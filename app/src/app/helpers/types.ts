/* eslint-disable @typescript-eslint/no-explicit-any */

export type EntityObject = {
  [key: string | number]: string;
};

export type ObjectLoading = {
  key: boolean;
};

export type DefaultObject = {
  [key: string | number]: any;
};

export type DefaultObjects = {
  [key: string | number]: DefaultObject;
};

export type DefaultObjectType<Type> = {
  [key: string | number]: Type | any;
};

export type DefaultObjectTypes<Type> = {
  [key: string | number]: DefaultObjectType<Type>;
};

// config paging data all api
export type PagingData = {
  old_id?: number | string;
  id?: number | string;
  ids?: any[];
  page?: number;
  pages?: any;
  hasMore?: boolean;
  loadedToPage?: number;
  refreshing?: boolean;
  loading?: boolean;
  pagingName?: string; //query sellect call // default _
  inverted?: boolean;
  current_page?: number;
  first_page_url?: string;
  last_page_url?: string;
  next_page_url?: string;
  per_page?: string | number;
  prev_page_url?: string;
  total?: number;
};
// config state all reducer
export type reducerState<Type> = {
  entity: DefaultObjectType<Type>;
  pagation: DefaultObjectType<PagingData>;
  setting: DefaultObject;
};
