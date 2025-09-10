import {NetWorkService} from '../../library/networking';
import {PAGINATION_SUCCESS} from '../../store/constants';
import {PayloadAction} from '../../store/types';
import {call, put} from '../../common/typed-redux-saga';
import {showMessage} from 'react-native-flash-message';

type PagingDataQuery = {
  apiUrl: string;

  apiParams: Record<string, any>;
  pagingId: string;
  page: number;
  moduleName: string;
  entityName: string;
};
export function* onGetDataQuery(
  action: PayloadAction<string, PagingDataQuery, unknown>,
) {
  if (!action.payload) {
    return;
  }

  const {apiUrl, apiParams, pagingId} = action.payload;

  if (!action.payload || !pagingId) {
    return;
  }

  const response = yield* call(NetWorkService.Get, {
    url: apiUrl,
    params: apiParams,
  });
  if (response?.data?.code === 200 && response.data.data) {
    yield put({
      type: PAGINATION_SUCCESS,
      payload: {
        ...action.payload,
        response: response.data,
      },
    });
  } else {
    yield* call(showMessage, {
      message: response?.data?.message || 'Lấy dữ liệu thất bại!',
      type: 'danger',
    });
    console.error(
      'onGetDataQuery error:',
      response?.data?.message || 'Lấy dữ liệu thất bại!',
    );
  }
}
