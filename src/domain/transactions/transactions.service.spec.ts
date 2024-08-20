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

	describe('when is a debit_card transaction', () => {

		let result;
		const mockTransaction = new Transaction({
			...mockBaseTransaction,
			amount: 100,
			paymentMethod: 'debit_card',
		});
		const transactionRepository = mock<Repository<Transaction>>();
		const payableRepository = mock<Repository<Payable>>();

		beforeAll(async () => {
			transactionRepository.save.mockImplementationOnce(async (entity) => entity as Transaction);
			payableRepository.save.mockImplementationOnce(async (entity) => entity as Payable);

			const transactionsService = new TransactionsService(transactionRepository, payableRepository);

			result = await transactionsService.create(mockTransaction);
		});

		it('should create a transaction', () => {
			expect(result).toEqual(mockTransaction);
		});

		it('payble status should be "paid"', () => {
			expect(payableRepository.save).toHaveBeenCalledWith(expect.objectContaining({ status: 'paid' }));
		});

		it('payble dueDate should be now', () => {
			const now = new Date();
			const dueDate = payableRepository.save.mock.calls[0][0].dueDate;
			const isSameDate = checkIsSameDate(dueDate, now);
			
			expect(isSameDate).toBe(true);
		});

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

		const transactionRepository = mock<Repository<Transaction>>();
		const payableRepository = mock<Repository<Payable>>();

		beforeAll(async () => {
			transactionRepository.save.mockImplementationOnce(async (entity) => entity as Transaction);
			payableRepository.save.mockImplementationOnce(async (entity) => entity as Payable);

			const transactionsService = new TransactionsService(transactionRepository, payableRepository);

			result = await transactionsService.create(mockTransaction)
		});

		it('should create a transaction', () => { 
			expect(result).toEqual(mockTransaction);
		});

		it('payble status should be "waiting_funds"', () => { 
			expect(payableRepository.save).toHaveBeenCalledWith(expect.objectContaining({ status: 'waiting_funds' }));
		});

		it('payble dueDate should be thirty days ahead', () => {
			const now = new Date();
			const thirtyDaysAhead = new Date(now.setDate(now.getDate() + 30));

			const dueDate = payableRepository.save.mock.calls[0][0].dueDate;
			const isSameDate = checkIsSameDate(dueDate, thirtyDaysAhead);
			expect(isSameDate).toBe(true);
		 });

		it('payble discount should be 4% of the transaction amount', () => { 
			expect(payableRepository.save).toHaveBeenCalledWith(expect.objectContaining({ discount: 8 }));
		});

		it('payable total should be a subtraction operation from subTotal and discount', () => {
			expect(payableRepository.save).toHaveBeenCalledWith(expect.objectContaining({ total: 192 }));
		});
	});
});

function checkIsSameDate(receivedDate, expectedDate) {
	const isSameYear = receivedDate.getFullYear() === expectedDate.getFullYear();
	const isSameMonth = receivedDate.getMonth() === expectedDate.getMonth();
	const isSameDay = receivedDate.getDate() === expectedDate.getDate();

	return isSameYear && isSameMonth && isSameDay;
}