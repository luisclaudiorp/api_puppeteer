import { Test } from '@nestjs/testing';
import { SearchResponseDto } from 'src/infrastructure/http/dto/search.response.dto';
import { ICrawler } from '../domain/crawler.interface';
import { ILogger } from '../domain/logger.interface';
import { Provider } from '../infrastructure/usecases-provider/usecases-provider';
import { SearchUseCases } from './search.usecases';

describe('SearchUsecases', () => {
  let searchUseCases: SearchUseCases;
  let logger: ILogger;
  let crawlerService: ICrawler;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SearchUseCases,
        {
          provide: Provider.LOGGER_SERVICE,
          useValue: {
            log: jest.fn(),
          },
        },
        {
          provide: Provider.CRAWLER_SERVICE,
          useValue: {
            getDataCrawler: jest.fn(),
          },
        },
      ],
    }).compile();
    searchUseCases = moduleRef.get<SearchUseCases>(SearchUseCases);
    logger = moduleRef.get<ILogger>(Provider.LOGGER_SERVICE);
    crawlerService = moduleRef.get<ICrawler>(Provider.CRAWLER_SERVICE);
  });

  it('should be defined', () => {
    expect(searchUseCases).toBeDefined();
  });

  describe('execute', () => {
    it('should call the logger service with correct parameters', async () => {
      const checkin = '2023-04-01';
      const checkout = '2023-04-03';

      const data: SearchResponseDto[] = [
        { name: 'hotel 1', price: '100', image: '', description: '' },
        { name: 'hotel 2', price: '150', image: '', description: '' },
      ];

      jest.spyOn(crawlerService, 'getDataCrawler').mockResolvedValueOnce(data);

      await searchUseCases.execute(checkin, checkout);

      expect(logger.log).toHaveBeenCalledWith(
        'SearchUseCases execute',
        'Start process execute',
      );
      expect(logger.log).toHaveBeenCalledWith(
        'SearchUseCases execute',
        'Finish process execute',
      );
    });

    it('should call the crawler service with correct parameters', async () => {
      const checkin = '2022-04-01';
      const checkout = '2022-04-03';

      const data: SearchResponseDto[] = [
        { name: 'hotel 1', price: '100', image: '', description: '' },
        { name: 'hotel 2', price: '150', image: '', description: '' },
      ];

      jest.spyOn(crawlerService, 'getDataCrawler').mockResolvedValueOnce(data);

      await expect(
        searchUseCases.execute(checkin, checkout),
      ).rejects.toThrowError();
    });
  });
});
