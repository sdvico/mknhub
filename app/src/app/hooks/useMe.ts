import {useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {NetWorkService} from '@/app/library/networking';
import React from 'react';
import Constants from '../store/app/redux/constants';

export interface MeData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  country?: string;
  commune?: string;
  verified: boolean;
  provider: string;
  socialId?: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export const useMe = () => {
  const dispatch = useDispatch();
  const [meData, setMeData] = useState<MeData | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getMe = useCallback(
    async (setRedux = true) => {
      try {
        setLoading(true);
        setError(null);

        const response = await NetWorkService.Get({
          url: '/api/v1/auth/me',
        });

        console.log('response-----me', response);
        const userData = response.data;

        if (!(setRedux === false) && userData) {
          setMeData(userData);
          dispatch({
            type: Constants.ON_SET_APP_PROFILE,
            payload: userData,
          });
        }
        // Dispatch vào Redux profile

        return userData;
      } catch (err: any) {
        console.error('Error fetching me data:', err);
        setError(err?.message || 'Failed to fetch user data');

        return undefined;
      } finally {
        setLoading(false);
        return undefined;
      }
    },
    [dispatch],
  );

  const refreshMe = React.useCallback(() => {
    getMe();
  }, [getMe]);

  // useEffect(() => {
  //   getMe();
  // }, [getMe]);

  return {
    getMe,
    meData,
    loading,
    error,
    refreshMe,
  };
};
