import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { Payable } from '../payables/payable.entity';
import { PayablesService } from '../payables/payables.service';


@Injectable()
export class TransactionsService {
	constructor(
		@InjectRepository(Transaction)
		private transactionsRepository: Repository<Transaction>,
		@InjectRepository(Payable)
		private payableRepository: Repository<Payable>,
		private payablesService: PayablesService,
	) { }

	findAll(): Promise<Transaction[]> {
		return this.transactionsRepository.find();
	}

	async create(transaction: Transaction): Promise<Transaction> {
		try {
			const payableToCreate = this.payablesService.generatePayable(transaction);

			const createTransactionPromise = this.transactionsRepository.save(transaction);
			const createPayablePromise = this.payableRepository.save(payableToCreate);

			const [createdTransaction, _] = await Promise.all([createTransactionPromise, createPayablePromise]);
			return createdTransaction;
		} catch (error) {
			throw new Error('Error creating transaction');
		}
	}
}
