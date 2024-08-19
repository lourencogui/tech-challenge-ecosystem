import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payable } from './payable.entity';
import { PayablesService } from './payables.service';

@Module({
	imports: [TypeOrmModule.forFeature([Payable])],
	providers: [PayablesService],
	controllers: [],
})

export class TransactionsModule {}