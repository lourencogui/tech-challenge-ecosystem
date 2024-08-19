import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './createTransactionDto';

@Controller('transactions')
export class TransactionsController {
	constructor(
		private transactionsService: TransactionsService
	) {}

	@Get()
	async getTransactions(): Promise<Transaction[] | null> {
		const transactions = await this.transactionsService.findAll();

		return transactions;
	}

	@Post('/create')
	async createTransaction(@Body() body: CreateTransactionDto): Promise<Transaction> {

		const transactionToCreate = new Transaction(body);
		const createdTransaction = await this.transactionsService.create(transactionToCreate);

		return createdTransaction;
	}
}