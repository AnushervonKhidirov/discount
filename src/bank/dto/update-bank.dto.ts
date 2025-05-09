import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, ValidateIf, IsBoolean } from 'class-validator';
import { CreateBankDto } from './create-bank.dto';

export class UpdateBankDto extends PartialType(CreateBankDto) {
  @ApiProperty({ example: 'path/to/logo/image' })
  @IsString()
  @IsNotEmpty()
  @ValidateIf(({ logoUrl }) => logoUrl !== undefined)
  logoUrl?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @ValidateIf(({ logoUrl }) => logoUrl !== undefined)
  archived?: boolean;
}
