import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCountryDto {
  @ApiProperty({ example: 'Tajikistan' })
  @IsString()
  @IsNotEmpty()
  value: string;
}
