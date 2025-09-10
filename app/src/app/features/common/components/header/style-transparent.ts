import {StyleSheet} from 'react-native';
import {AppTheme} from '../../../../themes';
import Utils from '../../../../library/utils';
export const createStyleHerder = (theme: AppTheme) =>
  StyleSheet.create({
    containerSearch: {
      flexDirection: 'row',
      paddingTop: Utils.PaddingSize.statusbar,
      minHeight: 50,
      backgroundColor: theme.colors.white,
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingBottom: Utils.PaddingSize.vertical10,
      paddingHorizontal: Utils.PaddingSize.vertical16,
    },
    containerFieldSearch: {
      flex: 1,
      borderWidth: 0,
      backgroundColor: theme.colors.backgroundSecondary,
      paddingHorizontal: Utils.PaddingSize.vertical10,
    },
    iconSearch: {
      paddingHorizontal: Utils.PaddingSize.vertical10,
    },
    conatinerHeaderBasic: {
      flexDirection: 'row',
      paddingTop: Utils.PaddingSize.statusbar,
      alignItems: 'flex-end',
      paddingBottom: Utils.PaddingSize.vertical10,
      paddingHorizontal: Utils.PaddingSize.paddingHorizontal,
    },
    containerTitleHeaderBasic: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    conatinerHeaderAction: {
      flexDirection: 'row',
      paddingTop: Utils.PaddingSize.statusbar,
      height: 50 + Utils.PaddingSize.statusbar,
      backgroundColor: theme.colors.white,
      alignItems: 'flex-end',
      paddingBottom: Utils.PaddingSize.vertical10,
      paddingHorizontal: Utils.PaddingSize.paddingHorizontal,
      alignSelf: 'center',
    },
    containerTitleHeaderAction: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
  });
