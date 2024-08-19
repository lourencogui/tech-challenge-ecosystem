import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payable } from './payable.entity';
import { PayablesService } from './payables.service';
import { PayablesController } from './payables.controller';

@Module({
	imports: [TypeOrmModule.forFeature([Payable])],
	providers: [PayablesService],
	controllers: [PayablesController],
})

export class PayablesModule {}