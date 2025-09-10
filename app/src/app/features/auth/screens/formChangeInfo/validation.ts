import * as yup from 'yup';

export const useValidation = () => {
  const validate = yup.object().shape({
    fullname: yup.string().required('Vui lòng nhập họ và tên'),
    phone: yup.string().required('Vui lòng nhập số điện thoại'),
    // address: yup.string().required('Vui lòng nhập địa chỉ'),
    // birthday: yup.string().required('Vui lòng chọn ngày sinh'),
  });

  return { validate };
};
