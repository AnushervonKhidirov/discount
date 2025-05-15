// NOTE: Still not used
import { Benefit, $Enums } from '@prisma/client';

export type BenefitQuery = Partial<{
  type: Benefit['type'];
  skip: number;
  take: number;
}>;

export type Discount = Omit<Benefit, 'bankId' | 'promoCode'>;
export type Cashback = Omit<Benefit, 'promoCode'> & { bankId: number };
export type PromoCode = Omit<Benefit, 'bankId'> & { promoCode: string };
type UnknownBenefitType = Discount | Cashback | PromoCode;

export function isDiscount(benefit: UnknownBenefitType): benefit is Discount {
  return benefit.type === $Enums.BenefitType.DISCOUNT;
}

export function isCashback(benefit: UnknownBenefitType): benefit is Cashback {
  return benefit.type === $Enums.BenefitType.CASHBACK;
}

export function isPromoCode(benefit: UnknownBenefitType): benefit is PromoCode {
  return benefit.type === $Enums.BenefitType.PROMO_CODE;
}
