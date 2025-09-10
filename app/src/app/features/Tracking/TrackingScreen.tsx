// import {images} from '@/app/assets/image';
import {StatusBadge} from '@/app/components/StatusBadge';
import {toDMS} from '@/app/features/Report/forrm/LocationInpuNomal';
import {useInfiniteList} from '@/app/hooks/useInfiniteList';
import {Divider, Text} from '@/app/library/components';
import Utils from '@/app/library/utils';
import {APP_SCREEN} from '@/app/navigation/screen-types';
import {fetchNotificationTypes} from '@/app/store/saga/notification.saga';
import {fetchShips} from '@/app/store/saga/ship.saga';
import {ColorDefault} from '@/app/themes/color';
import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  // ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {useScreenRefocus} from '../CafePrice/hooks/useScreenRefocus';
import NotificationHtmlMessage, {
  NotificationTitle,
} from '../Notification/components/NotificationHtmlMessage';
import {Notification} from '../Notification/types';
import {Ship, ShipStatus} from './types';
import {RootStateReducer} from '@/app/store/types';
import {CheckHasReportView} from '../Notification/NotificationScreen';
import {useToastAlert} from '@/app/components/ToastAlertContext';
import {NetWorkService} from '@/app/library/networking';
import {useNavigation} from '@react-navigation/core';

export const TrackingScreen = () => {
  const user = useSelector((state: any) => state.app.profile.user);
  const typesMap = useSelector(
    (state: any) => state.notification?.typesMap || {},
  );
  const total_unread =
    useSelector((state: any) => state.notification?.total_unread) || 0;

  const {ships, loading} = useSelector((state: any) => state.ship) || {
    ships: [],
    loading: false,
  };

  const notificationTypesState = useSelector(
    (state: RootStateReducer) => state.notification?.notificationTypes,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchShips());
  }, [dispatch]);

  const refresh = () => {
    dispatch(fetchShips());
  };

  const getStatusText = (status: ShipStatus) => {
    switch (status) {
      case ShipStatus.ACTIVE:
        return 'Đang hoạt động';
      case ShipStatus.INACTIVE:
        return 'Không hoạt động';
      case ShipStatus.CONNECTED:
        return 'Đã kết nối';
      case ShipStatus.DISCONNECTED:
        return 'Chưa kết nối';
      case ShipStatus.POSITION_DECLARED:
        return 'Đã khai báo vị trí';
      default:
        return 'Không xác định';
    }
  };

  const getStatusType = (status: ShipStatus) => {
    switch (status) {
      case ShipStatus.ACTIVE:
        return 'success';
      case ShipStatus.INACTIVE:
        return 'error';
      case ShipStatus.CONNECTED:
        return 'success';
      case ShipStatus.DISCONNECTED:
        return 'error';
      case ShipStatus.POSITION_DECLARED:
        return 'warning';
      default:
        return 'info';
    }
  };

  useScreenRefocus(() => {
    dispatch(fetchNotificationTypes());
    dispatch(fetchShips());
  });

  const renderTrackingItem = ({item}: {item: Ship}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          Utils.navigation.push(APP_SCREEN.LIST_REPORT, {
            ship: item,
          });
        }}
        style={styles.trackingItem}>
        <View style={styles.trackingHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.shipName}>
              {item.name || item.plate_number}
            </Text>
          </View>

          <StatusBadge
            type={getStatusType(item.status)}
            value={getStatusText(item.status)}
          />
        </View>
        {item.lastReport && (
          <View style={styles.infoSection}>
            <View style={styles.messageHeaderRow}>
              <Text style={styles.infoLabel}>Lần khai báo gần nhất</Text>
              <StatusBadge
                type={'success'}
                value={item.lastReport?.source || 'KXD'}
              />
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Vị trí</Text>
                <Text style={styles.infoValue}>
                  {toDMS(item.lastReport.lat || 0, true)}
                  {'\n'}
                  {toDMS(item.lastReport.lng || 0, false)}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Thời gian</Text>
                <Text style={styles.infoValue}>
                  {new Date(item.lastReport.reported_at).toLocaleString(
                    'vi-VN',
                  )}
                </Text>
              </View>
            </View>
            {!!item.lastReport.port_code && (
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Cảng</Text>
                  <Text style={styles.infoValue}>
                    {item.lastReport.port_code}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
        <View style={styles.messageSection}>
          {item.lastmessage ? (
            <View style={styles.messageHeaderRow}>
              <Text style={styles.infoValue}>
                {item.lastmessage?.type
                  ? typesMap && item.lastmessage.type
                    ? typesMap[item.lastmessage.type] || item.lastmessage.type
                    : item.lastmessage.type
                  : '—'}
              </Text>
              {item.lastmessage?.report !== undefined && (
                <StatusBadge
                  type={item.lastmessage.report ? 'success' : 'normal'}
                  value={
                    item.lastmessage.report ? 'Đã khai báo' : 'Chưa khai báo'
                  }
                />
              )}
            </View>
          ) : (
            <Text style={styles.infoValue}>{'Chưa có thông báo'}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loading) {
      return null;
    }
    return (
      <View style={styles.loaderFooter}>
        <ActivityIndicator size="small" color={ColorDefault.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return null;
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không có dữ liệu theo dõi</Text>
      </View>
    );
  };

  //
  const IconRN: any = Icon;

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeftMenu}>
        <TouchableOpacity
          onPress={() => Utils.navigation.push(APP_SCREEN.TAB_ACCOUNT)}
          style={styles.avatarContainer}>
          <View style={styles.avatarMenu}>
            <IconRN name="person" size={40} color="#007AFF" />
          </View>
        </TouchableOpacity>
        <View>
          <Text style={styles.welcomeText}>Xin chào,</Text>
          <Text style={styles.userName}>{user?.username || 'Ngư dân'}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={() => Utils.navigation.navigate(APP_SCREEN.TAB_NOTIFICATION)}>
        <IconRN
          name="notifications-outline"
          size={24}
          color={ColorDefault.grey800}
        />
        {total_unread > 0 ? (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>{total_unread || 0}</Text>
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );

  const {showAlert, popToast} = useToastAlert();

  const handleSubmitReport = async (reportData: any) => {
    try {
      if (!reportData.reporter_ship_id) {
        return showAlert({
          message: 'Vui lòng khai báo tàu của bạn',
          buttonText: 'OK',
          onClose: () => {},
        });
      }

      if (reportData.isRequrePort && !reportData.port) {
        return showAlert({
          message: 'Vui lòng khai báo cảng',
          buttonText: 'OK',
          onClose: () => {},
        });
      }

      const body = {
        ...reportData,
        port_code: reportData?.port?.code,
        reporter_user_id: user?.id,
        source: 'app',
      };

      const response = await NetWorkService.Post({
        url: '/api/reports',
        body: body,
      });

      console.log('response', response);
      if (response.code === 200) {
        popToast({
          message: 'Thực hiện thành công',
          iconName: 'success',
          iconColor: ColorDefault.active,
          textColor: ColorDefault.active,
        });
        // Navigation will be handled by the modal screen
      }
      // TODO: Handle success (show toast, refresh notification list, etc.)
    } catch (error) {
      console.error('Error submitting report:', error);
      // TODO: Handle error (show error toast)
    }
  };

  const navigation = useNavigation();

  const handleOpenMap = () => {
    (navigation as any).navigate(APP_SCREEN.MAP_REPORT_FORM_SCREEN, {
      notification: undefined,
      onSubmit: handleSubmitReport,
    });
  };

  const handleOpenReportForm = () => {
    (navigation as any).navigate(APP_SCREEN.REPORT_FORM_SCREEN, {
      notification: undefined,
      onSubmit: data => {
        handleSubmitReport({
          ...data,
          isRequrePort: true,
        });
      },
    });
  };

  // Removed banner (not used in new Home layout)

  // Quick menu 4 blocks
  const renderQuickMenu = () => (
    <View style={styles.menuGrid}>
      <TouchableOpacity
        style={[
          styles.menuItem,
          selectedTab === 'notifications' && styles.tabButtonActive,
        ]}
        onPress={() => setSelectedTab('notifications')}>
        <View>
          <IconRN
            name="notifications-outline"
            size={22}
            color={
              selectedTab === 'notifications'
                ? ColorDefault.white
                : ColorDefault.facebook_blue
            }
          />
          {total_unread > 0 ? (
            <View style={[styles.notificationBadge, {top: -10, right: -10}]}>
              <Text style={styles.notificationCount}>{total_unread || 0}</Text>
            </View>
          ) : null}
        </View>

        <Text
          style={[
            styles.menuText,
            selectedTab === 'notifications' && styles.menuTextActive,
          ]}>
          Thông báo
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.menuItem,
          selectedTab === 'ships' && styles.tabButtonActive,
        ]}
        onPress={() => setSelectedTab('ships')}>
        <IconRN
          name="boat-outline"
          size={22}
          color={
            selectedTab === 'ships'
              ? ColorDefault.white
              : ColorDefault.facebook_blue
          }
        />
        <Text
          style={[
            styles.menuText,
            selectedTab === 'ships' && styles.menuTextActive,
          ]}>
          Thông tin tàu
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() =>
          Utils.navigation.push(APP_SCREEN.LIST_REPORT, {ship: ships?.[0]})
        }>
        <IconRN
          name="document-text-outline"
          size={22}
          color={ColorDefault.facebook_blue}
        />
        <Text style={styles.menuText}>Lịch sử khai báo</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleOpenMap} style={styles.menuItem}>
        <IconRN name="location" size={22} color={ColorDefault.facebook_blue} />
        <Text style={styles.menuText}>Khai báo vị trí</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleOpenReportForm} style={styles.menuItem}>
        <IconRN
          name="document-text"
          size={22}
          color={ColorDefault.facebook_blue}
        />
        <Text style={styles.menuText}>Khai báo cập cảng</Text>
      </TouchableOpacity>
    </View>
  );

  // Tabs state
  const [selectedTab, setSelectedTab] = React.useState<
    'notifications' | 'ships'
  >('notifications');

  // Notifications list for Home
  const {
    data: notiData,
    refreshing: refreshingNoti,
    loadMore: loadMoreNoti,
    refresh: refreshNoti,
  } = useInfiniteList<Notification>({
    url: '/api/v1/ship-notifications/list',
    params: {},
    paramsStringKey: 'home',
  });

  const renderNotificationItem = ({item}: {item: Notification}) => (
    <TouchableOpacity
      style={styles.notificationItem}
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

      <NotificationHtmlMessage notification={item} />
      <Divider style={styles.divider} />
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
  const inssets = useSafeAreaInsets();

  const isLoading = notificationTypesState.length <= 0;

  return (
    <View style={[styles.container, {paddingTop: inssets.top}]}>
      {renderHeader()}
      {selectedTab === 'notifications' ? (
        <FlatList
          data={isLoading ? [] : notiData || []}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          onRefresh={refreshNoti}
          refreshing={refreshingNoti}
          onEndReached={loadMoreNoti}
          onEndReachedThreshold={0.5}
          contentContainerStyle={[
            styles.listContent,
            !notiData?.length && styles.emptyList,
          ]}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          ListHeaderComponent={renderQuickMenu}
        />
      ) : (
        <FlatList
          data={ships}
          renderItem={renderTrackingItem}
          keyExtractor={item => item.id}
          onRefresh={refresh}
          refreshing={loading}
          contentContainerStyle={[
            styles.listContent,
            !ships?.length && styles.emptyList,
          ]}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          ListHeaderComponent={renderQuickMenu}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarMenu: {
    width: 50,
    height: 50,
    borderRadius: 35,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: ColorDefault.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    // backgroundColor: ColorDefault.white,
    borderBottomWidth: 1,
    borderBottomColor: ColorDefault.grey200,
  },
  headerLeftMenu: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  welcomeText: {
    fontSize: 12,
    color: ColorDefault.grey600,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorDefault.grey800,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: ColorDefault.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: ColorDefault.white,
    fontSize: 12,
    fontWeight: '600',
  },
  banner: {
    height: 180,
    // marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerImage: {
    borderRadius: 12,
  },
  bannerContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ColorDefault.white,
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: ColorDefault.white,
    fontWeight: 'bold',
    marginBottom: 8,
    opacity: 0.9,
  },
  bannerStatus: {
    fontSize: 15,
    color: ColorDefault.white,
  },
  menuGrid: {
    paddingBottom: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  menuItem: {
    flexGrow: 1,
    flexBasis: '48%',
    backgroundColor: ColorDefault.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ColorDefault.grey200,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 6,
  },
  menuIcon: {fontSize: 20},
  menuIconActive: {fontSize: 20, color: ColorDefault.white},
  menuText: {fontSize: 14, fontWeight: '600', color: ColorDefault.grey800},
  menuTextActive: {color: ColorDefault.white},
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: ColorDefault.grey800,
    marginHorizontal: 16,
    paddingVertical: 16,
  },
  tabSwitch: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ColorDefault.grey300,
    alignItems: 'center',
    backgroundColor: ColorDefault.white,
  },
  tabButtonActive: {
    backgroundColor: ColorDefault.primary,
    borderColor: ColorDefault.primary,
  },
  tabText: {fontSize: 14, fontWeight: '600', color: ColorDefault.grey800},
  tabTextActive: {color: ColorDefault.white},
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: ColorDefault.grey600,
  },
  loaderFooter: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  trackingItem: {
    backgroundColor: ColorDefault.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ColorDefault.grey200,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  trackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  shipName: {
    fontSize: 18,
    fontWeight: '600',
    color: ColorDefault.facebook_blue,
    marginBottom: 4,
  },
  plateNumber: {
    fontSize: 14,
    color: ColorDefault.grey600,
  },
  infoSection: {
    backgroundColor: ColorDefault.grey100,
    borderRadius: 8,
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 15,
    color: ColorDefault.grey600,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: ColorDefault.grey800,
    fontWeight: '500',
  },
  messageSection: {
    backgroundColor: ColorDefault.grey200,
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 8,
    padding: 8,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  messageHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  messageContent: {
    fontSize: 14,
    color: ColorDefault.grey800,
    lineHeight: 20,
  },
  typeBadge: {
    marginRight: 4,
  },
  // Notification list styles (shared from NotificationScreen)
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
  notificationTime: {
    fontSize: 12,
    color: ColorDefault.grey600,
    marginLeft: 8,
  },
  shipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ship: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorDefault.facebook_blue,
    marginRight: 8,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mknBadge: {
    marginRight: 8,
  },
  divider: {
    marginVertical: 8,
  },
  infoNote: {
    marginTop: 8,
  },
});
