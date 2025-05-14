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
        data: this.expandCreateDto(createStoreDto),
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
        data: this.expandUpdateDto(updateStoreDto),
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

  private expandCreateDto(createStoreDto: CreateStoreDto): CreateStoreDto {
    return {
      companyId: createStoreDto.companyId,
      countryId: createStoreDto.countryId,
      cityId: createStoreDto.cityId,
      address: createStoreDto.address,
      latitude: createStoreDto.latitude,
      longitude: createStoreDto.longitude,
      openAt: createStoreDto.openAt,
      closeAt: createStoreDto.closeAt,
    };
  }

  private expandUpdateDto(updateStoreDto: UpdateStoreDto): UpdateStoreDto {
    return {
      companyId: updateStoreDto.companyId,
      countryId: updateStoreDto.countryId,
      cityId: updateStoreDto.cityId,
      address: updateStoreDto.address,
      latitude: updateStoreDto.latitude,
      longitude: updateStoreDto.longitude,
      openAt: updateStoreDto.openAt,
      closeAt: updateStoreDto.closeAt,
      archived: updateStoreDto.archived,
    };
  }
}
