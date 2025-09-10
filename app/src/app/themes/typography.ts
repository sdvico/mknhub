import { Platform } from 'react-native';

import { FontFamily as FontType } from '../config/type';

export const FontDefault: FontType = {
  primary: Platform.select({
    ios: 'SF UI Display',
    android: 'SF UI Display',
  }) as string,

  secondary: Platform.select({
    ios: 'SF UI Display',
    android: 'SF UI Display',
  }) as string,
};
export type FontFamily = keyof typeof FontDefault;
