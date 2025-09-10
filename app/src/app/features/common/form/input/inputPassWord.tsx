import { HelperText, Icon, TextField, TouchableScale } from '../../../../library/components';
import { HookFormRules } from '../../../../config/type';
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
  resetField?: () => void;
}

const InputComponent = ({
  onSubmit,
  label,
  name,
  rules,
  nameTrigger,
  defaultValue = '',
  rightChildren,
  containerStyle,
  ...rest
}: InputProps) => {
  const [hidePass, setHidePass] = React.useState<boolean>(true);
  // state
  const { trigger, getValues } = useFormContext();
  const {
    field,
    fieldState: { invalid, error },
  } = useController({
    name,
    rules,
    defaultValue,
  });
  // render
  return (
    <>
      <TextField
        onSubmit={onSubmit}
        ref={field.ref}
        nameTrigger={nameTrigger}
        trigger={trigger}
        error={invalid}
        label={label}
        name={name}
        value={field.value}
        onChangeText={field.onChange}
        onBlur={field.onBlur}
        defaultValue={getValues()[name]}
        secureTextEntry={hidePass}
        containerStyle={[containerStyle]}
        {...rest}
        rightChildren={
          <View
            style={{
              paddingHorizontal: 10,
              flexDirection: 'row',
            }}>
            {getValues()[name] ? (
              <TouchableScale
                onPressIn={() => {
                  field.onChange('');
                }}>
                <View
                  style={{
                    paddingHorizontal: Utils.PaddingSize.size3,
                    flexDirection: 'row',
                  }}>
                  <Icon size={Utils.IcontSize.icon12} icon="clear" />
                </View>
              </TouchableScale>
            ) : null}
            <TouchableScale onPress={() => setHidePass(!hidePass)}>
              <View
                style={{
                  paddingHorizontal: Utils.PaddingSize.size3,
                  flexDirection: 'row',
                }}>
                {hidePass ? (
                  <Icon size={Utils.IcontSize.icon16} icon="hidePass" />
                ) : (
                  <Icon size={Utils.IcontSize.icon16} icon="showPass" />
                )}
              </View>
            </TouchableScale>
            {rightChildren}
          </View>
        }
      />
      <HelperText visible={invalid} msg={error?.message ?? ''} type={'error'} />
    </>
  );
};

export const InputPassWord = memo(InputComponent, isEqual);
