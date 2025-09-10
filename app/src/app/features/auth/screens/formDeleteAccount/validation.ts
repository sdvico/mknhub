import * as yup from 'yup';

export const useValidation = () => {
  const validate = yup.object().shape({
    // location: yup.string().required('Cần vị trí'),
    // note: yup.string().required('Vui lòng nhập ghi chú'),
    // type: yup.string().required('Vui lòng chọn type'),
  });

  return { validate };
};
