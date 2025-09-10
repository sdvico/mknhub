import {StatusBadge} from '@/app/components/StatusBadge';
import {MapView} from '@/app/features/Map/MapView';
import Utils from '@/app/library/utils';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ColorDefault} from '../../themes/color';
import Loading, {RefObject} from '../common/screens/loading';
import {LocationInputNomal, toDMS} from './forrm/LocationInpuNomal';
import DatePicker from 'react-native-date-picker';
import {format} from 'date-fns';

interface ReportFormProps {
  title: string;
  notification?: any;
  onSubmit: (data: ReportFormData) => void;
  onClose: () => void;
}

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

export const MapReportForm: React.FC<ReportFormProps> = ({
  title,
  notification,
  onSubmit,
  onClose,
}) => {
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
  const locationInputRef = useRef(null);
  const loadingRef = useRef<RefObject>(null);

  // Auto get current position when component mounts
  useEffect(() => {
    getCurrentDeviceLocation();
  }, []);

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
    } finally {
      loadingRef.current?.toggleState(false);
    }
  };
  const insset = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingVertical: 8,
        flex: 1,
        paddingBottom: insset.bottom,
      }}>
      <BottomSheetScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {notification && (
            <StatusBadge
              type="MKN"
              value={notification.type}
              style={styles.typeBadge}
            />
          )}
        </View>

        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle]}>Vị trí</Text>
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
              {'-'}
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
        </View>

        <MapView
          point={{
            lat: formData.lat || 10.762622,
            lng: formData.lng || 106.660172,
          }}
          handleMapMessage={() => {}}
          showInBottomSheet={false}
          showSendButton={true}
          onSendLocation={handleSubmit}
        />
      </BottomSheetScrollView>
      <Loading ref={loadingRef} />
      <View style={{paddingHorizontal: 16}}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Khai báo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.submitButton,
            {backgroundColor: ColorDefault.text_grey600},
          ]}
          onPress={onClose}>
          <Text style={styles.submitText}>Đóng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorDefault.white,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: ColorDefault.grey800,
    flex: 1,
  },
  typeBadge: {
    marginLeft: 8,
  },
  formSection: {
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorDefault.grey800,
    paddingBottom: 8,
  },
  getLocationButton: {
    backgroundColor: ColorDefault.orange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 8,
  },
  getLocationText: {
    fontSize: 12,
    color: ColorDefault.white,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: ColorDefault.grey200,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: ColorDefault.grey800,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: ColorDefault.grey200,
    borderRadius: 8,
    padding: 12,
  },
  locationText: {
    fontSize: 16,
    color: ColorDefault.grey800,
    flex: 1,
  },
  editText: {
    fontSize: 14,
    color: ColorDefault.facebook_blue,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: ColorDefault.grey200,
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: ColorDefault.grey800,
  },
  submitButton: {
    backgroundColor: ColorDefault.facebook_blue,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitText: {
    fontSize: 18,
    fontWeight: '600',
    color: ColorDefault.white,
  },
});
