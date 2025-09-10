import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState} from '../store';

// Screens
import LoginScreen from '../features/auth/screens/Login';
import RegisterScreen from '../features/auth/screens/Register';
import RootTab from './authen/tab';
import {APP_SCREEN} from './screen-types';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {!isAuthenticated ? (
          // Auth screens
          <>
            <Stack.Screen name={APP_SCREEN.LOGIN} component={LoginScreen} />
            <Stack.Screen
              name={APP_SCREEN.REGISTER}
              component={RegisterScreen}
            />
          </>
        ) : (
          // Main app screens
          <Stack.Screen name={APP_SCREEN.ROOT_TAB} component={RootTab} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
