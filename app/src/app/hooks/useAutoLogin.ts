import React, {useEffect} from 'react';
import 'react-native-get-random-values';
import {useSelector} from 'react-redux';
import {NetWorkService} from '../library/networking/service';
import Utils from '../library/utils';
import {APP_SCREEN} from '../navigation/screen-types';
import {RootStateReducer} from '../store/types';
import {dispatch} from '../common';
import {onSetToken} from '../store/app/redux/actions';

export const useAutoLogin = () => {
  const gestAccount = useSelector(
    (state: RootStateReducer) => state.app.gestAccount,
  );

  console.log('gestAccount', gestAccount);

  const token = useSelector((state: RootStateReducer) => state.app.token);

  const initLoading = React.useCallback(async () => {
    console.log('init----', token);
    if (token) {
      const response = await NetWorkService.Get({
        url: '/api/auth/me',
      });
      console.log('response-----me', response);
      const meData = response?.data;

      if (meData) {
        Utils.navigation.replace(APP_SCREEN.TAB_MAIN);
      } else {
        dispatch(onSetToken(undefined));
        Utils.navigation.replace(APP_SCREEN.AUTH_LOGIN);
      }
    } else {
      Utils.navigation.replace(APP_SCREEN.AUTH_LOGIN);
    }
  }, [token]);

  useEffect(() => {
    initLoading();
  }, []);
};
