import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService],
    }).compile();

    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(loggerService).toBeDefined();
  });

  it('should be set the log method', () => {
    const loggerService = new LoggerService();
    const logger = loggerService.getLogger();
    const spy = jest.spyOn(logger, 'log');

    loggerService.log('message', 'context');

    expect(spy).toHaveBeenCalledWith('[INFO] message', 'context');
  });
});
