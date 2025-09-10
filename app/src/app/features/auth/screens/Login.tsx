/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState} from 'react';
import {Image, StatusBar, StyleSheet, View} from 'react-native';
import Loading, {RefObject} from '../../../features/common/screens/loading';

import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';

import {NetWorkService} from '../../../library/networking';
import {onSetAppProfile, onSetToken} from '../../../store/app/redux/actions';
import HeaderBasic from '../../common/components/header/header-basic';
import {FormPhoneLogin} from './formPhoneLogin/FormPhoneLogin';
import {images} from '@/app/assets/image';

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const LoadingRef = React.useRef<RefObject>(null);

  const phoneLogin = async (fromData: any) => {
    const data = {
      ...fromData,
    };
    const response = await NetWorkService.Post({
      url: 'api/auth/login',
      body: data,
    });
    if (response.code === 200) {
      dispatch(onSetToken({payload: response.data.token}));
      dispatch(onSetAppProfile({payload: response.data}));
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" />
      <HeaderBasic title="Đăng nhập" />
      <FormPhoneLogin onSubmit={phoneLogin} />
      <Loading ref={LoadingRef} />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {flex: 1},
  headerImage: {
    flex: 1,
    width: '100%',
    height: '30%',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  formContainer: {
    flex: 2.5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30, // lift up over the image
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  formTitle: {marginBottom: 30},
  loginButton: {
    marginTop: 15,
    width: '100%',
    backgroundColor: '#005492',
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
  },
});
