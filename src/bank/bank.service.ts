import type { Prisma, Bank } from '@prisma/client';
import type { ReturnPromiseWithErr } from '@type/return-with-error.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

import { exceptionHandler } from '@helper/exception.helper';
import { UploadPath } from 'src/common/constant/upload';

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
    id: number,
    { name, logoUrl, archived }: UpdateBankDto,
  ): ReturnPromiseWithErr<Bank> {
    try {
      const bank = await this.prisma.bank.update({
        data: { name, logoUrl, archived },
        where: { id },
      });
      return [bank, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async archive(id: number): ReturnPromiseWithErr<Bank> {
    try {
      const [bank, err] = await this.update(id, { archived: true });
      if (err) throw err;
      return [bank, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async unArchive(id: number): ReturnPromiseWithErr<Bank> {
    try {
      const [bank, err] = await this.update(id, { archived: false });
      if (err) throw err;
      return [bank, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete(id: number): ReturnPromiseWithErr<Bank> {
    try {
      const [_, err] = await this.findOne({ id });
      if (err) throw err;

      const bank = await this.prisma.bank.delete({ where: { id } });
      return [bank, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async uploadLogo(id: number, file: File): ReturnPromiseWithErr<Bank> {
    try {
      const [bank, err] = await this.findOne({ id });
      if (err) throw err;

      const bankImageName = `${bank.name.replaceAll(' ', '_')}_id_${bank.id}`;

      const [logoUrl, logoErr] = await this.uploadService.create({
        file,
        path: UploadPath.Logo,
        fileName: bankImageName,
      });

      if (logoErr) throw logoErr;

      const [updatedBank, updateErr] = await this.update(id, { logoUrl });
      if (updateErr) throw updateErr;

      return [updatedBank, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
