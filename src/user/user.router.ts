import Elysia, { t } from 'elysia';

import { UserService } from './user.service';
import { updateUserBody } from './dto/update-user.dto';
import { authMiddleware } from '../common/middleware/auth.middleware';
import { ForbiddenException } from '@exception';

export const UserRouter = new Elysia({ prefix: 'users' });
const userService = new UserService();

UserRouter.get('/', async ({ error }) => {
  const [users, err] = await userService.findMany({ role: 'USER' });
  if (err) throw error(err.status, { ...err });
  return users;
});

UserRouter.get(
  '/:id',
  async ({ params, error }) => {
    const [user, err] = await userService.findOne({ id: params.id });
    if (err) throw error(err.status, { ...err });
    return user;
  },
  { params: t.Object({ id: t.Number() }) },
);

UserRouter.use(authMiddleware).patch(
  '/',
  async ({ store, body, error }) => {
    const [user, err] = await userService.update(store.userId, body);
    if (err) throw error(err.status, { ...err });
    return user;
  },
  { body: updateUserBody },
);

UserRouter.use(authMiddleware).delete('/', async ({ store, error }) => {
  if (store.role === 'SUPER_ADMIN') {
    const exception = new ForbiddenException();
    throw error(exception.status, { ...exception });
  }

  const [user, err] = await userService.delete(store.userId);
  if (err) throw error(err.status, { ...err });
  return user;
});
