import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class SearchRequestDto {
  @ApiProperty({ required: true, example: 'YYYY-MM-DD', nullable: false })
  @IsDateString(
    {},
    { message: `This field 'checkin' must be in the date format YYYY-MM-DD` },
  )
  checkin: string;

  @ApiProperty({ required: true, example: 'YYYY-MM-DD', nullable: false })
  @IsDateString(
    {},
    { message: `This field 'checkout' must be in the date format YYYY-MM-DD` },
  )
  checkout: string;
}
