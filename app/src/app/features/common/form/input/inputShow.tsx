import { IconTypes } from '../../../../assets/icon';
import { Icon, Text } from '../../../../library/components';
import { HookFormRules } from '../../../../config/type';
import { useTheme } from '../../../../themes';
import Utils, { PaddingSize, paddingHorizontal, paddingVertical } from '../../../../library/utils';
import React, { memo, useState } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextInputProps, TouchableOpacity, View, ViewStyle } from 'react-native';

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
  iconRight?: IconTypes;
  isRow?: boolean;
  placeholder?: string;
  containerStyle?: ViewStyle;
  usePassword?: boolean;
  renderRight?: () => React.ReactElement;
  isUperCase?: boolean;
  labelRight?: boolean;
}

const InputComponent = ({
  label,
  name,
  containerStyle,
  trackChar = false,
  isRequire = false,
  iconRight,
  isRow = false,
  defaultValue,
  maxLength,
  usePassword = false,
  renderRight,
  ...rest
}: InputProps) => {
  // state
  const theme = useTheme();
  const { getValues } = useFormContext();
  const { t } = useTranslation();

  const [showPass, setShowPass] = useState(false);

  const renderTitleTop = () => {
    return (
      <View
        style={[
          {
            flexDirection: 'row',
            paddingVertical: Utils.PaddingSize.vertical10,
          },
        ]}>
        <View style={{ flex: 1 }}>
          <Text fontSize={14} style={{ color: theme.colors.text }}>
            {label} {isRequire && <Text style={{ color: theme.colors.error }}>{'*'}</Text>}
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

  // eslint-disable-next-line no-nested-ternary
  const icon = !usePassword ? iconRight : showPass ? 'hidden' : 'showPass';
  // render
  return (
    <View
      style={[
        {
          borderRadius: PaddingSize.base,
          paddingHorizontal,
        },
        isRow ? { flex: 1 } : {},
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
          defaultValue={defaultValue}
          containerStyle={[styles.containerDefault, containerStyle]}
          fieldStyle={[styles.fieldStyleDefault]}
          color={theme.colors.text}
          maxLength={maxLength}
          {...rest}
          secureTextEntry={!showPass && usePassword}
          editable={false}
        />
        {/* {labelRight && label && renderTitleTop()} */}
        {renderRight?.()}
        {(usePassword || iconRight) && (
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Icon
              style={{
                paddingHorizontal: PaddingSize.horizontal8,
              }}
              icon={icon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export const InputShow = memo(InputComponent, isEqual);
const styles = StyleSheet.create({
  containerDefault: {
    flex: 1,
  },
  fieldStyleDefault: {
    paddingVertical,
    paddingHorizontal,
  },
});
