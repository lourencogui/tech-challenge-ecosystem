import { Repository } from 'typeorm';
import { TransactionsService } from './transactions.service';
import { mock } from 'jest-mock-extended';
import { Transaction } from './transaction.entity';
import { Payable } from '../payables/payable.entity';
import { PayablesService } from '../payables/payables.service';

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
	const payableService = mock<PayablesService>();

	const mockTransaction = new Transaction({
		...mockBaseTransaction,
		amount: 100,
		paymentMethod: 'debit_card',
	});
	const mockPayable = new Payable({
		merchantId: 1,
		status: 'paid',
		dueDate: new Date(2024, 12, 24),
		subTotal: 100,
		discount: 2,
		total: 98,
	});

	let transactionResult;

	beforeAll(async () => {
		transactionRepository.save.mockImplementationOnce(async (entity) => entity as Transaction);
		payableRepository.save.mockImplementationOnce(async (entity) => entity as Payable);
		payableService.generatePayable.mockReturnValue(mockPayable);

		const transactionsService = new TransactionsService(transactionRepository, payableRepository, payableService);

		transactionResult = await transactionsService.create(mockTransaction);
	});

	it('should have called payablesService.generatePayable', () => {
		expect(payableService.generatePayable).toHaveBeenCalledWith(mockTransaction);
	})

	it('should have called transactionRepository.save', () => {
		expect(transactionRepository.save).toHaveBeenCalledWith(mockTransaction);
	})

	it('should have called payableRepository.save', () => {
		expect(payableRepository.save).toHaveBeenCalledWith(mockPayable);
	});

});
