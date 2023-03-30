import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { SearchResponseDto } from '../infrastructure/http/dto/search.response.dto';

export const SearchSwaggerDecorator = () => {
  return applyDecorators(
    ApiResponse({ status: 201, type: SearchResponseDto, isArray: true }),
    ApiBadRequestResponse({
      schema: {
        example: {
          statusCode: 'number',
          timestamp: 'string',
          path: 'string',
          message: ['string'],
          error: 'string',
        },
      },
    }),
    ApiNotFoundResponse({
      schema: {
        example: {
          statusCode: 'number',
          timestamp: 'string',
          path: 'string',
          message: ['string'],
          error: 'string',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      schema: {
        example: {
          statusCode: 'number',
          timestamp: 'string',
          path: 'string',
          message: 'string',
          error_code: 'string',
        },
      },
    }),
  );
};
