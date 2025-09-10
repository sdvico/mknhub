import { Text } from '../../../library/components';
import { ColorDefault } from '../../../themes/color';
import { PaddingSize } from '../../../library/utils';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export const TabItem = ({ label, onPress, active }: { label: string; active: boolean; onPress(): void }) => {
  return (
    <TouchableOpacity
      style={{
        padding: PaddingSize.base,
        borderBottomWidth: 3,
        flex: 1,
        borderBottomColor: active ? ColorDefault.primary : ColorDefault.grey200,
        flexDirection: 'row',
        alignItems: 'center',
      }}
      onPress={() => onPress()}>
      <Text
        textAlign="center"
        style={{
          fontWeight: 'bold',
          color: active ? ColorDefault.primary : ColorDefault.black,
          flex: 1,
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
