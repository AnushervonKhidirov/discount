import type { Request } from 'express';
import type { UserTokenPayload } from 'src/token/type/token.type';

import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Req,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';

import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async findMany() {
    const [companies, err] = await this.companyService.findMany();
    if (err) throw err;
    return companies;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [company, err] = await this.companyService.findOne({ id });
    if (err) throw err;
    return company;
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body(new ValidationPipe()) createCompanyDto: CreateCompanyDto,
    @Req() request: Request,
  ) {
    const userPayload: UserTokenPayload | undefined = request['user'];
    if (!userPayload) throw new UnauthorizedException();

    const [company, err] = await this.companyService.create(
      +userPayload.sub,
      createCompanyDto,
    );

    if (err) throw err;
    return company;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) { name, about, categoryId }: UpdateCompanyDto,
    @Req() request: Request,
  ) {
    const userPayload: UserTokenPayload | undefined = request['user'];
    if (!userPayload) throw new UnauthorizedException();

    const [company, err] = await this.companyService.update(
      { id, userId: +userPayload.sub },
      { name, about, categoryId },
    );

    if (err) throw err;
    return company;
  }

  @UseGuards(AuthGuard)
  @Patch('archive/:id')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const userPayload: UserTokenPayload | undefined = request['user'];
    if (!userPayload) throw new UnauthorizedException();

    const [company, err] = await this.companyService.archive({
      id,
      userId: +userPayload.sub,
    });

    if (err) throw err;
    return company;
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-logo/:id')
  async uploadLogo(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    const userPayload: UserTokenPayload | undefined = request['user'];
    if (!userPayload) throw new UnauthorizedException();

    const [company, err] = await this.companyService.uploadLogo(
      { id, userId: +userPayload.sub },
      file,
    );

    if (err) throw err;
    return company;
  }
}
