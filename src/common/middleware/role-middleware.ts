import type { $Enums } from '@prisma/client';

import Elysia from 'elysia';
import { authMiddleware } from './auth.middleware';
import { ForbiddenException } from '@exception';

export const roleMiddleware = (roles: $Enums.Role[]) => {
  return (app: Elysia) =>
    app.use(authMiddleware).onBeforeHandle(({ store, error }) => {
      if (!roles.includes(store.role)) {
        const err = new ForbiddenException();
        throw error(err.status, { ...err });
      }
    });
};
