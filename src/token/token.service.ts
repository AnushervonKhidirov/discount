import type { Prisma, User, Token as UserToken } from '@prisma/client';
import type { Tokens, UserTokenPayload } from './type/token.type';
import type {
  ReturnWithErr,
  ReturnPromiseWithErr,
} from '@type/return-with-error.type';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class TokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  generate(payload: UserTokenPayload): ReturnWithErr<Tokens> {
    try {
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '10h',
      });

      return [{ accessToken, refreshToken }, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async save(
    userId: number,
    refreshToken: string,
  ): ReturnPromiseWithErr<UserToken> {
    try {
      const expiredAt = new Date();
      expiredAt.setHours(expiredAt.getHours() + 10);

      const token = await this.prisma.token.create({
        data: { refreshToken, userId, expiredAt },
      });
      return [token, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async delete(
    refreshToken: string,
  ): ReturnPromiseWithErr<UserToken & { user: Omit<User, 'password'> }> {
    try {
      const token = await this.prisma.token.delete({
        where: { refreshToken },
        include: { user: { omit: { password: true } } },
      });
      return [token, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async deleteAllUsersToken(
    userId: number,
  ): ReturnPromiseWithErr<Prisma.BatchPayload> {
    try {
      const token = await this.prisma.token.deleteMany({ where: { userId } });
      return [token, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  async deleteExpiredTokens(): ReturnPromiseWithErr<Prisma.BatchPayload> {
    const tokens = await this.prisma.token.deleteMany({
      where: { expiredAt: { lte: new Date() } },
    });

    return [tokens, null];
  }

  async verifyAccessToken(
    accessToken: string,
  ): ReturnPromiseWithErr<UserTokenPayload> {
    try {
      const token =
        await this.jwtService.verifyAsync<UserTokenPayload>(accessToken);
      return [token, null];
    } catch (err) {
      return exceptionHandler(this.tokenErrorsToHttpException(err));
    }
  }

  async verifyRefreshToken(
    refreshToken: string,
  ): ReturnPromiseWithErr<UserTokenPayload> {
    try {
      const token = await this.jwtService.verifyAsync<UserTokenPayload>(
        refreshToken,
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
        },
      );

      return [token, null];
    } catch (err) {
      return exceptionHandler(this.tokenErrorsToHttpException(err));
    }
  }

  private tokenErrorsToHttpException(err: any) {
    const errMessages = {
      'invalid token': 'Invalid token',
      'jwt expired': 'Token expired',
    };

    return err.message in errMessages
      ? new UnauthorizedException(errMessages[err.message])
      : err;
  }
}
