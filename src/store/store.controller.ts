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
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { StoreService } from './store.service';
import { CompanyService } from 'src/company/company.service';

import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

const storeData = {
  id: 1,
  companyId: 27,
  countryId: 1,
  cityId: 1,
  address: 'Ayni street 48',
  latitude: '21.23',
  longitude: '21.23',
  openAt: '08:00',
  closeAt: '18:00',
  archived: false,
  createdAt: '2025-05-14T08:18:59.000Z',
  updatedAt: '2025-05-14T08:18:59.000Z',
  city: {
    id: 1,
    countryId: 1,
    value: 'Dushanbe',
  },
  country: {
    id: 1,
    value: 'Tajikistan',
  },
  company: {
    id: 27,
    name: 'Gelos',
    about: 'Gelos about',
    logoUrl: null,
    verified: false,
    archived: false,
    userId: 1,
    categoryId: null,
  },
  promotions: [],
};

@Controller('stores')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly companyService: CompanyService,
  ) {}

  @ApiResponse({ example: [storeData] })
  @Get()
  async findMany() {
    const [stores, err] = await this.storeService.findMany();
    if (err) throw err;
    return stores;
  }

  @ApiResponse({ example: storeData })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [stores, err] = await this.storeService.findOne({ id });
    if (err) throw err;
    return stores;
  }

  @ApiResponse({ example: storeData })
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body(new ValidationPipe()) createStoreDto: CreateStoreDto,
    @Req() request: Request,
  ) {
    const userPayload = this.getUserPayload(request);
    const [_, companyErr] = await this.companyService.findOne({
      id: createStoreDto.companyId,
      userId: +userPayload.sub,
    });

    if (companyErr) throw companyErr;

    const [store, err] = await this.storeService.create(createStoreDto);
    if (err) throw err;
    return store;
  }

  @ApiResponse({ example: storeData })
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateStoreDto: UpdateStoreDto,
    @Req() request: Request,
  ) {
    const userPayload = this.getUserPayload(request);
    const [store, err] = await this.storeService.update(
      {
        id,
        company: { userId: +userPayload.sub },
      },
      updateStoreDto,
    );

    if (err) throw err;
    return store;
  }

  @ApiResponse({ example: storeData })
  @UseGuards(AuthGuard)
  @Patch('archive/:id')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const userPayload = this.getUserPayload(request);
    const [store, err] = await this.storeService.archive({
      id,
      company: { userId: +userPayload.sub },
    });

    if (err) throw err;
    return store;
  }

  @ApiResponse({ example: storeData })
  @UseGuards(AuthGuard)
  @Patch('unarchive/:id')
  async unarchive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ) {
    const userPayload = this.getUserPayload(request);
    const [store, err] = await this.storeService.unarchive({
      id,
      company: { userId: +userPayload.sub },
    });

    if (err) throw err;
    return store;
  }

  private getUserPayload(request: Request): UserTokenPayload {
    const userPayload: UserTokenPayload | undefined = request['user'];
    if (!userPayload) throw new UnauthorizedException();
    return userPayload;
  }
}
