import { $Enums } from '@prisma/client';

import Elysia from 'elysia';
import { UnauthorizedException } from '@exception';
import { TokenService } from '../../token/token.service';

const tokenService = new TokenService();

export const authMiddleware = (app: Elysia) =>
  app
    .state({ userId: {} as number, role: {} as $Enums.Role })
    .onBeforeHandle(({ store, headers, error }) => {
      const unauthorized = new UnauthorizedException();
      const token = headers.authorization?.replace('Bearer ', '');

      if (!token) {
        throw error(unauthorized.status, { ...unauthorized });
      }

      const [payload, err] = tokenService.verifyAccessToken(token);
      if (err) throw error(err.status, { ...err });

      if (!payload.sub || !payload.role) {
        throw error(unauthorized.status, { ...unauthorized });
      }

      store.userId = +payload.sub;
      store.role = payload.role;
    });
