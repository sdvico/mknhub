import {useEffect, useCallback} from 'react';
import {Platform} from 'react-native';
import {PermissionsAndroid} from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

export const useNotificationPermission = () => {
  // Request permission cho notification
  const requestPermission = useCallback(async () => {
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
  }, []);

  // Tạo channel cho Android
  const createChannel = useCallback(async () => {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: notifee.AndroidImportance.HIGH,
      sound: 'default',
    });
    console.info('Channel ID:', channelId);
  }, []);

  // Setup permission và channel
  useEffect(() => {
    const initialize = async () => {
      await requestPermission();
      await createChannel();
    };

    initialize();
  }, [requestPermission, createChannel]);
};
