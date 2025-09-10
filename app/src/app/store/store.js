import createSagaMiddleware from 'redux-saga';
import {persistStore} from 'redux-persist';

import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
} from 'redux';

import {rootReducer} from './all-reducers';
import {rootSaga} from './root-sagas';
import {createNetworkMiddleware} from 'react-native-offline';

import Reactotron from 'reactotron-react-native';
import {reactotronRedux} from 'reactotron-redux';
import sagaPlugin from 'reactotron-redux-saga';

const networkMiddleware = createNetworkMiddleware({});

let sagaMiddleware = createSagaMiddleware();
// const ENABLE_REACT_TOTRON = false;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const isDev = true;
const configureStore = () => {
  const devMode = __DEV__;

  let enhancer = composeEnhancers(
    applyMiddleware(networkMiddleware, sagaMiddleware),
  );

  if (devMode && isDev) {
    // const hostname = info.hostname;
    const reactotronConfigure = {
      name: 'Soba Mobile',
      port: 9090,
      // host: hostname,
    };

    ReactotronConnect = Reactotron.configure(reactotronConfigure)
      .useReactNative({
        asyncStorage: true, // there are more options to the async storage.
        networking: {
          // optionally, you can turn it off with false.
          ignoreUrls: /symbolicate/,
        },
        editor: false, // there are more options to editor
        errors: {veto: () => false}, // or turn it off with false
        overlay: false, // just turning off overlay
      })
      .use(reactotronRedux())
      .use(sagaPlugin())
      .connect(); // let's connect!
    Reactotron.clear();
    //----
    sagaMiddleware = createSagaMiddleware({
      sagaMonitor: Reactotron.createSagaMonitor(),
    });

    enhancer = composeEnhancers(
      applyMiddleware(networkMiddleware, sagaMiddleware),
      ReactotronConnect.createEnhancer(true),
    );
  }

  if (devMode && isDev) {
    console.warn = Reactotron.warn;
    console.log = Reactotron.logImportant;
    console.info = Reactotron.log;
    console.error = Reactotron.error;
  }

  const store = createStore(rootReducer, enhancer);

  if (devMode && isDev) {
    ReactotronConnect.setReduxStore(store);
  }

  const persistor = persistStore(store, {
    debounce: 100,
  });

  sagaMiddleware.run(rootSaga);

  return {store, persistor};

  // console.log('store---------------', store);
};
//
const {store, persistor} = configureStore();
//
export {store, persistor};

// import {createStore, applyMiddleware, compose} from 'redux';
// import createSagaMiddleware from 'redux-saga';
// import {persistStore} from 'redux-persist';

// import {rootReducer} from './all-reducers';
// import {rootSaga} from './root-sagas';
// import {createNetworkMiddleware} from 'react-native-offline';

// const networkMiddleware = createNetworkMiddleware({});

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const sagaMiddleware = createSagaMiddleware();

// const configureStore = () => {
//   let enhancer = composeEnhancers(
//     applyMiddleware(networkMiddleware, sagaMiddleware),
//   );
//   if (__DEV__) {
//     enhancer = composeEnhancers(
//       applyMiddleware(networkMiddleware, sagaMiddleware),
//     );
//   }

//   const store = createStore(rootReducer, enhancer);
//   //
//   const persistor = persistStore(store, {
//     debounce: 100,
//   });
//   sagaMiddleware.run(rootSaga);

//   return {store, persistor};
// };
// //
// const {store, persistor} = configureStore();
// //
// export {store, persistor};
