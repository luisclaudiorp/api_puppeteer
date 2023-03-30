import { Injectable, Logger } from '@nestjs/common';
import { ILogger } from '../../domain/logger.interface';

/**
 * @description used to send system logs
 * @extends Logger
 * @implements ILogger
 * @class LoggerService
 */

@Injectable()
export class LoggerService extends Logger implements ILogger {
  private logger: Logger;
  constructor() {
    super();
    this.logger = new Logger();
  }
  /**
   * @description method used to add logs to the microservice.
   * @param message string;
   * @param context string;
   * @returns void;
   */

  log(message: string, context?: string): void {
    this.logger.log(`[INFO] ${message}`, context);
  }

  getLogger(): Logger {
    return this.logger;
  }
}
