import type { Benefit } from '@prisma/client';
import type { ReturnPromiseWithErr } from '@type/return-with-error.type';
import type { CreateBenefitDto } from './dto/create-benefit.dto';

import { Prisma, PrismaClient } from '@prisma/client';
import { NotFoundException } from '@exception';
import { exceptionHelper } from '@helper/exception.helper';

export class BenefitService {
  private readonly repository = new PrismaClient().benefit;

  async findOne(where: Prisma.BenefitWhereUniqueInput): ReturnPromiseWithErr<Benefit> {
    try {
      const benefit = await this.repository.findUnique({
        where,
        include: { company: true, bank: true },
      });
      if (!benefit) throw new NotFoundException();
      return [benefit, null];
    } catch (err) {
      return exceptionHelper(err);
    }
  }

  async findMany(
    where?: Prisma.BenefitWhereInput,
    take?: number,
    skip?: number,
  ): ReturnPromiseWithErr<Benefit[]> {
    try {
      const benefits = await this.repository.findMany({
        where,
        take,
        skip,
        include: { company: true, bank: true },
      });
      return [benefits, null];
    } catch (err) {
      return exceptionHelper(err);
    }
  }

  async create(
    { type, size, about, startAt, endAt, bankId }: CreateBenefitDto,
    companyId: number,
  ): ReturnPromiseWithErr<Benefit> {
    try {
      const benefit = await this.repository.create({
        data: { type, size, about, startAt, endAt, bankId, companyId },
        include: { company: true, bank: true },
      });

      return [benefit, null];
    } catch (err) {
      return exceptionHelper(err);
    }
  }

  async update(
    id: number,
    { size, about, startAt, endAt, bankId }: Partial<Benefit>,
    companyId: number,
  ): ReturnPromiseWithErr<Benefit> {
    try {
      const benefit = await this.repository.update({
        where: { id, companyId },
        data: { size, about, startAt, endAt, bankId },
        include: { company: true, bank: true },
      });

      return [benefit, null];
    } catch (err) {
      return exceptionHelper(err);
    }
  }

  async archive(id: number, companyId?: number): ReturnPromiseWithErr<Benefit> {
    try {
      const benefit = await this.repository.update({
        where: { id, companyId },
        data: { archived: true },
        include: { company: true, bank: true },
      });
      return [benefit, null];
    } catch (err) {
      return exceptionHelper(err);
    }
  }

  async unarchive(id: number, companyId?: number): ReturnPromiseWithErr<Benefit> {
    try {
      const benefit = await this.repository.update({
        where: { id, companyId },
        data: { archived: false },
        include: { company: true, bank: true },
      });
      return [benefit, null];
    } catch (err) {
      return exceptionHelper(err);
    }
  }

  async delete(id: number): ReturnPromiseWithErr<Benefit> {
    try {
      const benefit = await this.repository.delete({
        where: { id },
        include: { company: true, bank: true },
      });
      return [benefit, null];
    } catch (err) {
      return exceptionHelper(err);
    }
  }
}
