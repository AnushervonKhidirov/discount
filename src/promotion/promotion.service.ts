import type { Promotion } from '@prisma/client';
import type { ReturnPromiseWithErr } from '@type/return-with-error.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class PromotionService {
  private readonly include: Prisma.PromotionDefaultArgs['include'] = {
    company: true,
    stores: true,
    bank: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  async findOne(
    where: Prisma.PromotionWhereUniqueInput,
  ): ReturnPromiseWithErr<Promotion> {
    try {
      const promotion = await this.prisma.promotion.findUnique({
        where,
        include: this.include,
      });
      if (!promotion) throw new NotFoundException();
      return [promotion, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany(
    where?: Prisma.PromotionWhereInput,
    params?: Pick<Prisma.PromotionFindManyArgs, 'take' | 'skip' | 'orderBy'>,
  ): ReturnPromiseWithErr<Promotion[]> {
    try {
      const promotions = await this.prisma.promotion.findMany({
        where,
        take: params?.take,
        skip: params?.skip,
        orderBy: params?.orderBy,
        include: this.include,
      });
      return [promotions, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create(
    createPromotionDto: CreatePromotionDto,
  ): ReturnPromiseWithErr<Promotion> {
    try {
      const promotion = await this.prisma.promotion.create({
        data: {
          ...this.expandCreateDto(createPromotionDto),
          stores: {
            connect: createPromotionDto.storeIds.map((storeId) => ({
              id: storeId,
            })),
          },
        },
        include: this.include,
      });

      return [promotion, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async update(
    where: Prisma.PromotionWhereUniqueInput,
    updatePromotionDto: UpdatePromotionDto,
  ): ReturnPromiseWithErr<Promotion> {
    try {
      const promotion = await this.prisma.promotion.update({
        where,
        data: {
          ...this.expandUpdateDto(updatePromotionDto),
          stores: updatePromotionDto.storeIds && {
            connect: updatePromotionDto.storeIds.map((storeId) => ({
              id: storeId,
            })),
          },
        },
        include: this.include,
      });
      return [promotion, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async archive(
    where: Prisma.PromotionWhereUniqueInput,
  ): ReturnPromiseWithErr<Promotion> {
    try {
      return await this.update(where, { archived: true });
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async unarchive(
    where: Prisma.PromotionWhereUniqueInput,
  ): ReturnPromiseWithErr<Promotion> {
    try {
      return await this.update(where, { archived: false });
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete(
    where: Prisma.PromotionWhereUniqueInput,
  ): ReturnPromiseWithErr<Promotion> {
    try {
      const promotion = await this.prisma.promotion.delete({
        where,
        include: this.include,
      });
      return [promotion, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  private expandCreateDto(
    createPromotionDto: CreatePromotionDto,
  ): Omit<CreatePromotionDto, 'storeIds'> {
    return {
      type: createPromotionDto.type,
      companyId: createPromotionDto.companyId,
      size: createPromotionDto.size,
      message: createPromotionDto.message,
      startAt: new Date(createPromotionDto.startAt),
      endAt: new Date(createPromotionDto.endAt),
      promoCode: createPromotionDto.promoCode,
      bankId: createPromotionDto.bankId,
    };
  }

  private expandUpdateDto(
    updatePromotionDto: UpdatePromotionDto,
  ): UpdatePromotionDto {
    return {
      type: updatePromotionDto.type,
      size: updatePromotionDto.size,
      message: updatePromotionDto.message,
      startAt:
        updatePromotionDto.startAt && new Date(updatePromotionDto.startAt),
      endAt: updatePromotionDto.endAt && new Date(updatePromotionDto.endAt),
      promoCode: updatePromotionDto.promoCode,
      bankId: updatePromotionDto.bankId,
      archived: updatePromotionDto.archived,
    };
  }
}
