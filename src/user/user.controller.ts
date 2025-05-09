import type { UserTokenPayload } from 'src/token/type/token.type';

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

const user = {
  id: 1,
  username: 'john_doe_01',
  firstName: 'John',
  lastName: 'Doe',
  role: 'USER',
  archived: false,
  createdAt: '2025-05-08T16:31:28.000Z',
  updatedAt: '2025-05-08T16:31:28.000Z',
};

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ schema: { example: [user] } })
  @Get()
  async findMany() {
    const [users, err] = await this.userService.findMany({ role: 'USER' });
    if (err) throw err;
    return users;
  }

  @ApiResponse({ schema: { example: user } })
  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [users, err] = await this.userService.findOne({ id });
    if (err) throw err;
    return users;
  }

  @ApiResponse({ schema: { example: user } })
  @UseGuards(AuthGuard)
  @Patch()
  async update(
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
    @Req() request: Request,
  ) {
    const userPayload: UserTokenPayload | undefined = request['user'];
    if (!userPayload) throw new UnauthorizedException();

    const [users, err] = await this.userService.update(
      +userPayload.sub,
      updateUserDto,
    );

    if (err) throw err;
    return users;
  }
}
