import { Controller, Get, Param, Query } from '@nestjs/common';
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

	@Get(':merchantId')
	async getPayablesByMerchantId(
		@Param('merchantId') merchantId: number,
		@Query('minDate') minDate: Date,
		@Query('maxDate') maxDate: Date,
	): Promise<object> {
		const totals = await this.payableService.sumByMerchantId(merchantId, minDate, maxDate);
		return totals;
	}

}