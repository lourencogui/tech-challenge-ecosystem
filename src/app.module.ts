import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppEntity } from './entities/app.entity';
import { AppService } from './app.service';
import { TopSellerModule } from './topseller/topseller.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: () => {
        return {
          type: 'sqlite',
          database: 'db.sqlite',
          synchronize: true,
          entities: [AppEntity]
        }
      }
    }),
    TypeOrmModule.forFeature([AppEntity]),
    TopSellerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
