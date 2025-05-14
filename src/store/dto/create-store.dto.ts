import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsLatitude,
  IsLongitude,
  IsMilitaryTime,
} from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  countryId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  cityId: number;

  @ApiProperty({ example: 'Ayni street 48' })
  @IsString()
  address: string;

  @ApiProperty({ example: '38.57882399486239' })
  @IsLatitude()
  latitude: string;

  @ApiProperty({ example: '68.78637547795134' })
  @IsLongitude()
  longitude: string;

  @ApiProperty({ example: '8:00' })
  @IsMilitaryTime()
  openAt: string;

  @ApiProperty({ example: '21:00' })
  @IsMilitaryTime()
  closeAt: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  companyId: number;
}
