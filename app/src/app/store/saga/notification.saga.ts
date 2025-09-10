import {call, put, takeLatest, select} from 'redux-saga/effects';
import {APP_SCREEN} from '@/app/navigation/screen-types';
import Utils from '@/app/library/utils';
import {NetWorkService} from '@/app/library/networking';

// Action types
export const NOTIFICATION_ACTIONS = {
  SET_PRODUCT_CODE: 'notification/SET_PRODUCT_CODE',
  SET_PENDING_ACTION: 'notification/SET_PENDING_ACTION',
  PROCESS_PENDING_ACTION: 'notification/PROCESS_PENDING_ACTION',
  CLEAR_PENDING_ACTION: 'notification/CLEAR_PENDING_ACTION',

  // New actions for notifications
  FETCH_NOTIFICATIONS: 'notification/FETCH_NOTIFICATIONS',
  FETCH_NOTIFICATIONS_SUCCESS: 'notification/FETCH_NOTIFICATIONS_SUCCESS',
  FETCH_NOTIFICATIONS_ERROR: 'notification/FETCH_NOTIFICATIONS_ERROR',

  // New actions for notification types
  FETCH_NOTIFICATION_TYPES: 'notification/FETCH_NOTIFICATION_TYPES',
  FETCH_NOTIFICATION_TYPES_SUCCESS:
    'notification/FETCH_NOTIFICATION_TYPES_SUCCESS',
  FETCH_NOTIFICATION_TYPES_ERROR: 'notification/FETCH_NOTIFICATION_TYPES_ERROR',

  // Ports
  FETCH_PORTS: 'notification/FETCH_PORTS',
  FETCH_PORTS_SUCCESS: 'notification/FETCH_PORTS_SUCCESS',
  FETCH_PORTS_ERROR: 'notification/FETCH_PORTS_ERROR',
} as const;

// Action creators
export const setProductCode = (productCode: string) => ({
  type: NOTIFICATION_ACTIONS.SET_PRODUCT_CODE,
  payload: productCode,
});

export const setPendingAction = (action: string) => ({
  type: NOTIFICATION_ACTIONS.SET_PENDING_ACTION,
  payload: action,
});

export const processPendingAction = () => ({
  type: NOTIFICATION_ACTIONS.PROCESS_PENDING_ACTION,
});

export const clearPendingAction = () => ({
  type: NOTIFICATION_ACTIONS.CLEAR_PENDING_ACTION,
});

// Action creators for notifications
export const fetchNotifications = (shipCode?: string, type?: string) => ({
  type: NOTIFICATION_ACTIONS.FETCH_NOTIFICATIONS,
  payload: {shipCode, type},
});

export const fetchNotificationsSuccess = (notifications: any[]) => ({
  type: NOTIFICATION_ACTIONS.FETCH_NOTIFICATIONS_SUCCESS,
  payload: notifications,
});

export const fetchNotificationsError = (error: string) => ({
  type: NOTIFICATION_ACTIONS.FETCH_NOTIFICATIONS_ERROR,
  payload: error,
});

// Action creators for notification types
export const fetchNotificationTypes = (shipCode?: string) => ({
  type: NOTIFICATION_ACTIONS.FETCH_NOTIFICATION_TYPES,
  payload: {shipCode},
});

export const fetchNotificationTypesSuccess = (types: any[]) => ({
  type: NOTIFICATION_ACTIONS.FETCH_NOTIFICATION_TYPES_SUCCESS,
  payload: types,
});

export const fetchNotificationTypesError = (error: string) => ({
  type: NOTIFICATION_ACTIONS.FETCH_NOTIFICATION_TYPES_ERROR,
  payload: error,
});

// Actions for ports
export const fetchPorts = () => ({
  type: NOTIFICATION_ACTIONS.FETCH_PORTS,
});

export const fetchPortsSuccess = (ports: any[]) => ({
  type: NOTIFICATION_ACTIONS.FETCH_PORTS_SUCCESS,
  payload: ports,
});

export const fetchPortsError = (error: string) => ({
  type: NOTIFICATION_ACTIONS.FETCH_PORTS_ERROR,
  payload: error,
});

// Saga để xử lý pending action
function* processPendingActionSaga(): Generator<any, void, any> {
  try {
    // Lấy state từ store
    const state = yield select();
    const {productCode, pendingAction} = state.notification;

    if (pendingAction === 'navigate_to_home' && productCode) {
      // Navigate to home
      yield call(Utils.navigation.push, APP_SCREEN.TAB_HOME);

      // Clear pending action sau khi xử lý xong
      yield put(clearPendingAction());
    }
  } catch (error) {
    console.error('Error processing pending action:', error);
  }
}

// Saga để xử lý set product code
function* setProductCodeSaga(
  action: ReturnType<typeof setProductCode>,
): Generator<any, void, any> {
  try {
    const productCode = action.payload;

    // Có thể thêm logic xử lý productCode ở đây nếu cần

    console.log('Product code set:', productCode);
  } catch (error) {
    console.error('Error setting product code:', error);
  }
}

// Saga để fetch notifications
function* fetchNotificationsSaga(
  action: ReturnType<typeof fetchNotifications>,
): Generator<any, void, any> {
  try {
    const {shipCode, type} = action.payload;
    const params = {
      ...(type !== 'all' && {type}),
      ship_code: type === 'all' ? '' : shipCode || '',
    };

    const response = yield call(NetWorkService.Get, {
      url: '/api/v1/ship-notifications/list',
      params,
    });

    yield put(fetchNotificationsSuccess(response.data));
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    yield put(
      fetchNotificationsError(error.message || 'Failed to fetch notifications'),
    );
  }
}

// Saga để fetch notification types
function* fetchNotificationTypesSaga(
  action: ReturnType<typeof fetchNotificationTypes>,
): Generator<any, void, any> {
  try {
    const {shipCode} = action.payload;
    const response = yield call(NetWorkService.Get, {
      url: '/api/notification-types/user',
      params: shipCode ? {ship_code: shipCode} : {ship_code: 'all'},
    });

    yield put(fetchNotificationTypesSuccess(response.data));
  } catch (error: any) {
    console.error('Error fetching notification types:', error);
    yield put(
      fetchNotificationTypesError(
        error.message || 'Failed to fetch notification types',
      ),
    );
  }
}

// Saga to fetch ports list
function* fetchPortsSaga(): Generator<any, void, any> {
  try {
    const response = yield call(NetWorkService.Get, {
      url: '/api/reports/ports?limit=150&page=1',
    });
    yield put(fetchPortsSuccess(response.data?.data));
  } catch (error: any) {
    console.error('Error fetching ports:', error);
    yield put(fetchPortsError(error.message || 'Failed to fetch ports'));
  }
}

// Root saga
export function* notificationSaga() {
  yield takeLatest(
    NOTIFICATION_ACTIONS.PROCESS_PENDING_ACTION,
    processPendingActionSaga,
  );
  yield takeLatest(NOTIFICATION_ACTIONS.SET_PRODUCT_CODE, setProductCodeSaga);
  yield takeLatest(
    NOTIFICATION_ACTIONS.FETCH_NOTIFICATIONS,
    fetchNotificationsSaga,
  );
  yield takeLatest(
    NOTIFICATION_ACTIONS.FETCH_NOTIFICATION_TYPES,
    fetchNotificationTypesSaga,
  );
  yield takeLatest(NOTIFICATION_ACTIONS.FETCH_PORTS, fetchPortsSaga);
}
