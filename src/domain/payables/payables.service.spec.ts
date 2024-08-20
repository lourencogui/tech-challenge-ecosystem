import { Repository, SelectQueryBuilder } from 'typeorm';
import { mock } from 'jest-mock-extended';
import { Transaction } from '../transactions/transaction.entity';
import { Payable } from '../payables/payable.entity';
import { PayablesService } from './payables.service';

describe('PayablesService', () => {
	describe('#generatePayable', () => {

		const mockBaseTransaction = {
			amount: 100,
			description: 'mock',
			cardNumber: '1234',
			cardHolderName: 'fake name',
			cardExpirationDate: '12/24',
			cardCvv: '123',
		}

		describe('when is a debit_card operation', () => {

			const mockTransaction = new Transaction({
				...mockBaseTransaction,
				amount: 100,
				paymentMethod: 'debit_card',
			});
			const expectedPayable = new Payable({
				merchantId: 1,
				status: 'paid',
				dueDate: expect.any(Date),
				subTotal: 100,
				discount: 2,
				total: 98,
			});

			let payableResult;

			beforeAll(async () => {
				const payableRepository = mock<Repository<Payable>>();
				const payableService = new PayablesService(payableRepository);

				payableResult = await payableService.generatePayable(mockTransaction);
			});

			it('should return a payable instance', () => {
				expect(payableResult).toEqual(expectedPayable);
			});

			it('payble status should be "paid"', () => {
				expect(payableResult.status).toBe('paid');
			});

			it('payble dueDate should be now', () => {
				const now = new Date();
				const isSameDate = checkIsSameDate(payableResult.dueDate, now);

				expect(isSameDate).toBe(true);
			});

			it('payble discount should be 2% of the transaction amount', () => {
				expect(payableResult.discount).toBe(2);
			});

			it('payable total should be a subtraction operation from subTotal and discount', () => {
				expect(payableResult.total).toBe(98);
			});
		});

		describe('when is a credit_card transaction', () => {

			const mockTransaction = new Transaction({
				...mockBaseTransaction,
				amount: 200,
				paymentMethod: 'credit_card',
			});
			const expectedPayable = new Payable({
				merchantId: 1,
				status: 'waiting_funds',
				dueDate: expect.any(Date),
				subTotal: 200,
				discount: 8,
				total: 192,
			});

			let payableResult;

			beforeAll(async () => {
				const payableRepository = mock<Repository<Payable>>();
				const payableService = new PayablesService(payableRepository);

				payableResult = await payableService.generatePayable(mockTransaction);
			});

			it('should return a payable instance', () => {
				expect(payableResult).toEqual(expectedPayable);
			});

			it('payble status should be "waiting_funds"', () => {
				expect(payableResult.status).toBe('waiting_funds');
			});

			it('payble dueDate should be thirty days ahead', () => {
				const now = new Date();
				const thirtyDaysAhead = new Date(now.setDate(now.getDate() + 30));

				const isSameDate = checkIsSameDate(payableResult.dueDate, thirtyDaysAhead);
				expect(isSameDate).toBe(true);
			});

			it('payble discount should be 4% of the transaction amount', () => {
				expect(payableResult.discount).toBe(8);
			});

			it('payable total should be a subtraction operation from subTotal and discount', () => {
				expect(payableResult.total).toBe(192);
			});
		});
	});

	describe('#sumByMerchantId', () => {

		const merchantId = 1;
		const minDate = new Date('2021-01-01');
		const maxDate = new Date('2021-12-31');

		const payableRepository = mock<Repository<Payable>>();

		describe('when merchant has no payables', () => {

			const expectedTotal = {
				totalReceived: 0,
				totalTaxes: 0,
				totalWaitingFunds: 0,
			}

			let totalResult;

			beforeAll(async () => {
				payableRepository.createQueryBuilder.mockReturnValue({
					where: jest.fn().mockReturnThis(),
					andWhere: jest.fn().mockReturnThis(),
					getMany: jest.fn().mockResolvedValue([]),
				} as unknown as SelectQueryBuilder<Payable>);

				const payableService = new PayablesService(payableRepository);

				totalResult = await payableService.sumByMerchantId(merchantId, minDate, maxDate);
			});

			it('should return an empty object', () => { 
				expect(totalResult).toEqual(expectedTotal);
			});
		});

		describe('when merchant has received payables', () => {

			const mockPayables = [
				new Payable({
					merchantId: 1,
					subTotal: 100,
					discount: 2,
					total: 98,
					status: 'paid',
				}),
				new Payable({
					merchantId: 1,
					subTotal: 200,
					discount: 8,
					total: 192,
					status: 'paid',
				})
			];

			let totalResult;

			beforeAll(async () => {
				payableRepository.createQueryBuilder.mockReturnValue({
					where: jest.fn().mockReturnThis(),
					andWhere: jest.fn().mockReturnThis(),
					getMany: jest.fn().mockResolvedValue(mockPayables),
				} as unknown as SelectQueryBuilder<Payable>);

				const payableService = new PayablesService(payableRepository);

				totalResult = await payableService.sumByMerchantId(merchantId, minDate, maxDate);
			});

			it('should return totalWaitingFunds as 0', () => { 
				expect(totalResult.totalWaitingFunds).toBe(0);
			});

			it('should return totalReceived and totalTaxes', () => { 
				expect(totalResult.totalReceived).toEqual(290);
				expect(totalResult.totalTaxes).toEqual(10);
			});

		});

		describe('when merchant has waiting payables', () => {
			const mockPayables = [
				new Payable({
					merchantId: 1,
					subTotal: 200,
					discount: 12,
					total: 188,
					status: 'waiting_funds',
				}),
				new Payable({
					merchantId: 1,
					subTotal: 250,
					discount: 15,
					total: 235,
					status: 'waiting_funds',
				})
			];

			let totalResult;

			beforeAll(async () => {
				payableRepository.createQueryBuilder.mockReturnValue({
					where: jest.fn().mockReturnThis(),
					andWhere: jest.fn().mockReturnThis(),
					getMany: jest.fn().mockResolvedValue(mockPayables),
				} as unknown as SelectQueryBuilder<Payable>);

				const payableService = new PayablesService(payableRepository);

				totalResult = await payableService.sumByMerchantId(merchantId, minDate, maxDate);
			});

			it('should return totalWaitingFunds', () => { 
				expect(totalResult.totalWaitingFunds).toBe(423);
			});

			it('should return totalReceived and totalTaxes as 0', () => {
				expect(totalResult.totalReceived).toEqual(0);
				expect(totalResult.totalTaxes).toEqual(0);
			 });

		});
	});
});


function checkIsSameDate(receivedDate, expectedDate) {
	const isSameYear = receivedDate.getFullYear() === expectedDate.getFullYear();
	const isSameMonth = receivedDate.getMonth() === expectedDate.getMonth();
	const isSameDay = receivedDate.getDate() === expectedDate.getDate();

	return isSameYear && isSameMonth && isSameDay;
}
