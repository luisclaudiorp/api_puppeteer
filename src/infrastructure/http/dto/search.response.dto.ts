import { ApiProperty } from '@nestjs/swagger';

export class SearchResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  price: string;
}
