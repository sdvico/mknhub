import {images} from '../../../assets/image';
import {enhance} from '../../../common';
import React, {memo, useMemo} from 'react';
import equals from 'react-fast-compare';
import {ImageBackground, StyleProp, View} from 'react-native';
import {ImageStyle} from 'react-native-fast-image';

import {ImageProps} from './type';

const ImgBackgroundComponent = (props: ImageProps) => {
  // state
  const {
    style: styleOverride,
    resizeMode = 'cover',
    source,
    containerStyle,
    children,
  } = props;

  // style
  const style = useMemo<StyleProp<ImageStyle>>(
    () =>
      enhance([{width: '100%', height: '100%'}, styleOverride as ImageStyle]),
    [styleOverride],
  );

  // render
  return (
    <View style={containerStyle}>
      <ImageBackground
        style={style}
        resizeMode={resizeMode}
        source={images[source as keyof typeof images]}>
        {children}
      </ImageBackground>
    </View>
  );
};
export const ImgBackground = memo(ImgBackgroundComponent, equals);
