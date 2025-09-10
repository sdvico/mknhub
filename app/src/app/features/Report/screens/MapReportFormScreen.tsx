import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {APP_SCREEN, RootStackParamList} from '../../../navigation/screen-types';
import {StatusBadge} from '@/app/components/StatusBadge';
import {MapView} from '@/app/features/Map/MapView';
import Utils from '@/app/library/utils';
import DatePicker from 'react-native-date-picker';
import {format} from 'date-fns';
import {ColorDefault} from '../../../themes/color';
import Loading, {RefObject} from '../../common/screens/loading';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {LocationInputNomal, toDMS} from '../forrm/LocationInpuNomal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ShipSelectorRequired} from '@/app/components/ShipSelectorRequired';
import {useSelector} from 'react-redux';

type Props = StackScreenProps<
  RootStackParamList,
  APP_SCREEN.MAP_REPORT_FORM_SCREEN
>;

export interface ReportFormData {
  lat: number;
  lng: number;
  reported_at: string;
  port_code: string;
  description: string;
  status: string;
  reporter_user_id: string;
  reporter_ship_id: string;
  source?: string;
}

export const MapReportFormScreen: React.FC<Props> = ({route, navigation}) => {
  const {notification, onSubmit} = route.params;
  const {ships} = useSelector((state: any) => state.ship) || {ships: []};
  const [formData, setFormData] = useState<ReportFormData>({
    lat: 10.762622,
    lng: 106.660172,
    reported_at: new Date().toISOString(),
    port_code: '',
    description: '',
    status: 'pending',
    source: 'app',
    reporter_user_id: '', // Sẽ lấy từ auth store
    reporter_ship_id: notification?.ship_id || '',
  });

  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [selectedShipId, setSelectedShipId] = useState<string>(
    notification?.ship_id || '',
  );
  const locationInputRef = useRef(null);
  const loadingRef = useRef<RefObject>(null);
  const insets = useSafeAreaInsets();

  // Auto get current position when component mounts
  useEffect(() => {
    getCurrentDeviceLocation();
  }, []);

  // Auto select first ship if no notification and ships are available
  useEffect(() => {
    if (!notification && ships && ships.length > 0 && !selectedShipId) {
      setSelectedShipId(ships[0].id);
    }
  }, [ships, notification, selectedShipId]);

  // Update formData when selectedShipId changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      reporter_ship_id: selectedShipId,
    }));
  }, [selectedShipId]);

  const getCurrentDeviceLocation = async () => {
    setIsGettingLocation(true);
    try {
      const position = await Utils.getCurrentPosition();
      if (position && (position as any).coords) {
        setFormData(prev => ({
          ...prev,
          lat: (position as any).coords.latitude,
          lng: (position as any).coords.longitude,
        }));
      }
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleLocationChange = ({latDMS, lngDMS}: any) => {
    // Convert DMS to decimal degrees
    const lat =
      parseFloat(latDMS.degrees) +
      parseFloat(latDMS.minutes) / 60 +
      parseFloat(latDMS.seconds) / 3600;
    const lng =
      parseFloat(lngDMS.degrees) +
      parseFloat(lngDMS.minutes) / 60 +
      parseFloat(lngDMS.seconds) / 3600;

    setFormData(prev => ({
      ...prev,
      lat: latDMS.direction === 'N' ? lat : -lat,
      lng: lngDMS.direction === 'E' ? lng : -lng,
    }));
  };

  const handleConfirmDate = (selectedDate: Date) => {
    setOpenDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        reported_at: selectedDate.toISOString(),
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      loadingRef.current?.toggleState(true);
      await onSubmit(formData);
      navigation.goBack();
    } finally {
      loadingRef.current?.toggleState(false);
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Khai báo vị trí</Text>
        {notification && (
          <StatusBadge
            type="MKN"
            value={notification.type}
            style={styles.typeBadge}
          />
        )}
      </View>

      <KeyboardAwareScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}>
        {!notification && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Chọn tàu</Text>
            <ShipSelectorRequired
              selectedShipId={selectedShipId}
              onSelectShip={setSelectedShipId}
            />
          </View>
        )}
        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vị trí</Text>
            <TouchableOpacity
              style={styles.getLocationButton}
              onPress={getCurrentDeviceLocation}
              disabled={isGettingLocation}>
              <Text style={styles.getLocationText}>
                {isGettingLocation
                  ? 'Đang lấy vị trí...'
                  : 'Lấy vị trí hiện tại'}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => (locationInputRef.current as any)?.showModal()}>
            <Text style={styles.locationText}>
              {toDMS(formData.lat || 0, true)}
              {' - '}
              {toDMS(formData.lng || 0, false)}
            </Text>
            <Text style={styles.editText}>Chỉnh sửa</Text>
          </TouchableOpacity>
          <LocationInputNomal
            ref={locationInputRef}
            handleEditCoordinates={handleLocationChange}
            portOutLatLngTime={{
              latitude: formData.lat,
              longitude: formData.lng,
            }}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Thời gian</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setOpenDatePicker(true)}>
            <Text style={styles.dateText}>
              {format(new Date(formData.reported_at), 'dd/MM/yyyy HH:mm')}
            </Text>
          </TouchableOpacity>
          <DatePicker
            modal
            open={openDatePicker}
            date={new Date(formData.reported_at)}
            mode="datetime"
            onConfirm={handleConfirmDate}
            onCancel={() => setOpenDatePicker(false)}
            locale="vi_VN"
            confirmText="Xác nhận"
            cancelText="Huỷ"
          />
        </View>

        <View style={styles.mapContainer}>
          <MapView
            point={{
              lat: formData.lat || 10.762622,
              lng: formData.lng || 106.660172,
            }}
            handleMapMessage={() => {}}
            showInBottomSheet={false}
            showSendButton={false}
            onSendLocation={undefined}
          />
        </View>
      </KeyboardAwareScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom || 16}]}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Khai báo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitButton, styles.cancelButton]}
          onPress={handleClose}>
          <Text style={styles.submitText}>Đóng</Text>
        </TouchableOpacity>
      </View>

      <Loading ref={loadingRef} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  typeBadge: {
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  formSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  mapContainer: {
    height: 300,
    marginVertical: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: ColorDefault.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  cancelButton: {
    backgroundColor: ColorDefault.text_grey600,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  getLocationButton: {
    backgroundColor: ColorDefault.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  getLocationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  locationButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
    flex: 1,
  },
  editText: {
    fontSize: 12,
    color: ColorDefault.primary,
    textAlign: 'right',
  },
});
