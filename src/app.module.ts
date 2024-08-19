import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './domain/transactions/transaction.entity';
import { Payable } from './domain/payables/payable.entity';
import { TransactionsModule } from './domain/transactions/transactions.module';
import { PayablesModule } from './domain/payables/payables.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'tech-challenge-ecosystem',
      entities: [Transaction, Payable],
      migrations: ['infra/database/migrations/*.js'],
    }),
    TransactionsModule,
    PayablesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
