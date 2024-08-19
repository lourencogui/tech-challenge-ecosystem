import { Body, Controller, Get, Post } from '@nestjs/common';
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

	@Post('/create')
	async createTransaction(@Body() body: Body): Promise<Transaction> {

		const transaction = new Transaction();
		transaction.amount = 1000;
		transaction.description = 'T-shirt';
		transaction.paymentMethod = 'credit_card';
		transaction.cardNumber = '5678';
		transaction.cardHolderName = 'Guilherme Lourenco';
		transaction.cardExpirationDate = '12/24';
		transaction.cardCvv = '123';
		transaction.merchantId = 1;

		const createdTransaction = await this.transactionsService.create(transaction);

		return createdTransaction;
	}
}