import {useMemo} from 'react';
import {phoneLoginSchema} from './types';

export const useValidation = () => {
  const validate = useMemo(() => phoneLoginSchema, []);

  return {
    validate,
  };
};
