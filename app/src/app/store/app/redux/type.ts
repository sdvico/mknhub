import {UserInfo, UserType} from '@modalType/user';
import {NetInfoState} from '@react-native-community/netinfo';
import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import {ThemeType} from '../../../themes';

export interface AppState {
  internetState: NetInfoState;
  profile: {
    user: UserType.User;
    userinfo: UserInfo[];
    // wallet: UserWallet[];
    wallet: number;
    total_point: number;
    affiliate_code?: {
      affiliate_code: string;
    };
  } | null;

  readyApp: boolean;
  appReady: boolean;

  token: string | undefined;

  loadingApp: boolean;

  showDialog: boolean;

  theme: ThemeType;

  appUrl: string;
  linkOpenApp: string;
  notifyOpenApp?: FirebaseMessagingTypes.RemoteMessage;
  appSetting: {
    // [AppSettingType.APP_LOGO]: string;
    // [AppSettingType.PRICE_PER_VIEW_ADVERTISEMENT]: number;
    // [AppSettingType.APP_NAME]: string;
    // [AppSettingType.LIMIT_IMAGE]: number;
  };
  device_token: string;
  gestAccount: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  };
  productFollows: any[];
}
