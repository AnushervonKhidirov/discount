import type { Benefit } from '@prisma/client';
import type { ReturnPromiseWithErr } from '@type/return-with-error.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';

import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class BenefitService {
  private readonly include: Prisma.BenefitDefaultArgs['include'] = {
    company: true,
    stores: true,
    bank: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  async findOne(
    where: Prisma.BenefitWhereUniqueInput,
  ): ReturnPromiseWithErr<Benefit> {
    try {
      const benefit = await this.prisma.benefit.findUnique({
        where,
        include: this.include,
      });
      if (!benefit) throw new NotFoundException();
      return [benefit, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany(
    where?: Prisma.BenefitWhereInput,
  ): ReturnPromiseWithErr<Benefit[]> {
    try {
      const benefits = await this.prisma.benefit.findMany({
        where,
        include: this.include,
      });
      return [benefits, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create(
    createBenefitDto: CreateBenefitDto,
  ): ReturnPromiseWithErr<Benefit> {
    try {
      const benefit = await this.prisma.benefit.create({
        data: {
          ...this.expandCreateDto(createBenefitDto),
          stores: {
            connect: createBenefitDto.storeIds.map((storeId) => ({
              id: storeId,
            })),
          },
        },
        include: this.include,
      });

      return [benefit, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async update(
    where: Prisma.BenefitWhereUniqueInput,
    updateBenefitDto: UpdateBenefitDto,
  ): ReturnPromiseWithErr<Benefit> {
    try {
      const benefit = await this.prisma.benefit.update({
        where,
        data: {
          ...this.expandUpdateDto(updateBenefitDto),
          stores: updateBenefitDto.storeIds && {
            connect: updateBenefitDto.storeIds.map((storeId) => ({
              id: storeId,
            })),
          },
        },
        include: this.include,
      });
      return [benefit, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async archive(
    where: Prisma.BenefitWhereUniqueInput,
  ): ReturnPromiseWithErr<Benefit> {
    try {
      return await this.update(where, { archived: true });
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async unarchive(
    where: Prisma.BenefitWhereUniqueInput,
  ): ReturnPromiseWithErr<Benefit> {
    try {
      return await this.update(where, { archived: false });
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete(
    where: Prisma.BenefitWhereUniqueInput,
  ): ReturnPromiseWithErr<Benefit> {
    try {
      const benefit = await this.prisma.benefit.delete({
        where,
        include: this.include,
      });
      return [benefit, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  private expandCreateDto(
    createBenefitDto: CreateBenefitDto,
  ): CreateBenefitDto {
    return {
      type: createBenefitDto.type,
      companyId: createBenefitDto.companyId,
      storeIds: createBenefitDto.storeIds,
      size: createBenefitDto.size,
      message: createBenefitDto.message,
      startAt: createBenefitDto.startAt,
      endAt: createBenefitDto.endAt,
      promoCode: createBenefitDto.promoCode,
      bankId: createBenefitDto.bankId,
    };
  }

  private expandUpdateDto(
    updateBenefitDto: UpdateBenefitDto,
  ): UpdateBenefitDto {
    return {
      type: updateBenefitDto.type,
      storeIds: updateBenefitDto.storeIds,
      size: updateBenefitDto.size,
      message: updateBenefitDto.message,
      startAt: updateBenefitDto.startAt,
      endAt: updateBenefitDto.endAt,
      promoCode: updateBenefitDto.promoCode,
      bankId: updateBenefitDto.bankId,
      archived: updateBenefitDto.archived,
    };
  }
}
