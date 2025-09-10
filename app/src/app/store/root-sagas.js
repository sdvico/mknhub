import {networkSaga} from 'react-native-offline';
import {all, fork} from '../common/typed-redux-saga';
import {appSaga} from './app/saga/index';
import {pagingSaga} from './saga';
import {notificationSaga} from './saga/notification.saga';
import {shipSaga} from './saga/ship.saga';
import {weatherSaga} from './saga/weather.saga';

export const rootSaga = function* rootSaga() {
  yield all([
    appSaga(),
    pagingSaga(),
    notificationSaga(),
    shipSaga(),
    weatherSaga(),
    fork(networkSaga, {pingInterval: 20000}),
  ]);
};
