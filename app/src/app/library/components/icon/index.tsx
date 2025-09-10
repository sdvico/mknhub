import { icons } from '../../../assets/icon';
import { enhance } from '../../../common';
import { useTheme } from '../../../themes';
import React, { memo, useMemo } from 'react';
import equals from 'react-fast-compare';
import { Image, StyleProp, TouchableOpacity } from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';

import { IconProps } from './type';

export const SIZE = {
  's-small': 12,
  small: 14,
  middle: 18,
  large: 24,
};

const IconComponent = (props: IconProps) => {
  // state
  const {
    size = 16,
    icon,
    colorTheme,
    resizeMode = 'contain',
    onPress,
    color,
    style: ContainerStyle,
    sizeIcon,
    useFastIcon = false,
  } = props;
  const theme = useTheme();
  // style
  const style = useMemo<StyleProp<ImageStyle>>(() => enhance([{ width: size, height: size }]), [size]);

  if (!useFastIcon) {
    return (
      <TouchableOpacity style={ContainerStyle} disabled={typeof onPress !== 'function'} onPress={onPress}>
        <Image
          style={[style, sizeIcon && { width: SIZE[sizeIcon], height: SIZE[sizeIcon] }]}
          tintColor={colorTheme ? theme.colors[colorTheme] : color}
          resizeMode={resizeMode}
          source={icons[icon]}
        />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={ContainerStyle} disabled={typeof onPress !== 'function'} onPress={onPress}>
      <FastImage
        style={[style, sizeIcon && { width: SIZE[sizeIcon], height: SIZE[sizeIcon] }]}
        tintColor={colorTheme ? theme.colors[colorTheme] : color}
        resizeMode={resizeMode}
        source={icons[icon]}
      />
    </TouchableOpacity>
  );
};
export const Icon = memo(IconComponent, equals);
