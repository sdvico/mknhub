import {useEffect} from 'react';
import 'react-native-get-random-values';
import {NetWorkService} from '../library/networking/service';
import {PermissionsAndroid, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {useDispatch} from 'react-redux';
import {SET_DEVICE_TOKEN} from '../store/app/redux/constants';
import DeviceInfo from 'react-native-device-info';

export const useNotification = () => {
  const dispatch = useDispatch();
  const requestPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        console.info('Permission granted');
      } else {
        console.info('iOS');
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        await notifee.requestPermission();
        if (enabled) {
          console.info('Authorization status:', authStatus);
        }
      }
    } catch (error) {
      console.info('Error:', error);
    }
  };

  const createChannel = async () => {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,

      sound: 'default',
    });
    console.info('Channel ID:', channelId);
  };

  const registerDeviceToken = async () => {
    requestPermission();
    createChannel();

    const deviceToken = await messaging().getToken();
    console.info('deviceToken:', deviceToken);

    if (deviceToken) {
      dispatch({
        type: SET_DEVICE_TOKEN,
        payload: deviceToken,
      });
    }

    const body = {
      deviceToken: deviceToken,
      platform: Platform.OS,
      deviceName: Platform.Version,
      deviceModel: DeviceInfo.getModel(),
      osVersion: DeviceInfo.getVersion(),
      appVersion: DeviceInfo.getVersion(),
      notificationEnabled: true,
    };

    const res = await NetWorkService.Post({
      url: '/api/devices',
      body,
    });

    messaging().subscribeToTopic('system');

    console.log('res---device', res);
  };

  useEffect(() => {
    registerDeviceToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
