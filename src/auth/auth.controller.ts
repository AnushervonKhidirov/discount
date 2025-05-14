import type { Tokens } from 'src/token/type/token.type';

import {
  Body,
  Controller,
  HttpCode,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignOutDto } from './dto/sign-out.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

const tokens: Tokens = {
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ7',
  refreshToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ8.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ7',
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ schema: { example: tokens }, status: 200 })
  @Post('sign-up')
  @HttpCode(200)
  async signUp(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    const [token, err] = await this.authService.signUp(createUserDto);
    if (err) throw err;
    return token;
  }

  @ApiResponse({ schema: { example: tokens }, status: 200 })
  @Post('sign-in')
  @HttpCode(200)
  async signIn(@Body(new ValidationPipe()) signInDto: SignInDto) {
    const [token, err] = await this.authService.signIn(signInDto);
    if (err) throw err;
    return token;
  }

  @Post('sign-out')
  @HttpCode(200)
  async signOut(@Body(new ValidationPipe()) signOutDto: SignOutDto) {
    const err = await this.authService.signOut(signOutDto);
    if (err) throw err;
  }

  @Post('sign-out-everywhere')
  @HttpCode(200)
  async signOutEverywhere(@Body(new ValidationPipe()) signOutDto: SignOutDto) {
    const err = await this.authService.signOutEverywhere(signOutDto);
    if (err) throw err;
  }

  @ApiResponse({ schema: { example: tokens }, status: 200 })
  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(
    @Body(new ValidationPipe()) refreshTokenDto: RefreshTokenDto,
  ) {
    const [token, err] = await this.authService.refreshToken(refreshTokenDto);
    if (err) throw err;
    return token;
  }
}
