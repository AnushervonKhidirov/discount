import { t } from 'elysia';

export const updateCompanyBody = t.Object({
  name: t.Optional(t.String()),
  about: t.Optional(t.String()),
  logoUrl: t.Optional(t.String()),
  archive: t.Optional(t.Boolean()),
});

export type UpdateCompanyDto = typeof updateCompanyBody.static;
