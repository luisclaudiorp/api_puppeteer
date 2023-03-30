import { CrawlerService } from './crawler.service';
import { LoggerService } from '../logger/logger.service';

describe('CrawlerService', () => {
  let crawlerService: CrawlerService;

  beforeEach(async () => {
    crawlerService = new CrawlerService(LoggerService);
  });

  it('should return a list of hotels when given valid input', async () => {
    const checkin = '05%2F04%2F2023';
    const checkout = '15%2F04%2F2023';

    const hotels = await crawlerService.getDataCrawler(checkin, checkout);

    expect(hotels).toHaveLength(6);
  });
});
