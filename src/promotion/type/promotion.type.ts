// NOTE: Still not used
import { Promotion, $Enums } from '@prisma/client';

export type Discount = Omit<Promotion, 'bankId' | 'promoCode'>;
export type Cashback = Omit<Promotion, 'promoCode'> & { bankId: number };
export type PromoCode = Omit<Promotion, 'bankId'> & { promoCode: string };
type UnknownPromotionType = Discount | Cashback | PromoCode;

export function isDiscount(
  promotion: UnknownPromotionType,
): promotion is Discount {
  return promotion.type === $Enums.PromotionType.DISCOUNT;
}

export function isCashback(
  promotion: UnknownPromotionType,
): promotion is Cashback {
  return promotion.type === $Enums.PromotionType.CASHBACK;
}

export function isPromoCode(
  promotion: UnknownPromotionType,
): promotion is PromoCode {
  return promotion.type === $Enums.PromotionType.PROMO_CODE;
}
