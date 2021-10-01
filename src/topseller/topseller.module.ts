import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppEntity } from 'src/entities/app.entity';
import { TopSellerController } from './topseller.controller';
import { TopSellerService } from './topseller.service';

@Module({
  controllers: [TopSellerController],
  providers: [TopSellerService],
  imports: [
    TypeOrmModule.forFeature([AppEntity]),
    HttpModule
  ]
})
export class TopSellerModule {}
