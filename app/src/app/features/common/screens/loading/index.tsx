import { Text } from '../../../../library/components';
import { useTheme } from '@react-navigation/native';
import { ColorDefault } from '../../../../themes/color';
import Utils, { paddingHorizontal, paddingVertical } from '../../../../library/utils';
import React, { Ref } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

type LoadingProps = {
  isLoading?: boolean;
  title?: string;
};

export interface RefObject {
  toggleState: (val: boolean) => void;
}
//
const _Loading = React.forwardRef((props: LoadingProps, ref: Ref<RefObject>) => {
  const { isLoading = false, title = '', pointerEvents = 'auto' } = props;
  const theme = useTheme();
  const [loadingState, setLoadingState] = React.useState<boolean>(false);
  const toggleState = React.useCallback(
    (val: boolean) => {
      setLoadingState(val);
    },
    [setLoadingState],
  );

  React.useImperativeHandle(ref, () => {
    return { toggleState };
  });

  if (loadingState || isLoading) {
    return (
      <View pointerEvents={pointerEvents} style={[styles.container]}>
        {title ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: paddingVertical,
              paddingHorizontal: paddingHorizontal,
              maxWidth: Utils.deviceWidth * 0.7,
              backgroundColor: theme.colors.white,
              borderRadius: 5,
            }}>
            <ActivityIndicator size={'large'} color={ColorDefault.primary} />
            <Text textAlign={'center'} fontSize={18}>
              {title}
            </Text>
          </View>
        ) : (
          <ActivityIndicator size={'large'} color={ColorDefault.primary} />
        )}
      </View>
    );
  } else {
    return null;
  }
});

const Loading = React.memo(_Loading);
export default Loading;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: ColorDefault.backgroundCategory,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
