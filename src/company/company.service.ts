import type { Company } from '@prisma/client';
import type { ReturnPromiseWithErr } from '@type/return-with-error.type';

import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(
    where: Prisma.CompanyWhereUniqueInput,
  ): ReturnPromiseWithErr<Company> {
    try {
      const company = await this.prisma.company.findUnique({
        where,
        include: { category: true, countries: true },
      });
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
      const companies = await this.prisma.company.findMany({
        where,
        include: { category: true, countries: true },
      });
      return [companies, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async create(
    userId: number,
    { name, about, categoryId, countryIds }: CreateCompanyDto,
  ): ReturnPromiseWithErr<Company> {
    try {
      const companies = await this.prisma.company.create({
        data: {
          name,
          about,
          categoryId,
          userId,
          countries: { connect: countryIds.map((id) => ({ id })) },
        },
        include: { category: true, countries: true },
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
        where,
        data: { name, about, categoryId, logoUrl, archived },
        include: { category: true, countries: true },
      });

      return [company, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async archive(
    where: Prisma.CompanyWhereUniqueInput,
  ): ReturnPromiseWithErr<Company> {
    return await this.update(where, { archived: true });
  }

  async unArchive(
    where: Prisma.CompanyWhereUniqueInput,
  ): ReturnPromiseWithErr<Company> {
    return await this.update(where, { archived: false });
  }

  async uploadLogo(
    where: Prisma.CompanyWhereUniqueInput,
    logoUrl: string,
  ): ReturnPromiseWithErr<Company> {
    return await this.update(where, { logoUrl });
  }

  async delete(
    where: Prisma.CompanyWhereUniqueInput,
  ): ReturnPromiseWithErr<Company> {
    try {
      const companies = await this.prisma.company.delete({
        where,
        include: { category: true, countries: true },
      });
      return [companies, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
