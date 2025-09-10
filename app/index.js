/**
 * @format
 */
import {AppRegistry} from 'react-native';
import 'react-native-gesture-handler';

import notifee, {
  AndroidImportance,
  AndroidStyle,
  EventType,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {name as appName} from './app.json';
import AppCore from './src/IndexApp';
import * as Sentry from '@sentry/react-native';

// Register background handler
console.warn('Registering background handler');

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!');

  console.log('Message handled in the background!', remoteMessage);
  const title = remoteMessage?.notification?.title || 'New Notification';
  const body = remoteMessage?.notification?.body || 'You have a new message';

  await notifee.displayNotification({
    data: remoteMessage.data,
    title,
    body,
    android: {
      channelId: 'default',
      importance: AndroidImportance.HIGH,
      smallIcon: 'ic_launcher',
      pressAction: {
        id: 'default',
      },
      style: {
        type: AndroidStyle.BIGTEXT,
        text: body,
      },
    },
  });
});

// Set background event handler for notifee
notifee.onBackgroundEvent(async ({type, detail}) => {
  console.log('onBackgroundEvent!');

  switch (type) {
    case EventType.DISMISSED:
      console.warn('User dismissed notification', detail.notification);
      break;
    case EventType.PRESS: {
      console.log('User pressed notification idex.js', detail.notification);
      // Utils.navigation.push(APP_SCREEN.NOTIFICATION_LIST);
      break;
    }
  }
});

// Sentry.init({
//   dsn: 'https://36518c81392a0ce146e201edbfcfb6ca@o4506114523529216.ingest.us.sentry.io/4509836182683648',

//   // Adds more context data to events (IP address, cookies, user, etc.)
//   // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
//   sendDefaultPii: true,

//   // Configure Session Replay
//   replaysSessionSampleRate: 0.1,
//   replaysOnErrorSampleRate: 1,
//   integrations: [
//     Sentry.mobileReplayIntegration(),
//     Sentry.feedbackIntegration(),
//   ],

//   // uncomment the line below to enable Spotlight (https://spotlightjs.com)
//   // spotlight: __DEV__,
// });

AppRegistry.registerComponent(appName, () => Sentry.wrap(AppCore));
