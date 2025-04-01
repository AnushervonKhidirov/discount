import Elysia, { t } from 'elysia';
import { createCompanyBody } from './dto/create-company.dto';
import { updateCompanyBody } from './dto/update-company.dto';
import { authMiddleware } from '@middleware/auth.middleware';
import { CompanyService } from './company.service';

export const CompanyRouter = new Elysia({ prefix: 'companies' });
const companyService = new CompanyService();

CompanyRouter.get('/', async ({ error }) => {
  const [companies, err] = await companyService.findMany();
  if (err) throw error(err.status, { ...err });
  return companies;
});

CompanyRouter.get(
  '/:id',
  async ({ params, error }) => {
    const [company, err] = await companyService.findOne({ id: params.id });
    if (err) throw error(err.status, { ...err });
    return company;
  },
  { params: t.Object({ id: t.Number() }) },
);

CompanyRouter.use(authMiddleware).post(
  '/',
  async ({ body, store, error }) => {
    const [company, err] = await companyService.create(body, store.userId);
    if (err) throw error(err.status, { ...err });
    return company;
  },
  {
    body: createCompanyBody,
  },
);

CompanyRouter.use(authMiddleware).patch(
  '/',
  async ({ body, params, store, error }) => {
    const [company, err] = await companyService.update(params.id, body, store.userId);
    if (err) throw error(err.status, { ...err });
    return company;
  },
  {
    params: t.Object({ id: t.Number() }),
    body: updateCompanyBody,
  },
);

CompanyRouter.use(authMiddleware).delete(
  '/',
  async ({ params, store, error }) => {
    const [company, err] = await companyService.delete(params.id, store.userId);
    if (err) throw error(err.status, { ...err });
    return company;
  },
  {
    params: t.Object({ id: t.Number() }),
  },
);
