/* eslint-disable react-native/no-inline-styles */
import {Icon, Text} from '../../../../library/components';
import {useTheme} from '../../../../themes';
import Utils from '../../../../library/utils';
import React, {memo} from 'react';
import equals from 'react-fast-compare';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {createStyleHerder} from './style-transparent';
import {HeaderBasicProps} from './types';

const _HeaderBasic = (props: HeaderBasicProps) => {
  const theme = useTheme();
  const {
    leftChildren,
    rightChildren,
    containerStyle,
    children,
    title,
    titleStyle,
    isBackButton,
    onBack,
    iconBack,
    iconBackSize = Utils.IcontSize.icon16,
  } = props;
  const styleBasic = createStyleHerder(theme);

  const renderBackButton = () => {
    return (
      <TouchableOpacity
        onPress={onBack || Utils.navigation.goBack}
        style={{
          backgroundColor: 'transparent',
          paddingBottom: 0,
          paddingRight: 30,
        }}>
        <Icon size={iconBackSize} icon={iconBack || 'back'} color={'white'} />
      </TouchableOpacity>
    );
  };
  return (
    <View style={[styleBasic.conatinerHeaderBasic, containerStyle]}>
      {isBackButton && renderBackButton()}

      <View style={styleBasic.containerTitleHeaderBasic}>
        <Text
          numberOfLines={2}
          fontSize={16}
          fontWeight="bold"
          style={[{color: theme.colors.white}, titleStyle]}>
          {title}
        </Text>
        {children}
      </View>
      {leftChildren}
      <View style={{flex: 1}} />
      {rightChildren}
    </View>
  );
};
const HeaderBasicTransparent = memo(_HeaderBasic, equals);
export default HeaderBasicTransparent;
