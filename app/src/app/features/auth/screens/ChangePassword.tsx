import HeaderBasic from '../../../features/common/components/header/header-basic';
import Loading, { RefObject } from '../../../features/common/screens/loading';
import { NetWorkService } from '../../../library/networking';
import { SET_ACCOUNT } from '../../../store/app/redux/constants';
import { RootStateReducer } from '../../../store/types';
import Utils from '../../../library/utils';
import React from 'react';
import { View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { useDispatch, useSelector } from 'react-redux';
import { FormChangePassword } from './formChangePassword';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const LoadingRef = React.useRef<RefObject>(null);
  const { account } = useSelector((state: RootStateReducer) => state.nkkt) ?? {};
  const onSubmit = async values => {
    LoadingRef.current?.toggleState(true);
    const res = await NetWorkService.Post({
      url: '/api/common2/post',
      body: {
        action: 'account.changepwd',
        data: values,
      },
    });
    LoadingRef.current?.toggleState(false);

    if (res.code === 200 && res.data.result >= 0) {
      dispatch({
        type: SET_ACCOUNT,
        payload: {
          username: account?.username,
          password: values?.newPass,
        },
      });

      showMessage({
        message: 'Thông báo',
        type: 'success',
        description: res.data.message || res.data?.data?.msg || 'Thực hiện thành công',
      });
      Utils.navigation.goBack();
    } else {
      // console.log('ress-------', res);
      showMessage({
        message: 'Thông báo',
        type: 'danger',
        description: res.data?.data?.msg || res.data?.message || 'Vui lòng kiểm tra kết nối mạng',
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderBasic title="Đổi mật khẩu" isBackButton={true} />
      <FormChangePassword onSubmit={onSubmit} />
      <Loading ref={LoadingRef} />
    </View>
  );
};

export default ChangePassword;
