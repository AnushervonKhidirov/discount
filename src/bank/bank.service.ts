import type { Prisma, Bank } from '@prisma/client';
import type { ReturnPromiseWithErr } from '@type/return-with-error.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class BankService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async findOne(
    where: Prisma.BankWhereUniqueInput,
  ): ReturnPromiseWithErr<Bank> {
    try {
      const bank = await this.prisma.bank.findUnique({ where });
      if (!bank) throw new NotFoundException('Bank not found');
      return [bank, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany(where?: Prisma.BankWhereInput): ReturnPromiseWithErr<Bank[]> {
    try {
      const banks = await this.prisma.bank.findMany({ where });
      return [banks, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create({ name }: CreateBankDto): ReturnPromiseWithErr<Bank> {
    try {
      const bank = await this.prisma.bank.create({ data: { name } });
      return [bank, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async update(
    where: Prisma.BankWhereUniqueInput,
    { name, logoUrl, archived }: UpdateBankDto,
  ): ReturnPromiseWithErr<Bank> {
    try {
      const bank = await this.prisma.bank.update({
        where,
        data: { name, logoUrl, archived },
      });
      return [bank, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async archive(
    where: Prisma.BankWhereUniqueInput,
  ): ReturnPromiseWithErr<Bank> {
    return await this.update(where, { archived: true });
  }

  async unArchive(
    where: Prisma.BankWhereUniqueInput,
  ): ReturnPromiseWithErr<Bank> {
    return await this.update(where, { archived: false });
  }

  async uploadLogo(
    where: Prisma.BankWhereUniqueInput,
    logoUrl: string,
  ): ReturnPromiseWithErr<Bank> {
    return await this.update(where, { logoUrl });
  }

  async delete(where: Prisma.BankWhereUniqueInput): ReturnPromiseWithErr<Bank> {
    try {
      const [_, err] = await this.findOne(where);
      if (err) throw err;

      const bank = await this.prisma.bank.delete({ where });
      return [bank, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
