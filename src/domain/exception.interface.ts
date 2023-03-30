/**
 * @interface IFormatExceptionMessage
 * @description system formatExceptionMessage interface
 * @property message @type string
 * @property code_error? @type number
 */

export interface IFormatExceptionMessage {
  message: string;
  code_error?: number;
}

/**
 * @interface IException
 * @description system exception interface
 * @method badRequestException
 * @param IFormatExceptionMessage
 * @method internalServerErrorException
 * @param IFormatExceptionMessage
 */

export interface IException {
  badRequestException(data: IFormatExceptionMessage): void;
  internalServerErrorException(data?: IFormatExceptionMessage): void;
}
