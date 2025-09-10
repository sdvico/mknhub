import { Colors } from '@theme';
import { ViewStyle } from 'react-native';

export interface DividerProps {
  /**
   * Background for divider
   * @default #bbb
   */
  color?: string;

  /**
   * Overwrite color with theme
   */
  colorTheme?: keyof Colors;

  /**
   * Height of divider
   * @default 1
   */
  height?: number;
  style?: ViewStyle;
}
