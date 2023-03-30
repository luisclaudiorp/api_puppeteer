import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { LoggerService } from '../../../infrastructure/logger/logger.service';

interface IError {
  message: string;
  code_error: string;
}

/**
 * @description error interceptor class
 */

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request: any = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as IError)
        : { message: (exception as Error).message, code_error: null };

    const responseData = {
      ...{
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
      ...message,
    };

    this.logMessage(request, message, status, exception);

    response.status(status).json(responseData);
  }

  /**
   * @description used to assemble the error message
   * @param request Request
   * @param message objet error
   * @param status code error
   * @param exception error exception string
   */
  private logMessage(
    request: Request,
    message: IError,
    status: number,
    exception: string,
  ) {
    if (status === 500) {
      this.logger.log(
        `End Request for ${request.path} method=${
          request.method
        } status=${status} code_error=${
          message.code_error ? message.code_error : null
        } message=${
          message.message ? message.message : null
        } exception= ${exception}`,
      );
    } else {
      this.logger.log(
        `End Request for ${request.path} method=${
          request.method
        } status=${status} code_error=${
          message.code_error ? message.code_error : null
        } message=${message.message ? message.message : null}
        exception= ${exception}`,
      );
    }
  }
}
