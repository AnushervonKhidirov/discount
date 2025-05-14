import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, ValidateIf } from 'class-validator';
import { CreateStoreDto } from './create-store.dto';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {
  @ApiProperty({ example: true })
  @IsBoolean()
  @ValidateIf(({ archived }) => archived !== undefined)
  archived?: boolean;
}
