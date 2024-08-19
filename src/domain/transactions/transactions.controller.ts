import { Controller, Get } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transaction.entity';

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
}