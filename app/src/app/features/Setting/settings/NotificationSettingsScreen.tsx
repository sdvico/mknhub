import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ColorDefault} from '../../../themes/color';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const NotificationSettingsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [notificationSettings, setNotificationSettings] = useState<
    NotificationSetting[]
  >([
    {
      id: '1',
      title: 'Thông báo đẩy',
      description: 'Nhận thông báo khi có tin nhắn mới',
      enabled: true,
    },
    {
      id: '2',
      title: 'Thông báo âm thanh',
      description: 'Phát âm thanh khi có thông báo',
      enabled: true,
    },
    {
      id: '3',
      title: 'Thông báo rung',
      description: 'Rung thiết bị khi có thông báo',
      enabled: false,
    },
    {
      id: '4',
      title: 'Thông báo trong ứng dụng',
      description: 'Hiển thị thông báo trong ứng dụng',
      enabled: true,
    },
    {
      id: '5',
      title: 'Thông báo email',
      description: 'Gửi thông báo qua email',
      enabled: false,
    },
  ]);

  const toggleNotification = (id: string) => {
    setNotificationSettings(prev =>
      prev.map(setting =>
        setting.id === id ? {...setting, enabled: !setting.enabled} : setting,
      ),
    );
  };

  const handleSave = () => {
    // TODO: Save notification settings to backend/local storage
    navigation.goBack();
  };

  return (
    <View style={[styles.container]}>
      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt thông báo</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Lưu</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tùy chỉnh thông báo</Text>
          <Text style={styles.sectionDescription}>
            Bạn có thể tùy chỉnh cách nhận thông báo từ ứng dụng
          </Text>
        </View>

        {notificationSettings.map(setting => (
          <View key={setting.id} style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{setting.title}</Text>
              <Text style={styles.settingDescription}>
                {setting.description}
              </Text>
            </View>
            <Switch
              value={setting.enabled}
              onValueChange={() => toggleNotification(setting.id)}
              trackColor={{
                false: '#E0E0E0',
                true: ColorDefault.background_primary,
              }}
              thumbColor={setting.enabled ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        ))}

        <View style={styles.infoSection}>
          <Icon name="information-circle" size={20} color="#666" />
          <Text style={styles.infoText}>
            Cài đặt này sẽ được áp dụng cho tất cả thiết bị của bạn
          </Text>
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
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorDefault.background_primary,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E8F4FD',
    borderRadius: 12,
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#0066CC',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});

export default NotificationSettingsScreen;
