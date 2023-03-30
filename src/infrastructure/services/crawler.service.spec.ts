import { Test, TestingModule } from '@nestjs/testing';
import { SearchResponseDto } from '../http/dto/search.response.dto';
import { Provider } from '../usecases-provider/usecases-provider';
import { CrawlerService } from './crawler.service';
import puppeteer from 'puppeteer';
import { ILogger } from '../../domain/logger.interface';
import { NotFoundException } from '@nestjs/common';

describe('CrawlerService', () => {
  let crawlerService: CrawlerService;
  let logger: ILogger;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        CrawlerService,
        {
          provide: Provider.LOGGER_SERVICE,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();
    process.env.BASE_URL = 'https://pratagy.letsbook.com.br/D/';
  });

  afterAll(async () => {
    await moduleRef.close();
    delete process.env.BASE_URL;
  });

  beforeEach(async () => {
    crawlerService = moduleRef.get<CrawlerService>(CrawlerService);
    logger = moduleRef.get<ILogger>(Provider.LOGGER_SERVICE);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(crawlerService).toBeDefined();
  });

  describe('getDataCrawler', () => {
    it('should throw NotFoundException when no hotel is found', async () => {
      const checkin = '29%2F03%2F2023';
      const checkout = '29%2F03%2F2023';

      const page = {
        evaluate: jest.fn(() => []),
        goto: jest.fn(),
      };
      const browser = {
        newPage: jest.fn(() => page),
        close: jest.fn(),
      };
      jest.spyOn(puppeteer, 'launch').mockResolvedValue(browser as any);
      jest.spyOn(page, 'goto').mockResolvedValue(null);

      await expect(
        crawlerService.getDataCrawler(checkin, checkout),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should return data from crawler', async () => {
      const checkin = '05%2F04%2F2023';
      const checkout = '15%2F04%2F2023';

      const mockData: SearchResponseDto[] = [
        {
          name: 'Hotel A',
          description: 'Description A',
          price: '100',
          image: 'http://example.com/imageA.png',
        },
        {
          name: 'Hotel B',
          description: 'Description B',
          price: '200',
          image: 'http://example.com/imageB.png',
        },
      ];

      jest.spyOn(puppeteer, 'launch').mockResolvedValueOnce({
        newPage: jest.fn().mockResolvedValueOnce({
          goto: jest.fn().mockResolvedValueOnce(''),
          evaluate: jest.fn().mockResolvedValueOnce(mockData),
        }),
        close: jest.fn().mockResolvedValueOnce(''),
      } as any);

      const result = await crawlerService.getDataCrawler(checkin, checkout);

      expect(result).toEqual(mockData);
      expect(logger.log).toHaveBeenCalledTimes(2);
    });
  });
});
