import Elysia, { t } from 'elysia';
import { authMiddleware } from '@middleware/auth.middleware';
import { roleMiddleware } from '@middleware/role-middleware';
import { CompanyService } from '../company/company.service';
import { StoreService } from './store.service';

import { createStoreBody } from './dto/cerate-store.dto';
import { updateStoreBody } from './dto/update-store.dto';

export const StoreRouter = new Elysia({ prefix: 'stores' });
const companyService = new CompanyService();
const storeService = new StoreService();

StoreRouter.get('/', async ({ error }) => {
  const [stores, err] = await storeService.findMany();
  if (err) throw error(err.status, { ...err });
  return stores;
});

StoreRouter.get(
  '/:id',
  async ({ params, error }) => {
    const [companyStores, err] = await storeService.findOne({ id: params.id });
    if (err) throw error(err.status, { ...err });
    return companyStores;
  },
  {
    params: t.Object({ id: t.Number() }),
  },
);

StoreRouter.use(authMiddleware).post(
  '/',
  async ({ store, body, query, error }) => {
    const [company, companyErr] = await companyService.findOne({
      id: query.companyId,
      userId: store.userId,
    });

    if (companyErr) throw error(companyErr.status, { ...companyErr });

    const [companyStore, storeErr] = await storeService.create(body, company.id);
    if (storeErr) throw error(storeErr.status, { ...storeErr });
    return companyStore;
  },
  {
    body: createStoreBody,
    query: t.Object({ companyId: t.Number() }),
  },
);

StoreRouter.use(authMiddleware).put(
  '/:id',
  async ({ store, body, params, query, error }) => {
    const [company, companyErr] = await companyService.findOne({
      id: query.companyId,
      userId: store.userId,
    });

    if (companyErr) throw error(companyErr.status, { ...companyErr });

    const [companyStore, storeErr] = await storeService.update(params.id, body, company.id);
    if (storeErr) throw error(storeErr.status, { ...storeErr });
    return companyStore;
  },
  {
    body: updateStoreBody,
    params: t.Object({ id: t.Number() }),
    query: t.Object({ companyId: t.Number() }),
  },
);

StoreRouter.use(authMiddleware).delete(
  '/:id',
  async ({ store, params, query, error }) => {
    const [company, companyErr] = await companyService.findOne({
      id: query.companyId,
      userId: store.userId,
    });

    if (companyErr) throw error(companyErr.status, { ...companyErr });

    const [companyStore, storeErr] = await storeService.archive(params.id, company.id);
    if (storeErr) throw error(storeErr.status, { ...storeErr });
    return companyStore;
  },
  {
    params: t.Object({ id: t.Number() }),
    query: t.Object({ companyId: t.Number() }),
  },
);

StoreRouter.use(authMiddleware).patch(
  '/archive/:id',
  async ({ params, error }) => {
    const [companyStore, storeErr] = await storeService.archive(params.id);
    if (storeErr) throw error(storeErr.status, { ...storeErr });
    return companyStore;
  },
  {
    params: t.Object({ id: t.Number() }),
    ...roleMiddleware(['ADMIN', 'SUPER_ADMIN']),
  },
);

StoreRouter.use(authMiddleware).patch(
  '/unarchive/:id',
  async ({ params, error }) => {
    const [companyStore, storeErr] = await storeService.unarchive(params.id);
    if (storeErr) throw error(storeErr.status, { ...storeErr });
    return companyStore;
  },
  {
    params: t.Object({ id: t.Number() }),
    ...roleMiddleware(['ADMIN', 'SUPER_ADMIN']),
  },
);

StoreRouter.use(authMiddleware).delete(
  '/delete/:id',
  async ({ params, error }) => {
    const [companyStore, storeErr] = await storeService.delete(params.id);
    if (storeErr) throw error(storeErr.status, { ...storeErr });
    return companyStore;
  },
  {
    params: t.Object({ id: t.Number() }),
    ...roleMiddleware(['SUPER_ADMIN']),
  },
);
