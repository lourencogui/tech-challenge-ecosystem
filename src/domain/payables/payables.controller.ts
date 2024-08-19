import { Body, Controller, Get, Post } from '@nestjs/common';
import { PayablesService } from './payables.service';
import { Payable } from './payable.entity';

@Controller('payables')
export class PayablesController {
	constructor(
		private payableService: PayablesService
	) { }

	@Get()
	async getPayables(): Promise<Payable[] | null> {
		const payables = await this.payableService.findAll();

		return payables;
	}
}