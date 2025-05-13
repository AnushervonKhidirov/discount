import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, ValidateIf } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Defacto' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Defacto store with high quality brand clothes!' })
  @IsString()
  @IsNotEmpty()
  @ValidateIf(({ about }) => about !== undefined)
  about?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @ValidateIf(({ categoryId }) => categoryId !== undefined)
  categoryId?: number;
}
