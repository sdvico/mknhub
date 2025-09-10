import { IconTypes } from '@assets/icon';
import { TextFieldProps } from '@library/components/text-field/type';
import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type HeaderActionBasicProps = {
  rightChildren?: React.ReactNode;
  leftChildren?: React.ReactNode;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  containerTitle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  leftStyle?: StyleProp<ViewStyle>;
  rightStyle?: StyleProp<ViewStyle>;
  backButtonStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  isBackButton?: boolean;
  onBack?: () => void;
  onPressTitle?: () => void;
};

export type HeaderSearchBasicProps = TextFieldProps & {
  rightChildren?: React.ReactNode;
  leftChildren?: React.ReactNode;
  title?: string;
  titleStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  leftStyle?: StyleProp<ViewStyle>;
  rightStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  isBackButton?: boolean;
  onBack?: () => void;
  onClearText?: () => void;
};

export type HeaderBasicProps = {
  rightChildren?: React.ReactNode;
  leftChildren?: React.ReactNode;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  leftStyle?: StyleProp<ViewStyle>;
  rightStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  isBackButton?: boolean;
  onBack?: () => void;
  onPressTitle?: () => void;
  iconBack?: IconTypes;
  iconBackSize?: number;
};
