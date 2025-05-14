// NOTE: Still not used
import { Benefit } from '@prisma/client';

export type Discount = Omit<Benefit, 'bankId' | 'promoCode'>;
export type Cashback = Omit<Benefit, 'promoCode'> & { bankId: number };
export type PromoCode = Omit<Benefit, 'bankId'> & { promoCode: string };
type UnknownBenefitType = Discount | Cashback | PromoCode;

export function isDiscount(benefit: UnknownBenefitType): benefit is Discount {
  return !('bankId' in benefit || 'promoCode' in benefit);
}

export function isCashback(benefit: UnknownBenefitType): benefit is Cashback {
  return 'bankId' in benefit && !('promoCode' in benefit);
}

export function isPromoCode(benefit: UnknownBenefitType): benefit is PromoCode {
  return !('bankId' in benefit) && 'promoCode' in benefit;
}
