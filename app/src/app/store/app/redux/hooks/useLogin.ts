import {RootStateReducer} from '../../../../store/types';
import {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {navigate} from '../../../../navigation/navigation-service';
import {APP_SCREEN} from '../../../../navigation/screen-types';
// import SimpleToast from 'react-native-simple-toast';

const useLogin = () => {
  const token = useSelector((state: RootStateReducer) => state.app.token);

  const checkLoginCallback = useCallback(
    (callback: () => void) => {
      if (token) {
        callback?.();
      } else {
        // SimpleToast.show('Please login account to use it !');
        navigate(APP_SCREEN.LOGIN_WITH_EMAIL);
      }
    },
    [token],
  );

  return {
    isLogin: !!token,
    checkLogin: checkLoginCallback,
  };
};

export default useLogin;
