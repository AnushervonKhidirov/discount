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
import { ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

import { UploadService } from 'src/upload/upload.service';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

import { UploadPath } from 'src/common/constant/upload';

const companyData = {
  id: 1,
  name: 'Defacto',
  about: 'about Defacto',
  logoUrl: '22e14d84-a522-495b-973d-a6b6fbef9fbc.png',
  verified: false,
  archived: false,
  userId: 1,
  categoryId: null,
  createdAt: '2025-05-13T06:32:31.000Z',
  updatedAt: '2025-05-13T09:44:17.000Z',
  category: null,
};

@Controller('companies')
export class CompanyController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly companyService: CompanyService,
  ) {}

  @ApiResponse({ example: [companyData] })
  @Get()
  async findMany() {
    const [companies, err] = await this.companyService.findMany();
    if (err) throw err;
    return companies;
  }

  @ApiResponse({ example: companyData })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [company, err] = await this.companyService.findOne({ id });
    if (err) throw err;
    return company;
  }

  @ApiResponse({ example: companyData })
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

  @ApiResponse({ example: companyData })
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

  @ApiResponse({ example: companyData })
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

  @ApiResponse({ example: companyData })
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', UploadService.setFileOptions(UploadPath.Logo)),
  )
  @Post('upload-logo/:id')
  async uploadLogo(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    const [_, fileContentErr] = await this.uploadService.checkFileContent({
      path: UploadPath.Logo,
      fileName: file.filename,
    });

    if (fileContentErr) throw fileContentErr;

    const userPayload: UserTokenPayload | undefined = request['user'];
    if (!userPayload) throw new UnauthorizedException();

    const [company, err] = await this.companyService.uploadLogo(
      { id, userId: +userPayload.sub },
      file.filename,
    );

    if (err) throw err;
    return company;
  }
}
