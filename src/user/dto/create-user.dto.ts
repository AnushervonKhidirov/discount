import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'your_user_name' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'your_strong_password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
