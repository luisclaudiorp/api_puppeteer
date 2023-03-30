import { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { of } from 'rxjs';
import { LoggerService } from '../../../infrastructure/logger/logger.service';
import { LoggerInterceptor } from './logger.interceptor';

describe('LoggingInterceptor', () => {
  let loggingInterceptor: LoggerInterceptor;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LoggerInterceptor,
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    loggingInterceptor = moduleRef.get<LoggerInterceptor>(LoggerInterceptor);
    loggerService = moduleRef.get<LoggerService>(LoggerService);
  });

  it('loggingInterceptor should be defined', () => {
    expect(loggingInterceptor).toBeDefined();
  });
  it('loggerService should be defined', () => {
    expect(loggerService).toBeDefined();
  });

  it('should log incoming request and end request', () => {
    const request = {
      path: '/test',
      method: 'GET',
      headers: { 'x-forwarded-for': '192.0.2.1' },
      socket: { remoteAddress: '::ffff:192.0.2.1' },
    };
    const response = { statusCode: 200 };
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => request,
        getResponse: () => response,
      }),
    };
    const next = { handle: () => of('test') };
    const logSpy = jest.spyOn(loggerService, 'log');

    loggingInterceptor
      .intercept(context as unknown as ExecutionContext, next as any)
      .subscribe({
        next: () => {
          const incomingLogMessage = `Incoming Request on ${request.path}`;
          const incomingLogMetadata = `method=${request.method} ip=192.0.2.1`;
          const endLogMessage = `End Request for ${request.path}`;
          const endLogMetadata = `method=${request.method} ip=192.0.2.1 duration=`;
          expect(logSpy).toHaveBeenCalledWith(
            incomingLogMessage,
            incomingLogMetadata,
          );
          expect(logSpy).toHaveBeenCalledWith(
            expect.stringContaining(endLogMessage),
            expect.stringContaining(endLogMetadata),
          );
        },
      });
  });

  it('should log incoming request and end request with ip undefined', () => {
    const request = {
      path: '/test',
      method: 'GET',
      headers: { 'x-forwarded-for': undefined },
      socket: { remoteAddress: '::ffff:192.0.2.1' },
    };
    const response = { statusCode: 200 };
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => request,
        getResponse: () => response,
      }),
    };
    const next = { handle: () => of('test') };
    const logSpy = jest.spyOn(loggerService, 'log');

    loggingInterceptor
      .intercept(context as unknown as ExecutionContext, next as any)
      .subscribe({
        next: () => {
          const incomingLogMessage = `Incoming Request on ${request.path}`;
          const incomingLogMetadata = `method=${request.method} ip=192.0.2.1`;
          const endLogMessage = `End Request for ${request.path}`;
          const endLogMetadata = `method=${request.method} ip=192.0.2.1 duration=`;
          expect(logSpy).toHaveBeenCalledWith(
            incomingLogMessage,
            incomingLogMetadata,
          );
          expect(logSpy).toHaveBeenCalledWith(
            expect.stringContaining(endLogMessage),
            expect.stringContaining(endLogMetadata),
          );
        },
      });
  });
});
