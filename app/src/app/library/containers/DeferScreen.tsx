import { APP_SCREEN, RootStackParamList } from '../../navigation/screen-types';
import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/core';
import Utils from '../../library/utils';
import { ColorDefault } from '../../themes/color';

type Props = RouteProp<RootStackParamList, APP_SCREEN.DEFER_SCREEN>;
const DeferScreenView = () => {
  const {
    params: { ContentView, ContentProps, defer, deferCenterLayout },
  } = useRoute<Props>();
  const onTouchEnd = () => {
    defer.resolve();
    Utils.navigation.goBack();
  };
  return (
    <View style={[{ flex: 1, justifyContent: deferCenterLayout ? 'center' : 'flex-end' }]}>
      <View
        onTouchEnd={onTouchEnd}
        style={[StyleSheet.absoluteFillObject, { backgroundColor: ColorDefault.background_modal }]}
      />
      <ContentView {...(ContentProps as Record<string, unknown>)} defer={defer} />
    </View>
  );
};

export default DeferScreenView;
