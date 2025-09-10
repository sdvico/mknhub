import {useTheme} from '@react-navigation/native';
import React, {memo, useCallback} from 'react';
import isEqual from 'react-fast-compare';
import {FormProvider, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button} from 'react-native-ui-lib';
import {Input} from '../../../../features/common/form/input/input';
import {Spacer} from '../../../../library/components';
import Utils, {paddingHorizontal} from '../../../../library/utils';
import {BorderSize} from '../../../../library/utils/index';
import useYupValidationResolver from '../../../../library/utils/useYupValidationResolver';
import {LoginFormType} from './types';
import {useValidation} from './validation';

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
      phoneNumber: '',
      firstName: '',
      lastName: '',
      country: 'VN',
      commune: ' ',
    },
  });
  const {handleSubmit} = methods;

  const onSubmitKey = useCallback(() => {
    handleSubmit(onSubmit)();
  }, [onSubmit, handleSubmit]);

  return (
    <View
      style={{
        paddingTop: Utils.PaddingSize.vertical16,
        flex: 1,
        width: '100%',
      }}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardOpeningTime={Number.MAX_VALUE}>
        <FormProvider {...methods}>
          <View>
            <Input
              name="phoneNumber"
              label={t('common:phoneNumber')}
              placeholder={t('common:phoneNumber')}
              isRequire={true}
              keyboardType="numeric"
            />

            <Input
              name="firstName"
              label={'Tên'}
              placeholder={'Tên'}
              isRequire={true}
            />
            <Input
              name="lastName"
              label={'Họ'}
              placeholder={'Họ'}
              isRequire={true}
            />
            {/* <Input
              name="country"
              label={t('common:country')}
              placeholder={t('common:country')}
              isRequire={true}
            /> */}
            <Input
              name="commune"
              label={'Địa chỉ'}
              placeholder={'Địa chỉ'}
              isRequire={false}
            />

            <Spacer height={Utils.PaddingSize.size16} />
          </View>
          <View style={{paddingHorizontal: paddingHorizontal}}>
            <Button
              onPress={onSubmitKey}
              fullWidth
              label={'Xác minh tài khoản'}
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

export const FormVerifyAccount = memo(_FormRegister, isEqual);
