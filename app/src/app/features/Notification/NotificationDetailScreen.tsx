import {StatusBadge} from '@/app/components/StatusBadge';
import {useNotificationForm} from '@/app/hooks/useNotificationForm';
import {Text} from '@/app/library/components';
import {NetWorkService} from '@/app/library/networking';
import {ColorDefault} from '@/app/themes/color';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import HeaderBasic from '../common/components/header/header-basic';

import {useToastAlert} from '@/app/components/ToastAlertContext';
import Utils from '@/app/library/utils';
import {APP_SCREEN} from '@/app/navigation/screen-types';
import {fetchPorts} from '@/app/store/saga/notification.saga';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LocationInfoCard from '../common/components/LocationInfoCard';
import NotificationHtmlMessage, {
  NotificationTitle,
} from './components/NotificationHtmlMessage';
import {useNotificationFormType} from './hooks/useDataMessage';

interface NotificationDetailScreenProps {
  route: {
    params: {
      notification: any;
    };
  };
}

export const NotificationDetailScreen: React.FC<
  NotificationDetailScreenProps
> = ({route}) => {
  const defaultNotification = route.params.notification;
  const [notification, setNotification] = useState(defaultNotification);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state: any) => state.app.profile.user.id);
  const {hasForm} = useNotificationForm(notification.type);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const notificationRes = await NetWorkService.Get({
          url: `/api/v1/ship-notifications/${defaultNotification.id}`,
        });

        setNotification(notificationRes?.data || {});
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [defaultNotification?.id]);
  // form_type

  const report = notification.report;
  const {showAlert} = useToastAlert();

  const handleSubmitReport = async (reportData: any) => {
    try {
      if (reportData.isRequrePort && !reportData.port) {
        return showAlert({
          message: 'Vui lòng khai báo cảng',
          buttonText: 'OK',
          onClose: () => {},
        });
      }
      const response = await NetWorkService.Post({
        url: '/api/reports',
        body: {
          ...reportData,
          port_code: reportData?.port?.code,
          shipNotificationId: notification.id,
          reporter_user_id: userId,
          reporter_ship_id: notification.ship?.id,
          source: 'app',
        },
      });

      if (response.code === 200) {
        const fetchData = async () => {
          try {
            const notificationRes = await NetWorkService.Get({
              url: `/api/v1/ship-notifications/${defaultNotification.id}`,
            });

            setNotification(notificationRes?.data || {});
          } catch (error) {
            console.error('Error fetching data:', error);
          } finally {
            setLoading(false);
          }
        };

        fetchData();
        // Navigation will be handled by the modal screen
      }
      // TODO: Handle success (show toast, refresh notification list, etc.)
    } catch (error) {
      console.error('Error submitting report:', error);
      // TODO: Handle error (show error toast)
    }
  };

  const handleOpenReportForm = () => {
    dispatch(fetchPorts());
    (navigation as any).navigate(APP_SCREEN.REPORT_FORM_SCREEN, {
      notification,
      onSubmit: handleSubmitReport,
    });
  };

  const handleOpenMap = () => {
    if (report) {
      Utils.navigation.push(APP_SCREEN.REPORT_MAP_VIEW, {report});
      return;
    }
    (navigation as any).navigate(APP_SCREEN.MAP_REPORT_FORM_SCREEN, {
      notification: notification || undefined,
      onSubmit: handleSubmitReport,
    });
  };

  // Helpers: simple decimal to DMS formatter for display
  const toDMS = (decimal?: number, isLatitude?: boolean) => {
    if (decimal === undefined || decimal === null || isNaN(decimal)) {
      return '';
    }
    const abs = Math.abs(decimal);
    const degrees = Math.floor(abs);
    const minutesFloat = (abs - degrees) * 60;
    const minutes = Math.floor(minutesFloat);
    const seconds = (minutesFloat - minutes) * 60;
    const direction = isLatitude
      ? decimal >= 0
        ? 'N'
        : 'S'
      : decimal >= 0
      ? 'E'
      : 'W';
    return `${degrees}°${minutes}'${seconds.toFixed(3)}"${direction}`;
  };

  const formatTimeAgo = (isoString?: string) => {
    if (!isoString) {
      return '';
    }
    const occurred = new Date(isoString);
    if (isNaN(occurred.getTime())) {
      return '';
    }
    const now = new Date();
    const diffMs = now.getTime() - occurred.getTime();
    const seconds = Math.floor(diffMs / 1000);
    if (seconds < 60) {
      return `${seconds} giây trước`;
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} phút trước`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} giờ trước`;
    }
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  const insset = useSafeAreaInsets();
  const formObject = useNotificationFormType(notification);
  console.log('formObject', formObject);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={ColorDefault.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderBasic isBackButton={true} title="Chi tiết thông báo" />
      <ScrollView style={[styles.content, {paddingBottom: insset.bottom}]}>
        {/* Top card section (match provided design) */}
        <View style={styles.topCard}>
          <NotificationTitle notification={notification} />
          <Text style={styles.topCardTime}>
            {new Date(notification.occurred_at).toLocaleString('vi-VN')}
          </Text>
          {/* {notification.content ? (
            <Text style={styles.topCardBody}>{notification.content}</Text>
          ) : null} */}
          <NotificationHtmlMessage notification={notification} />

          <View style={styles.shipInfoCard}>
            <Text style={styles.shipInfoTitle}>Thông tin tàu</Text>
            <Text style={styles.shipInfoText}>
              Biển số:{' '}
              <Text style={styles.shipCode}>{notification.ship_code}</Text>
            </Text>
          </View>
          {hasForm || notification.report ? (
            <View
              style={
                notification.report
                  ? styles.statusBlockDone
                  : styles.statusBlock
              }>
              <Text style={styles.statusLabel}>
                Trạng thái khai báo vị trí:
              </Text>
              <View style={styles.mt8}>
                <StatusBadge
                  type={notification.report ? 'success' : 'error'}
                  value={notification.report ? 'Đã khai báo' : 'Chưa khai báo'}
                />
              </View>
            </View>
          ) : null}

          {(notification.lat ||
            notification.lng ||
            notification.reported_at) && (
            <View style={styles.locationInfoCard}>
              <Text style={styles.locationInfoTitle}>
                Thông tin vị trí cuối:
              </Text>
              {notification.reported_at ? (
                <Text style={styles.locationInfoText}>
                  Thời gian cuối:{' '}
                  {new Date(notification.reported_at).toLocaleString('vi-VN')}
                </Text>
              ) : null}
              {notification.lat !== undefined &&
                notification.lng !== undefined && (
                  <>
                    <Text style={styles.locationInfoText}>
                      Vĩ độ: {toDMS(notification.lat, true)}
                    </Text>
                    <Text style={styles.locationInfoText}>
                      Kinh độ:
                      {toDMS(notification.lng, false)}
                    </Text>

                    <Text style={styles.locationInfoText}>
                      Thời gian: {formatTimeAgo(notification.occurred_at)}
                    </Text>
                  </>
                )}
            </View>
          )}
        </View>
        {report ? (
          <>
            <View style={styles.reportSection}>
              <Text style={styles.messageTitle}>Thông tin khai báo</Text>
              <LocationInfoCard
                time={report?.reported_at}
                lat={report?.lat}
                lng={report?.lng}
                statusLabel={'Đã khai báo'}
              />
            </View>

            <TouchableOpacity
              style={[styles.actionButton, styles.manualLocationButton]}
              onPress={handleOpenMap}>
              <Text style={styles.actionButtonText}>Xem vị trí trên map</Text>
            </TouchableOpacity>
          </>
        ) : (
          hasForm && (
            <View style={styles.actionSection}>
              {formObject?.KBCC ? (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleOpenReportForm}>
                  <Text style={styles.actionButtonText}>Khai báo Cập cảng</Text>
                </TouchableOpacity>
              ) : null}

              {formObject?.KBVT ? (
                <TouchableOpacity
                  style={[styles.actionButton, styles.mapButton]}
                  onPress={handleOpenMap}>
                  <Text style={styles.actionButtonText}>Khai báo vị trí</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )
        )}
        <View style={styles.h100} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  topCard: {
    // backgroundColor: ColorDefault.white,
    // borderRadius: 12,
    // borderWidth: 1,
    // borderColor: ColorDefault.grey200,
  },
  topCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ColorDefault.grey800,
    marginBottom: 6,
  },
  topCardTime: {
    fontSize: 12,
    color: ColorDefault.grey600,
    marginBottom: 12,
  },
  topCardTimeSub: {
    fontSize: 16,
    color: ColorDefault.grey600,
    marginTop: -8,
    marginBottom: 12,
  },
  topCardBody: {
    fontSize: 14,
    color: ColorDefault.grey800,
    lineHeight: 20,
    marginBottom: 12,
  },
  shipInfoCard: {
    backgroundColor: ColorDefault.facebook_bluebg2,
    borderWidth: 1,
    borderColor: ColorDefault.grey200,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    marginTop: 16,
  },
  shipInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: ColorDefault.facebook_blue,
    marginBottom: 6,
  },
  shipInfoText: {
    fontSize: 16,
    color: ColorDefault.facebook_blue,
  },
  statusBlock: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  statusBlockDone: {
    backgroundColor: 'white',
    borderColor: 'rgba(92,201,50,1)',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 16,
    color: ColorDefault.grey800,
    fontWeight: '500',
  },
  locationInfoCard: {
    backgroundColor: ColorDefault.white,
    borderColor: ColorDefault.grey200,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  locationInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorDefault.grey800,
    marginBottom: 6,
  },
  locationInfoText: {
    fontSize: 16,
    color: ColorDefault.grey800,
    marginBottom: 4,
  },
  reportInfo: {
    backgroundColor: ColorDefault.grey100,
    borderRadius: 8,
    padding: 16,
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: ColorDefault.grey800,
  },
  description: {
    alignItems: 'flex-start',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: ColorDefault.white,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: ColorDefault.grey800,
    marginBottom: 8,
  },
  time: {
    fontSize: 14,
    color: ColorDefault.grey600,
  },
  infoSection: {
    backgroundColor: ColorDefault.grey100,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: ColorDefault.grey600,
    width: 120,
  },
  shipCode: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorDefault.facebook_blue,
  },
  messageSection: {
    marginBottom: 24,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorDefault.grey800,
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: ColorDefault.grey800,
    lineHeight: 24,
  },
  reportSection: {
    paddingTop: 16,
  },
  actionSection: {
    paddingTop: 16,
    gap: 12,
  },
  actionButton: {
    backgroundColor: ColorDefault.facebook_blue,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  mapButton: {
    backgroundColor: ColorDefault.orange,
  },
  manualLocationButton: {
    backgroundColor: ColorDefault.orange,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorDefault.white,
  },
  bottomSheetBackground: {
    backgroundColor: ColorDefault.white,
  },
  bottomSheetIndicator: {
    backgroundColor: ColorDefault.grey600,
  },
  bottomSheetContent: {
    flex: 1,
    backgroundColor: ColorDefault.background,
  },
  flex1: {flex: 1},
  ph16: {paddingHorizontal: 16},
  mt8: {marginTop: 8},
  h100: {height: 100},
});
