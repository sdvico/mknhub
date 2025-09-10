import * as yup from 'yup';

export const useValidation = () => {
  const validate = yup.object().shape({
    phoneNumber: yup.string().required('Vui lòng nhập Số điện thoại'),
    firstName: yup.string().required('Vui lòng nhập tên'),
    lastName: yup.string().required('Vui lòng nhập họ'),
    // country: yup.string().required('Vui lòng nhập quốc gia'),
    // commune: yup.string().required('Vui lòng nhập xã'),
  });

  return {validate};
};
