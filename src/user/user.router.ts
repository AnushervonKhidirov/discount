import Elysia, { t } from 'elysia';
import { authMiddleware } from '@middleware/auth.middleware';
import { roleMiddleware } from '@middleware/role-middleware';
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

UserRouter.use(authMiddleware).put(
  '/',
  async ({ store, body, error }) => {
    const [user, err] = await userService.update(store.userId, body);
    if (err) throw error(err.status, { ...err });
    return user;
  },
  { body: updateUserBody },
);

UserRouter.use(authMiddleware).delete(
  '/',
  async ({ store, error }) => {
    const [user, err] = await userService.archive(store.userId);
    if (err) throw error(err.status, { ...err });
    return user;
  },
  { ...roleMiddleware(['USER', 'ADMIN']) },
);

UserRouter.use(authMiddleware).patch(
  '/archive/:id',
  async ({ params, error }) => {
    const [user, err] = await userService.archive(params.id);
    if (err) throw error(err.status, { ...err });
    return user;
  },
  { params: t.Object({ id: t.Number() }), ...roleMiddleware(['ADMIN', 'SUPER_ADMIN']) },
);

UserRouter.use(authMiddleware).patch(
  '/unarchive/:id',
  async ({ params, error }) => {
    const [user, err] = await userService.unArchive(params.id);
    if (err) throw error(err.status, { ...err });
    return user;
  },
  { params: t.Object({ id: t.Number() }), ...roleMiddleware(['ADMIN', 'SUPER_ADMIN']) },
);

UserRouter.use(authMiddleware).delete(
  '/delete/:id',
  async ({ params, error }) => {
    const [user, err] = await userService.delete(params.id);
    if (err) throw error(err.status, { ...err });
    return user;
  },
  { params: t.Object({ id: t.Number() }), ...roleMiddleware(['SUPER_ADMIN']) },
);
