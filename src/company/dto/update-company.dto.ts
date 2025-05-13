import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @ApiProperty({ example: 'path/to/logo/image' })
  @IsString()
  @IsNotEmpty()
  @ValidateIf(({ logoUrl }) => logoUrl !== undefined)
  logoUrl?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @ValidateIf(({ archived }) => archived !== undefined)
  archived?: boolean;
}
