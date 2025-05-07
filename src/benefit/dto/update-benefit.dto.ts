import { t } from 'elysia';
import { $Enums } from '@prisma/client';

export const updateBenefitBody = t.Object({
  type: t.Optional(t.Enum($Enums.BenefitType)),
  size: t.Optional(t.Number({ minimum: 0, maximum: 100 })),
  about: t.Optional(t.String()),
  startAt: t.Optional(t.Date()),
  endAt: t.Optional(t.Date()),
  bankId: t.Optional(t.Number()),
});
