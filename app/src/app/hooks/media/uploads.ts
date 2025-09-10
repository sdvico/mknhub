import { ResponseBase } from '@config/type';
import { ApiConstants, NetWorkService } from '@library/networking';
import { useCallback, useState } from 'react';

export type ResponseImages = {
  code: number;
  data: { image: string }[];
  message: string;
};

export const uploadImages = async (files): Promise<ResponseBase<ResponseImages> | null> => {
  const formData: FormData = new FormData();

  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    const path = file.path || file.uri || file.image?.uri;
    const filetmp = {
      uri: path,
      type: 'image/jpeg',
      name: path?.split('/').pop() || file?.filename || file.image?.filename,
    };

    // console.log('filetmp---------', filetmp);
    formData.append('filenames[]', filetmp);
    // }
  }
  console.log('formData---------', JSON.stringify(formData));

  const res = await NetWorkService.Post<ResponseImages>({
    url: ApiConstants.UPLOADS,
    body: formData,
  });

  console.log('ress-------', res);

  return res;
};

const useUploadImages = () => {
  const [error, setError] = useState('');
  const mutate = useCallback(async (values?: unknown) => {
    try {
      return await uploadImages(values);
    } catch (responseError: unknown) {
      console.log('errror', responseError);
      setError('Lỗi hệ thống');
    }
  }, []);

  return {
    mutate,
    error,
    isError: !!error,
  };
};

export default useUploadImages;
