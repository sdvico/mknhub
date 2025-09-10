import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import immutableTransform from 'redux-persist-transform-immutable';
import {reducer as networkReducer} from 'react-native-offline';
import appReducer from './app/redux/reducer';
import {notificationReducer} from './reducers/notification.reducer';
import {shipReducer} from './reducers/ship.reducer';
import {weatherReducer} from './reducers/weather.reducer';

//migrations
const VER_REDUX = 1;

// const migrationsChat = {
//   1: state => {
//     return {
//       ...state,
//     };
//   },
//   // Add more migration cases as needed
// };

const authPersistConfig = {
  key: 'app',
  transforms: [immutableTransform()],
  storage: AsyncStorage,
  version: VER_REDUX,
  // migrate: createMigrate({debug: false}),
  blacklist: ['appUrl', 'linkOpenApp', 'appReady'],
};

const notificationPersistConfig = {
  key: 'notification',
  transforms: [immutableTransform()],
  storage: AsyncStorage,
  version: VER_REDUX,
  // migrate: createMigrate({debug: false}),
  // blacklist: ['appUrl', 'linkOpenApp', 'appReady'],
};

export const rootReducer = combineReducers({
  app: persistReducer(authPersistConfig, appReducer),
  network: networkReducer,
  notification: persistReducer(notificationPersistConfig, notificationReducer),
  ship: shipReducer,
  weather: weatherReducer,
});
