/* eslint-disable react-native/no-inline-styles */
import {Icon, Text} from '../../../../library/components';
import {useTheme} from '../../../../themes';
import Utils from '../../../../library/utils';
import React, {memo} from 'react';
import equals from 'react-fast-compare';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {createStyleHerder} from './style';
import {HeaderBasicProps} from './types';
import {ColorDefault} from '@/app/themes/color';

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
    onPressTitle = () => {},
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
        <Icon
          size={iconBackSize}
          icon={iconBack || 'back'}
          color={ColorDefault.primary}
        />
      </TouchableOpacity>
    );
  };
  return (
    <View style={[styleBasic.conatinerHeaderBasic, containerStyle]}>
      <TouchableOpacity
        onPress={onPressTitle}
        style={styleBasic.containerTitleHeaderBasic}>
        <Text
          numberOfLines={2}
          fontSize={16}
          fontWeight="bold"
          style={[{color: theme.colors.primary}, titleStyle]}>
          {title}
        </Text>
        {children}
      </TouchableOpacity>
      <View
        pointerEvents="box-none"
        style={{
          ...StyleSheet.absoluteFillObject,
          flexDirection: 'row',
          alignItems: 'flex-end',
          paddingBottom: Utils.PaddingSize.vertical10,
          paddingHorizontal: Utils.PaddingSize.vertical16,
        }}>
        {isBackButton && renderBackButton()}
        {leftChildren}
        <View style={{flex: 1}} />
        {rightChildren}
      </View>
    </View>
  );
};
const HeaderBasic = memo(_HeaderBasic, equals);
export default HeaderBasic;
