import * as yup from 'yup';

export interface PhoneLoginFormType {
  username: string;
  password: string;
}

export const phoneLoginSchema = yup.object({
  username: yup
    .string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^[0-9]+$/, 'Số điện thoại chỉ được chứa số')
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .max(11, 'Số điện thoại không được quá 11 số'),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});
