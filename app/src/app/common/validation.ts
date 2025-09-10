import Utils from '../library/utils';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

export const useCommonValidation = () => {
  const { t } = useTranslation();

  const passwordSchema = yup
    .string()
    .label(t('common:password'))
    .matches(/.*[A-Z]/, ({ label }) => `${label} must contain at least one upper case character`)
    .matches(/.*[a-z]/, ({ label }) => `${label} must contain at least one lower case character`)
    .matches(/.*\d/, ({ label }) => `${label} must contain at least one number`)
    .matches(/.*[-_!@#$%^&*.,?]/, ({ label }) => `${label} must contain at least one special character`)
    .min(8, ({ label }) => t('common:validation:passwordMustCharacter', { label, n: 8 }))
    .max(32, ({ label }) => t('common:validation:passwordLessCharacter', { label, n: 20 }))
    .required(() => t('common:validation:password'));

  const newPasswordSchema = yup
    .string()
    .label(t('common:password'))
    .matches(/.*[A-Z]/, ({ label }) => `${label} must contain at least one upper case character`)
    .matches(/.*[a-z]/, ({ label }) => `${label} must contain at least one lower case character`)
    .matches(/.*\d/, ({ label }) => `${label} must contain at least one number`)
    .matches(/.*[-_!@#$%^&*.,?]/, ({ label }) => `${label} must contain at least one special character`)
    .min(8, ({ label }) => t('common:validation:passwordMustCharacter', { label, n: 8 }))
    .max(32, ({ label }) => t('common:validation:passwordLessCharacter', { label, n: 20 }))
    .required(() => t('common:validation:newPassword'));

  const confirmPasswordSchema = yup
    .string()
    .oneOf([yup.ref('password')], t('common:validation:passwordIncorrect'))
    .required(t('common:validation:confirmPassword'));

  return {
    confirmPasswordSchema,
    passwordSchema,
    newPasswordSchema,
  };
};

export const price = yup.string().test({
  name: 'price',
  exclusive: false,
  test: function (value) {
    const { path, createError } = this;
    const newValue = Utils.cleanMoney(value || '0');

    if (newValue < 0) {
      return createError({
        path,
        message: 'Vui lòng nhập giá lớn hơn hoặc bằng 0',
      });
    }

    return true;
  },
});

export const priceSale = yup.string().test({
  name: 'price_sale',
  exclusive: false,
  test: function (value) {
    const { path, createError } = this;
    const newValue = Utils.cleanMoney(value || '0');
    if (newValue > Utils.cleanMoney(this?.parent?.price || '0')) {
      return createError({
        path,
        message: 'Vui lòng nhập giá sale nhỏ hơn hoặc băng giá gốc!',
      });
    }

    return true;
  },
});
