import { $Enums } from '@prisma/client';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'benefitType', async: false })
export class BenefitTypeValidation implements ValidatorConstraintInterface {
  private message: string = `type ${$Enums.BenefitType.DISCOUNT} can't contain bankId or promoCode`;

  validate(value: any, validationArguments?: ValidationArguments) {
    if (validationArguments) {
      const body: {} = validationArguments.object;

      const isDiscount = value === $Enums.BenefitType.DISCOUNT;
      const isCashback = value === $Enums.BenefitType.CASHBACK;
      const isPromoCode = value === $Enums.BenefitType.PROMO_CODE;

      const isContainBankId = 'bankId' in body;
      const isContainPromoCode = 'promoCode' in body;

      if (isCashback && isContainPromoCode) {
        this.message = `promoCode can only be used with type: ${$Enums.BenefitType.PROMO_CODE}`;
        return false;
      }

      if (isPromoCode && isContainBankId) {
        this.message = `bankId can only be used with type: ${$Enums.BenefitType.CASHBACK}`;
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
