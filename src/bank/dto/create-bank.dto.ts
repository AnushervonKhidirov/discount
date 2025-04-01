import { t } from 'elysia';

export const createBankBody = t.Object({
  name: t.String(),
  about: t.Optional(t.String()),
});

export type CreateBankDto = typeof createBankBody.static;
