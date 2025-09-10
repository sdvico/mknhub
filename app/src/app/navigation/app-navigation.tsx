import {RXStore, dispatch, useSelector} from '../common';
import {NavigationContainer} from '@react-navigation/native';
import {MyAppTheme} from '../themes';
import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import Toast from 'react-native-toast-message';

import NavigationService from './navigation-service';
import {RootStateReducer} from '../store/types';
import {RootNavigation} from './root-navigator';
import {ToastAlertProvider} from '../components/ToastAlertContext';

const linking = {
  prefixes: [],
};
// const theme = 'default';
export const AppContainer = () => {
  const {theme} = useSelector((state: RootStateReducer) => state.app);
  // effect
  useEffect(() => {}, []);

  const onReady = () => {
    dispatch({
      type: 'READY_APP',
    });
  };
  return (
    <NavigationContainer
      onReady={onReady}
      linking={linking}
      ref={NavigationService.navigationRef}
      theme={MyAppTheme[theme]}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <ToastAlertProvider>
        <RootNavigation />
      </ToastAlertProvider>
      <FlashMessage position="top" />
      <Toast />
      <RXStore />
    </NavigationContainer>
  );
};
