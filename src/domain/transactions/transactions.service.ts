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

	public async create(transaction: Transaction): Promise<Transaction> {
		const payableToCreate = this.generatePayable(transaction);
		
		const createPayablePromise = this.payableRepository.save(payableToCreate);
		const createTransactionPromise = this.transactionsRepository.save(transaction);

		const [createdTransaction, _] = await Promise.all([createTransactionPromise, createPayablePromise]);
		return createdTransaction;
	}

	private generatePayable(transaction: Transaction): Payable {
		const payable = new Payable();
		payable.merchantId = 1;
		payable.discount = 5;
		payable.status = 'waiting_funds';
		payable.subTotal = transaction.amount;
		payable.total = payable.subTotal - payable.discount;
		payable.dueDate = new Date();

		return payable;
	}
}
