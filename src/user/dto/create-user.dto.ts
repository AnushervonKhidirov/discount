import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe_01' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'your_strong_password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;
}
