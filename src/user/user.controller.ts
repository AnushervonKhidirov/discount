import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';

const user = {
  id: 1,
  username: 'username',
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
}
