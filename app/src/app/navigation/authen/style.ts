import { StyleSheet } from 'react-native';
import { AppTheme } from '../../themes';
import Utils, { PaddingSize } from '../../library/utils';
export const styles = (theme: AppTheme) =>
  StyleSheet.create({
    itemStyle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: PaddingSize.paddingVertical,
    },
    container: {
      paddingBottom: Utils.bottomSpace,
      flexDirection: 'row',
      borderWidth: 0,
      borderTopWidth: 0.5,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.white,
    },
    containerBadge: {
      width: 20,
      height: 20,
      borderRadius: 20,
      position: 'absolute',
      top: 0,
      right: -10,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
