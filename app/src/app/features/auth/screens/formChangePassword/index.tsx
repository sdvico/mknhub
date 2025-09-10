import { Divider, Spacer, Text } from '../../../../library/components';
import { Input } from '../../../../features/common/form/input/input';
import { TouchableScale } from '../../../../library/components/touch-scale';
import useYupValidationResolver from '../../../../library/utils/useYupValidationResolver';
import { APP_SCREEN } from '../../../../navigation/screen-types';
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
import { useSelector } from 'react-redux';
import { RootStateReducer } from '../../../../store/types';

interface LoginProps {
  onSubmit: (data: LoginFormType) => void;
}

const _FormChangePassword = ({ onSubmit }: LoginProps) => {
  const { validate } = useValidation();
  const theme = useTheme();
  const resolver = useYupValidationResolver(validate);
  const { account } = useSelector((state: RootStateReducer) => state.nkkt) ?? {};

  const methods = useForm<LoginFormType>({
    resolver,
    defaultValues: {
      oldPass: account?.password || '',
      newPass: '',
    },
  });
  const { handleSubmit } = methods;

  const onSubmitKey = useCallback(() => {
    handleSubmit(onSubmit)();
  }, [onSubmit, handleSubmit]);

  return (
    <View style={{ paddingTop: Utils.PaddingSize.vertical16, flex: 1 }}>
      <KeyboardAwareScrollView keyboardOpeningTime={Number.MAX_VALUE}>
        <FormProvider {...methods}>
          <View>
            <Input
              name="oldPass"
              label={'Mật khẩu cũ'}
              placeholder={'Mật khẩu...'}
              accessibilityIgnoresInvertColors={false}
              maxLength={200}
              isRequire={true}
              usePassword={true}
            />

            <Spacer height={Utils.PaddingSize.size16} />
          </View>
          <View>
            <Input
              name="newPass"
              label={'Mật khẩu mới'}
              placeholder={'Mật khẩu...'}
              accessibilityIgnoresInvertColors={false}
              maxLength={200}
              isRequire={true}
              usePassword={true}
            />

            <Spacer height={Utils.PaddingSize.size16} />
          </View>
          <View style={{ paddingHorizontal: paddingHorizontal, paddingBottom: paddingVertical }}>
            <Button
              onPress={onSubmitKey}
              fullWidth
              label={'Đổi mật khẩu'}
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

export const FormChangePassword = memo(_FormChangePassword, isEqual);
