import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsEnum,
  IsDate,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class FindManyPromotionDto {
  @ApiProperty({ example: 6 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  take?: number;

  @ApiProperty({ example: 6 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  skip?: number;

  @ApiProperty({ example: 35 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  size?: number;

  @ApiProperty({ example: '2025-05-20' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startAt?: Date;

  @ApiProperty({ example: '2025-05-30' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endAt?: Date;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  bankId?: number;

  @ApiProperty({ example: $Enums.PromotionType.CASHBACK })
  @IsEnum($Enums.PromotionType)
  @IsOptional()
  type?: $Enums.PromotionType;
}
