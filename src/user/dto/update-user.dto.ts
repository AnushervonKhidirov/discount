import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'John' })
  @IsString()
  @MaxLength(40)
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MaxLength(40)
  lastName?: string;
}
