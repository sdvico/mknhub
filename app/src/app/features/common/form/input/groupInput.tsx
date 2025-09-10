import { IconTypes } from '../../../../assets/icon';
import { HelperText, Icon, Spacer, Text } from '../../../../library/components';
import { HookFormRules } from '../../../../config/type';
import { useTheme } from '../../../../themes';
import Utils, { PaddingSize, paddingBase, paddingHorizontal, paddingVertical } from '../../../../library/utils';
import React, { memo, useState } from 'react';
import isEqual from 'react-fast-compare';
import { useController, useFormContext } from 'react-hook-form';
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
  rules,
  containerStyle,
  isRequire = false,
  isRow = false,
  defaultValue,
  placeholder2,
  ...rest
}: InputProps) => {
  // state
  const theme = useTheme();
  const { getValues } = useFormContext();

  const {
    field,
    fieldState: { invalid, error },
  } = useController({
    name,
    rules,
    defaultValue,
  });
  const defaultData = Object.keys(getValues()[name] || {});
  const [data, setData] = useState(defaultData.length ? defaultData : ['1']);

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

  const renderInput = (_, _index) => {
    const index = _index + 1;
    return (
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: Utils.BorderSize.normal,
            paddingTop: 1,
          },
        ]}>
        <View style={{ backgroundColor: theme.colors.white, flex: 1 }}>
          <TextField
            ref={field.ref}
            onChangeText={text => {
              const _data = {
                ...(field.value || ''),
                [index]: {
                  name: text,
                  value: field.value?.[index]?.value,
                },
              };
              console.log('_data', _data);
              field.onChange(_data);
            }}
            onBlur={field.onBlur}
            defaultValue={`${field.value?.[index]?.name || ''}`}
            containerStyle={[styles.containerDefault, containerStyle]}
            fieldStyle={[styles.fieldStyleDefault]}
            color={theme.colors.text}
            multiline={true}
            {...rest}
          />
        </View>
        <Spacer width={1} />
        <View style={{ backgroundColor: theme.colors.white, flex: 1 }}>
          <TextField
            ref={field.ref}
            onChangeText={text => {
              const _data = {
                ...(field.value || ''),
                [index]: {
                  name: field.value?.[index]?.name || '',
                  value: text,
                },
              };

              field.onChange(_data);
            }}
            onBlur={field.onBlur}
            defaultValue={`${field.value?.[index]?.value || ''}`}
            containerStyle={[styles.containerDefault, containerStyle]}
            fieldStyle={[styles.fieldStyleDefault]}
            color={theme.colors.text}
            multiline={true}
            {...rest}
            placeholder={placeholder2}
          />
        </View>
      </View>
    );
  };

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
      {data.map(renderInput)}
      <View
        style={{
          paddingTop: paddingBase,
        }}>
        <TouchableOpacity
          onPress={() => setData(prew => [...prew, `${prew.length + 1}`])}
          style={{
            padding: paddingBase,
            borderRadius: 8,
            width: 100,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.primary,
          }}>
          <Icon color={theme.colors.white} icon={'ic_add'} />
        </TouchableOpacity>
      </View>
      {invalid && <HelperText visible={invalid} msg={error?.message ?? ''} type={'error'} />}
    </View>
  );
};

export const GroupInput = memo(InputComponent, isEqual);
const styles = StyleSheet.create({
  containerDefault: {
    flex: 1,
  },
  fieldStyleDefault: {
    paddingVertical,
    paddingHorizontal,
  },
});
