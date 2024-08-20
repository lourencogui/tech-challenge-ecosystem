import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { Payable } from '../payables/payable.entity';


@Injectable()
export class TransactionsService {
	constructor(
		@InjectRepository(Transaction)
		private transactionsRepository: Repository<Transaction>,
		@InjectRepository(Payable)
		private payableRepository: Repository<Payable>,
	) { }

	findAll(): Promise<Transaction[]> {
		return this.transactionsRepository.find();
	}

	async create(transaction: Transaction): Promise<Transaction> {
		try {
			const payableToCreate = this.generatePayable(transaction);

			const createTransactionPromise = this.transactionsRepository.save(transaction);
			const createPayablePromise = this.payableRepository.save(payableToCreate);

			const [createdTransaction, _] = await Promise.all([createTransactionPromise, createPayablePromise]);
			return createdTransaction;
		} catch (error) {
			throw new Error('Error creating transaction');
		}
	}

	private generatePayable(transaction: Transaction): Payable {
		const payable = new Payable();

		payable.subTotal = transaction.amount;
		payable.merchantId = 1;

		const isDebitTransaction = transaction.paymentMethod === 'debit_card';

		if (isDebitTransaction) {
			payable.status = 'paid';
			payable.dueDate = new Date();

			const fee = 2;
			const discount = (fee * payable.subTotal) / 100;
			const newValue = payable.subTotal - discount;

			payable.discount = discount;
			payable.total = newValue;
		} else {
			payable.status = 'waiting_funds';

			const now = new Date();
			const thirtyDaysAhead = new Date(now.setDate(now.getDate() + 30));
			payable.dueDate = thirtyDaysAhead;
			payable.status = 'waiting_funds';

			const fee = 4;
			const discount = (fee * payable.subTotal) / 100;
			const newValue = payable.subTotal - discount;

			payable.discount = discount;
			payable.total = newValue;
		}

		return payable;
	}
}
