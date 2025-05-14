import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, ValidateIf } from 'class-validator';
import { CreateBenefitDto } from './create-benefit.dto';

export class UpdateBenefitDto extends PartialType(CreateBenefitDto) {
  @ApiProperty({ example: true })
  @IsBoolean()
  @ValidateIf(({ archived }) => archived !== undefined)
  archived?: boolean;
}
