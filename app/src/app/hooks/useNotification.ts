import notifee, {
  AndroidImportance,
  AndroidStyle,
  EventType,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {useCallback, useEffect} from 'react';
import {Platform} from 'react-native';
import {useDispatch} from 'react-redux';
import Utils from '../library/utils';
import {APP_SCREEN} from '../navigation/screen-types';
import {SET_DEVICE_TOKEN} from '../store/app/redux/constants';
import {NetWorkService} from '../library/networking';
import {fetchNotificationTypes} from '../store/saga/notification.saga';
import {fetchShips} from '../store/saga/ship.saga';

export const useNotificationPermission = () => {
  const requestPermission = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        await messaging().requestPermission();
      } else {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.info('Authorization status:', authStatus);
        }
      }

      await notifee.requestPermission();
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    }
  }, []);

  const createChannel = useCallback(async () => {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });
    console.info('Channel ID:', channelId);
  }, []);

  useEffect(() => {
    const initialize = async () => {
      await requestPermission();
      await createChannel();
    };

    initialize();
  }, [requestPermission, createChannel]);
};

export const useNotification = () => {
  const dispatch = useDispatch();

  const registerPushToken = useCallback(
    async (token: string) => {
      try {
        const deviceData = {
          device_os: Platform.OS,
          push_token: token,
          app_ver: '1.0.0', // TODO: Get from app config
          module: 'main',
        };

        await NetWorkService.Post({
          url: '/api/v1/user-push-tokens/register',
          body: deviceData,
        });

        dispatch({
          type: SET_DEVICE_TOKEN,
          payload: token,
        });
      } catch (error) {
        console.error('Failed to register push token:', error);
      }
    },
    [dispatch],
  );

  const getDeviceToken = useCallback(async () => {
    try {
      const token = await messaging().getToken();
      console.info('Token:', token);
      if (token) {
        await registerPushToken(token);
      }
    } catch (error) {
      console.error('Failed to get device token:', error);
    }
  }, [registerPushToken]);

  // Xử lý notification khi app đang mở
  const handleForegroundMessage = useCallback(async (remoteMessage: any) => {
    try {
      console.info('New FCM message:', remoteMessage);

      let title = 'New Notification';
      let body = 'You have a new message';

      // Try to get notification data from different possible structures
      if (remoteMessage?.notification) {
        title = remoteMessage.notification.title || title;
        body = remoteMessage.notification.body || body;
      } else if (remoteMessage?.data?.notificationData) {
        try {
          const notificationData = JSON.parse(
            remoteMessage.data.notificationData,
          );
          title = notificationData.title || title;
          body = notificationData.body || body;
        } catch (e) {
          console.error('Failed to parse notificationData:', e);
        }
      }

      await notifee.displayNotification({
        id: remoteMessage?.messageId,
        data: remoteMessage.data,
        title: String(title),
        body: String(body),
        ios: {
          sound: 'default',
          badgeCount: 1,
          foregroundPresentationOptions: {
            badge: true,
            sound: true,
            banner: true,
            list: true,
          },
        },
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          smallIcon: 'ic_launcher',
          pressAction: {
            id: 'default',
          },
          style: {
            type: AndroidStyle.BIGTEXT,
            text: String(body),
          },
          actions: [
            {
              title: 'Xem',
              pressAction: {
                id: 'view',
              },
            },
          ],
        },
      });
    } catch (error) {
      console.error('Failed to handle foreground message:', error);
    }
  }, []);

  // Xử lý notification khi app đang mở (notifee)
  const handleNotificationPress = useCallback(() => {
    Utils.navigation.navigate(APP_SCREEN.TAB_NOTIFICATION);

    dispatch(fetchNotificationTypes());
    dispatch(fetchShips());
  }, [dispatch]);

  const handleForegroundEvent = useCallback(
    async ({type}: any) => {
      switch (type) {
        case EventType.DISMISSED:
          break;

        case EventType.PRESS: {
          handleNotificationPress();
          break;
        }
      }
    },
    [handleNotificationPress],
  );

  // Xử lý notification khi app đang mở (messaging)
  const handleNotificationOpenedApp = useCallback(
    (_remoteMessage: any) => {
      handleNotificationPress();
    },
    [handleNotificationPress],
  );

  // Xử lý notification khi app đang background
  const handleBackgroundEvent = useCallback(
    async ({type}: any) => {
      console.log('onBackgroundEvent!');

      switch (type) {
        case EventType.DISMISSED:
          break;
        case EventType.PRESS: {
          handleNotificationPress();
          break;
        }
      }
    },
    [handleNotificationPress],
  );

  useEffect(() => {
    getDeviceToken();
  }, [getDeviceToken]);

  useEffect(() => {
    // Setup messaging listeners
    const unsubscribeMessage = messaging().onMessage(handleForegroundMessage);
    const unsubscribeOpenedApp = messaging().onNotificationOpenedApp(
      handleNotificationOpenedApp,
    );

    // Setup notifee listeners
    const unsubscribeForegroundEvent = notifee.onForegroundEvent(
      handleForegroundEvent,
    );
    const unsubscribeBackgroundEvent = notifee.onBackgroundEvent(
      handleBackgroundEvent,
    );

    return () => {
      unsubscribeMessage();
      unsubscribeOpenedApp();
      unsubscribeForegroundEvent?.();
      unsubscribeBackgroundEvent?.();
    };
  }, [
    handleForegroundMessage,
    handleForegroundEvent,
    handleBackgroundEvent,
    handleNotificationOpenedApp,
  ]);

  return {
    getDeviceToken,
  };
};
