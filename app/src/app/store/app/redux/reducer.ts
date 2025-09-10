/* eslint-disable @typescript-eslint/no-explicit-any */
import {ENVConfig} from '../../../config/env';
import {PayloadAction} from '../../../store/types';
import Constants, {ON_LOG_OUT, SET_DEVICE_TOKEN} from './constants';
import {AppState} from './type';
import {produce} from 'immer';

export const initialAppState: AppState = {
  internetState: {},
  profile: null,
  token: '',
  loadingApp: false,
  showDialog: false,
  theme: 'default',
  appUrl: ENVConfig.API_URL,
  readyApp: false,
  appReady: false,
  linkOpenApp: '',
  notifyOpenApp: undefined,
  listAddress: [],
  appSetting: {
    app_logo: '',
    app_name: '',
    pricePerViewAdversiment: 0,
    imageLimit: 0,
  },
  productFollows: [],
};

export default function appReducer(
  state = initialAppState,
  action: PayloadAction<string, any, any>,
) {
  return produce(state, (draft: AppState) => {
    switch (action.type) {
      case Constants.SET_RPODUCT_FOLLOWS: {
        draft.productFollows = action.payload;
        break;
      }
      case Constants.ON_SET_GEST_ACCOUNT: {
        draft.gestAccount = action.payload;
        break;
      }
      case Constants.ON_SET_INTERNET: {
        draft.internetState = action.payload;
        break;
      }
      // HOME_READY;
      case 'READY_APP': {
        draft.appReady = true;
        return;
      }
      case Constants.ON_LOG_OUT: {
        return {...initialAppState};
      }
      case Constants.ON_SET_TOKEN: {
        draft.token = action.payload;
        break;
      }
      case ON_LOG_OUT: {
        draft.token = '';
        console.info('adu call logout');

        break;
      }
      case Constants.ON_SET_APP_PROFILE: {
        draft.profile = action.payload;
        break;
      }
      case Constants.ON_SET_APP_THEME: {
        draft.theme = action.payload;
        break;
      }
      case Constants.ON_SET_APP_MODE: {
        draft.appUrl = ENVConfig.API_URL;
        break;
      }
      case Constants.ON_LOAD_APP: {
        draft.loadingApp = true;
        break;
      }
      case Constants.ON_LOAD_APP_END: {
        draft.loadingApp = false;
        break;
      }
      case Constants.ON_START_PROCESS: {
        draft.showDialog = true;
        break;
      }
      case Constants.ON_END_PROCESS: {
        draft.showDialog = false;
        break;
      }
      case SET_DEVICE_TOKEN: {
        draft.device_token = action.payload;
        break;
      }
      case Constants.SET_LINK_OPEN_APP: {
        if (action.payload !== state.linkOpenApp) {
          draft.linkOpenApp = action.payload;
        }
        break;
      }
      case Constants.SET_NOTIFICATION_OPEN_APP: {
        draft.notifyOpenApp = action.payload;
        break;
      }

      case Constants.ON_GET_SETTING_APP_SUCCESS: {
        draft.appSetting = action.payload;
        break;
      }
      default: {
        break;
      }
    }
  });
}
