import type { Category } from '@prisma/client';
import type { ReturnPromiseWithErr } from '@type/return-with-error.type';

import { exceptionHandler } from '@helper/exception.helper';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(
    where: Prisma.CategoryWhereUniqueInput,
  ): ReturnPromiseWithErr<Category> {
    try {
      const category = await this.prisma.category.findUnique({ where });
      if (!category) throw new NotFoundException('County not found');
      return [category, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany(
    where?: Prisma.CategoryWhereInput,
  ): ReturnPromiseWithErr<Category[]> {
    try {
      const categories = await this.prisma.category.findMany({ where });
      return [categories, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
