/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CommonActions,
  NavigationContainerRef,
  StackActions,
} from '@react-navigation/native';
import {createRef} from 'react';

import {RootStackParamList} from './screen-types';

export const navigationRef =
  createRef<NavigationContainerRef<RootStackParamList>>();

export function navigate<RouteName extends keyof RootStackParamList>(
  ...arg: undefined extends RootStackParamList[RouteName]
    ?
        | [screen: RouteName]
        | [screen: RouteName, params?: RootStackParamList[RouteName]]
    : [screen: RouteName, params: RootStackParamList[RouteName]]
) {
  navigationRef.current?.navigate(
    arg[0] as any,
    arg.length > 1 ? arg[1] : undefined,
  );
}

export function push<RouteName extends keyof RootStackParamList>(
  ...arg: undefined extends RootStackParamList[RouteName]
    ?
        | [screen: RouteName]
        | [screen: RouteName, params?: RootStackParamList[RouteName]]
    : [screen: RouteName, params: RootStackParamList[RouteName]]
) {
  try {
    navigationRef.current?.dispatch(
      StackActions.push(arg[0] as any, arg.length > 1 ? arg[1] : undefined),
    );
  } catch (error) {
    // alert('lỗi gócreen');
  }
}

export function replace<RouteName extends keyof RootStackParamList>(
  ...arg: undefined extends RootStackParamList[RouteName]
    ?
        | [screen: RouteName]
        | [screen: RouteName, params?: RootStackParamList[RouteName]]
    : [screen: RouteName, params: RootStackParamList[RouteName]]
) {
  try {
    navigationRef.current?.dispatch(
      StackActions.replace(arg[0] as any, arg.length > 1 ? arg[1] : undefined),
    );
  } catch (error) {
    // alert('lỗi gócreen');
  }
}

export function goBack() {
  navigationRef.current?.dispatch(CommonActions.goBack);
}

export function dispatch(actions) {
  navigationRef.current?.dispatch(actions);
}

export function getCurrentRoute() {
  return navigationRef.current?.getCurrentRoute();
}

const NavigationService = {
  goBack,
  navigate,
  navigationRef,
  push,
  replace,
  dispatch,
  getCurrentRoute,
};
export default NavigationService;
