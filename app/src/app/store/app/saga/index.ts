import Constants from '../../../store/app/redux/constants';
import { takeLatest } from 'redux-saga/effects';

import * as Saga from './saga';
export function* appSaga() {
  yield takeLatest(Constants.ON_LOAD_APP, Saga.onLoadAppModeAndTheme);
}
