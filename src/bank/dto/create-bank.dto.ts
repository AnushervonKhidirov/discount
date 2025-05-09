import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateBankDto {
  @ApiProperty({ example: 'Alif' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}
