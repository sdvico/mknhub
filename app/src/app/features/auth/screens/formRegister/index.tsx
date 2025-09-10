import {Spacer} from '../../../../library/components';
import {Input} from '../../../../features/common/form/input/input';
import useYupValidationResolver from '../../../../library/utils/useYupValidationResolver';
import {useTheme} from '@react-navigation/native';
import Utils, {
  paddingHorizontal,
  paddingVertical,
} from '../../../../library/utils';
import React, {memo, useCallback} from 'react';
import isEqual from 'react-fast-compare';
import {FormProvider, useForm} from 'react-hook-form';
import {Image, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button} from 'react-native-ui-lib';
import {BorderSize} from '../../../../library/utils/index';
import {LoginFormType} from './types';
import {useValidation} from './validation';
import {useTranslation} from 'react-i18next';
import {images} from '@/app/assets/image';

interface LoginProps {
  onSubmit: (data: LoginFormType) => void;
}

const _FormRegister = ({onSubmit}: LoginProps) => {
  const {validate} = useValidation();
  const {t} = useTranslation();
  const theme = useTheme();
  const resolver = useYupValidationResolver(validate);
  const methods = useForm<LoginFormType>({
    resolver,
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const {handleSubmit} = methods;

  const onSubmitKey = useCallback(() => {
    handleSubmit(onSubmit)();
  }, [onSubmit, handleSubmit]);

  return (
    <View style={{paddingTop: Utils.PaddingSize.vertical16, flex: 1}}>
      <KeyboardAwareScrollView keyboardOpeningTime={Number.MAX_VALUE}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{alignItems: 'center', padding: 16}}>
            <Image
              source={images.splash}
              style={{width: 100, height: 100, borderRadius: 16}}
            />
          </View>
        </View>
        <FormProvider {...methods}>
          <View>
            <Input
              name="username"
              label={t('common:phoneNumber')}
              placeholder={t('common:phoneNumber')}
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
            <Input
              name="fullname"
              label={t('common:HoVaTen')}
              placeholder={t('common:HoVaTen')}
              isRequire={true}
            />
            <Spacer height={Utils.PaddingSize.size16} />
          </View>
          <View style={{paddingHorizontal: paddingHorizontal}}>
            <Button
              onPress={onSubmitKey}
              fullWidth
              label={t('common:signUp')}
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
        </FormProvider>
      </KeyboardAwareScrollView>
    </View>
  );
};

export const FormRegister = memo(_FormRegister, isEqual);
