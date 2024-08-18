import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './domain/transactions/transaction.entity';
import { TransactionsModule } from './domain/transactions/transactions.module';
// import { TransactionsController } from './domain/transactions/transactions.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres14',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'tech-challenge-ecosystem',
      entities: [Transaction],
      migrations: ['infra/database/migrations/*.js'],
    }),
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
