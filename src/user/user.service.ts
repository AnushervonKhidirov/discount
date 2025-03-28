import type { Prisma, User } from '@prisma/client';
import type { ReturnPromiseWithErr } from '@type/return-with-error.type';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';

import { PrismaClient } from '@prisma/client';
import { exceptionHelper } from '@helper/exception.helper';
import { NotFoundException, ConflictException } from '@exception';

export class UserService {
  private readonly repository = new PrismaClient().user;

  async findOne<T extends boolean>(
    where: Prisma.UserWhereUniqueInput,
    withPassword?: T,
  ): ReturnPromiseWithErr<T extends true ? User : Omit<User, 'password'>> {
    try {
      const user = await this.repository.findUnique({ where, omit: { password: !withPassword } });
      if (!user) throw new NotFoundException('User not found');
      return [user, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async findMany(where?: Prisma.UserWhereInput): ReturnPromiseWithErr<Omit<User, 'password'>[]> {
    try {
      const users = await this.repository.findMany({ where, omit: { password: true } });
      return [users, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async create(createUserDto: CreateUserDto): ReturnPromiseWithErr<Omit<User, 'password'>> {
    try {
      const [isExist] = await this.findOne({ username: createUserDto.username });
      if (isExist) throw new ConflictException(`User '${createUserDto.username}' already exists`);

      createUserDto.password = await Bun.password.hash(createUserDto.password, 'bcrypt');

      const user = await this.repository.create({ data: createUserDto, omit: { password: true } });
      return [user, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): ReturnPromiseWithErr<Omit<User, 'password'>> {
    try {
      const [_, err] = await this.findOne({ id });
      if (err) throw err;

      if (updateUserDto.password) {
        updateUserDto.password = await Bun.password.hash(updateUserDto.password, 'bcrypt');
      }

      const user = await this.repository.update({
        data: updateUserDto,
        where: { id },
        omit: { password: true },
      });
      return [user, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async delete(id: number): ReturnPromiseWithErr<Omit<User, 'password'>> {
    try {
      const [_, err] = await this.findOne({ id });
      if (err) throw err;

      const user = await this.repository.delete({ where: { id }, omit: { password: true } });
      return [user, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }
}
