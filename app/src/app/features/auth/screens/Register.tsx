import {ColorDefault} from '@/app/themes/color';
import {useTheme} from '@react-navigation/native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import HeaderBasic from '../../../features/common/components/header/header-basic';
import Loading, {RefObject} from '../../../features/common/screens/loading';
import {NetWorkService} from '../../../library/networking';
import Utils from '../../../library/utils';
import {FormRegister} from './formRegister';

const Register = () => {
  const LoadingRef = React.useRef<RefObject>(null);
  const theme = useTheme();
  const {t} = useTranslation();

  const onSubmit = async values => {
    LoadingRef.current?.toggleState(true);

    const res = await NetWorkService.Post({
      url: 'api/auth/register',
      body: values,
    });

    LoadingRef.current?.toggleState(false);
    console.log('res', res);

    if (res.code === 200) {
      showMessage({
        message: t('message:ThongBao'),
        type: 'success',
        description: t('dialog:success'),
      });
      Utils.navigation.goBack();
    } else {
      showMessage({
        message: t('message:ThongBao'),
        type: 'danger',
        description: res.data?.data?.msg || t('error:haveError'),
      });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: Utils.bottomSpace,
        backgroundColor: ColorDefault.background,
      }}>
      <HeaderBasic title="Đăng ký" isBackButton={true} />

      <FormRegister onSubmit={onSubmit} />
      <Loading ref={LoadingRef} />
    </View>
  );
};

export default Register;
