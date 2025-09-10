import {useEffect, useCallback} from 'react';
import messaging from '@react-native-firebase/messaging';
import {useDispatch} from 'react-redux';
import {SET_DEVICE_TOKEN} from '../store/constants';

export const useDeviceToken = () => {
  const dispatch = useDispatch();

  // Lấy device token
  const getDeviceToken = useCallback(async () => {
    messaging()
      .getToken()
      .then(token => {
        console.info('Token:', token);
        if (token) {
          dispatch({
            type: SET_DEVICE_TOKEN,
            payload: token,
          });
        }
      });
  }, [dispatch]);

  // Lấy token khi component mount
  useEffect(() => {
    getDeviceToken();
  }, [getDeviceToken]);
};
