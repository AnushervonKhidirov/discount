import type { Company } from '@prisma/client';
import type { ReturnPromiseWithErr } from '@type/return-with-error.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

import { exceptionHandler } from '@helper/exception.helper';
import { UploadPath } from 'src/common/constant/upload';

@Injectable()
export class CompanyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async findOne(
    where: Prisma.CompanyWhereUniqueInput,
  ): ReturnPromiseWithErr<Company> {
    try {
      const company = await this.prisma.company.findUnique({ where });
      if (!company) throw new NotFoundException('Company not found');
      return [company, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async findMany(
    where?: Prisma.CompanyWhereInput,
  ): ReturnPromiseWithErr<Company[]> {
    try {
      const companies = await this.prisma.company.findMany({ where });
      return [companies, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create(
    userId: number,
    { name, about, categoryId }: CreateCompanyDto,
  ): ReturnPromiseWithErr<Company> {
    try {
      const companies = await this.prisma.company.create({
        data: { name, about, categoryId, userId },
      });
      return [companies, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async update(
    where: Prisma.CompanyWhereUniqueInput,
    { name, about, categoryId, logoUrl, archived }: UpdateCompanyDto,
  ): ReturnPromiseWithErr<Company> {
    try {
      const company = await this.prisma.company.update({
        data: { name, about, categoryId, logoUrl },
        where,
      });

      return [company, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async archive(
    where: Prisma.CompanyWhereUniqueInput,
  ): ReturnPromiseWithErr<Company> {
    try {
      const [company, err] = await this.update(where, { archived: true });
      if (err) throw err;
      return [company, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async unArchive(
    where: Prisma.CompanyWhereUniqueInput,
  ): ReturnPromiseWithErr<Company> {
    try {
      const [company, err] = await this.update(where, { archived: false });
      if (err) throw err;
      return [company, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete(
    where: Prisma.CompanyWhereUniqueInput,
  ): ReturnPromiseWithErr<Company> {
    try {
      const companies = await this.prisma.company.delete({ where });
      return [companies, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async uploadLogo(
    where: Prisma.CompanyWhereUniqueInput,
    file: Express.Multer.File,
  ): ReturnPromiseWithErr<Company> {
    try {
      const [company, err] = await this.findOne(where);
      if (err) throw err;

      const companyImageName = `${company.name.replaceAll(' ', '_')}_id_${company.id}`;

      const [logoUrl, logoErr] = await this.uploadService.create({
        file,
        path: UploadPath.Logo,
        fileName: companyImageName,
      });

      if (logoErr) throw logoErr;

      const updatedCompany = await this.prisma.company.update({
        data: { logoUrl },
        where,
      });

      return [updatedCompany, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
