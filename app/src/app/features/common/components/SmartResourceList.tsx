/* eslint-disable @typescript-eslint/no-explicit-any */
import { Divider } from '../../../library/components';
import { VirtualizedListView } from '../../../library/components/virtualizedList';
import ConfigActions from '../../../store/ConfigActions';
import ConfigViews from '../../../store/ConfigViews';
import { PAGINATION_START } from '../../../store/constants';
import { RootStateReducer } from '../../../store/types';
import { ColorDefault } from '../../../themes/color';
import Utils from '../../../library/utils';
import { get } from 'lodash';
import { stringify } from 'querystring';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { View, VirtualizedListProps } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import compactDataSource from './compactDataSource';

type Props = VirtualizedListProps<any> & {
  pagingId?: string;
  query?: Record<string, any>;
  condition?: Record<string, any>;
  moduleName?: string;
  entityName?: string;
  actionConfigName?: string;
  checkLogin?: boolean;
  enableScroll?: boolean;
  itemView?: string;
  useMap?: boolean;
  renderItem?: (props) => React.ReactElement;
  itemProps?: Record<string, any>;
  renderSeeMore?: () => React.ReactElement;
};
const SmartList = (props: Props) => {
  const {
    pagingId: padingStatic,
    entityName,
    actionConfigName,
    query,
    condition = {},
    moduleName,
    scrollEnabled = true,
    renderItem,
    itemView,
    // useMap,
    itemProps = {},
    // renderSeeMore,
    ...otherProps
  } = props;

  const { apiUrl, apiParams } = React.useMemo(() => {
    const dataSource = get(ConfigActions, actionConfigName ?? '');

    const { lat, lng, radius, ...otherCondition } = condition || {};

    let location = {};

    if (lat && lng && radius) {
      location = { ...Utils.regionToBoundingBox(lng, lat, radius) };
    }
    return compactDataSource(dataSource, {
      ...query,
      ...(otherCondition || {}),
      ...location,
    });
  }, [condition, query, actionConfigName]);

  const pagingId = React.useMemo(() => {
    const _apiParams = stringify(apiParams || '') ? `?${stringify(apiParams || '')}` : '';

    return padingStatic || `${apiUrl}${_apiParams}`.split?.('.').join?.('');
  }, [padingStatic, apiParams, apiUrl]);

  const dispatch = useDispatch();

  const pagation = useSelector((state: RootStateReducer) => get(state, `${moduleName}.pagation.${pagingId}`));

  const { loading = true, refreshing = false } = pagation ?? {};

  const onRefresh = () => { };

  const handleGetData = React.useCallback(
    (page, _refreshing) => {
      dispatch({
        type: PAGINATION_START,
        payload: {
          apiUrl,
          apiParams: {
            ...apiParams,
            page,
          },
          refreshing: _refreshing,
          pagingId,
          moduleName,
          entityName,
        },
      });
    },
    [apiParams, apiUrl, dispatch, entityName, moduleName, pagingId],
  );

  React.useEffect(() => {
    handleGetData(1, true);
  }, [handleGetData, pagingId]);

  const onLoadMore = () => {
    if (
      pagation &&
      !!pagation.ids?.length &&
      !!pagation?.total &&
      pagation.ids?.length < pagation?.total &&
      !!pagation?.page &&
      !loading
    ) {
      handleGetData(pagation?.page + 1, false);
    }
  };

  const _renderItem = React.useCallback(
    ({ item }) => {
      return React.createElement(ConfigViews[itemView ?? ''], {
        ...itemProps,
        id: item,
        key: item,
        pagingName: pagingId,
      });
    },
    [itemProps, itemView, pagingId],
  );

  return (
    <VirtualizedListView
      scrollEnabled={scrollEnabled}
      {...otherProps}
      onRefresh={onRefresh}
      renderItem={itemView ? _renderItem : renderItem}
      refreshing={refreshing}
      showsVerticalScrollIndicator={false}
      data={refreshing ? [1, 2, 3, 4, 5] : pagation?.ids || []}
      ItemSeparatorComponent={() => (
        <View style={{ paddingHorizontal: Utils.PaddingSize.size16 }}>
          <Divider height={1} color={ColorDefault.grey200} />
        </View>
      )}
      keyExtractor={Utils.keyExtractor}
      canLoadMore={true}
      onLoadMore={onLoadMore}
    />
  );
};

export const SmartResourceList = memo(SmartList, isEqual);
