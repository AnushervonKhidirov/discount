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
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { StoreService } from './store.service';
import { CompanyService } from 'src/company/company.service';

import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Controller('stores')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly companyService: CompanyService,
  ) {}

  @Get()
  async findMany() {
    const [stores, err] = await this.storeService.findMany();
    if (err) throw err;
    return stores;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [stores, err] = await this.storeService.findOne({ id });
    if (err) throw err;
    return stores;
  }

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

    const [stores, err] = await this.storeService.create(createStoreDto);
    if (err) throw err;
    return stores;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateStoreDto: UpdateStoreDto,
    @Req() request: Request,
  ) {
    if (typeof updateStoreDto.companyId !== 'number') {
      throw new BadRequestException(['companyId must be a number']);
    }

    const userPayload = this.getUserPayload(request);
    const [store, err] = await this.storeService.update(
      {
        id,
        companyId: updateStoreDto.companyId,
        company: { userId: +userPayload.sub },
      },
      updateStoreDto,
    );

    if (err) throw err;
    return store;
  }

  @UseGuards(AuthGuard)
  @Patch('archive/:id')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateStoreDto: UpdateStoreDto,
    @Req() request: Request,
  ) {
    if (typeof updateStoreDto.companyId !== 'number') {
      throw new BadRequestException(['companyId must be a number']);
    }

    const userPayload = this.getUserPayload(request);
    const [store, err] = await this.storeService.archive({
      id,
      companyId: updateStoreDto.companyId,
      company: { userId: +userPayload.sub },
    });

    if (err) throw err;
    return store;
  }

  @UseGuards(AuthGuard)
  @Patch('unarchive/:id')
  async unArchive(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateStoreDto: UpdateStoreDto,
    @Req() request: Request,
  ) {
    if (typeof updateStoreDto.companyId !== 'number') {
      throw new BadRequestException(['companyId must be a number']);
    }

    const userPayload = this.getUserPayload(request);
    const [store, err] = await this.storeService.unArchive({
      id,
      companyId: updateStoreDto.companyId,
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
