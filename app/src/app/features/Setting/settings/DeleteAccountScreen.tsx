import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {store} from '@/app/store/store';
import {onSetToken} from '@/app/store/app/redux/actions';
import Utils from '@/app/library/utils';
import {APP_SCREEN} from '@/app/navigation/screen-types';

const DeleteAccountScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (!note.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập lý do xóa tài khoản');
      return;
    }

    Alert.alert(
      'Xác nhận xóa tài khoản',
      'Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa tài khoản',
          style: 'destructive',
          onPress: confirmDeleteAccount,
        },
      ],
    );
  };

  const confirmDeleteAccount = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success message
      Alert.alert(
        'Thành công',
        'Tài khoản đã được xóa thành công. Bạn sẽ được đăng xuất.',
        [
          {
            text: 'OK',
            onPress: async () => {
              try {
                Utils.navigation.goBack();
                store.dispatch(
                  onSetToken({
                    payload: '',
                  }),
                );

                navigation.reset({
                  index: 0,
                  routes: [{name: APP_SCREEN.AUTH_LOGIN as never}],
                });
              } catch (error) {
                console.error('Error signing out:', error);
                Alert.alert('Lỗi', 'Có lỗi xảy ra khi đăng xuất');
              }
            },
          },
        ],
      );
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi xóa tài khoản. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (note.trim()) {
      Alert.alert(
        'Hủy thay đổi',
        'Bạn có muốn hủy thay đổi? Dữ liệu đã nhập sẽ bị mất.',
        [
          {
            text: 'Tiếp tục chỉnh sửa',
            style: 'cancel',
          },
          {
            text: 'Hủy thay đổi',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container]}>
      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xóa tài khoản</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Warning Section */}
        <View style={styles.warningSection}>
          <Icon name="warning" size={48} color="#FF3B30" />
          <Text style={styles.warningTitle}>Cảnh báo quan trọng</Text>
          <Text style={styles.warningDescription}>
            Việc xóa tài khoản sẽ xóa vĩnh viễn tất cả dữ liệu của bạn và không
            thể hoàn tác.
          </Text>
        </View>

        {/* Note Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lý do xóa tài khoản *</Text>
          <Text style={styles.sectionDescription}>
            Vui lòng cho chúng tôi biết lý do bạn muốn xóa tài khoản để chúng
            tôi có thể cải thiện dịch vụ.
          </Text>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="Nhập lý do xóa tài khoản..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* What will be deleted */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dữ liệu sẽ bị xóa</Text>
          <View style={styles.deletionList}>
            <View style={styles.deletionItem}>
              <Icon name="close-circle" size={20} color="#FF3B30" />
              <Text style={styles.deletionText}>
                Tất cả tin nhắn và lịch sử chat
              </Text>
            </View>
            <View style={styles.deletionItem}>
              <Icon name="close-circle" size={20} color="#FF3B30" />
              <Text style={styles.deletionText}>
                Thông tin cá nhân và cài đặt
              </Text>
            </View>
            <View style={styles.deletionItem}>
              <Icon name="close-circle" size={20} color="#FF3B30" />
              <Text style={styles.deletionText}>Kết nối với các thiết bị</Text>
            </View>
            <View style={styles.deletionItem}>
              <Icon name="close-circle" size={20} color="#FF3B30" />
              <Text style={styles.deletionText}>Dữ liệu ứng dụng khác</Text>
            </View>
          </View>
        </View>

        {/* Alternative Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cân nhắc thay thế</Text>
          <Text style={styles.sectionDescription}>
            Trước khi xóa tài khoản, bạn có thể cân nhắc:
          </Text>
          <View style={styles.alternativeList}>
            <View style={styles.alternativeItem}>
              <Icon name="checkmark-circle" size={20} color="#34C759" />
              <Text style={styles.alternativeText}>
                Tạm thời vô hiệu hóa tài khoản
              </Text>
            </View>
            <View style={styles.alternativeItem}>
              <Icon name="checkmark-circle" size={20} color="#34C759" />
              <Text style={styles.alternativeText}>
                Liên hệ hỗ trợ để giải quyết vấn đề
              </Text>
            </View>
            <View style={styles.alternativeItem}>
              <Icon name="checkmark-circle" size={20} color="#34C759" />
              <Text style={styles.alternativeText}>
                Thay đổi cài đặt bảo mật
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[
              styles.deleteButton,
              loading && styles.deleteButtonDisabled,
            ]}
            onPress={handleDeleteAccount}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Icon name="trash" size={20} color="#FFFFFF" />
            )}
            <Text style={styles.deleteButtonText}>
              {loading ? 'Đang xóa...' : 'Xóa tài khoản'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 20,
  },
  warningSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFF5F5',
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF3B30',
    marginTop: 16,
    marginBottom: 8,
  },
  warningDescription: {
    fontSize: 14,
    color: '#FF3B30',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#FFFFFF',
    minHeight: 100,
  },
  deletionList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  deletionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deletionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  alternativeList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  alternativeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alternativeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  actionSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  deleteButtonDisabled: {
    backgroundColor: '#FF9999',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DeleteAccountScreen;
