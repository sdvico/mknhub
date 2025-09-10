import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import BootSplash from 'react-native-bootsplash';
import {useSelector} from 'react-redux';
import LoginScreen from '../features/auth/screens/Login';
import {SplashScreen} from '../features/CafePrice/SplashScreen';
import {NotificationDetailScreen} from '../features/Notification/NotificationDetailScreen';
import {NotificationScreen} from '../features/Notification/NotificationScreen';
import ReportScreen from '../features/Report/ReportScreen';
import ReportMapScreen from '../features/Report/ReportMapScreen';
import {ReportFormScreen} from '../features/Report/screens/ReportFormScreen';
import {MapReportFormScreen} from '../features/Report/screens/MapReportFormScreen';
import {PortPickerScreen} from '../features/Report/screens/PortPickerScreen';
import {
  AboutAppScreen,
  DeleteAccountScreen,
  DeviceLogsScreen,
  HelpSupportScreen,
} from '../features/Setting';
import NotificationSettingsScreen from '../features/Setting/settings/NotificationSettingsScreen';
import PrivacyPolicyScreen from '../features/Setting/settings/PrivacyPolicyScreen';
import SecurityPolicyScreen from '../features/Setting/settings/SecurityPolicyScreen';
import {useNotificationPermission} from '../hooks/useNotification';
import {RootStateReducer} from '../store/types';
import RootTab from './authen/tab';
import {APP_SCREEN, RootStackParamList} from './screen-types';
import Register from '../features/auth/screens/Register';

const RootStack = createStackNavigator<RootStackParamList>();

export const RootNavigation = () => {
  const token = useSelector((state: RootStateReducer) => state.app.token);

  useNotificationPermission();

  useEffect(() => {
    BootSplash.hide({fade: true});
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (token) {
          console.info('Initializing app with token:', token);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initializeApp();
  }, [token]);
  const isAuthenticated = !!token;

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.BottomSheetAndroid,
        presentation: 'transparentModal',
      }}>
      <RootStack.Group screenOptions={{presentation: 'card'}}>
        {!isAuthenticated ? (
          // Auth screens
          <>
            <RootStack.Screen
              name={APP_SCREEN.AUTH_LOGIN}
              component={LoginScreen}
            />
            <RootStack.Screen
              name={APP_SCREEN.AUTH_REGISTER}
              component={Register}
            />
          </>
        ) : (
          <RootStack.Screen name={APP_SCREEN.SPLASH} component={SplashScreen} />
          // Main app screens
        )}
        {isAuthenticated ? (
          <RootStack.Screen name={APP_SCREEN.TAB_MAIN} component={RootTab} />
        ) : null}

        <RootStack.Screen
          name={APP_SCREEN.TAB_NOTIFICATION}
          component={NotificationScreen}
        />

        <RootStack.Screen
          name={APP_SCREEN.NOTIFICATION_SETTINGS}
          component={NotificationSettingsScreen}
        />
        <RootStack.Screen
          name={APP_SCREEN.PRIVACY_POLICY}
          component={PrivacyPolicyScreen}
        />
        <RootStack.Screen
          name={APP_SCREEN.SECURITY_POLICY}
          component={SecurityPolicyScreen}
        />
        <RootStack.Screen
          name={APP_SCREEN.HELP_SUPPORT}
          component={HelpSupportScreen}
        />
        <RootStack.Screen
          name={APP_SCREEN.ABOUT_APP}
          component={AboutAppScreen}
        />
        <RootStack.Screen
          name={APP_SCREEN.DELETE_ACCOUNT}
          component={DeleteAccountScreen}
        />
        <RootStack.Screen
          name={APP_SCREEN.DEVICE_LOGS}
          component={DeviceLogsScreen}
        />
        <RootStack.Screen
          name={APP_SCREEN.LIST_REPORT}
          component={ReportScreen}
        />
        <RootStack.Screen
          name={APP_SCREEN.REPORT_MAP_VIEW}
          component={ReportMapScreen}
        />
        <RootStack.Screen
          name={APP_SCREEN.NOTIFICATION_DETAIL}
          component={NotificationDetailScreen}
        />
      </RootStack.Group>

      {/* Modal screens */}
      <RootStack.Group
        screenOptions={{
          presentation: 'modal',
          headerShown: false,
        }}>
        <RootStack.Screen
          name={APP_SCREEN.REPORT_FORM_SCREEN}
          component={ReportFormScreen}
        />
        <RootStack.Screen
          name={APP_SCREEN.MAP_REPORT_FORM_SCREEN}
          component={MapReportFormScreen}
        />
        <RootStack.Screen
          name={APP_SCREEN.PORT_PICKER_SCREEN}
          component={PortPickerScreen}
        />
      </RootStack.Group>
    </RootStack.Navigator>
  );
};
