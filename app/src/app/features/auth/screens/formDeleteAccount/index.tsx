import { Icon, Spacer, Text } from '../../../../library/components';
import { Input } from '../../../../features/common/form/input/input';
import useYupValidationResolver from '../../../../library/utils/useYupValidationResolver';
import { useTheme } from '@react-navigation/native';
import Utils, { paddingHorizontal, paddingVertical } from '../../../../library/utils';
import React, { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import { FormProvider, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from 'react-native-ui-lib';
import { BorderSize } from '../../../../library/utils/index';
import { DeleteAccountType } from './types';
import { useValidation } from './validation';

interface LoginProps {
  onSubmit: (data: DeleteAccountType) => void;
}

const _FormDeleteAccount = ({ onSubmit }: LoginProps) => {
  const { validate } = useValidation();
  const theme = useTheme();
  const resolver = useYupValidationResolver(validate);
  const methods = useForm<DeleteAccountType>({
    resolver,
    defaultValues: {
      reason: '',
    },
  });
  const { handleSubmit } = methods;

  const onSubmitKey = useCallback(() => {
    handleSubmit(onSubmit)();
  }, [onSubmit, handleSubmit]);

  return (
    <View style={{ paddingTop: Utils.PaddingSize.vertical16, flex: 1 }}>
      <KeyboardAwareScrollView>
        <FormProvider {...methods}>
          <View
            style={{
              padding: paddingHorizontal,
              backgroundColor: theme.colors.info,
              borderRadius: 10,
              marginHorizontal: 8,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={24} color="red" icon="warning" />
              <Text fontWeight="bold" fontSize={16}>
                {' Cảnh báo: '}
              </Text>
            </View>
            <Text fontSize={16}>
              {
                'Việc huỷ kích hoạt sẽ xoá toàn bộ dữ liệu của bạn bao gồm thông tin khai báo nhật ký khai thác, thông tin tài khoản khỏi tất cả thiết bị.'
              }
            </Text>
            <Text fontSize={16}>{'Không thể khôi phục dữ liệu từ thao tác huỷ kích hoạt'}</Text>
            <Text fontSize={16}>
              {'Để tìm hiểu thêm thông tin huỷ kích hoạt, vui lòng liên hệ bộ phận hỗ trợ dịch vụ'}
            </Text>
          </View>
          <Spacer height={10} />
          <View>
            <Input name="reason" label={'Nhập lý do'} placeholder={'Nhập lý do...'} />
            <Spacer height={Utils.PaddingSize.size16} />
          </View>
          <View style={{ paddingHorizontal: paddingHorizontal, paddingBottom: paddingVertical }}>
            <Button
              onPress={onSubmitKey}
              fullWidth
              label={'Xoá tài khoản'}
              size={Button.sizes.large}
              backgroundColor={theme.colors.orange}
              style={{
                borderRadius: BorderSize.normal,
              }}
              labelStyle={{
                fontSize: 18,
              }}
            />
          </View>
        </FormProvider>
      </KeyboardAwareScrollView>
    </View>
  );
};

export const FormDeleteAccount = memo(_FormDeleteAccount, isEqual);
