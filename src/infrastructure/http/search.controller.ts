import { Controller, Inject, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';
import { SearchSwaggerDecorator } from '../../docs/swagger.decorator';
import { ILogger } from '../../domain/logger.interface';
import { SearchUseCases } from '../../usecases/search.usecases';
import { Provider } from '../usecases-provider/usecases-provider';
import { SearchRequestDto } from './dto/search.request.dto';
import { SearchResponseDto } from './dto/search.response.dto';

@Controller('search')
export class SearchController {
  constructor(
    @Inject(Provider.SEARCH_USECASES)
    private readonly searchUseCases: SearchUseCases,
    @Inject(Provider.LOGGER_SERVICE)
    private readonly logger: ILogger,
  ) {}

  @ApiTags('Search')
  @SearchSwaggerDecorator()
  @Post()
  async search(@Body() body: SearchRequestDto): Promise<SearchResponseDto[]> {
    this.logger.log(
      `SearchController search with checkin ${body.checkin} and checkout ${body.checkout}`,
      'Start process search',
    );

    const result = await this.searchUseCases.execute(
      body.checkin,
      body.checkout,
    );

    this.logger.log(
      `SearchController search result ${JSON.stringify(result)}`,
      'Finish process search',
    );
    return result;
  }
}
