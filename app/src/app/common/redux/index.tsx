import {store} from '@/app/store/store';
import React, {createRef, forwardRef, memo, useImperativeHandle} from 'react';
import isEqual from 'react-fast-compare';
import {useDispatch} from 'react-redux';
import {RootStateReducer} from '../../store/types';

type ActionBase<T = any> = {
  type: string;
  payload?: T;
  callback?: () => void;
  nextAction?: string;
  checkCurrentTrip?: boolean;
  callbackSuccess?(): void;
};

const RXStoreComponent = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  // const store = useSelector((state: RootStateReducer) => {
  //   // Explicitly naming that we intentionally select full state for the store utility
  //   return state as RootStateReducer;
  // }, Object.is); // Using Object.is to prevent unnecessary rerenders
  useImperativeHandle(
    ref,
    () => ({
      dispatch: (action: ActionBase) => {
        dispatch(action);
      },
      getState: (state: keyof RootStateReducer) => {
        return store.getState()[state];
      },
    }),
    [dispatch],
  );
  return null;
});

type RXStoreType = {
  dispatch: (action: ActionBase) => void;
  getState: <K extends keyof RootStateReducer>(
    selector: K,
  ) => RootStateReducer[K];
};

const storeRef = createRef<RXStoreType>();

export const RXStore = memo(() => <RXStoreComponent ref={storeRef} />, isEqual);

export const dispatch = (action: ActionBase) => {
  if (storeRef.current) {
    storeRef.current.dispatch(action);
  }
};
export function getState<K extends keyof RootStateReducer>(
  selector: K,
): RootStateReducer[K] {
  if (storeRef.current) {
    return storeRef.current.getState(selector);
  }
  return {} as RootStateReducer[K];
}
