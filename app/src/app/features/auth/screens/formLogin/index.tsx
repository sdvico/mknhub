/* eslint-disable react-native/no-inline-styles */
import {Divider, Spacer, Text} from '../../../../library/components';
import {Input} from '../../../../features/common/form/input/input';
import {TouchableScale} from '../../../../library/components/touch-scale';
import useYupValidationResolver from '../../../../library/utils/useYupValidationResolver';
import {APP_SCREEN} from '../../../../navigation/screen-types';
import {useTheme} from '@react-navigation/native';
import Utils, {
  paddingHorizontal,
  paddingVertical,
} from '../../../../library/utils';
import React, {memo, useCallback} from 'react';
import isEqual from 'react-fast-compare';
import {FormProvider, useForm} from 'react-hook-form';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button} from 'react-native-ui-lib';
import {BorderSize} from '../../../../library/utils/index';
import {LoginFormType} from './types';
import {useValidation} from './validation';
import {useSelector} from 'react-redux';
import {RootStateReducer} from '../../../../store/types';
import {useTranslation} from 'react-i18next';

interface LoginProps {
  onSubmit: (data: LoginFormType) => void;
}

const _FormLogin = ({onSubmit}: LoginProps) => {
  const {validate} = useValidation();
  const {t} = useTranslation();
  const theme = useTheme();
  const resolver = useYupValidationResolver(validate);
  const {account} = useSelector((state: RootStateReducer) => state.nkkt) ?? {};

  const methods = useForm<LoginFormType>({
    resolver,
    defaultValues: {
      username: account?.username || '',
      password: account?.password || '',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: {isValid},
  } = methods;

  const onSubmitKey = useCallback(() => {
    handleSubmit(onSubmit)();
  }, [onSubmit, handleSubmit]);

  const goRegister = () => {
    Utils.navigation.push(APP_SCREEN.AUTH_REGISTER);
  };

  return (
    <View style={{paddingTop: Utils.PaddingSize.vertical16, flex: 1}}>
      <KeyboardAwareScrollView
        keyboardOpeningTime={Number.MAX_VALUE}
        enableOnAndroid
        enableResetScrollToCoords={false}>
        <FormProvider {...methods}>
          <View>
            <Input
              name="username"
              label={t('common:userName')}
              placeholder={t('common:userName')}
              isRequire={true}
            />
            <Input
              name="password"
              label={t('common:password')}
              placeholder={t('common:password')}
              accessibilityIgnoresInvertColors={false}
              maxLength={2000}
              isRequire={true}
              usePassword={true}
            />

            <Spacer height={Utils.PaddingSize.size16} />
          </View>
          <View
            style={{
              paddingHorizontal: paddingHorizontal,
              paddingBottom: paddingVertical,
            }}>
            <Button
              onPress={onSubmitKey}
              fullWidth
              disabled={!isValid}
              label={t('common:signIn')}
              size={Button.sizes.large}
              backgroundColor={theme.colors.primary}
              style={{
                borderRadius: BorderSize.normal,
                opacity: !isValid ? 0.7 : 1,
              }}
              labelStyle={{
                fontSize: 18,
              }}
            />
          </View>
          {/* <Divider height={1} color="gray" />
          <Spacer height={5} />
          <TouchableScale onPress={goRegister}>
            <Text color={theme.colors.primary}>{t('common:signUp')}</Text>
          </TouchableScale> */}
        </FormProvider>
      </KeyboardAwareScrollView>
    </View>
  );
};

export const FormLogin = memo(_FormLogin, isEqual);
