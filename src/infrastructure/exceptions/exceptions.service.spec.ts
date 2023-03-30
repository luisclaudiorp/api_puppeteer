import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IFormatExceptionMessage } from '../../domain/exception.interface';
import { ExceptionsService } from './exceptions.service';

describe('ExceptionsService', () => {
  let service: ExceptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExceptionsService],
    }).compile();

    service = module.get<ExceptionsService>(ExceptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should throw a BadRequestException with the provided message', () => {
    const message: IFormatExceptionMessage = {
      message: 'bad request',
      code_error: 400,
    };
    expect(() => service.badRequestException(message)).toThrowError(
      BadRequestException,
    );
  });
  it('should throw an InternalServerErrorException with the provided message', () => {
    const message: IFormatExceptionMessage = {
      message: 'Internal server error',
      code_error: 500,
    };
    expect(() => service.internalServerErrorException(message)).toThrowError(
      InternalServerErrorException,
    );
  });
});
