/* eslint-disable @typescript-eslint/no-explicit-any */
import {Alert, Platform} from 'react-native';
import {
  PERMISSIONS,
  Permission,
  request,
  check,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

type Result = 'unavailable' | 'denied' | 'blocked' | 'granted' | 'limited';

export async function useCameraPermission() {
  const status = await request(
    Platform.select<any>({
      android: PERMISSIONS.ANDROID.CAMERA,
      ios: PERMISSIONS.IOS.CAMERA,
    }),
  );
  return status;
}
export async function useMediaPermission() {
  const statusRead = await request(
    Platform.select<any>({
      android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.MEDIA_LIBRARY,
    }),
  );
  const statusWrite = await request(
    Platform.select<any>({
      android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.MEDIA_LIBRARY,
    }),
  );
  return {statusRead, statusWrite};
}
export async function useLocationPermission() {
  const status = await request(
    Platform.select<any>({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    }),
  );
  return status;
}

export const checkLocationPermission = async () => {
  const result = await check(
    Platform.select<any>({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    }),
  );

  if (result === RESULTS.GRANTED) {
    return true;
  }

  if (result === RESULTS.UNAVAILABLE) {
    Alert.alert('Chức năng này không khả dụng trên thiết bị này');
    return false;
  }

  if (result === RESULTS.DENIED) {
    Alert.alert('Bạn chưa cấp quyền truy cập vị trí');

    let resultRequest = await request(
      Platform.select<any>({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      }),
    );

    if (resultRequest === RESULTS.GRANTED) {
      return true;
    } else {
      return checkLocationPermission();
    }
  }

  if (result === RESULTS.BLOCKED) {
    Alert.alert(
      'Quyền vị trí bị chặn',
      'Vui lòng mở Cài đặt và cấp lại quyền truy cập vị trí để ứng dụng hoạt động đúng.',
      [{text: 'Hủy'}, {text: 'Mở Cài đặt', onPress: () => openSettings()}],
    );
    return false;
  }
  return true;
};

export const checkPermission = (
  permission: Permission,
  onUnAvailable?: () => void,
  onDenied?: () => void,
  onGranted?: () => void,
  onBlocked?: () => void,
) => {
  check(permission).then((result: Result) => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        /*
       This feature is not available (on this device / in this context)
       */
        onUnAvailable && onUnAvailable();
        break;
      case RESULTS.DENIED:
        /*
       The permission has not been requested / is denied but requestable
       */
        onDenied && onDenied();
        break;
      case RESULTS.GRANTED:
        /*
      The permission is granted
       */
        onGranted && onGranted();
        break;
      case RESULTS.BLOCKED:
        /*
      The permission is denied and not requestable anymore
       */
        onBlocked && onBlocked();
        break;
    }
  });
};
