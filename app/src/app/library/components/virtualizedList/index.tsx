import React, { memo, useCallback } from 'react';
import { RefreshControl, View, VirtualizedList } from 'react-native';
import equals from 'react-fast-compare';

import { VirtualizedListProps } from './type';

const VirtualizedListComponent = React.forwardRef(
  (
    props: VirtualizedListProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<VirtualizedList<any>>,
  ) => {
    // state
    const {
      onLoadMore,
      onRefresh,
      canRefresh = true,
      canLoadMore = false,
      refreshing = false,
      topComponent,
      bottomComponent,
      containerBodyStyle,
      data,
      ...otherProps
    } = props;

    // function
    const loadMore = useCallback(() => {
      if (canLoadMore && onLoadMore && typeof onLoadMore === 'function') {
        onLoadMore();
      }
    }, [canLoadMore, onLoadMore]);

    const getItemCount = () => {
      return data?.length || 0;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getItem = (_data: Array<any>, index: number) => {
      return _data[index];
    };

    // render
    return (
      <View style={[{ flex: 1 }, containerBodyStyle]}>
        {topComponent}
        <VirtualizedList
          showsVerticalScrollIndicator={false}
          ref={ref}
          data={data}
          refreshControl={canRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined}
          onEndReached={loadMore}
          getItemCount={getItemCount}
          getItem={getItem}
          onEndReachedThreshold={0.5}
          {...otherProps}
          onRefresh={undefined}
          refreshing={undefined}
        />
        {bottomComponent}
      </View>
    );
  },
);

export const VirtualizedListView = memo(VirtualizedListComponent, equals);
