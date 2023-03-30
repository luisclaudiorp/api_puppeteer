import { BadRequestException, Inject } from '@nestjs/common';
import { Provider } from '../infrastructure/usecases-provider/usecases-provider';
import { ILogger } from '../domain/logger.interface';
import { ICrawler } from '../domain/crawler.interface';
import * as dayjs from 'dayjs';
import { SearchResponseDto } from '../infrastructure/http/dto/search.response.dto';

export class SearchUseCases {
  constructor(
    @Inject(Provider.LOGGER_SERVICE)
    private readonly logger: ILogger,
    @Inject(Provider.CRAWLER_SERVICE)
    private readonly crawlerService: ICrawler,
  ) {}
  async execute(
    checkin: string,
    checkout: string,
  ): Promise<SearchResponseDto[]> {
    this.logger.log('SearchUseCases execute', 'Start process execute');

    this.validateDates(checkin, checkout);
    checkin = this.convertDateStringformat(checkin);
    checkout = this.convertDateStringformat(checkout);
    const data = await this.crawlerService.getDataCrawler(checkin, checkout);

    this.logger.log('SearchUseCases execute', 'Finish process execute');
    return data;
  }

  /**
   * @description valid if checkin is before the day current and if checkout is before checkinDate
   * @param checkin
   * @param checkout
   */
  validateDates(checkin: string, checkout: string): void {
    const checkinDate = dayjs(checkin);
    const checkoutDate = dayjs(checkout);
    if (
      checkinDate.isBefore(dayjs(), 'day') ||
      checkoutDate.isBefore(checkinDate)
    ) {
      throw new BadRequestException(
        'the checkin cannot be earlier than the current day or checkout cannot be less than the checkin',
      );
    }
  }

  /**
   * @description converts the date in YYYY-MM-DD format to the format used as a query parameter
   * @param dateString
   * @returns
   */
  convertDateStringformat(dateString: string): string {
    const parseDate = dateString.split('-');
    const dateFormated = `${parseDate[2]}%2F${parseDate[1]}%2F${parseDate[0]}`;
    return dateFormated;
  }
}
