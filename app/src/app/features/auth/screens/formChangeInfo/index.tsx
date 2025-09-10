import { Divider, Spacer } from '../../../../library/components';
import { DatePickerForm } from '../../../../features/common/form/date-picker';
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
import { LoginFormType } from './types';
import { useValidation } from './validation';

// id:2E65E4EF-1FBE-40A1-B891-1A1882DE3A9F
// awater:/images/awt/2E65E4EF-1FBE-40A1-B891-1A1882DE3A9F.png
// fullname:Nguyễn Hữu Quân
// sex:M
// phone:BĐ-33333-TS
// address:null
// birthday:null
// status:1
// required_changedpwd:false

interface ChangeInfoProps {
  onSubmit: (data: LoginFormType) => void;
  defaultValues?: LoginFormType;
}

const _FormChangeInfo = ({ onSubmit, defaultValues }: ChangeInfoProps) => {
  const { validate } = useValidation();
  const theme = useTheme();
  const resolver = useYupValidationResolver(validate);

  const methods = useForm<LoginFormType>({
    resolver,
    defaultValues: {
      ...(defaultValues || {}),
    },
  });
  const { handleSubmit, setValue, getValues } = methods;

  const onSubmitKey = useCallback(() => {
    handleSubmit(onSubmit)();
  }, [onSubmit, handleSubmit]);

  return (
    <View style={{ paddingTop: Utils.PaddingSize.vertical16, flex: 1 }}>
      <KeyboardAwareScrollView keyboardOpeningTime={Number.MAX_VALUE}>
        <FormProvider {...methods}>
          <Input name="fullname" label={'Họ và tên'} placeholder={'Họ và tên...'} isRequire={true} />
          <Input name="phone" label={'Số điện thoại'} placeholder={'Nhập số điện thoại...'} isRequire={true} />
          <Input name="address" label={'Địa chỉ'} placeholder={'Nhập địa chỉ...'} isRequire={true} />
          <DatePickerForm
            name="birthday"
            label={'Ngày sinh :'}
            placeholder={'Ngày sinh ...'}
            accessibilityIgnoresInvertColors={false}
          />
          <Spacer height={Utils.PaddingSize.size16} />

          {/* <InputDefer
            iconRight="sd_edit"
            name="CangCaDangKy"
            label={'Cảng cá đăng ký'}
            placeholder={'Chọn cảng cá đăng ký'}
            useStringify
            onPress={() => onSelectPort('CangCaDangKy')}
            formater={value => {
              console.log(value);
              if (!value) {
                return '';
              }

              return `${value?.name}`;
            }}
          />
          <Spacer height={Utils.PaddingSize.size16} /> */}

          <View style={{ paddingHorizontal: paddingHorizontal, paddingBottom: paddingVertical }}>
            <Button
              onPress={onSubmitKey}
              fullWidth
              label={'Cập nhật tài khoản'}
              size={Button.sizes.large}
              backgroundColor={theme.colors.primary}
              style={{
                borderRadius: BorderSize.normal,
              }}
              labelStyle={{
                fontSize: 18,
              }}
            />
          </View>
          <View style={{ paddingVertical: paddingVertical }}>
            <Divider height={1} />
          </View>
        </FormProvider>
      </KeyboardAwareScrollView>
    </View>
  );
};

export const FormChangeInfo = memo(_FormChangeInfo, isEqual);
