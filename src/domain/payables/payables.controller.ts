import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
	async getPayablesByMerchantId(@Param('merchantId') merchantId): Promise<object> {
		
		const payables = await this.payableService.sumByMerchantId(merchantId);
		const totals = payables.reduce((acc, payable) => {
			const totalReceived = payable.status === 'paid' ? (payable.total + acc.totalReceived) : acc.totalReceived;
			const taxes = payable.status === 'paid' ? (payable.discount + acc.taxes) : acc.taxes;
			const totalToReceive = payable.status === 'waiting_funds' ? (payable.total + acc.totalToReceive) : acc.totalToReceive;

			return {
				totalReceived,
				taxes,
				totalToReceive
			}
		}, {
			totalReceived: 0,
			taxes: 0,
			totalToReceive: 0
		});

		return totals;
	}
	
}