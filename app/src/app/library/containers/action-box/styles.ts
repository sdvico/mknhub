import { StyleSheet } from 'react-native';
import { AppTheme } from '@theme';
import Utils from '@utils';
import { ColorDefault } from '@theme/color';

export const createStyleActionBox = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      paddingVertical: Utils.PaddingSize.size16,
      backgroundColor: theme.colors.white,
      paddingHorizontal: Utils.PaddingSize.size16,
      minHeight: 100,
      paddingBottom: Utils.PaddingSize.bottomLayoutIP,
      borderWidth: 0,
      borderTopWidth: 1,
      borderTopColor: ColorDefault.border_grey300,
    },
    conatinerTitle: {
      alignItems: 'center',
    },
    itemSeparatorComponentStyle: {
      height: 1,
      backgroundColor: theme.colors.grey200,
    },
    line: {
      width: 75,
      height: 5,
      backgroundColor: ColorDefault.background_orange200,
      borderRadius: 5,
    },
  });
