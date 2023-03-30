import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '../../../infrastructure/logger/logger.service';
import { AllExceptionFilter } from './exception.filter';

describe('ExceptionFilter', () => {
  let filter: AllExceptionFilter;
  let loggerService: LoggerService;

  const mockRequest = {
    url: '/mock-url',
    method: 'GET',
    path: '/mock-path',
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const mockHost = {
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn().mockReturnValue(mockRequest),
    getResponse: jest.fn().mockReturnValue(mockResponse),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AllExceptionFilter,
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    filter = module.get<AllExceptionFilter>(AllExceptionFilter);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('filter should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('loggerService should be defined', () => {
    expect(loggerService).toBeDefined();
  });

  describe('should catch HttpException BAD_REQUEST and return response', () => {
    it('should log the correct message for HttpException', () => {
      const mockHttpException = new HttpException(
        { message: 'Mock message', code_error: 'Mock error code' },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(mockHttpException, mockHost as unknown as ArgumentsHost);

      const expectedResponse = {
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: expect.any(String),
        path: mockRequest.url,
        message: 'Mock message',
        code_error: 'Mock error code',
      };
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    it('should log the correct message for HttpException no code_error and message', () => {
      const mockHttpException = new HttpException(
        { message: undefined, code_error: undefined },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(mockHttpException, mockHost as unknown as ArgumentsHost);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });
  });

  describe('should catch HttpException INTERNAL_SERVER_ERROR and return response', () => {
    it('should log the correct message for non-HttpException', () => {
      const mockError = new Error('Mock error message');

      filter.catch(mockError, mockHost as unknown as ArgumentsHost);

      const expectedResponse = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: expect.any(String),
        path: mockRequest.url,
        message: 'Mock error message',
        code_error: null,
      };
      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
      expect(loggerService.log).toHaveBeenCalledWith(
        `End Request for ${mockRequest.path} method=${mockRequest.method} status=${HttpStatus.INTERNAL_SERVER_ERROR} code_error=null message=Mock error message exception= ${mockError}`,
      );
    });

    it('should log the correct message for non-HttpException', () => {
      const mockError = new HttpException(
        { message: undefined, code_error: 'Mock error code' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      filter.catch(mockError, mockHost as unknown as ArgumentsHost);

      const expectedResponse = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: expect.any(String),
        path: mockRequest.url,
        message: 'Mock error message',
        code_error: null,
      };
      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
});
