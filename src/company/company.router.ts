import Elysia, { t } from 'elysia';
import { createCompanyBody } from './dto/create-company.dto';
import { updateCompanyBody } from './dto/update-company.dto';
import { authMiddleware } from '@middleware/auth.middleware';
import { CompanyService } from './company.service';
import { uploadBody } from '../upload/dto/upload.dto';
import { roleMiddleware } from '@middleware/role-middleware';

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

CompanyRouter.use(authMiddleware).put(
  '/:id',
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
  '/:id',
  async ({ params, store, error }) => {
    const [company, err] = await companyService.archive(params.id, store.userId);
    if (err) throw error(err.status, { ...err });
    return company;
  },
  {
    params: t.Object({ id: t.Number() }),
  },
);

CompanyRouter.use(authMiddleware).patch(
  '/archive/:id',
  async ({ params, error }) => {
    const [company, err] = await companyService.archive(params.id);
    if (err) throw error(err.status, { ...err });
    return company;
  },
  {
    params: t.Object({ id: t.Number() }),
    ...roleMiddleware(['ADMIN', 'SUPER_ADMIN']),
  },
);

CompanyRouter.use(authMiddleware).patch(
  '/unarchive/:id',
  async ({ params, error }) => {
    const [company, err] = await companyService.unArchive(params.id);
    if (err) throw error(err.status, { ...err });
    return company;
  },
  {
    params: t.Object({ id: t.Number() }),
    ...roleMiddleware(['ADMIN', 'SUPER_ADMIN']),
  },
);

CompanyRouter.use(authMiddleware).delete(
  '/delete/:id',
  async ({ params, error }) => {
    const [company, err] = await companyService.delete(params.id);
    if (err) throw error(err.status, { ...err });
    return company;
  },
  {
    params: t.Object({ id: t.Number() }),
    ...roleMiddleware(['SUPER_ADMIN']),
  },
);

CompanyRouter.use(authMiddleware).post(
  '/upload-logo/:id',
  async ({ params, body, store, error }) => {
    const [company, err] = await companyService.uploadLogo(params.id, body.file, store.userId);
    if (err) throw error(err.status, { ...err });
    return company;
  },
  {
    body: uploadBody,
    params: t.Object({ id: t.Number() }),
  },
);
