/**
 * An action with a string type and an associated payload. This is the
 * type of action returned by `createAction()` action creators.
 *
 * @template P The type of the action's payload.
 * @template T the type used for the action type.
 * @template M The type of the action's meta (optional)
 * @template E The type of the action's error (optional)
 *
 * @public
 */

import {compose} from 'redux';
import {AppState} from './app/redux/type';
import {NetworkState} from 'react-native-offline/dist/src/types';

export declare type PayloadInput<P, C> = {
  payload?: P;
  callback?: C;
};

export declare type PayloadAction<T, P = undefined, C = unknown> = {
  type: T;
  payload?: P;
  callback?: C;
};

export declare type PayloadAny = PayloadAction<string, unknown, unknown>;

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

export type RootStateReducer = {
  app: AppState;
  network: NetworkState;
};
