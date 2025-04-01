import { t } from 'elysia';

export const UpdatePostBody = t.Object({
  name: t.Optional(t.String()),
  about: t.Optional(t.String()),
});

export type UpdatePostDto = typeof UpdatePostBody.static;
