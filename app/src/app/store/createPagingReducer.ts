/* eslint-disable @typescript-eslint/no-explicit-any */
import EntityAdapter from '../helpers/EntityAdapter';
import PagingAdapter, { initPagingState } from '../helpers/PagingAdapter';
import { PagingData } from '../helpers/types';
import { difference } from 'lodash';
import { normalize } from 'normalizr';
import ConfigEntitySchema from './ConfigEntitySchema';
import {
  ENTITY_DELETE,
  PAGINATION_REFRESH,
  PAGINATION_RESET_ALL,
  PAGINATION_START,
  PAGINATION_SUCCESS,
  PAGINATION_UN_LIST,
} from './constants';

const createPagingListener = (action, draft, oldState, moduleName = '') => {
  if (action.payload?.moduleName === moduleName) {
    switch (action.type) {
      case PAGINATION_RESET_ALL:
        return {};
      case PAGINATION_UN_LIST:
      case ENTITY_DELETE: {
        const { identity } = action.payload;

        Object.keys(draft).forEach(pageId => {
          if (draft.pagation[pageId]?.ids.includes(identity)) {
            draft.pagation[pageId].ids = difference(draft[pageId].ids, [identity]);
            draft.pagation[pageId].dirty = true;
          }
        });
        break;
      }

      case PAGINATION_REFRESH: {
        const pagingId = action.payload?.pagingId;
        const prev: PagingData = initPagingState();
        prev.refreshing = true;
        draft.pagation[pagingId] = prev;

        break;
      }

      case PAGINATION_START: {
        const { pagingId, refreshing = false } = action.payload;

        if (!pagingId) {
          return;
        }

        const prev: PagingData = draft.pagation[pagingId] || initPagingState();

        prev.loading = true;
        prev.refreshing = refreshing;
        draft.pagation[pagingId] = prev;
        break;
      }

      case PAGINATION_SUCCESS: {
        const { pagingId, entityName, response } = action.payload;

        const Schemas = ConfigEntitySchema[entityName];
        const { data: list, ...otherData } = response.data;

        const _data = normalize<Record<string, any>, typeof Schemas>(list || [], Schemas);

        EntityAdapter.updateAllEntity<Record<string, any>, typeof draft>({
          draft,
          entities: _data.entities,
          oldState: oldState,
        });

        const pagingData: PagingData = {
          ...otherData,
          ids: _data.result,
          page: otherData?.current_page,
          pages: {},
          pagingName: pagingId,
          loading: false,
          refreshing: false,
        };

        PagingAdapter.pagingSuccess<Record<string, any>, typeof draft>({
          draft,
          payload: pagingData,
          oldState: oldState,
        });
        break;
      }
    }
  }
};

export default createPagingListener;
