import { Controller, Get } from '@nestjs/common';

@Controller()
export class TransactionsController {
	constructor() {}

	@Get()
	getTransactions(): string {
		return 'Transactions';
	}
}