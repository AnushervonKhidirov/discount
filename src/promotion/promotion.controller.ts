import type { Request } from 'express';
import type { UserTokenPayload } from 'src/token/type/token.type';
import type { PromotionQuery } from './type/promotion.type';

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
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

const promotion = {
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

@Controller('promotions')
export class PromotionController {
  constructor(
    private readonly promotionService: PromotionService,
    private readonly companyService: CompanyService,
  ) {}

  @ApiResponse({ example: [promotion] })
  @Get()
  async findMany(@Query() { type, take, skip }: PromotionQuery) {
    const [promotions, err] = await this.promotionService.findMany(
      { type },
      { take, skip },
    );
    if (err) throw err;
    return promotions;
  }

  @ApiResponse({ example: promotion })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [promotion, err] = await this.promotionService.findOne({ id });
    if (err) throw err;
    return promotion;
  }

  @ApiResponse({ example: promotion })
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body(new ValidationPipe()) createPromotionDto: CreatePromotionDto,
    @Req() request: Request,
  ) {
    const userPayload = this.getUserPayload(request);

    const [_, companyErr] = await this.companyService.findOne({
      id: createPromotionDto.companyId,
      userId: +userPayload.sub,
    });

    if (companyErr) throw companyErr;

    const [promotion, err] =
      await this.promotionService.create(createPromotionDto);

    if (err) throw err;
    return promotion;
  }
  @ApiResponse({ example: promotion })
  @UseGuards(AuthGuard)
  @Patch()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updatePromotionDto: UpdatePromotionDto,
    @Req() request: Request,
  ) {
    const userPayload = this.getUserPayload(request);

    const [promotion, err] = await this.promotionService.update(
      {
        id,
        company: { userId: +userPayload },
      },
      updatePromotionDto,
    );

    if (err) throw err;
    return promotion;
  }

  @ApiResponse({ example: promotion })
  @UseGuards(AuthGuard)
  @Patch()
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const userPayload = this.getUserPayload(request);

    const [promotion, err] = await this.promotionService.archive({
      id,
      company: { userId: +userPayload },
    });

    if (err) throw err;
    return promotion;
  }

  @ApiResponse({ example: promotion })
  @UseGuards(AuthGuard)
  @Patch()
  async unarchive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const userPayload = this.getUserPayload(request);

    const [promotion, err] = await this.promotionService.unarchive({
      id,
      company: { userId: +userPayload },
    });

    if (err) throw err;
    return promotion;
  }

  private getUserPayload(request: Request): UserTokenPayload {
    const userPayload: UserTokenPayload | undefined = request['user'];
    if (!userPayload) throw new UnauthorizedException();
    return userPayload;
  }
}
