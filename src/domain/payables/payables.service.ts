import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payable } from './payable.entity';
import { Transaction } from '../transactions/transaction.entity';


@Injectable()
export class PayablesService {
	constructor(
		@InjectRepository(Payable)
		private payablesRepository: Repository<Payable>
	) { }

	findAll(): Promise<Payable[]> {
		return this.payablesRepository.find();
	}

	async sumByMerchantId(merchantId: number, minDate: Date, maxDate: Date): Promise<object> {
		const payables = await this.payablesRepository.createQueryBuilder('payable')
			.where('payable.merchantId = :merchantId', { merchantId })
			.andWhere('payable.createdAt >= :minDate', { minDate })
			.andWhere('payable.createdAt <= :maxDate', { maxDate })
			.getMany();

		return this.sumPayables(payables);
	}

	generatePayable(transaction: Transaction): Payable {
		const payable = new Payable();

		payable.subTotal = transaction.amount;
		payable.merchantId = 1;

		const isDebitTransaction = transaction.paymentMethod === 'debit_card';

		if (isDebitTransaction) {
			const partial = this.buildByDebitRule(payable);
			return { ...payable, ...partial };
		}

		const partial = this.buildByCreditRule(payable);
		return { ...payable, ...partial };
	}

	private buildByDebitRule(payable: Payable): Partial<Payable> {
		const fee = 2;
		const discount = (fee * payable.subTotal) / 100;

		return {
			status: 'paid',
			dueDate: new Date(),
			discount,
			total: payable.subTotal - discount,
		};
	}

	private buildByCreditRule(payable: Payable): Partial<Payable> {
		const now = new Date();
		const thirtyDaysAhead = new Date(now.setDate(now.getDate() + 30));

		const fee = 4;
		const discount = (fee * payable.subTotal) / 100;

		return {
			status: 'waiting_funds',
			dueDate: thirtyDaysAhead,
			discount,
			total: payable.subTotal - discount,
		}
	}

	private sumPayables(payables: Payable[]): object {
		const received = this.sumReceived(payables);
		const waiting = this.sumWaitingFunds(payables);

		return {
			...received,
			...waiting,
		}
	}

	private sumReceived(payables: Payable[]): object {
		const receivedPayables = payables.filter(payable => payable.status === 'paid');

		const initalValue = {
			totalReceived: 0,
			totalTaxes: 0,
		}

		return receivedPayables.reduce((acc, received) => {
			return {
				totalReceived: acc.totalReceived + received.total,
				totalTaxes: acc.totalTaxes + received.discount,
			}
		}, initalValue);
	}

	private sumWaitingFunds(payables: Payable[]): object {
		const waitingFundsPayables = payables.filter(payable => payable.status === 'waiting_funds');

		const initalValue = {
			totalWaitingFunds: 0,
		}

		return waitingFundsPayables.reduce((acc, waiting) => {
			return {
				totalWaitingFunds: acc.totalWaitingFunds + waiting.total,
			}
		}, initalValue);
	}
}
