import Elysia, { t } from 'elysia';
import { $Enums } from '@prisma/client';

import { authMiddleware } from '@middleware/auth.middleware';
import { CompanyService } from '../company/company.service';
import { BenefitService } from './benefit.service';
import { createBenefitBody } from './dto/create-benefit.dto';
import { updateBenefitBody } from './dto/update-benefit.dto';

export const BenefitRouter = new Elysia({ prefix: 'benefits' });
const companyService = new CompanyService();
const benefitService = new BenefitService();

BenefitRouter.get(
  '/',
  async ({ error, query }) => {
    const { take, skip, ...where } = query;
    const [benefits, err] = await benefitService.findMany(
      { ...where, size: { gte: query.size } },
      take,
      skip,
    );
    if (err) throw error(err.status, { ...err });
    return benefits;
  },
  {
    query: t.Object({
      type: t.Optional(t.Enum($Enums.BenefitType)),
      size: t.Optional(t.Number()),
      startAt: t.Optional(t.Date()),
      endAt: t.Optional(t.Date()),
      take: t.Optional(t.Number()),
      skip: t.Optional(t.Number()),
    }),
  },
)
  .get(
    '/:id',
    async ({ params, error }) => {
      const [benefit, err] = await benefitService.findOne({ id: params.id });
      if (err) throw error(err.status, { ...err });
      return benefit;
    },
    { params: t.Object({ id: t.Number() }) },
  )
  .use(authMiddleware)
  .post(
    '/',
    async ({ store, body, query, error }) => {
      const [company, companyErr] = await companyService.findOne({
        id: query.companyId,
        userId: store.userId,
      });
      if (companyErr) throw error(companyErr.status, { ...companyErr });

      const [benefit, benefitErr] = await benefitService.create(body, company.id);
      if (benefitErr) throw error(benefitErr.status, { ...benefitErr });

      return benefit;
    },
    { body: createBenefitBody, query: t.Object({ companyId: t.Number() }) },
  )
  .put(
    '/:id',
    async ({ store, params, body, query, error }) => {
      const [company, companyErr] = await companyService.findOne({
        id: query.companyId,
        userId: store.userId,
      });
      if (companyErr) throw error(companyErr.status, { ...companyErr });

      const [benefit, benefitErr] = await benefitService.update(params.id, body, company.id);
      if (benefitErr) throw error(benefitErr.status, { ...benefitErr });

      return benefit;
    },
    {
      body: updateBenefitBody,
      params: t.Object({ id: t.Number() }),
      query: t.Object({ companyId: t.Number() }),
    },
  )
  .delete(
    '/:id',
    async ({ store, params, query, error }) => {
      const [company, companyErr] = await companyService.findOne({
        id: query.companyId,
        userId: store.userId,
      });
      if (companyErr) throw error(companyErr.status, { ...companyErr });

      const [benefit, benefitErr] = await benefitService.archive(params.id, company.id);
      if (benefitErr) throw error(benefitErr.status, { ...benefitErr });

      return benefit;
    },
    {
      params: t.Object({ id: t.Number() }),
      query: t.Object({ companyId: t.Number() }),
    },
  );
