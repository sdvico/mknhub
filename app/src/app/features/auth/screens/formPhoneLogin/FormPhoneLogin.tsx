import {ColorDefault} from '@/app/themes/color';
import {useTheme} from '@react-navigation/native';
import React, {memo, useCallback} from 'react';
import isEqual from 'react-fast-compare';
import {FormProvider, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {Image, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button} from 'react-native-ui-lib';
import {Input} from '../../../../features/common/form/input/input';
import {Spacer, Text} from '../../../../library/components';
import Utils, {paddingHorizontal} from '../../../../library/utils';
import {BorderSize} from '../../../../library/utils/index';
import useYupValidationResolver from '../../../../library/utils/useYupValidationResolver';
import {PhoneLoginFormType} from './types';
import {useValidation} from './validation';
import {images} from '@/app/assets/image';
import {APP_SCREEN} from '@/app/navigation/screen-types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface PhoneLoginProps {
  onSubmit: (data: PhoneLoginFormType) => void;
}

const _FormPhoneLogin = ({onSubmit}: PhoneLoginProps) => {
  const {validate} = useValidation();
  const {t} = useTranslation();
  const theme = useTheme();
  const resolver = useYupValidationResolver(validate);
  const methods = useForm<PhoneLoginFormType>({
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

  const inset = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: ColorDefault.background,
      }}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardOpeningTime={Number.MAX_VALUE}>
        <View style={{alignItems: 'center', padding: 16}}>
          <Image
            source={images.splash}
            style={{width: 100, height: 100, borderRadius: 16}}
          />
        </View>

        <FormProvider {...methods}>
          <View>
            <Input
              name="username"
              label={t('common:phoneNumber')}
              placeholder={t('common:phoneNumber')}
              isRequire={true}
              keyboardType="numeric"
            />

            <Input
              name="password"
              label={'Mật khẩu'}
              placeholder={'Nhập mật khẩu'}
              isRequire={true}
              secureTextEntry={true}
            />

            <Spacer height={Utils.PaddingSize.size16} />
          </View>
          <View style={{paddingHorizontal: paddingHorizontal}}>
            <Button
              onPress={onSubmitKey}
              fullWidth
              label={'Đăng nhập'}
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

          <TouchableOpacity
            style={{
              alignSelf: 'center',
              marginTop: 20,
              marginBottom: inset.bottom + 10,
            }}
            onPress={() => {
              Utils.navigation.navigate(APP_SCREEN.AUTH_REGISTER);
            }}>
            <Text color="#1E528B" fontSize={18} fontWeight="500">
              Đăng ký tài khoản
            </Text>
          </TouchableOpacity>
        </FormProvider>
      </KeyboardAwareScrollView>
    </View>
  );
};

export const FormPhoneLogin = memo(_FormPhoneLogin, isEqual);
