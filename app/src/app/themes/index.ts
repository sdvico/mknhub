import { Theme, useTheme as useThemeRN } from '@react-navigation/native';

import { ColorDark, ColorDefault } from './color';
// import { lightColors } from '@sms/components/config';

type ColorDefault = typeof ColorDefault;
type ColorDark = typeof ColorDark;

export type Colors = ColorDefault & ColorDark;
export type AppTheme = Theme & { colors: Colors };

const Default: AppTheme = {
  // ...lightColors,
  dark: false,
  colors: {
    // ...lightColors.colors,
    ...ColorDefault,
  },
};

export const Premium: AppTheme = {
  // ...lightColors,
  dark: false,
  colors: {
    // ...lightColors.colors,
    ...ColorDefault,
    primary: 'rgba(71, 12, 107, 1)',
    secondary: 'rgba(179, 87, 235, 1)',
  },
};

const Dark: AppTheme = {
  dark: true,
  // ...lightColors,
  colors: {
    // ...lightColors.colors,
    ...ColorDark,
  },
};

export const MyAppTheme = {
  default: Default,
  dark: Dark,
  premium: Premium,
};

export type ThemeType = keyof typeof MyAppTheme;

export const useTheme = () => {
  const payload = useThemeRN() as AppTheme;
  return payload;
};
