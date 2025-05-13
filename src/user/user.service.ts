import type { Prisma, User } from '@prisma/client';
import type { ReturnPromiseWithErr } from '@type/return-with-error.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'bcryptjs';

import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne<T extends boolean>(
    where: Prisma.UserWhereUniqueInput,
    withPassword?: T,
  ): ReturnPromiseWithErr<T extends true ? User : Omit<User, 'password'>> {
    try {
      const user = await this.prisma.user.findUnique({
        where,
        omit: { password: !withPassword },
      });

      if (!user) throw new NotFoundException('User not found');
      return [user, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany(
    where?: Prisma.UserWhereInput,
  ): ReturnPromiseWithErr<Omit<User, 'password'>[]> {
    try {
      const users = await this.prisma.user.findMany({
        where,
        omit: { password: true },
      });

      return [users, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create({
    username,
    password,
  }: CreateUserDto): ReturnPromiseWithErr<Omit<User, 'password'>> {
    try {
      const hashedPassword = await hash(password, 10);

      const user = await this.prisma.user.create({
        data: { username, password: hashedPassword },
        omit: { password: true },
      });

      return [user, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    { username, password, firstName, lastName }: UpdateUserDto,
  ): ReturnPromiseWithErr<Omit<User, 'password'>> {
    try {
      const hashedPassword = password && (await hash(password, 10));

      const user = await this.prisma.user.update({
        data: { username, firstName, lastName, password: hashedPassword },
        where,
        omit: { password: true },
      });

      return [user, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async archive(
    where: Prisma.UserWhereUniqueInput,
  ): ReturnPromiseWithErr<Omit<User, 'password'>> {
    try {
      const user = await this.prisma.user.update({
        where,
        data: { archived: true },
        omit: { password: true },
      });

      return [user, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async unArchive(
    where: Prisma.UserWhereUniqueInput,
  ): ReturnPromiseWithErr<Omit<User, 'password'>> {
    try {
      const user = await this.prisma.user.update({
        where,
        data: { archived: false },
        omit: { password: true },
      });

      return [user, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete(
    where: Prisma.UserWhereUniqueInput,
  ): ReturnPromiseWithErr<Omit<User, 'password'>> {
    try {
      const deletedUser = await this.prisma.user.delete({
        where,
        omit: { password: true },
      });

      return [deletedUser, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
