import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Payable } from '../payables/payable.entity';
import { PayablesService } from '../payables/payables.service';

@Module({
	imports: [TypeOrmModule.forFeature([Transaction, Payable])],
	providers: [TransactionsService, PayablesService],
	controllers: [TransactionsController],
})

export class TransactionsModule {}