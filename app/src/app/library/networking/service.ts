import Axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {StyleSheet} from 'react-native';
import {getState} from '../../common';
import {RESULT_CODE_PUSH_OUT, TIME_OUT} from '../../config/api';
import {ParamsNetwork, ResponseBase} from '../../config/type';
import {AppState} from '../../store/app/redux/type';

import {ApiConstants} from './api';
import {
  handleErrorAxios,
  handleParameter,
  handleResponseAxios,
  onPushLogout,
} from './helper';

export const tokenKeyHeader = 'authorization';
let refreshTokenRequest: Promise<string | null> | null = null;
export const AxiosInstance = Axios.create({});
const AxiosApi = Axios.create({});

AxiosInstance.interceptors.response.use(
  response => response,
  async function (error) {
    const originalRequest = error.config;
    if (
      error &&
      error.response &&
      (error.response.status === 403 || error.response.status === 401) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      refreshTokenRequest = refreshTokenRequest
        ? refreshTokenRequest
        : refreshToken(originalRequest);
      const newToken = await refreshTokenRequest;
      refreshTokenRequest = null;
      if (newToken === null) {
        return Promise.reject(error);
      }

      // dispatch(Actions.onSetToken({ payload: newToken }));
      originalRequest.headers[tokenKeyHeader] = newToken;
      return AxiosInstance(originalRequest);
    }
    return Promise.reject(error);
  },
);

AxiosApi.interceptors.response.use(
  response => response,
  async function (_error) {
    return Promise.reject(null);
  },
);

// refresh token
async function refreshToken(originalRequest: any) {
  return AxiosInstance.get(ApiConstants.REFRESH_TOKEN, originalRequest)
    .then((res: AxiosResponse) => {
      if (res.status === 200) {
        return '';
      } else {
        return '';
      }
    })
    .catch(() => null);
}

// base
export function Request<T = unknown>(
  config: AxiosRequestConfig,
  isCheckOut = true,
) {
  const {token, appUrl}: AppState = getState('app');
  const defaultConfig: AxiosRequestConfig = {
    baseURL: appUrl,
    timeout: TIME_OUT,
    headers: {
      'Content-Type': 'application/json',
      [tokenKeyHeader]: token ? `Bearer ${token}` : '',
    },
  };

  return new Promise<ResponseBase<T> | ResponseBase<any>>(rs => {
    AxiosInstance.request({
      ...StyleSheet.flatten([defaultConfig, config]),
    })
      .then((res: AxiosResponse<T>) => {
        const result = handleResponseAxios(res);
        rs(result);
      })
      .catch((error: AxiosError) => {
        const result = handleErrorAxios(error);
        if (!isCheckOut) {
          rs(result);
        }
        if (result.code === RESULT_CODE_PUSH_OUT && isCheckOut) {
          onPushLogout();
          rs({
            code: 401,
            msg: 'author error',
            data: null,
            status: false,
          });
        } else {
          rs(result);
        }
      });
  });
}

// get
async function Get<T>(params: ParamsNetwork) {
  return Request<T>(handleParameter(params, 'GET'));
}

// post
async function Post<T>(params: ParamsNetwork) {
  console.info('params', params);

  return Request<T>(handleParameter(params, 'POST'));
}

type ParameterPostFormData = AxiosRequestConfig & ParamsNetwork;
// post FormData
async function PostFormData<T>(params: ParamsNetwork) {
  const {token}: AppState = getState('app');
  const headers: AxiosRequestConfig['headers'] = {
    token: token ?? '',
    'Content-Type': 'multipart/form-data',
  };
  return Request<T>(
    handleParameter<ParameterPostFormData>({...params, headers}, 'POST'),
  );
}

// put
async function Put<T>(params: ParamsNetwork) {
  return Request<T>(handleParameter(params, 'PUT'));
}

// delete
async function Delete<T>(params: ParamsNetwork) {
  return Request<T>(handleParameter(params, 'DELETE'));
}
export type NetWorkResponseType<T> = (
  params: ParamsNetwork,
) => Promise<ResponseBase<T> | null>;
export type NetWorType<T, B> = (body: B) => Promise<ResponseBase<T> | null>;

async function GetActionCode<T>(params: ParamsNetwork) {
  const {appUrl}: AppState = getState('app');
  let token = getState('app').token;

  // Add retry mechanism for token
  let retryCount = 0;
  while (!token && retryCount < 3) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newState: AppState = getState('app');
    if (newState.token) {
      token = newState.token;
      break;
    }
    retryCount++;
  }

  if (!token) {
    console.warn('GetActionCode: No token available after retries');
    return {
      code: 401,
      msg: 'Authorization token not available',
      data: null,
      status: false,
    };
  }

  const defaultConfig: AxiosRequestConfig = {
    baseURL: appUrl,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      [tokenKeyHeader]: `Bearer ${token}`,
    },
  };

  console.info('defaultConfig', defaultConfig);

  return new Promise<ResponseBase<T> | ResponseBase<any>>(rs => {
    AxiosInstance.request({
      ...StyleSheet.flatten([defaultConfig, handleParameter(params, 'GET')]),
    })
      .then((res: AxiosResponse<T>) => {
        const result = handleResponseAxios(res);
        rs(result);
      })
      .catch((error: AxiosError) => {
        const result = handleErrorAxios(error);
        rs(result);
      });
  });
}

export const NetWorkService = {
  Get,
  Post,
  Put,
  Delete,
  PostFormData,
  Request,
  GetActionCode,
};

export default NetWorkService;
