import { SearchResponseDto } from '../infrastructure/http/dto/search.response.dto';

/**
 * @description system ICrawler interface
 * @interface ICrawler
 * @method getDataCrawler
 */
export interface ICrawler {
  getDataCrawler(
    checkin: string,
    checkout: string,
  ): Promise<SearchResponseDto[]>;
}
