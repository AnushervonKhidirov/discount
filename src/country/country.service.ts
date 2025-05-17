import type { Country } from '@prisma/client';
import type { ReturnPromiseWithErr } from '@type/return-with-error.type';

import { exceptionHandler } from '@helper/exception.helper';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CountryService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(
    where: Prisma.CountryWhereUniqueInput,
  ): ReturnPromiseWithErr<Country> {
    try {
      const country = await this.prisma.country.findUnique({ where });
      if (!country) throw new NotFoundException('County not found');
      return [country, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany(
    where?: Prisma.CountryWhereInput,
  ): ReturnPromiseWithErr<Country[]> {
    try {
      const country = await this.prisma.country.findMany({ where });
      return [country, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
