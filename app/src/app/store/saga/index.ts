import { PAGINATION_START } from '../../store/constants';
import { takeEvery } from '../../common/typed-redux-saga';
import { onGetDataQuery } from './saga';

export function* pagingSaga() {
  yield* takeEvery(PAGINATION_START, onGetDataQuery);
}
