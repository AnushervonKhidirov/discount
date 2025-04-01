import type { Company } from '@prisma/client';
import type { ReturnPromiseWithErr } from '@type/return-with-error.type';
import type { CreatePostDto } from './dto/create-post.dto';
import type { UpdatePostDto } from './dto/update-post.dto';

import { Prisma, PrismaClient } from '@prisma/client';
import { exceptionHelper } from '@helper/exception.helper';
import { NotFoundException } from '@exception';

export class CompanyService {
  private readonly repository = new PrismaClient().company;

  async findOne(where: Prisma.CompanyWhereUniqueInput): ReturnPromiseWithErr<Company> {
    try {
      const company = await this.repository.findUnique({ where });
      if (!company) throw new NotFoundException('Company not found');
      return [company, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async findMany(where?: Prisma.CompanyWhereInput): ReturnPromiseWithErr<Company[]> {
    try {
      const companies = await this.repository.findMany({ where });
      return [companies, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async create(createPostDto: CreatePostDto, userId: number): ReturnPromiseWithErr<Company> {
    try {
      const companies = await this.repository.create({ data: { ...createPostDto, userId } });
      return [companies, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    userId: number,
  ): ReturnPromiseWithErr<Company> {
    try {
      const [_, err] = await this.findOne({ id });
      if (err) throw err;

      const companies = await this.repository.update({
        data: updatePostDto,
        where: { id, userId },
      });

      return [companies, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }

  async delete(id: number, userId: number): ReturnPromiseWithErr<Company> {
    try {
      const [_, err] = await this.findOne({ id });
      if (err) throw err;

      const companies = await this.repository.delete({ where: { id, userId } });
      return [companies, null];
    } catch (err) {
      return exceptionHelper(err, true);
    }
  }
}
