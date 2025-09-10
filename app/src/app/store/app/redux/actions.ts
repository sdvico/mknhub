import { NetInfoState } from '@react-native-community/netinfo';
import { PayloadAction, PayloadAny, PayloadInput } from '../../../store/types';
import { ThemeType } from '../../../themes';
import Constants, { ON_CHECK_TOKEN } from './constants';

export const onSetInternet = (
  payload: PayloadInput<NetInfoState, unknown>,
): PayloadAction<string, NetInfoState, unknown> => {
  return {
    type: Constants.ON_SET_INTERNET,
    payload: payload.payload,
    callback: payload.callback,
  };
};

export const onSetToken = (payload: PayloadInput<string, unknown>): PayloadAction<string, string, unknown> => {
  return {
    type: Constants.ON_SET_TOKEN,
    payload: payload.payload,
    callback: payload.callback,
  };
};

export const onSetAppProfile = (payload: PayloadInput<unknown, unknown>): PayloadAction<string, unknown, unknown> => {
  return {
    type: Constants.ON_SET_APP_PROFILE,
    payload: payload.payload,
    callback: payload.callback,
  };
};

const onSetAppTheme = (payload: PayloadInput<ThemeType, unknown>): PayloadAction<string, ThemeType, unknown> => {
  return {
    type: Constants.ON_SET_APP_THEME,
    payload: payload.payload,
    callback: payload.callback,
  };
};

const onLoadApp = (payload?: PayloadAny): PayloadAny => {
  return {
    type: Constants.ON_LOAD_APP,
    payload: true,
    callback: payload?.callback,
  };
};

const onSetAppMode = (payload: PayloadInput<string, unknown>): PayloadAction<string, string, unknown> => {
  return {
    type: Constants.ON_SET_APP_MODE,
    payload: payload.payload,
    callback: payload.callback,
  };
};

export const onLogout = (payload: PayloadInput<unknown, unknown>): PayloadAction<string, unknown, unknown> => {
  return {
    type: Constants.ON_LOG_OUT,
    payload: payload.payload,
    callback: payload.callback,
  };
};

export const onCheckToken = (payload: PayloadInput<unknown, unknown>): PayloadAction<string, unknown, unknown> => {
  return {
    type: ON_CHECK_TOKEN,
    payload: true,
    callback: payload?.callback,
  };
};

const Actions = {
  onLogout,
  onLoadApp,
  onSetAppMode,
  onSetAppTheme,
  onSetInternet,
  onSetToken,
};

export default Actions;
