import Elysia, { t } from 'elysia';
import { authMiddleware } from '@middleware/auth.middleware';
import { roleMiddleware } from '@middleware/role-middleware';
import { DiscountService } from './discount.service';
import { CompanyService } from '../company/company.service';
import { createDiscountBody } from './dto/create-discount.dto';
import { updateDiscountBody } from './dto/update-discount.dto';

export const DiscountRouter = new Elysia({ prefix: 'discounts' });
const companyService = new CompanyService();
const discountService = new DiscountService();

DiscountRouter.get('/', async ({ error }) => {
  const [discounts, err] = await discountService.findMany();
  if (err) throw error(err.status, { ...err });
  return discounts;
});

DiscountRouter.get(
  '/:id',
  async ({ params, error }) => {
    const [discount, err] = await discountService.findOne({ id: params.id });
    if (err) throw error(err.status, { ...err });
    return discount;
  },
  { params: t.Object({ id: t.Number() }) },
);

DiscountRouter.use(authMiddleware).post(
  '/',
  async ({ store, body, query, error }) => {
    const [company, companyErr] = await companyService.findOne({
      id: query.companyId,
      userId: store.userId,
    });
    if (companyErr) throw error(companyErr.status, { ...companyErr });

    const [discount, discountErr] = await discountService.create(body, company.id);
    if (discountErr) throw error(discountErr.status, { ...discountErr });

    return discount;
  },
  { body: createDiscountBody, query: t.Object({ companyId: t.Number() }) },
);

DiscountRouter.use(authMiddleware).put(
  '/:id',
  async ({ store, params, body, query, error }) => {
    const [company, companyErr] = await companyService.findOne({
      id: query.companyId,
      userId: store.userId,
    });
    if (companyErr) throw error(companyErr.status, { ...companyErr });

    const [discount, discountErr] = await discountService.update(params.id, body, company.id);
    if (discountErr) throw error(discountErr.status, { ...discountErr });

    return discount;
  },
  {
    body: updateDiscountBody,
    params: t.Object({ id: t.Number() }),
    query: t.Object({ companyId: t.Number() }),
  },
);

DiscountRouter.use(authMiddleware).delete(
  '/:id',
  async ({ store, params, query, error }) => {
    const [company, companyErr] = await companyService.findOne({
      id: query.companyId,
      userId: store.userId,
    });
    if (companyErr) throw error(companyErr.status, { ...companyErr });

    const [discount, discountErr] = await discountService.archive(params.id, company.id);
    if (discountErr) throw error(discountErr.status, { ...discountErr });

    return discount;
  },
  {
    params: t.Object({ id: t.Number() }),
    query: t.Object({ companyId: t.Number() }),
  },
);

DiscountRouter.use(authMiddleware).patch(
  '/archive/:id',
  async ({ params, error }) => {
    const [discount, err] = await discountService.archive(params.id);
    if (err) throw error(err.status, { ...err });
    return discount;
  },
  {
    params: t.Object({ id: t.Number() }),
    ...roleMiddleware(['ADMIN', 'SUPER_ADMIN']),
  },
);

DiscountRouter.use(authMiddleware).patch(
  '/unarchive/:id',
  async ({ params, error }) => {
    const [discount, err] = await discountService.unarchive(params.id);
    if (err) throw error(err.status, { ...err });
    return discount;
  },
  {
    params: t.Object({ id: t.Number() }),
    ...roleMiddleware(['ADMIN', 'SUPER_ADMIN']),
  },
);

DiscountRouter.use(authMiddleware).delete(
  '/delete/:id',
  async ({ params, error }) => {
    const [discount, err] = await discountService.delete(params.id);
    if (err) throw error(err.status, { ...err });
    return discount;
  },
  {
    params: t.Object({ id: t.Number() }),
    ...roleMiddleware(['SUPER_ADMIN']),
  },
);
