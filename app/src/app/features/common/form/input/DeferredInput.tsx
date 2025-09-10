/* eslint-disable react-native/no-color-literals */
// DeferredInput.tsx
import React, { memo, useState, useEffect } from 'react';
import { StyleSheet, TextInputProps, TouchableOpacity, View, StyleProp, ViewStyle } from 'react-native';
import { TextField, TextFieldProps as UILibTextFieldProps } from 'react-native-ui-lib';
import { Icon, Text, HelperText } from '../../../../library/components';
import { IconTypes } from '../../../../assets/icon';
import { useTheme } from '../../../../themes';
import Utils, { paddingHorizontal, PaddingSize, paddingVertical } from '../../../../library/utils';

interface DeferredInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  isRequired?: boolean;
  trackChar?: boolean;
  maxLength?: number;
  iconRight?: IconTypes;
  onPress?: () => void;
  error?: string;
  formatter?: (value: string) => string;
  containerStyle?: StyleProp<ViewStyle>;
}

const DeferredInputComponent = (props: DeferredInputProps) => {
  // Hooks
  const {
    label,
    value,
    onChangeText,
    onSubmit,
    isRequired = false,
    trackChar = false,
    maxLength = 1000,
    iconRight,
    onPress,
    error,
    formatter,
    containerStyle,
    ...rest
  } = props;
  const theme = useTheme();
  const [localValue, setLocalValue] = useState<string>(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Handlers
  const handleChange = (text: string): void => {
    setLocalValue(text);
    onChangeText(text);
  };

  // Render title with character count
  const renderTitle = (): JSX.Element => (
    <View style={styles.titleContainer}>
      <View style={styles.labelContainer}>
        <Text fontSize={14}>
          {label}
          {isRequired && <Text style={styles.required}>*</Text>}
        </Text>
      </View>
      {trackChar && (
        <Text style={styles.charCount}>
          Đã nhập
          <Text style={styles.charCountHighlight}>{` ${localValue.length}/${maxLength} `}</Text>
          kí tự
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {label && renderTitle()}
      <TouchableOpacity onPress={onPress}>
        <View
          pointerEvents={onPress ? 'none' : 'auto'}
          style={[styles.inputWrapper, { backgroundColor: theme.colors.white }]}>
          <TextField
            value={formatter ? formatter(localValue) : localValue}
            onChangeText={handleChange}
            onSubmitEditing={onSubmit}
            maxLength={maxLength}
            containerStyle={[styles.containerDefault, containerStyle]}
            fieldStyle={styles.fieldStyleDefault}
            color={theme.colors.text}
            autoCapitalize="none"
            {...(rest as UILibTextFieldProps)}
          />
          {iconRight && <Icon style={styles.icon} icon={iconRight} />}
        </View>
      </TouchableOpacity>
      {error && <HelperText visible={true} msg={error} type="error" />}
    </View>
  );
};

export const DeferredInput = memo(DeferredInputComponent);

const styles = StyleSheet.create({
  charCount: {
    color: '#666',
  },
  charCountHighlight: {
    color: '#007AFF',
  },
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
  required: {
    color: 'red',
  },
  titleContainer: {
    flexDirection: 'row',
    paddingVertical: Utils.PaddingSize.vertical10,
  },
});
