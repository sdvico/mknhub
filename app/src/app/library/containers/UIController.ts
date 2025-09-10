import { APP_SCREEN, DeferParams } from '../../navigation/screen-types';
import Utils from '../../library/utils';
export class UIController {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static showDeferScreen<T>(deferScreenConfig: Omit<DeferParams<T>, 'defer'>): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        Utils.navigation.push(APP_SCREEN.DEFER_SCREEN, {
          ...deferScreenConfig,
          defer: { resolve, reject },
        });
      } catch (error) { }
    });
  }
}
