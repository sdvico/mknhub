import { IconTypes } from '../../../../assets/icon';
import { HelperText, Icon, Text } from '../../../../library/components';
import { HookFormRules } from '../../../../config/type';
import { useTheme } from '@react-navigation/native';
import Utils, { PaddingSize, paddingHorizontal, paddingVertical } from '../../../../library/utils';
import moment from 'moment';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useController, useFormContext } from 'react-hook-form';
import { StyleSheet, TextInputProps, TouchableOpacity, View, ViewStyle } from 'react-native';
import DatePicker, { DatePickerProps } from 'react-native-date-picker';
import { TextField } from 'react-native-ui-lib';

type InputProps = TextInputProps & {
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
  renderRight?: () => React.ReactElement;
  isUperCase?: boolean;
  labelRight?: boolean;
} & DatePickerProps;

const DatePickerComponent = ({
  label,
  name,
  rules,
  containerStyle,
  isRequire = false,
  isRow = false,
  defaultValue,
  maxLength,
  renderRight,
  mode = 'date',
  ...rest
}: InputProps) => {
  // state
  const theme = useTheme();
  const { getValues } = useFormContext();
  const [open, setOpen] = React.useState(false);
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
      </View>
    );
  };

  const onPress = () => {
    setOpen(!open);
  };
  // render
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
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
            pointerEvents="none"
            disabled={true}
            ref={field.ref}
            onBlur={field.onBlur}
            defaultValue={getValues()[name]}
            containerStyle={[styles.containerDefault, containerStyle]}
            fieldStyle={[styles.fieldStyleDefault]}
            color={theme.colors.text}
            maxLength={maxLength}
            {...rest}
          />
          {/* {labelRight && label && renderTitleTop()} */}
          {renderRight?.()}
          <TouchableOpacity>
            <Icon
              style={{
                paddingHorizontal: PaddingSize.horizontal8,
              }}
              icon={'calandar'}
            />
          </TouchableOpacity>
        </View>
        {invalid && <HelperText visible={invalid} msg={error?.message ?? ''} type={'error'} />}
      </TouchableOpacity>
      <DatePicker
        theme="light"
        modal
        mode={mode}
        open={open}
        date={
          getValues()[name]
            ? new Date(moment(getValues()[name], mode === 'time' ? 'HH:mm' : 'DD/MM/YYYY').toISOString())
            : new Date()
        }
        onConfirm={date => {
          setOpen(false);
          field.onChange(moment(date).format(mode === 'time' ? 'HH:mm' : 'DD/MM/YYYY'));
        }}
        onCancel={() => {
          setOpen(false);
        }}
        locale={'vi_VN'}
        confirmText="Xác nhận"
        cancelText="Huỷ"
      />
    </>
  );
};

export const DatePickerForm = memo(DatePickerComponent, isEqual);

const styles = StyleSheet.create({
  containerDefault: {
    flex: 1,
  },
  fieldStyleDefault: {
    paddingVertical,
    paddingHorizontal,
  },
});
