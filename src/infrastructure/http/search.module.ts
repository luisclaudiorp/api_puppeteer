import { Module } from '@nestjs/common/decorators';
import { SearchUseCases } from '../../usecases/search.usecases';
import { LoggerService } from '../logger/logger.service';
import { CrawlerService } from '../services/crawler.service';
import { Provider } from '../usecases-provider/usecases-provider';
import { SearchController } from './search.controller';

@Module({
  controllers: [SearchController],
  providers: [
    {
      provide: Provider.SEARCH_USECASES,
      useClass: SearchUseCases,
    },
    {
      provide: Provider.LOGGER_SERVICE,
      useClass: LoggerService,
    },
    {
      provide: Provider.CRAWLER_SERVICE,
      useClass: CrawlerService,
    },
  ],
})
export class SearchModule {}
