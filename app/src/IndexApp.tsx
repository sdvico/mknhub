import React, {Suspense, useEffect} from 'react';
import {I18nextProvider} from 'react-i18next';
import {Platform, TextInput, UIManager} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {isIos} from './app/common';
import I18n from './app/library/utils/i18n/i18n';
import {AppContainer} from './app/navigation/app-navigation';

import {persistor, store} from './app/store/store';
import {ColorDefault} from './app/themes/color';
import {prepareAssets} from './app/features/Map/MapView';

const App: React.FC = () => {
  useEffect(() => {
    if (!isIos) {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }

    if (Platform.OS === 'android') {
      prepareAssets();
    }

    // if (isIos) {
    //   KeyboardManager.setEnable(false);
    //   KeyboardManager.setEnableAutoToolbar(false);
    // }

    // Fix TextInput.defaultProps issue by using a safer approach
    if (TextInput) {
      const textInputAny = TextInput as any;

      if (!textInputAny.defaultProps) {
        textInputAny.defaultProps = {};
      }

      textInputAny.defaultProps.color = ColorDefault.text;
    }
  }, []);

  // Notification handling moved to useNotification hook

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <I18nextProvider i18n={I18n}>
              <Suspense fallback={null}>
                <AppContainer />
              </Suspense>
            </I18nextProvider>
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
