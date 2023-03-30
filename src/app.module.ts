import { CrawlerModule } from './infrastructure/services/crawler.module';
import { Module } from '@nestjs/common';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { ExceptionsModule } from './infrastructure/exceptions/exceptions.module';
import { SearchModule } from './infrastructure/http/search.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CrawlerModule,
    LoggerModule,
    ExceptionsModule,
    SearchModule,
  ],
})
export class AppModule {}
