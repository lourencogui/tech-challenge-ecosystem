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
		const created = await this.transactionsRepository.save(transaction);

		const payable = new Payable();
		payable.merchantId = 1;
		payable.discount = 5;
		payable.status = 'waiting_funds';
		payable.subTotal = transaction.amount;
		payable.total = payable.subTotal - payable.discount;
		payable.dueDate = new Date();

		await this.payableRepository.save(payable);

		return created;
	}
}
