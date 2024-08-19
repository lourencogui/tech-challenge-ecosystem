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
}
