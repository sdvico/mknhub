import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect} from 'react';

import {AccountSettingScreen} from '@/app/features/Setting';
import {fetchNotificationTypes} from '@/app/store/saga/notification.saga';
import {fetchShips} from '@/app/store/saga/ship.saga';
import {useDispatch} from 'react-redux';
import {useNotification} from '@/app/hooks/useNotification';
import FeedbackScreen from '../../features/Feedback/FeedbackScreen';
import {FishingGroundScreen} from '../../features/FishingGround/FishingGroundScreen';
import {TrackingScreen} from '../../features/Tracking/TrackingScreen';
import {WeatherScreen} from '../../features/Weather/WeatherScreen';
import {APP_SCREEN} from '../screen-types';
import {TabBottomLayout} from './TabBottomLayout';

const Tab = createBottomTabNavigator();

const RootTab = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchNotificationTypes());
    dispatch(fetchShips());
  }, [dispatch]);

  // Setup notification handling after login
  useNotification();

  return (
    <Tab.Navigator
      initialRouteName={APP_SCREEN.TAB_TRACKING}
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <TabBottomLayout {...props} />}>
      <Tab.Screen
        name={APP_SCREEN.TAB_FISHING_GROUND}
        component={FishingGroundScreen}
      />
      <Tab.Screen name={APP_SCREEN.TAB_WEATHER} component={WeatherScreen} />

      <Tab.Screen name={APP_SCREEN.TAB_TRACKING} component={TrackingScreen} />

      <Tab.Screen name={APP_SCREEN.TAB_FEEDBACK} component={FeedbackScreen} />
      <Tab.Screen
        name={APP_SCREEN.TAB_ACCOUNT}
        component={AccountSettingScreen}
      />
    </Tab.Navigator>
  );
};

export default RootTab;
