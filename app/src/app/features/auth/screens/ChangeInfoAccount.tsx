import HeaderBasic from '../../../features/common/components/header/header-basic';
import Loading, { RefObject } from '../../../features/common/screens/loading';
import { NetWorkService } from '../../../library/networking';
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { FormChangeInfo } from './formChangeInfo';
import Utils from '../../../library/utils';

const ChangeInfo = () => {
  const LoadingRef = React.useRef<RefObject>(null);

  const [data, setData] = useState(undefined);
  const getInfoAccount = useCallback(async () => {
    LoadingRef.current?.toggleState(true);
    const res = await NetWorkService.Get({
      url: '/api/common2/get?action=account.info',
    });
    LoadingRef.current?.toggleState(false);

    if (res.code === 200 && res.data.result >= 0) {
      setData(res.data?.data || undefined);
    } else {
      // console.log('ress-------', res);
      showMessage({
        message: 'Thông báo',
        type: 'danger',
        description: res.data?.data?.msg || res.data?.message || 'Vui lòng kiểm tra kết nối mạng',
      });
    }
  }, []);

  useEffect(() => {
    getInfoAccount();
  }, [getInfoAccount]);

  const onSubmit = async values => {
    LoadingRef.current?.toggleState(true);
    const res = await NetWorkService.Post({
      url: '/api/common2/post',
      body: {
        action: 'account.info_update',
        data: {
          ...(data || {}),
          ...(values || {}),
        },
      },
    });
    LoadingRef.current?.toggleState(false);

    if (res.code === 200 && res.data.result >= 0) {
      showMessage({
        message: 'Thông báo',
        type: 'success',
        description: res.data?.message || res.data?.data?.msg || 'Thực hiện thành công',
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
      <HeaderBasic title="Thông tin tài khoản" isBackButton={true} />
      {data ? <FormChangeInfo onSubmit={onSubmit} defaultValues={data} /> : null}

      <Loading ref={LoadingRef} />
    </View>
  );
};

export default ChangeInfo;
