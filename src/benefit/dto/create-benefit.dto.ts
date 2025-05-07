import { t } from 'elysia';
import { $Enums } from '@prisma/client';

export const createBenefitBody = t.Object({
  type: t.Enum($Enums.BenefitType),
  size: t.Number({ minimum: 0, maximum: 100 }),
  about: t.Optional(t.String()),
  startAt: t.Date(),
  endAt: t.Date(),
  bankId: t.Optional(t.Number()),
});

export type CreateBenefitDto = typeof createBenefitBody.static;
