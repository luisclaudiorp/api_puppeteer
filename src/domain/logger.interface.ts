/**
 * @description system logs interface
 * @method log
 */
export interface ILogger {
  log(message: string, context?: string): void;
}
