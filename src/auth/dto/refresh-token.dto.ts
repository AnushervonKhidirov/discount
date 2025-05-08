import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ example: 'your_refresh_token' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
