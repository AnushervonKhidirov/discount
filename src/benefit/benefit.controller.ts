import type { Request } from 'express';
import type { UserTokenPayload } from 'src/token/type/token.type';
import type { BenefitQuery } from './type/benefit.type';

import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  Req,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CompanyService } from 'src/company/company.service';
import { BenefitService } from './benefit.service';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';

const benefit = {
  id: 2,
  type: 'DISCOUNT',
  size: 25,
  message: null,
  startAt: '2025-05-15T00:00:01.000Z',
  endAt: '2025-05-25T00:00:00.000Z',
  archived: false,
  companyId: 28,
  bankId: null,
  promoCode: null,
  createdAt: '2025-05-15T10:49:46.000Z',
  updatedAt: '2025-05-15T10:49:46.000Z',
  company: {
    id: 28,
    name: 'Defacto',
    about: 'about Defacto store',
    logoUrl: null,
    verified: false,
    archived: false,
    userId: 3,
    categoryId: null,
    createdAt: '2025-05-15T10:14:46.000Z',
    updatedAt: '2025-05-15T10:14:46.000Z',
  },
  stores: [
    {
      id: 3,
      companyId: 28,
      countryId: 1,
      cityId: 1,
      address: 'Rudaki Avenue 77',
      latitude: '38.578805',
      longitude: '68.786370',
      openAt: '08:00',
      closeAt: '18:00',
      archived: false,
      createdAt: '2025-05-15T10:16:58.000Z',
      updatedAt: '2025-05-15T10:16:58.000Z',
    },
    {
      id: 4,
      companyId: 28,
      countryId: 1,
      cityId: 1,
      address: 'Sadriddin Ayni Street 55',
      latitude: '38.563287',
      longitude: '68.808445',
      openAt: '08:00',
      closeAt: '18:00',
      archived: false,
      createdAt: '2025-05-15T10:19:18.000Z',
      updatedAt: '2025-05-15T10:19:18.000Z',
    },
  ],
  bank: null,
};

@Controller('benefits')
export class BenefitController {
  constructor(
    private readonly benefitService: BenefitService,
    private readonly companyService: CompanyService,
  ) {}

  @ApiResponse({ example: [benefit] })
  @Get()
  async findMany(@Query() { type, take, skip }: BenefitQuery) {
    const [benefits, err] = await this.benefitService.findMany(
      { type },
      { take, skip },
    );
    if (err) throw err;
    return benefits;
  }

  @ApiResponse({ example: benefit })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [benefit, err] = await this.benefitService.findOne({ id });
    if (err) throw err;
    return benefit;
  }

  @ApiResponse({ example: benefit })
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body(new ValidationPipe()) createBenefitDto: CreateBenefitDto,
    @Req() request: Request,
  ) {
    const userPayload = this.getUserPayload(request);

    const [_, companyErr] = await this.companyService.findOne({
      id: createBenefitDto.companyId,
      userId: +userPayload.sub,
    });

    if (companyErr) throw companyErr;

    const [benefit, err] = await this.benefitService.create(createBenefitDto);
    if (err) throw err;
    return benefit;
  }
  @ApiResponse({ example: benefit })
  @UseGuards(AuthGuard)
  @Patch()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateBenefitDto: UpdateBenefitDto,
    @Req() request: Request,
  ) {
    const userPayload = this.getUserPayload(request);

    const [benefit, err] = await this.benefitService.update(
      {
        id,
        company: { userId: +userPayload },
      },
      updateBenefitDto,
    );

    if (err) throw err;
    return benefit;
  }

  @ApiResponse({ example: benefit })
  @UseGuards(AuthGuard)
  @Patch()
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const userPayload = this.getUserPayload(request);

    const [benefit, err] = await this.benefitService.archive({
      id,
      company: { userId: +userPayload },
    });

    if (err) throw err;
    return benefit;
  }

  @ApiResponse({ example: benefit })
  @UseGuards(AuthGuard)
  @Patch()
  async unarchive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const userPayload = this.getUserPayload(request);

    const [benefit, err] = await this.benefitService.unarchive({
      id,
      company: { userId: +userPayload },
    });

    if (err) throw err;
    return benefit;
  }

  private getUserPayload(request: Request): UserTokenPayload {
    const userPayload: UserTokenPayload | undefined = request['user'];
    if (!userPayload) throw new UnauthorizedException();
    return userPayload;
  }
}
