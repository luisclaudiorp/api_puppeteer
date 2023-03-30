import { Module } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { Provider } from '../usecases-provider/usecases-provider';

@Module({
  providers: [
    {
      provide: Provider.LOGGER_SERVICE,
      useClass: LoggerService,
    },
  ],
})
export class CrawlerModule {}
