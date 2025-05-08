import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findMany() {
    const [users, err] = await this.userService.findMany({ role: 'USER' });
    if (err) throw err;
    return users;
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [users, err] = await this.userService.findOne({ id });
    if (err) throw err;
    return users;
  }
}
