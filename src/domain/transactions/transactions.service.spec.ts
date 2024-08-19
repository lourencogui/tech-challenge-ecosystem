import { Repository } from 'typeorm';
import { TransactionsService } from './transactions.service';
import { mock } from 'jest-mock-extended';
import { Transaction } from './transaction.entity';
import { Payable } from '../payables/payable.entity';

describe('#create', () => {

	const mockBaseTransaction = {
		amount: 100,
		description: 'mock',
		cardNumber: '1234',
		cardHolderName: 'fake name',
		cardExpirationDate: '12/24',
		cardCvv: '123',
	}

	const transactionRepository = mock<Repository<Transaction>>();
	const payableRepository = mock<Repository<Payable>>();

	describe('when is a debit_card transaction', () => {

		let result;
		const mockTransaction = new Transaction({
			...mockBaseTransaction,
			amount: 100,
			paymentMethod: 'debit_card',
		});

		beforeAll(async () => {
			transactionRepository.save.mockImplementation(async (entity) => entity as Transaction);

			const transactionsService = new TransactionsService(transactionRepository, payableRepository);

			result = await transactionsService.create(mockTransaction)
		});

		it('should create a transaction', () => {
			expect(result).toEqual(mockTransaction);
		});

		it('payble status should be "paid"', () => {
			expect(payableRepository.save).toHaveBeenCalledWith(expect.objectContaining({ status: 'paid' }));
		});

		// it('payble dueDate should be now', () => {
		// 	const now = new Date();
		// 	const thirtyDaysAhead = new Date(now.setDate(now.getDate() + 30));
		// 	expect(result.dueDate.getDate).toEqual(thirtyDaysAhead);
		// });

		it('payble discount should be 2% of the transaction amount', () => {
			expect(payableRepository.save).toHaveBeenCalledWith(expect.objectContaining({ discount: 2 }));
		});

		it('payable total should be a subtraction operation from subTotal and discount', () => {
			expect(payableRepository.save).toHaveBeenCalledWith(expect.objectContaining({ total: 98 }));
		});
	});

	describe('when is a credit_card transaction', () => {

		let result;
		const mockTransaction = new Transaction({
			...mockBaseTransaction,
			amount: 200,
			paymentMethod: 'credit_card',
		});

		beforeAll(async () => {
			transactionRepository.save.mockImplementation(async (entity) => entity as Transaction);

			const transactionsService = new TransactionsService(transactionRepository, payableRepository);

			result = await transactionsService.create(mockTransaction)
		});

		it('should create a transaction', () => { 
			expect(result).toEqual(mockTransaction);
		});

		it('payble status should be "waiting_funds"', () => { 
			expect(payableRepository.save).toHaveBeenCalledWith(expect.objectContaining({ status: 'waiting_funds' }));
		});

		it('payble dueDate should be thirty days ahead', () => { });

		it('payble discount should be 4% of the transaction amount', () => { 
			expect(payableRepository.save).toHaveBeenCalledWith(expect.objectContaining({ discount: 8 }));
		});

		it('payable total should be a subtraction operation from subTotal and discount', () => {
			expect(payableRepository.save).toHaveBeenCalledWith(expect.objectContaining({ total: 192 }));
		});
	});
});