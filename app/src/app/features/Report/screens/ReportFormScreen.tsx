import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {APP_SCREEN, RootStackParamList} from '../../../navigation/screen-types';
import {StatusBadge} from '@/app/components/StatusBadge';
import Utils from '@/app/library/utils';
import DatePicker from 'react-native-date-picker';
import {format} from 'date-fns';
import {ColorDefault} from '../../../themes/color';
import Loading, {RefObject} from '../../common/screens/loading';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ShipSelectorRequired} from '@/app/components/ShipSelectorRequired';
import {useSelector} from 'react-redux';

type Props = StackScreenProps<
  RootStackParamList,
  APP_SCREEN.REPORT_FORM_SCREEN
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
  port?: any;
}

export const ReportFormScreen: React.FC<Props> = ({route, navigation}) => {
  const {notification, onSubmit} = route.params;
  const nav = useNavigation();
  const {ships} = useSelector((state: any) => state.ship) || {ships: []};
  const [selectedShipId, setSelectedShipId] = useState<string>(
    notification?.ship_id || '',
  );
  const [formData, setFormData] = useState<ReportFormData>({
    lat: 10.762622,
    lng: 106.660172,
    reported_at: new Date().toISOString(),
    port_code: '',
    description: '',
    status: 'pending',
    reporter_user_id: '', // Sẽ lấy từ auth store
    reporter_ship_id: notification?.ship_id || '',
    port: undefined,
  });

  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedPort, setSelectedPort] = useState<any>(null);
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
    }
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
      await onSubmit({
        ...formData,
        isRequrePort: true,
      });
      navigation.goBack();
    } finally {
      loadingRef.current?.toggleState(false);
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handlePortSelect = (port: any) => {
    setSelectedPort(port);
    setFormData(prev => ({
      ...prev,
      port: port,
      port_code: port?.code || '',
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Khai báo thông tin cập cảng</Text>
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

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Cảng</Text>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => {
              (nav as any).navigate(APP_SCREEN.PORT_PICKER_SCREEN, {
                onSelect: handlePortSelect,
              });
            }}>
            <Text style={styles.locationText}>
              {selectedPort ? `${selectedPort.name}` : 'Chọn cảng'}
            </Text>
            <Text style={styles.editText}>Chọn</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Ghi chú</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Nhập ghi chú..."
            value={formData.description}
            onChangeText={text =>
              setFormData(prev => ({...prev, description: text}))
            }
            multiline
            numberOfLines={3}
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
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
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
  locationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  editText: {
    fontSize: 14,
    color: ColorDefault.primary,
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
});
