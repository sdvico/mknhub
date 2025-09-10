import {call, put, takeLatest} from 'redux-saga/effects';
import {NetWorkService} from '@/app/library/networking';

// Action types
export const SHIP_ACTIONS = {
  FETCH_SHIPS: 'ship/FETCH_SHIPS',
  FETCH_SHIPS_SUCCESS: 'ship/FETCH_SHIPS_SUCCESS',
  FETCH_SHIPS_ERROR: 'ship/FETCH_SHIPS_ERROR',
} as const;

// Action creators
export const fetchShips = () => ({
  type: SHIP_ACTIONS.FETCH_SHIPS,
});

export const fetchShipsSuccess = (ships: any[]) => ({
  type: SHIP_ACTIONS.FETCH_SHIPS_SUCCESS,
  payload: ships,
});

export const fetchShipsError = (error: string) => ({
  type: SHIP_ACTIONS.FETCH_SHIPS_ERROR,
  payload: error,
});

// Saga
function* fetchShipsSaga() {
  try {
    const response = yield call(NetWorkService.Get, {
      url: '/api/ships',
    });

    if (Array.isArray(response.data)) {
      yield put(fetchShipsSuccess(response.data));
    } else if (response?.data?.data) {
      yield put(fetchShipsSuccess(response.data.data));
    } else {
      yield put(fetchShipsSuccess([]));
    }
  } catch (error: any) {
    console.error('Error fetching ships:', error);
    yield put(fetchShipsError(error.message || 'Failed to fetch ships'));
  }
}

// Root saga
export function* shipSaga() {
  yield takeLatest(SHIP_ACTIONS.FETCH_SHIPS, fetchShipsSaga);
}
