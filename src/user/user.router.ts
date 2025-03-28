import Elysia, { t } from 'elysia';

import { UserService } from './user.service';
import { updateUserBody } from './dto/update-user.dto';

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

UserRouter.patch(
  '/:id',
  async ({ params, body, error }) => {
    const [user, err] = await userService.update(params.id, body);
    if (err) throw error(err.status, { ...err });
    return user;
  },
  { params: t.Object({ id: t.Number() }), body: updateUserBody },
);

UserRouter.delete(
  '/:id',
  async ({ params, error }) => {
    const [user, err] = await userService.delete(params.id);
    if (err) throw error(err.status, { ...err });
    return user;
  },
  { params: t.Object({ id: t.Number() }) },
);
