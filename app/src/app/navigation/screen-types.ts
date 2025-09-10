import {ComponentType} from 'react';
import {ViewStyle} from 'react-native';

export enum APP_SCREEN {
  BOTTOM_SHEET = 'BOTTOM_SHEET',
  FORM_BOTTOM_SHEET = 'FORM_BOTTOM_SHEET',
  BOTTOM_SHEET_COMFIRM = 'BOTTOM_SHEET_COMFIRM',
  BOTTOM_SHEET_ALERT = 'BOTTOM_SHEET_ALERT',
  TEMPLATE_SELECT_MODAL = 'TEMPLATE_SELECT_MODAL',

  // Main Tabs
  TAB_MAIN = 'TAB_MAIN',
  TAB_FISHING_GROUND = 'TAB_FISHING_GROUND',
  TAB_TRACKING = 'TAB_TRACKING',
  TAB_NOTIFICATION = 'TAB_NOTIFICATION',
  TAB_FEEDBACK = 'TAB_FEEDBACK',
  TAB_ACCOUNT = 'TAB_ACCOUNT',
  TAB_WEATHER = 'TAB_WEATHER',

  // Other screens
  TAB_HOME = 'TAB_HOME',
  TAB_PRODUCT = 'TAB_PRODUCT',
  TAB_SD_GROUP = 'TAB_SD_GROUP',
  TAB_REWARD = 'TAB_REWARD',
  TAB_CARE = 'TAB_CARE',
  TAB_BLOG = 'TAB_BLOG',
  TAB_UTILITIES = 'TAB_UTILITIES',
  TAB_HISTORY = 'TAB_HISTORY',
  DETAIL_NOTIFICATION = 'DETAIL_NOTIFICATION',
  NOTIFICATION_LIST = 'NOTIFICATION_LIST',
  HOME_PAYMENT = 'HOME_PAYMENT',
  FORM_PAYMENT = 'FORM_PAYMENT',
  FORM_REPORT_LOCATION = 'FORM_REPORT_LOCATION',
  HOME_REPORT_LOCATION = 'HOME_REPORT_LOCATION',
  WEBVIEW_SCREEN = 'WEBVIEW_SCREEN',
  DETAIL_STRACKING = 'DETAIL_STRACKING',
  HOME_BACKUP_DATA = 'HOME_BACKUP_DATA',
  FORM_BACKUP_DATA = 'FORM_BACKUP_DATA',
  HOME_BLOG = 'HOME_BLOG',
  DETAIL_BLOG = 'DETAIL_BLOG',

  // auth
  AUTH_LOGIN = 'AUTH_LOGIN',
  AUTH_REGISTER = 'AUTH_REGISTER',
  AUTH_DELETE_ACCOUNT = 'AUTH_DELETE_ACCOUNT',
  SPLASH = 'SPLASH',
  UN_AUTHORIZE = 'UN_AUTHORIZE',
  AUTHORIZE = 'AUTHORIZE',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',

  HOME_CARE_PRODUCT_CREATE = 'HOME_CARE_PRODUCT_CREATE',
  NOTIFICATION_SETTINGS = 'NOTIFICATION_SETTINGS',
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  SECURITY_POLICY = 'SECURITY_POLICY',
  HELP_SUPPORT = 'HELP_SUPPORT',
  ABOUT_APP = 'ABOUT_APP',
  DEVICE_LOGS = 'DEVICE_LOGS',
  WIFI_WEBVIEW = 'WIFI_WEBVIEW',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  LIST_REPORT = 'LIST_REPORT',

  NOTIFICATION_DETAIL = 'NOTIFICATION_DETAIL',
  REPORT_MAP_VIEW = 'REPORT_MAP_VIEW',
  REPORT_FORM_SCREEN = 'REPORT_FORM_SCREEN',
  MAP_REPORT_FORM_SCREEN = 'MAP_REPORT_FORM_SCREEN',
  PORT_PICKER_SCREEN = 'PORT_PICKER_SCREEN',
}

export type UnAuthorizeParamsList = {
  [APP_SCREEN.AUTH_LOGIN]: undefined;
  [APP_SCREEN.SPLASH]: undefined;
};

export type FeedParams = {
  id: number | string;
  item: unknown;
};

export type DeferParams<T> = {
  ContentView: ComponentType<any>;
  containerStyle?: ViewStyle;
  ContentProps?: T;
  defer: {
    resolve: (reason?: unknown) => void;
    reject: (reason?: unknown) => void;
  };
  deferCenterLayout?: boolean;
};

export type AuthorizeParamsList = {
  [APP_SCREEN.TAB_FISHING_GROUND]: undefined;
  [APP_SCREEN.TAB_TRACKING]: undefined;
  [APP_SCREEN.TAB_NOTIFICATION]: undefined;
  [APP_SCREEN.TAB_FEEDBACK]: undefined;
  [APP_SCREEN.TAB_ACCOUNT]: undefined;
};

type ParamListBase = {
  [x: string]: object | undefined;
};

export interface RootStackParamList
  extends ParamListBase,
    UnAuthorizeParamsList,
    AuthorizeParamsList {
  [APP_SCREEN.UN_AUTHORIZE]: undefined;
  [APP_SCREEN.AUTHORIZE]: undefined;
  [APP_SCREEN.TEMPLATE_SELECT_MODAL]: {
    mode: 'select' | 'add';
    onSelectTemplate?: (template: any) => void;
    onAddTemplate?: (template: any) => void;
  };
  [APP_SCREEN.HOME_BLOG]: undefined;
  [APP_SCREEN.DETAIL_BLOG]: {
    url: string;
    title: string;
  };
  [APP_SCREEN.REPORT_MAP_VIEW]: {
    report: {
      lat: number;
      lng: number;
      reported_at?: string;
      ship_code?: string;
      [key: string]: any;
    };
  };
  [APP_SCREEN.REPORT_FORM_SCREEN]: {
    notification?: any;
    onSubmit: (data: any) => void;
  };
  [APP_SCREEN.MAP_REPORT_FORM_SCREEN]: {
    notification?: any;
    onSubmit: (data: any) => void;
  };
  [APP_SCREEN.PORT_PICKER_SCREEN]: {
    onSelect: (port: any) => void;
  };
}
