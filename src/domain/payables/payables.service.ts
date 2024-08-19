import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payable } from './payable.entity';


@Injectable()
export class PayablesService {
	constructor(
		@InjectRepository(Payable)
		private payablesRepository: Repository<Payable>
	) {}

	findAll(): Promise<Payable[]> {
		return this.payablesRepository.find();
	}

	sumByMerchantId(merchantId: number, minDate: Date, maxDate: Date): Promise<Payable[]> {
		return this.payablesRepository.createQueryBuilder('payable')
			.where('payable.merchantId = :merchantId', { merchantId })
			.andWhere('payable.createdAt >= :minDate', { minDate })
			.andWhere('payable.createdAt <= :maxDate', { maxDate })
			.getMany();
	}
}
