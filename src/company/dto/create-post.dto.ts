import { t } from 'elysia';

export const CreatePostBody = t.Object({
  name: t.String(),
  about: t.Optional(t.String()),
  logoUrl: t.Optional(t.String()),
});

export type CreatePostDto = typeof CreatePostBody.static;
