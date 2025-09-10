import {ShipSelector} from '@/app/components/ShipSelector';
import {StatusBadge} from '@/app/components/StatusBadge';
import {useInfiniteList} from '@/app/hooks/useInfiniteList';
import {Divider, Text} from '@/app/library/components';
import Utils from '@/app/library/utils';
import {APP_SCREEN} from '@/app/navigation/screen-types';
import {RootStateReducer} from '@/app/store/types';
import {ColorDefault} from '@/app/themes/color';
import React, {useMemo, useState} from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {Notification} from './types';
import HeaderBasic from '../common/components/header/header-basic';
import NotificationHtmlMessage, {
  NotificationTitle,
} from './components/NotificationHtmlMessage';
import {useScreenRefocus} from '../CafePrice/hooks/useScreenRefocus';
import {dispatch} from '@/app/common';
import {fetchNotificationTypes} from '@/app/store/saga/notification.saga';
import {useNotificationForm} from '@/app/hooks/useNotificationForm';

export const CheckHasReportView = ({notification}) => {
  const {hasForm} = useNotificationForm(notification.type);
  if (hasForm) {
    return (
      <StatusBadge
        type={notification.report ? 'success' : 'normal'}
        value={notification.report ? 'Đã khai báo' : 'Chưa khai báo'}
      />
    );
  }
  return <View />;
};

const NotificationList: React.FC<{type: string; shipCode?: string}> = ({
  type,
  shipCode,
}) => {
  const typesMap = useSelector(
    (state: RootStateReducer) => state.notification.typesMap,
  );

  const {ships} = useSelector((state: any) => state.ship) || {ships: []};
  const shipList = ships;
  const selectedShip = shipList?.find(ship => ship.id === shipCode);

  const params = useMemo(() => {
    return {
      ...(type !== 'all' && {type}),
      ship_code: !selectedShip ? '' : selectedShip?.plate_number || '',
    };
  }, [selectedShip, type]);

  const paramsStringKey = useMemo(
    () => Object.values(params).join('&'),
    [params],
  );

  const {data, loading, refreshing, loadMore, refresh} =
    useInfiniteList<Notification>({
      url: '/api/v1/ship-notifications/list',
      params: params,
      paramsStringKey: paramsStringKey,
    });

  useScreenRefocus(() => {
    dispatch(fetchNotificationTypes());
    refresh();
  });

  const renderItem = ({item}: {item: Notification}) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        {
          backgroundColor: item?.is_viewed
            ? ColorDefault.white
            : ColorDefault.background_orange200,
        },
      ]}
      onPress={() => {
        Utils.navigation.push(APP_SCREEN.NOTIFICATION_DETAIL, {
          notification: item,
        });
      }}>
      <View style={styles.notificationHeader}>
        <NotificationTitle notification={item} />
        <Text style={styles.notificationTime}>
          {new Date(item.occurred_at).toLocaleString('vi-VN')}
        </Text>
      </View>
      <View style={styles.shipContainer}>
        <Text style={styles.ship}>{item.ship_code}</Text>
      </View>
      {/* <Text style={styles.notificationMessage} numberOfLines={2}>
        {item.formatted_message || item.content}
      </Text> */}
      <NotificationHtmlMessage notification={item} />
      <Divider style={{marginVertical: 8}} />
      <View style={styles.footerContainer}>
        <StatusBadge
          type="MKN"
          value={typesMap[item.type] || item.type}
          style={styles.mknBadge}
        />
        <CheckHasReportView notification={item} />
        {/* <StatusBadge
          type={item.report ? 'success' : 'normal'}
          value={item.report ? 'Đã khai báo' : 'Chưa khai báo'}
        /> */}
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loading) {
      return null;
    }
    // return (
    //   <View style={styles.loaderFooter}>
    //     <ActivityIndicator size="small" color={ColorDefault.primary} />
    //   </View>
    // );
  };

  const renderEmpty = () => {
    if (loading) {
      return null;
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không có thông báo nào</Text>
      </View>
    );
  };

  return (
    <View style={styles.tabContent}>
      <FlatList
        data={data || []}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onRefresh={refresh}
        refreshing={refreshing}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export const NotificationScreen = () => {
  const insets = useSafeAreaInsets();
  const notificationTypesState = useSelector(
    (state: RootStateReducer) => state.notification?.notificationTypes,
  );
  const [selectedShipId, setSelectedShipId] = useState<string>();

  const notificationTypes = [...notificationTypesState];

  const [ships, _setShips] = useState<{id: string; name: string}[]>([
    {id: 'ship1', name: 'Tàu 1'},
    {id: 'ship2', name: 'Tàu 2'},
  ]);

  const [selectedType, setSelectedType] = useState('all');

  return (
    <View style={[styles.container]}>
      <HeaderBasic title="Thông báo" isBackButton={true} />
      <View>
        <ScrollView
          horizontal
          contentContainerStyle={{
            gap: 16,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
          showsHorizontalScrollIndicator={false}>
          {notificationTypes.map(type => (
            <Pressable
              key={type.code}
              onPress={() => setSelectedType(type.code)}
              style={[
                styles.typeButton,
                selectedType === type.code && styles.selectedTypeButton,
              ]}>
              <Icon
                name={type.icon || 'apps-outline'}
                size={20}
                color={`${type.color || ColorDefault.error}`}
              />
              <Text
                style={[
                  styles.typeText,
                  selectedType === type.code && styles.selectedTypeText,
                ]}>
                {type.name} {type.unread_count ? `(${type.unread_count})` : ''}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <ShipSelector
        selectedShipId={selectedShipId}
        onSelectShip={setSelectedShipId}
        ships={ships}
      />
      <View style={{flex: 1}}>
        <NotificationList type={selectedType} shipCode={selectedShipId} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorDefault.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeScrollView: {
    borderBottomWidth: 1,
    borderBottomColor: ColorDefault.grey200,
  },
  typeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: ColorDefault.grey300,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTypeButton: {
    backgroundColor: ColorDefault.primary,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: ColorDefault.grey600,
  },
  selectedTypeText: {
    color: ColorDefault.white,
  },
  tabContent: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  notificationItem: {
    backgroundColor: ColorDefault.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ColorDefault.grey200,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorDefault.grey800,
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    color: ColorDefault.grey600,
    marginLeft: 8,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  shipLabel: {
    fontSize: 14,
    color: ColorDefault.grey600,
    marginRight: 8,
  },
  ship: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorDefault.facebook_blue,
    marginRight: 8,
  },
  mknBadge: {
    marginRight: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: ColorDefault.grey600,
    lineHeight: 20,
    paddingVertical: 8,
  },
  loaderFooter: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: ColorDefault.grey600,
  },
});
