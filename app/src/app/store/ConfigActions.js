import { LIMIT_PAGING_SMALL } from '../config/paging';
import { ApiConstants } from '../library/networking';

export const ConfigActions = {
  getStoreSuggest: {
    apiUrl: ApiConstants.LIST_STORE_BY_ACCOUNT,
    apiParams: {
      is_not_personal: 1,
      sort_by: 'random',
      paginate: LIMIT_PAGING_SMALL,
    },
  },
};

export default ConfigActions;
