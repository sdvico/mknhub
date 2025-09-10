/* eslint-disable react-native/no-inline-styles */
import {IconTypes} from '../../../../assets/icon';
import {HelperText, Icon, Text} from '../../../../library/components';
import {HookFormRules} from '../../../../config/type';
import {useTheme} from '../../../../themes';
import Utils, {
  paddingHorizontal,
  PaddingSize,
  paddingVertical,
} from '../../../../library/utils';
import React, {memo, useState} from 'react';
import isEqual from 'react-fast-compare';
import {useController, useFormContext} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {
  StyleSheet,
  View,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';

import {TextField} from 'react-native-ui-lib';

interface InputProps extends TextInputProps {
  name: string;
  label?: string;
  onSubmit?: () => void;
  nameTrigger?: string;
  rules?: HookFormRules;
  titleTop?: boolean;
  trackChar?: boolean;
  isRequire?: boolean;
  iconRight?: IconTypes;
  isRow?: boolean;
  placeholder?: string;
  containerStyle?: ViewStyle;
  usePassword?: boolean;
  renderRight?: () => React.ReactElement;
  isUperCase?: boolean;
  labelRight?: boolean;
  isFormatMoney?: boolean;
}

const InputComponent = ({
  label,
  name,
  rules,
  containerStyle,
  trackChar = false,
  isRequire = false,
  iconRight,
  isRow = false,
  defaultValue,
  maxLength,
  usePassword = false,
  isUperCase = false,
  renderRight,
  isFormatMoney = false,
  ...rest
}: InputProps) => {
  // state
  const theme = useTheme();
  const {getValues} = useFormContext();
  const {t} = useTranslation();

  const [showPass, setShowPass] = useState(false);
  const {
    field,
    fieldState: {invalid, error},
  } = useController({
    name,
    rules,
    defaultValue,
  });
  const renderTitleTop = () => {
    return (
      <View
        style={[
          {
            flexDirection: 'row',
            paddingVertical: Utils.PaddingSize.vertical10,
          },
        ]}>
        <View style={{flex: 1}}>
          <Text fontSize={14} style={{color: theme.colors.text}}>
            {label}{' '}
            {isRequire && (
              <Text style={{color: theme.colors.error}}>{'*'}</Text>
            )}
          </Text>
        </View>
        {trackChar && (
          <Text style={{color: theme.colors.grey800}}>
            {t('component:DauVao:DaNhap')}
            <Text
              style={{
                color: theme.colors.secondary,
              }}>{` ${getValues()[name]?.length || 0}/${maxLength} `}</Text>
            {t('component:DauVao:KiTu')}
          </Text>
        )}
      </View>
    );
  };

  const icon = !usePassword ? iconRight : showPass ? 'hidden' : 'showPass';
  // render
  return (
    <View
      style={[
        {
          borderRadius: PaddingSize.base,
          paddingHorizontal,
        },
        isRow ? {flex: 1} : {},
        containerStyle,
      ]}>
      {label ? renderTitleTop() : null}
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: Utils.BorderSize.normal,
            backgroundColor: theme.colors.white,
          },
        ]}>
        <TextField
          // showCharCounter
          ref={field.ref}
          onChangeText={text => {
            if (isFormatMoney) {
              field.onChange(Utils.inputMoney(text));
            } else if (isUperCase) {
              field.onChange(text?.toLocaleUpperCase() || '');
            } else {
              field.onChange(text);
            }
          }}
          onBlur={field.onBlur}
          defaultValue={`${getValues()[name] ? getValues()[name] : ''}`}
          containerStyle={[styles.containerDefault, containerStyle]}
          fieldStyle={[styles.fieldStyleDefault]}
          color={theme.colors.text}
          maxLength={maxLength}
          {...rest}
          secureTextEntry={!showPass && usePassword}
        />
        {/* {labelRight && label && renderTitleTop()} */}
        {renderRight?.()}
        {(usePassword || iconRight) && (
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Icon
              style={{
                paddingHorizontal: 20,
              }}
              icon={icon}
              size={20}
            />
          </TouchableOpacity>
        )}
      </View>
      {invalid && (
        <HelperText
          visible={invalid}
          msg={error?.message ?? ''}
          type={'error'}
        />
      )}
    </View>
  );
};

export const Input = memo(InputComponent, isEqual);
const styles = StyleSheet.create({
  containerDefault: {
    flex: 1,
  },
  fieldStyleDefault: {
    paddingVertical,
    paddingHorizontal,
  },
});
