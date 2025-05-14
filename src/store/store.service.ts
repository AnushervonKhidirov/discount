import type { Store } from '@prisma/client';
import type { ReturnPromiseWithErr } from '@type/return-with-error.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class StoreService {
  private readonly include: Prisma.StoreDeleteArgs['include'] = {
    city: true,
    country: true,
    company: true,
    benefits: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  async findOne(
    where: Prisma.StoreWhereUniqueInput,
  ): ReturnPromiseWithErr<Store> {
    try {
      const store = await this.prisma.store.findUnique({
        where,
        include: this.include,
      });

      if (!store) throw new NotFoundException('Store not found');
      return [store, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany(
    where?: Prisma.StoreWhereInput,
  ): ReturnPromiseWithErr<Store[]> {
    try {
      const stores = await this.prisma.store.findMany({
        where,
        include: this.include,
      });
      return [stores, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create(createStoreDto: CreateStoreDto): ReturnPromiseWithErr<Store> {
    try {
      const store = await this.prisma.store.create({
        data: createStoreDto,
        include: this.include,
      });

      return [store, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async update(
    where: Prisma.StoreWhereUniqueInput,
    updateStoreDto: UpdateStoreDto,
  ): ReturnPromiseWithErr<Store> {
    try {
      const store = await this.prisma.store.update({
        where,
        data: updateStoreDto,
        include: this.include,
      });

      return [store, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async archive(
    where: Prisma.StoreWhereUniqueInput,
  ): ReturnPromiseWithErr<Store> {
    return await this.update(where, { archived: true });
  }

  async unArchive(
    where: Prisma.StoreWhereUniqueInput,
  ): ReturnPromiseWithErr<Store> {
    return await this.update(where, { archived: false });
  }

  async delete(
    where: Prisma.StoreWhereUniqueInput,
  ): ReturnPromiseWithErr<Store> {
    try {
      const store = await this.prisma.store.delete({
        where,
        include: this.include,
      });

      return [store, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
