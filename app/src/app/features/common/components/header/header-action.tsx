import { Icon, Text } from '../../../../library/components';
import { goBack } from '../../../../navigation/navigation-service';
import { useTheme } from '../../../../themes';
import React, { memo } from 'react';
import equals from 'react-fast-compare';
import { TouchableOpacity, View } from 'react-native';
import { createStyleHerder } from './style';
import { HeaderActionBasicProps } from './types';

const _HeaderAction = (props: HeaderActionBasicProps) => {
  const theme = useTheme();
  const {
    leftChildren,
    rightChildren,
    containerStyle,
    children,
    title,
    titleStyle,
    isBackButton,
    containerTitle,
    backButtonStyle,
    onBack,
    onPressTitle,
  } = props;

  const styleBasic = createStyleHerder(theme);

  const renderBackButton = () => {
    return (
      <TouchableOpacity
        onPress={onBack ?? goBack}
        style={[
          {
            backgroundColor: 'transparent',
            paddingBottom: 2,
            paddingRight: 10,
          },
          backButtonStyle,
        ]}>
        <Icon icon="back" sizeIcon="middle" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styleBasic.conatinerHeaderAction, containerStyle]}>
      {isBackButton && renderBackButton()}
      {title ? (
        <TouchableOpacity onPress={onPressTitle} style={[styleBasic.containerTitleHeaderAction, containerTitle]}>
          <View style={{ maxWidth: 200 }}>
            <Text numberOfLines={2} fontSize={16} style={titleStyle}>
              {title}
            </Text>
          </View>
          {leftChildren}
        </TouchableOpacity>
      ) : null}
      {children}
      {rightChildren}
    </View>
  );
};

const HeaderAction = memo(_HeaderAction, equals);

export default HeaderAction;
