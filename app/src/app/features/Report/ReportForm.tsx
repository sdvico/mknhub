import {StatusBadge} from '@/app/components/StatusBadge';
import Utils from '@/app/library/utils';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import DatePicker from 'react-native-date-picker';
import {format} from 'date-fns';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {ColorDefault} from '../../themes/color';
import Loading, {RefObject} from '../common/screens/loading';
// PortPicker is mounted at parent level

interface ReportFormProps {
  title: string;
  notification?: any;
  onSubmit: (data: ReportFormData) => void;
  onClose: () => void;
  onOpenPortPicker?: () => void;
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
  port?: any;
}

export type ReportFormRef = {
  setPortCode: (port: any) => void;
};

export const ReportForm = forwardRef<ReportFormRef, ReportFormProps>(
  ({title, notification, onSubmit, onClose, onOpenPortPicker}, ref) => {
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
    const loadingRef = useRef<RefObject>(null);

    useImperativeHandle(ref, () => ({
      setPortCode: port => setFormData(prev => ({...prev, port})),
    }));

    // Auto get current position when component mounts
    useEffect(() => {
      getCurrentDeviceLocation();
    }, []);

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

    // Removed location editor in this form to keep UI simple

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

    return (
      <BottomSheetScrollView style={styles.container}>
        {notification && (
          <StatusBadge
            type="MKN"
            value={notification.type}
            style={styles.typeBadge}
          />
        )}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
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

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Cảng</Text>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={onOpenPortPicker}>
            <Text style={styles.locationText}>
              {formData.port ? `${formData.port?.name}` : 'Chọn cảng'}
            </Text>
            <Text style={styles.editText}>Chọn</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Ghi chú</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={value =>
              setFormData(prev => ({...prev, description: value}))
            }
            placeholder="Nhập ghi chú"
            placeholderTextColor={ColorDefault.grey600}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

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
        <Loading ref={loadingRef} />
      </BottomSheetScrollView>
    );
  },
);

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
    // marginLeft: 8,
    marginBottom: 8,
  },
  formSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorDefault.grey800,
  },
  getLocationButton: {
    backgroundColor: ColorDefault.orange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
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
