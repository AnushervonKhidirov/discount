import { $Enums } from '@prisma/client';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'promotionType', async: false })
export class PromotionTypeValidation implements ValidatorConstraintInterface {
  private message: string = `type ${$Enums.PromotionType.DISCOUNT} can't contain bankId or promoCode`;

  validate(value: any, validationArguments?: ValidationArguments) {
    if (validationArguments) {
      const isDiscount = value === $Enums.PromotionType.DISCOUNT;
      const isCashback = value === $Enums.PromotionType.CASHBACK;
      const isPromoCode = value === $Enums.PromotionType.PROMO_CODE;

      const isContainBankId = 'bankId' in validationArguments.object;
      const isContainPromoCode = 'promoCode' in validationArguments.object;

      if (isCashback && isContainPromoCode) {
        this.message = `promoCode can only be used with type: ${$Enums.PromotionType.PROMO_CODE}`;
        return false;
      }

      if (isPromoCode && isContainBankId) {
        this.message = `bankId can only be used with type: ${$Enums.PromotionType.CASHBACK}`;
        return false;
      }

      if (isDiscount && (isContainBankId || isContainPromoCode)) {
        return false;
      }
    }

    return true;
  }

  defaultMessage(): string {
    return this.message;
  }
}
