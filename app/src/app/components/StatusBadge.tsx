import React from 'react';
import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import {ColorDefault} from '@/app/themes/color';

type StatusType = 'MKN' | 'normal' | 'success' | 'warning' | 'error' | 'info';

interface StatusBadgeProps {
  type: StatusType;
  value: string;
  style?: ViewStyle;
}

const getStatusColors = (type: StatusType) => {
  switch (type) {
    case 'MKN':
      return {
        bg: ColorDefault.errorbg,
        text: ColorDefault.error,
      };
    case 'success':
      return {
        bg: ColorDefault.activebg,
        text: ColorDefault.active,
      };
    case 'warning':
      return {
        bg: ColorDefault.warningbg,
        text: ColorDefault.warning,
      };
    case 'error':
      return {
        bg: ColorDefault.errorbg,
        text: ColorDefault.error,
      };
    case 'info':
      return {
        bg: ColorDefault.grey300,
        text: ColorDefault.grey600,
      };
    case 'normal':
    default:
      return {
        bg: ColorDefault.grey100,
        text: ColorDefault.grey600,
      };
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  type,
  value,
  style,
}) => {
  const colors = getStatusColors(type);

  return (
    <View style={[styles.container, {backgroundColor: colors.bg}, style]}>
      <Text style={[styles.text, {color: colors.text}]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});
