import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

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

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  userId?: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;
}
