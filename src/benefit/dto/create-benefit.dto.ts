import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateIf,
  Validate,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { $Enums } from '@prisma/client';
import { BenefitTypeValidation } from '../validation/benefit-type.validation';

export class CreateBenefitDto {
  @ApiProperty({ example: $Enums.BenefitType.DISCOUNT })
  @IsEnum($Enums.BenefitType)
  @Validate(BenefitTypeValidation)
  type: $Enums.BenefitType;

  @ApiProperty({ example: 1 })
  @IsNumber()
  companyId: number;

  @ApiProperty({ example: [1, 2] })
  @IsArray({ always: true })
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  storeIds: number[];

  @ApiProperty({ example: 30 })
  @IsNumber()
  @Min(1)
  @Max(100)
  size: number;

  @ApiProperty({ example: 'Discount for all products!' })
  @IsString()
  @ValidateIf(({ message }) => message !== undefined)
  message?: string;

  @ApiProperty({
    example: '2025-05-15T10:49:57.166Z',
    description: 'Date in ISO String format',
  })
  @IsDateString()
  startAt: Date;

  @ApiProperty({
    example: '2025-05-15T10:49:57.166Z',
    description: 'Date in ISO String format',
  })
  @IsDateString()
  endAt: Date;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @ValidateIf(({ type }) => type === $Enums.BenefitType.CASHBACK)
  bankId?: number;

  @ApiProperty({ example: 'PROMO_CODE' })
  @ValidateIf(({ type }) => type === $Enums.BenefitType.PROMO_CODE)
  @IsString()
  @IsNotEmpty()
  promoCode?: string;
}
