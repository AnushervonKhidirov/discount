import Elysia, { t } from 'elysia';
import { roleMiddleware } from '@middleware/role-middleware';
import { BankService } from './bank.service';
import { createBankBody } from './dto/create-bank.dto';
import { updateBankBody } from './dto/update-bank.dto';
import { uploadBody } from '../upload/dto/upload.dto';

export const BankRouter = new Elysia({ prefix: 'banks' });

const banksService = new BankService();

BankRouter.get('/', async ({ error }) => {
  const [banks, err] = await banksService.findMany();
  if (err) throw error(err.status, { ...err });
  return banks;
});

BankRouter.get(
  '/:id',
  async ({ params, error }) => {
    const [bank, err] = await banksService.findOne({ id: params.id });
    if (err) throw error(err.status, { ...err });
    return bank;
  },
  { params: t.Object({ id: t.Number() }) },
);

BankRouter.use(roleMiddleware(['ADMIN', 'SUPER_ADMIN'])).post(
  '/',
  async ({ body, error }) => {
    const [bank, err] = await banksService.create(body);
    if (err) throw error(err.status, { ...err });
    return bank;
  },
  {
    body: createBankBody,
  },
);

BankRouter.use(roleMiddleware(['ADMIN', 'SUPER_ADMIN'])).patch(
  '/:id',
  async ({ body, params, error }) => {
    const [bank, err] = await banksService.update(params.id, body);
    if (err) throw error(err.status, { ...err });
    return bank;
  },
  {
    params: t.Object({ id: t.Number() }),
    body: updateBankBody,
  },
);

BankRouter.use(roleMiddleware(['ADMIN', 'SUPER_ADMIN'])).delete(
  '/:id',
  async ({ params, error }) => {
    const [bank, err] = await banksService.archive(params.id);
    if (err) throw error(err.status, { ...err });
    return bank;
  },
  {
    params: t.Object({ id: t.Number() }),
  },
);

BankRouter.use(roleMiddleware(['SUPER_ADMIN'])).delete(
  '/delete/:id',
  async ({ params, error }) => {
    const [bank, err] = await banksService.delete(params.id);
    if (err) throw error(err.status, { ...err });
    return bank;
  },
  {
    params: t.Object({ id: t.Number() }),
  },
);

BankRouter.use(roleMiddleware(['ADMIN', 'SUPER_ADMIN'])).post(
  '/upload-logo/:id',
  async ({ params, body, error }) => {
    const [bank, err] = await banksService.uploadLogo(params.id, body.file);
    if (err) throw error(err.status, { ...err });
    return bank;
  },
  {
    body: uploadBody,
    params: t.Object({ id: t.Number() }),
  },
);
