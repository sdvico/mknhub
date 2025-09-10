/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import { PagingData } from './types';

export const initPagingState = (): PagingData => ({
  ids: [],
  page: 0,
  pages: {},
  hasMore: false,
  loadedToPage: 0,
  refreshing: false,
  loading: false,
  pagingName: '_', //query sellect call // default _
  inverted: false,
});

export interface RequestPagingAdapter<E, T> {
  draft: T | E | any;
  payload: PagingData;
  oldState: T | any;
  data?: any;
}

const PagingAdapter = {
  appendIds: <E, T>(input: RequestPagingAdapter<E, T>): void => {
    const { draft, payload, oldState } = input;

    const { ids = [], pagingName, inverted = false } = payload;

    if (!pagingName) {
      return;
    }

    const oldValue: PagingData = oldState.pagation[pagingName] ?? initPagingState();

    if (inverted) {
      oldValue.ids = [...ids, ...(oldValue?.ids ?? [])];
    } else {
      oldValue.ids = [...(oldValue?.ids ?? []), ...ids];
    }

    draft.pagation[pagingName] = oldValue;
  },

  removeIds: <E, T>(input: RequestPagingAdapter<E, T>): void => {
    const { draft, payload, oldState } = input;
    const { ids, pagingName } = payload;

    if (!pagingName) {
      return;
    }

    const oldValue: PagingData = oldState.pagation[pagingName] ?? initPagingState();
    oldValue.ids = _.without(oldValue.ids, ...ids);
    // console.log('voo--------', oldValue.ids, ids, pagingName);
    draft.pagation[pagingName] = { ...oldValue };
  },

  pagingSuccess: <E, T>(input: RequestPagingAdapter<E, T>): void => {
    const { draft, payload, oldState } = input;

    if (!payload) {
      return;
    }

    let ids: any[] = payload.ids || [];
    const refreshing = payload.refreshing || false;
    const inverted = payload.inverted || false;
    const pagingName = payload.pagingName || '_';

    const { ...otherProps } = payload;

    if (!pagingName) {
      return;
    }

    const oldValue: PagingData = oldState.pagation[pagingName] ?? initPagingState();

    if (payload.page === 1) {
      if (inverted) {
        ids = ids.reverse();
      }
    } else {
      if (inverted && !refreshing) {
        ids = [...ids, ...oldValue?.ids];
      } else {
        ids = [...oldValue?.ids, ...ids];
      }
    }

    const newValue = {
      ...otherProps,
      ids,
      refreshing: false,
      loading: false,
    };

    draft.pagation[pagingName] = newValue;
  },
  patchPaging: <E, T>(input: RequestPagingAdapter<E, T>): void => {
    const { draft, payload, oldState } = input;

    if (!payload) {
      return;
    }
    const pagingName = payload.pagingName || '_';

    if (!pagingName) {
      return;
    }
    if (!oldState.pagation[pagingName]) {
      const newValue: PagingData = {
        ...initPagingState(),
        ...payload,
      };
      draft.pagation[pagingName] = newValue;
    } else {
      const newValue = {
        ...oldState.pagation[pagingName],
        ...payload,
      };
      draft.pagation[pagingName] = newValue;
    }
  },

  addIds: <E, T>(input: RequestPagingAdapter<E, T>): void => {
    const { draft, payload, oldState } = input;

    if (!payload) {
      return;
    }

    const pagingName = payload.pagingName || '_';

    if (!pagingName) {
      return;
    }
    //
    if (oldState.pagation[pagingName]?.ids?.find(item => item === payload.id)) {
      return;
    }
    //
    if (!draft.pagation[pagingName]) {
      draft.pagation[pagingName] = initPagingState();
    }

    draft.pagation[pagingName].ids = [payload.id, ...(oldState.pagation[pagingName]?.ids || [])];
  },
  changeIds: <E, T>(input: RequestPagingAdapter<E, T>): void => {
    const { draft, payload, oldState } = input;

    if (!payload) {
      return;
    }

    const pagingName = payload.pagingName || '_';

    if (!pagingName) {
      return;
    }

    draft.pagation[pagingName].ids = oldState.pagation[pagingName]?.ids.map(id => {
      if (id === payload.old_id) {
        return payload.id;
      } else {
        return id;
      }
    });
  },
};

export default PagingAdapter;
