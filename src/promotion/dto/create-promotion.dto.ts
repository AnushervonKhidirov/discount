import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsString,
  IsArray,
  IsNotEmpty,
  Min,
  Max,
  ValidateIf,
  Validate,
} from 'class-validator';
import { $Enums } from '@prisma/client';
import { PromotionTypeValidation } from '../validation/promotion-type.validation';

export class CreatePromotionDto {
  @ApiProperty({ example: $Enums.PromotionType.DISCOUNT })
  @IsEnum($Enums.PromotionType)
  @Validate(PromotionTypeValidation)
  type: $Enums.PromotionType;

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

  @ApiProperty({ example: '2025-05-15', description: 'Format: YYYY-MM-dd' })
  @IsDate()
  @Type(() => Date)
  startAt: Date;

  @ApiProperty({ example: '2025-05-15', description: 'Format: YYYY-MM-dd' })
  @IsDate()
  @Type(() => Date)
  endAt: Date;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @ValidateIf(({ type }) => type === $Enums.PromotionType.CASHBACK)
  bankId?: number;

  @ApiProperty({ example: 'PROMO_CODE' })
  @ValidateIf(({ type }) => type === $Enums.PromotionType.PROMO_CODE)
  @IsString()
  @IsNotEmpty()
  promoCode?: string;
}
