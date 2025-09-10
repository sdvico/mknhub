import React from 'react';
import {Alert, View} from 'react-native';
import {useDispatch} from 'react-redux';
import HeaderBasic from '../../../features/common/components/header/header-basic';
import Loading, {RefObject} from '../../../features/common/screens/loading';
import Utils from '../../../library/utils';
import {FormDeleteAccount} from './formDeleteAccount';

const DeleteAccount = () => {
  const dispatch = useDispatch();
  const LoadingRef = React.useRef<RefObject>(null);

  const callBack = async values => {
    // LoadingRef.current?.toggleState(true);
    // const res = await NetWorkService.Post({
    //   url: 'api/account/remove',
    //   body: values,
    // });
    // LoadingRef.current?.toggleState(false);
    // if (res.code === 200 && res.data.result === 1) {
    //   dispatch(
    //     onSetToken({
    //       payload: '',
    //     }),
    //   );
    //   dispatch({
    //     type: RESET_STATE_NKKT,
    //   });
    // } else {
    //   showMessage({
    //     message: 'Thông báo',
    //     type: 'danger',
    //     description:
    //       typeof res === 'string' ? res : 'Vui lòng kiểm tra kết nối mạng',
    //   });
    // }
  };
  const onSubmit = values => {
    Alert.alert(
      'Thông báo',
      'Bạn có chắc chắn nuốn xoá tài khoản này',
      [
        {text: 'Yes', onPress: () => callBack(values)},
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  return (
    <View style={{flex: 1, paddingBottom: Utils.bottomSpace}}>
      <HeaderBasic title="Xoá tài khoản" isBackButton={true} />
      <FormDeleteAccount onSubmit={onSubmit} />
      <Loading ref={LoadingRef} />
    </View>
  );
};

export default DeleteAccount;
