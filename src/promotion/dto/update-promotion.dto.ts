import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, ValidateIf } from 'class-validator';
import { CreatePromotionDto } from './create-promotion.dto';

export class UpdatePromotionDto extends PartialType(CreatePromotionDto) {
  @ApiProperty({ example: true })
  @IsBoolean()
  @ValidateIf(({ archived }) => archived !== undefined)
  archived?: boolean;
}
