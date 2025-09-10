import { HelperText, Text, TextField } from '../../../../library/components';
import { HookFormRules } from '../../../../config/type';
import { useTheme } from '../../../../themes';
import Utils from '../../../../library/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useController, useFormContext } from 'react-hook-form';
import { View } from 'react-native';

interface InputProps {
  name: string;
  label: string;
  onSubmit?: () => void;
  nameTrigger?: string;
  rules?: HookFormRules;
  titleTop?: boolean;
  trackChar?: boolean;
  isRequire?: boolean;
}

const InputComponent = ({
  onSubmit,
  label,
  name,
  rules,
  nameTrigger,
  defaultValue = '',
  containerStyle,
  titleTop = false,
  maxLength = 1000,
  trackChar = false,
  isRequire = false,
  ...rest
}: InputProps) => {
  // state
  const theme = useTheme();
  const { trigger, getValues } = useFormContext();
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
          <Text fontWeight="bold" style={{ color: theme.colors.text }}>
            {label} {isRequire && <Text style={{ color: theme.colors.error }}>{'*'}</Text>}
          </Text>
        </View>
        {trackChar && (
          <Text style={{ color: theme.colors.grey800 }}>
            {'Đã nhập : '}
            <Text
              style={{
                color: theme.colors.secondary,
              }}>{`${getValues()[name]?.length || 0}/${maxLength}`}</Text>
            {' Kí tự'}
          </Text>
        )}
      </View>
    );
  };
  // render
  return (
    <>
      {titleTop && renderTitleTop()}
      <TextField
        onSubmit={onSubmit}
        ref={field.ref}
        nameTrigger={nameTrigger}
        trigger={trigger}
        error={invalid}
        label={''}
        name={name}
        onChangeText={text => field.onChange(Utils.inputMoney(text))}
        onBlur={field.onBlur}
        defaultValue={Utils.inputMoney(getValues()[name])}
        maxLength={maxLength}
        {...rest}
        containerStyle={[containerStyle]}
      />
      <HelperText visible={invalid} msg={error?.message ?? ''} type={'error'} />
    </>
  );
};

export const InputMonney = memo(InputComponent, isEqual);
