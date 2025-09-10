import * as yup from 'yup';

export const useValidation = () => {
  const validate = yup.object().shape({
    oldPass: yup.string().required('Vui lòng nhập mật khảu cũ'),
    newPass: yup.string().required('Vui lòng nhập mật khẩu mới'),
  });

  return { validate };
};
