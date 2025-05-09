import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignOutDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ7' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
