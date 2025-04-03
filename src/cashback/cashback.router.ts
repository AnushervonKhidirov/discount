import Elysia, { t } from 'elysia';
import { authMiddleware } from '@middleware/auth.middleware';
import { roleMiddleware } from '@middleware/role-middleware';
import { CashbackService } from './cashback.service';
import { CompanyService } from '../company/company.service';
import { createCashbackBody } from './dto/create-cashback.dto';
import { updateCashbackBody } from './dto/update-cashback.dto';

export const CashbackRouter = new Elysia({ prefix: 'cashbacks' });
const companyService = new CompanyService();
const cashbackService = new CashbackService();

CashbackRouter.get('/', async ({ error }) => {
  const [cashbacks, err] = await cashbackService.findMany();
  if (err) throw error(err.status, { ...err });
  return cashbacks;
});

CashbackRouter.get(
  '/:id',
  async ({ params, error }) => {
    const [cashback, err] = await cashbackService.findOne({ id: params.id });
    if (err) throw error(err.status, { ...err });
    return cashback;
  },
  { params: t.Object({ id: t.Number() }) },
);

CashbackRouter.use(authMiddleware).post(
  '/',
  async ({ store, body, query, error }) => {
    const [company, companyErr] = await companyService.findOne({
      id: query.companyId,
      userId: store.userId,
    });
    if (companyErr) throw error(companyErr.status, { ...companyErr });

    const [cashback, cashbackErr] = await cashbackService.create(body, company.id);
    if (cashbackErr) throw error(cashbackErr.status, { ...cashbackErr });

    return cashback;
  },
  { body: createCashbackBody, query: t.Object({ companyId: t.Number() }) },
);

CashbackRouter.use(authMiddleware).put(
  '/:id',
  async ({ store, params, body, query, error }) => {
    const [company, companyErr] = await companyService.findOne({
      id: query.companyId,
      userId: store.userId,
    });
    if (companyErr) throw error(companyErr.status, { ...companyErr });

    const [cashback, cashbackErr] = await cashbackService.update(params.id, body, company.id);
    if (cashbackErr) throw error(cashbackErr.status, { ...cashbackErr });

    return cashback;
  },
  {
    body: updateCashbackBody,
    params: t.Object({ id: t.Number() }),
    query: t.Object({ companyId: t.Number() }),
  },
);

CashbackRouter.use(authMiddleware).delete(
  '/:id',
  async ({ store, params, query, error }) => {
    const [company, companyErr] = await companyService.findOne({
      id: query.companyId,
      userId: store.userId,
    });
    if (companyErr) throw error(companyErr.status, { ...companyErr });

    const [cashback, cashbackErr] = await cashbackService.archive(params.id, company.id);
    if (cashbackErr) throw error(cashbackErr.status, { ...cashbackErr });

    return cashback;
  },
  {
    params: t.Object({ id: t.Number() }),
    query: t.Object({ companyId: t.Number() }),
  },
);

CashbackRouter.use(authMiddleware).patch(
  '/archive/:id',
  async ({ params, error }) => {
    const [cashback, err] = await cashbackService.archive(params.id);
    if (err) throw error(err.status, { ...err });
    return cashback;
  },
  {
    params: t.Object({ id: t.Number() }),
    ...roleMiddleware(['ADMIN', 'SUPER_ADMIN']),
  },
);

CashbackRouter.use(authMiddleware).patch(
  '/unarchive/:id',
  async ({ params, error }) => {
    const [cashback, err] = await cashbackService.unarchive(params.id);
    if (err) throw error(err.status, { ...err });
    return cashback;
  },
  {
    params: t.Object({ id: t.Number() }),
    ...roleMiddleware(['ADMIN', 'SUPER_ADMIN']),
  },
);

CashbackRouter.use(authMiddleware).delete(
  '/delete/:id',
  async ({ params, error }) => {
    const [cashback, err] = await cashbackService.delete(params.id);
    if (err) throw error(err.status, { ...err });
    return cashback;
  },
  {
    params: t.Object({ id: t.Number() }),
    ...roleMiddleware(['SUPER_ADMIN']),
  },
);
