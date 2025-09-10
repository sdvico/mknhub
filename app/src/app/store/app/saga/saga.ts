import { R } from '../../../assets/value';
import { checkKeyInObject } from '../../../common';
import { AppModeType, APP_MODE_URL } from '../../../library/networking';
import Actions from '../../../store/app/redux/actions';
import { all, call, put } from '../../../common/typed-redux-saga';
import { loadString } from '../../../library/utils';

export function* onLoadAppModeAndTheme() {
  const { appMode } = yield all({
    appMode: call(loadString, R.strings.APP_MODE),
    appTheme: call(loadString, R.strings.APP_MODE),
    token: call(loadString, R.strings.TOKEN),
  });

  if (typeof appMode === 'string' && checkKeyInObject(APP_MODE_URL, appMode)) {
    yield put(Actions.onSetAppMode({ payload: appMode as AppModeType }));
  }
}
