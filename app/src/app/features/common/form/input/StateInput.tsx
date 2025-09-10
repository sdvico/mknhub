// StateInput.tsx
import { IconTypes } from '../../../../assets/icon';
import { HelperText, Icon, Text } from '../../../../library/components';
import { useTheme } from '../../../../themes';
import Utils, { paddingHorizontal, PaddingSize, paddingVertical } from '../../../../library/utils';
import React, { memo, useEffect, useState } from 'react';
import { StyleSheet, View, ViewStyle, TextInputProps, TouchableOpacity } from 'react-native';
import { TextField, TextFieldProps as UILibTextFieldProps } from 'react-native-ui-lib';

interface StateInputProps extends TextInputProps {
  label?: string;
  value: string;
  onChangeText?: (text: string) => void;
  error?: string;
  trackChar?: boolean;
  isRequired?: boolean;
  iconRight?: IconTypes;
  isRow?: boolean;
  containerStyle?: ViewStyle;
  usePassword?: boolean;
  renderRight?: () => React.ReactElement;
  isUpperCase?: boolean;
  isFormatMoney?: boolean;
  maxLength?: number;
  readonly editable?: boolean;
  onPressIn?: () => void;
}

function StateInputComponent({
  label,
  value,
  onChangeText,
  error,
  containerStyle,
  trackChar = false,
  isRequired = false,
  iconRight,
  isRow = false,
  maxLength,
  usePassword = false,
  isUpperCase = false,
  renderRight,
  isFormatMoney = false,
  editable = true,
  onPressIn,
  ...rest
}: StateInputProps): JSX.Element {
  // Hooks
  const theme = useTheme();
  const [_showPass, _setShowPass] = useState<boolean>(false);
  const [_localValue, _setLocalValue] = useState<string>(value);

  useEffect(() => {
    _setLocalValue(value);
  }, [value]);

  // Handlers
  const _handleChangeText = (text: string): void => {
    if (!editable) return;
    let formattedText = text;
    if (isFormatMoney) {
      formattedText = Utils.inputMoney(text);
    } else if (isUpperCase) {
      formattedText = text?.toLocaleUpperCase() || '';
    }
    _setLocalValue(formattedText);
    onChangeText?.(formattedText);
  };

  // Render methods
  const _renderTitleTop = (): JSX.Element => (
    <View style={styles.titleContainer}>
      <View style={styles.labelContainer}>
        <Text fontSize={14} style={{ color: theme.colors.text }}>
          {label} {isRequired && <Text style={{ color: theme.colors.error }}>*</Text>}
        </Text>
      </View>
      {trackChar && (
        <Text style={{ color: theme.colors.grey800 }}>
          Đã nhập
          <Text style={{ color: theme.colors.secondary }}>{` ${_localValue.length}/${maxLength} `}</Text>
          kí tự
        </Text>
      )}
    </View>
  );

  // Update icon type definition
  const _getIcon = (): IconTypes => {
    if (!usePassword && iconRight) {
      return iconRight;
    }
    return _showPass ? 'hidden' : 'showPass';
  };

  // Add handler for password visibility toggle
  const _handlePasswordVisibility = (): void => {
    _setShowPass(prevState => !prevState);
  };

  return (
    <View style={[styles.container, isRow && styles.rowContainer, containerStyle]}>
      {label && _renderTitleTop()}
      <TouchableOpacity onPress={!editable ? onPressIn : undefined} disabled={editable}>
        <View style={[styles.inputWrapper, { backgroundColor: theme.colors.white }]}>
          <TextField
            value={_localValue}
            onChangeText={_handleChangeText}
            containerStyle={[styles.containerDefault, containerStyle]}
            fieldStyle={styles.fieldStyleDefault}
            color={theme.colors.text}
            maxLength={maxLength}
            secureTextEntry={!_showPass && usePassword}
            editable={editable}
            {...(rest as UILibTextFieldProps)}
          />
          {renderRight?.()}
          {(usePassword || iconRight) && (
            <TouchableOpacity onPress={_handlePasswordVisibility}>
              <Icon style={styles.icon} icon={_getIcon()} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
      {error && <HelperText visible={true} msg={error} type="error" />}
    </View>
  );
}

export const StateInput = memo(StateInputComponent);

const styles = StyleSheet.create({
  container: {
    borderRadius: PaddingSize.base,
    paddingHorizontal,
  },
  containerDefault: {
    flex: 1,
  },
  fieldStyleDefault: {
    paddingHorizontal,
    paddingVertical,
  },
  icon: {
    paddingHorizontal: PaddingSize.horizontal8,
  },
  inputWrapper: {
    alignItems: 'center',
    borderRadius: Utils.BorderSize.normal,
    flexDirection: 'row',
  },
  labelContainer: {
    flex: 1,
  },
  rowContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    paddingVertical: Utils.PaddingSize.vertical10,
  },
});
