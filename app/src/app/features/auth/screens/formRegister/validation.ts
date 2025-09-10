import * as yup from 'yup';

export const useValidation = () => {
  const validate = yup.object().shape({
    username: yup.string().required('Vui lòng nhập Số điện thoại'),
    password: yup.string().required('Vui lòng nhập mật khẩu'),
    fullname: yup.string().required('Vui lòng nhập họ và tên'),
  });

  return { validate };
};
