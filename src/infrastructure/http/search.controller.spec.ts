import { Test } from '@nestjs/testing';
import { SearchUseCases } from '../../usecases/search.usecases';
import { SearchController } from './search.controller';
import { ILogger } from '../../domain/logger.interface';
import { Provider } from '../usecases-provider/usecases-provider';
import { SearchRequestDto } from './dto/search.request.dto';
import { SearchResponseDto } from './dto/search.response.dto';

describe('SearchController', () => {
  let controller: SearchController;
  let searchUseCases: SearchUseCases;
  let logger: ILogger;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: Provider.SEARCH_USECASES,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: Provider.LOGGER_SERVICE,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get<SearchController>(SearchController);
    searchUseCases = moduleRef.get<SearchUseCases>(Provider.SEARCH_USECASES);
    logger = moduleRef.get<ILogger>(Provider.LOGGER_SERVICE);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('search', () => {
    it('should call SearchUseCases.execute with the correct arguments', async () => {
      const checkin = '';
      const checkout = '';
      const searchRequest: SearchRequestDto = { checkin, checkout };
      const searchResponse: SearchResponseDto[] = [
        {
          name: '',
          description: '',
          image: '',
          price: '',
        },
      ];
      jest.spyOn(searchUseCases, 'execute').mockResolvedValue(searchResponse);

      const result = await controller.search(searchRequest);

      expect(searchUseCases.execute).toHaveBeenCalledWith(checkin, checkout);
      expect(result).toEqual(searchResponse);
    });

    it('should call ILogger.log with the correct messages', async () => {
      const checkin = '';
      const checkout = '';
      const searchRequest: SearchRequestDto = { checkin, checkout };
      const searchResponse: SearchResponseDto[] = [
        {
          name: '',
          description: '',
          image: '',
          price: '',
        },
      ];
      jest.spyOn(searchUseCases, 'execute').mockResolvedValue(searchResponse);

      await controller.search(searchRequest);

      expect(logger.log).toHaveBeenCalledWith(
        `SearchController search with checkin ${checkin} and checkout ${checkout}`,
        'Start process search',
      );
      expect(logger.log).toHaveBeenCalledWith(
        `SearchController search result ${JSON.stringify(searchResponse)}`,
        'Finish process search',
      );
    });
  });
});
