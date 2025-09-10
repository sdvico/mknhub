/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseBase } from '@config/type';
import { ApiConstants, NetWorkService } from '@library/networking';
import { useCallback, useState } from 'react';

export type ResponseImage = {
  code: number;
  data: { image: string };
  message: string;
};

export const uploadImage = async (file): Promise<ResponseBase<ResponseImage> | null> => {
  const formData: FormData = new FormData();

  const path: string = file.path;
  //
  const filetmp = {
    uri: path || file.uri,
    type: 'image/jpeg',
    name: path?.split('/').pop() || file.filename,
  };
  formData.append('avatar', filetmp);

  return NetWorkService.Post<ResponseImage>({
    url: ApiConstants.UPLOAD,
    body: formData,
  });
};

const useUploadImage = () => {
  const [error, setError] = useState<unknown>({});

  const mutate = useCallback(async (values?: any) => {
    try {
      return await uploadImage(values);
    } catch (responseError: unknown) {
      setError(responseError);
    }
  }, []);

  return {
    mutate,
    error,
    isError: !!error,
  };
};

export default useUploadImage;
