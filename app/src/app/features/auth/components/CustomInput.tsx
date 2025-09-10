/* eslint-disable react-native/no-inline-styles */
import React, {useState, forwardRef, useCallback} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
} from 'react-native';
import {Icon} from '../../../library/components';

interface CustomInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  disabled?: boolean;
  maxLength?: number;
  showIcon?: boolean;
  iconName?: string;
  onIconPress?: () => void;
  noneLabel?: boolean;
}

const CustomInput = forwardRef<TextInput, CustomInputProps>(
  (
    {
      label,
      value,
      onChangeText,
      containerStyle,
      inputStyle,
      labelStyle,
      secureTextEntry = false,
      keyboardType = 'default',
      error,
      autoCapitalize = 'none',
      disabled = false,
      maxLength,
      showIcon = false,
      iconName = 'showPass',
      onIconPress,
      inputMode,
      noneLabel = false,
      ...props
    },
    ref,
  ) => {
    // Track password visibility state separately from secureTextEntry prop
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Calculate if the input should be secure right now
    const isCurrentlySecure = secureTextEntry && !passwordVisible;

    // Handle icon press with memoized callback to prevent unnecessary rerenders
    const handleIconPress = useCallback(() => {
      if (secureTextEntry) {
        setPasswordVisible(prevVisible => !prevVisible);
      }
      if (onIconPress) {
        onIconPress();
      }
    }, [secureTextEntry, onIconPress]);

    // Determine which icon to show
    const currentIconName = secureTextEntry
      ? passwordVisible
        ? 'hidden' // Show 'hidden' icon when password is visible
        : 'showPass' // Show 'showPass' icon when password is hidden
      : iconName;

    return (
      <View style={[styles.container, containerStyle]}>
        <View
          style={[
            styles.inputContainer,
            error ? styles.inputError : null,
            disabled ? styles.inputDisabled : null,
            isFocused ? styles.inputFocused : null,
          ]}>
          {!noneLabel && (
            <View style={styles.labelContainer}>
              <Text style={[styles.label, labelStyle]}>{label}</Text>
            </View>
          )}
          <TextInput
            ref={ref}
            style={[styles.input, inputStyle]}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={isCurrentlySecure}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            editable={!disabled}
            maxLength={maxLength}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            inputMode={inputMode}
            {...props}
          />
          {(showIcon || secureTextEntry) && (
            <TouchableOpacity
              onPress={handleIconPress}
              style={styles.iconContainer}
              activeOpacity={0.7}>
              <Icon icon={currentIconName} size={20} />
            </TouchableOpacity>
          )}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  labelContainer: {
    marginBottom: 2,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  input: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 4,
    paddingRight: 40, // Space for the icon
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  inputFocused: {
    borderColor: '#007AFF',
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#D1D1D1',
  },
  iconContainer: {
    position: 'absolute',
    right: 12,
    top: '50%',
    padding: 8, // Add padding for better touch target
    marginTop: 0, // Adjust vertical position accounting for padding
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomInput;
