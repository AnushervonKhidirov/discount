import type { JwtPayload } from 'jsonwebtoken';
import type { Prisma, User, Token as UserToken } from '@prisma/client';
import type { Tokens } from './type/token.type';
import type {
  ReturnWithErr,
  ReturnPromiseWithErr,
} from '@type/return-with-error.type';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

import { exceptionHandler } from '@helper/exception.helper';

@Injectable()
export class TokenService {
  private readonly accessKey = process.env.ACCESS_TOKEN_SECRET;
  private readonly refreshKey = process.env.REFRESH_TOKEN_SECRET;

  constructor(private readonly prisma: PrismaService) {}

  generate(payload: JwtPayload): ReturnWithErr<Tokens> {
    try {
      if (!this.accessKey || !this.refreshKey) {
        throw new Error('Access/Refresh token keys not found');
      }

      const accessToken = sign(payload, this.accessKey, { expiresIn: '10m' });
      const refreshToken = sign(payload, this.refreshKey, { expiresIn: '10h' });

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

  verifyAccessToken(accessToken: string): ReturnWithErr<JwtPayload> {
    try {
      if (!this.accessKey) throw new Error('Access token key not found');
      const userPayload = verify(accessToken, this.accessKey);

      if (typeof userPayload === 'string') {
        throw new UnauthorizedException('Invalid token');
      }

      return [userPayload, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }

  verifyRefreshToken(refreshToken: string): ReturnWithErr<JwtPayload> {
    try {
      if (!this.refreshKey) throw new Error('Refresh token key not found');
      const userPayload = verify(refreshToken, this.refreshKey);

      if (typeof userPayload === 'string') {
        throw new UnauthorizedException('Invalid token');
      }

      return [userPayload, null];
    } catch (err) {
      return exceptionHandler(err);
    }
  }
}
