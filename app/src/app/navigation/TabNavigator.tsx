import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import {RootState} from '../store';

// Screens
import FishingGroundScreen from '../features/FishingGround/FishingGroundScreen';
import TrackingScreen from '../features/Tracking/TrackingScreen';
import NotificationScreen from '../features/Notification/NotificationScreen';
import FeedbackScreen from '../features/Feedback/FeedbackScreen';
import AccountScreen from '../features/Account/AccountScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: '#2380ec',
        tabBarInactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="FishingGround"
        component={FishingGroundScreen}
        options={{
          title: 'Ngư trường',
          headerTitle: 'Ngư trường',
        }}
      />
      <Tab.Screen
        name="Tracking"
        component={TrackingScreen}
        options={{
          title: 'Tracking',
          headerTitle: 'Tracking',
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          title: 'Thông báo',
          headerTitle: 'Thông báo',
        }}
      />
      <Tab.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={{
          title: 'Phản ánh',
          headerTitle: 'Phản ánh',
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          title: 'Tài khoản',
          headerTitle: 'Tài khoản',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
