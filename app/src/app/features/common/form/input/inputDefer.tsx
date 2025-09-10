import { HelperText, Icon, Text } from '../../../../library/components';
import { HookFormRules } from '../../../../config/type';
import { useTheme } from '../../../../themes';
import Utils, { paddingHorizontal, PaddingSize, paddingVertical } from '../../../../library/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextInputProps, TouchableOpacity, View } from 'react-native';

import { IconTypes } from '../../../../assets/icon';
import { TextField } from 'react-native-ui-lib';

interface InputProps extends TextInputProps {
  name: string;
  label?: string;
  onSubmit?: () => void;
  nameTrigger?: string;
  rules?: HookFormRules;
  titleTop?: boolean;
  trackChar?: boolean;
  isRequire?: boolean;
  onPress?: () => void;
  iconRight?: IconTypes;
  placeholder?: string;
  useStringify?: boolean;
  formater?: (value) => string;
}

const InputComponent = ({
  onSubmit,
  label,
  name,
  rules,
  defaultValue = '',
  maxLength = 1000,
  trackChar = false,
  isRequire = false,
  iconRight,
  onPress,
  containerStyle,
  useStringify,
  formater,
  ...rest
}: InputProps) => {
  // state
  const theme = useTheme();
  const { getValues } = useFormContext();
  const { t } = useTranslation();
  const {
    field,
    fieldState: { invalid, error },
  } = useController({
    name,
    rules,
    defaultValue,
  });
  const renderTitleTop = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: Utils.PaddingSize.vertical10,
        }}>
        <View style={{ flex: 1 }}>
          <Text fontSize={14}>
            {label}
            {isRequire && <Text style={{ color: theme.colors.error }}>{'*'}</Text>}
          </Text>
        </View>
        {trackChar && (
          <Text style={{ color: theme.colors.grey800 }}>
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

  // render
  return (
    <View
      style={{
        borderRadius: PaddingSize.base,
        paddingHorizontal,
      }}>
      {label && renderTitleTop()}
      <TouchableOpacity onPress={onPress}>
        <View
          pointerEvents="none"
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: Utils.BorderSize.normal,
              backgroundColor: theme.colors.white,
            },
          ]}>
          <TextField
            value={
              // eslint-disable-next-line no-nested-ternary
              formater ? formater(field.value) : useStringify ? JSON.stringify(getValues()[name]) : getValues()[name]
            }
            onSubmit={onSubmit}
            ref={field.ref}
            label={null}
            onBlur={field.onBlur}
            maxLength={maxLength}
            containerStyle={[styles.containerDefault, containerStyle]}
            fieldStyle={[styles.fieldStyleDefault]}
            color={theme.colors.text}
            {...rest}
          />
          {iconRight && (
            <Icon
              style={{
                paddingHorizontal: PaddingSize.horizontal8,
              }}
              icon={iconRight}
            />
          )}
        </View>
      </TouchableOpacity>
      {invalid && <HelperText visible={invalid} msg={error?.message ?? ''} type={'error'} />}
    </View>
  );
};

export const InputDefer = memo(InputComponent, isEqual);
const styles = StyleSheet.create({
  containerDefault: {
    flex: 1,
  },
  fieldStyleDefault: {
    paddingVertical,
    paddingHorizontal,
  },
});
