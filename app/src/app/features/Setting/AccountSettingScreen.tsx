import {useMe} from '@/app/hooks/useMe';
import {APP_SCREEN} from '@/app/navigation/screen-types';
import {onSetToken} from '@/app/store/app/redux/actions';
import {ColorDefault} from '@/app/themes/color';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  iconColor: string;
  onPress: () => void;
}

const AccountSettingScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const profile = useSelector((state: any) => state.app.profile);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const {getMe} = useMe();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          try {
            dispatch(onSetToken({payload: ''}));
            navigation.reset({
              index: 0,
              routes: [{name: APP_SCREEN.AUTH_LOGIN as never}],
            });
          } catch (error) {
            console.error('Error signing out:', error);
            Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
          }
        },
      },
    ]);
  };

  const menuItems: MenuItem[] = [
    {
      id: '1',
      title: 'Thông báo',
      icon: 'notifications',
      iconColor: ColorDefault.primary,
      onPress: () =>
        navigation.navigate(APP_SCREEN.NOTIFICATION_SETTINGS as never),
    },
    {
      id: '2',
      title: 'Quyền riêng tư',
      icon: 'shield',
      iconColor: ColorDefault.green,
      onPress: () =>
        navigation.navigate(APP_SCREEN.PRIVACY_POLICY as never, {
          url: 'https://www.sdvico.vn',
          title: 'Quyền riêng tư',
        }),
    },
    {
      id: '3',
      title: 'Bảo mật',
      icon: 'lock-closed',
      iconColor: ColorDefault.grey300,
      onPress: () =>
        navigation.navigate(APP_SCREEN.SECURITY_POLICY, {
          url: 'https://www.sdvico.vn',
          title: 'Bảo mật',
        }),
    },
    {
      id: '4',
      title: 'Trợ giúp & Hỗ trợ',
      icon: 'help-circle',
      iconColor: ColorDefault.grey300,
      onPress: () => navigation.navigate(APP_SCREEN.HELP_SUPPORT as never),
    },
    {
      id: '5',
      title: 'Về ứng dụng',
      icon: 'information-circle',
      iconColor: ColorDefault.grey600,
      onPress: () => navigation.navigate(APP_SCREEN.ABOUT_APP as never),
    },
    {
      id: '6',
      title: 'Xóa tài khoản',
      icon: 'trash',
      iconColor: ColorDefault.red,
      onPress: () => navigation.navigate(APP_SCREEN.DELETE_ACCOUNT as never),
    },
  ];

  const renderMenuItem = ({item}: {item: MenuItem}) => (
    <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
      <View style={styles.menuIcon}>
        <Icon name={item.icon} size={24} color={item.iconColor} />
      </View>
      <Text style={styles.menuTitle}>{item.title}</Text>
      <Icon name="chevron-forward" size={20} color={ColorDefault.grey300} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, {backgroundColor: ColorDefault.white}]}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Đang tải...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <>
        {/* User Info Section */}
        <View style={[styles.userSection, {paddingTop: insets.top}]}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Icon
                name="person-circle-outline"
                size={40}
                color={ColorDefault.primary}
              />
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{`${profile?.user?.username} `}</Text>
            <Text style={styles.verifiedBadge}>Đã xác thực</Text>
          </View>
        </View>
        {/* Menu Section */}
        <Text style={styles.sectionTitle}>Cài đặt</Text>
        <View style={styles.menuSection}>
          <FlatList
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon icon="logout" size={24} color={ColorDefault.red} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorDefault.background,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: ColorDefault.background,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: ColorDefault.grey100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: ColorDefault.grey800,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: ColorDefault.grey600,
    marginBottom: 4,
  },
  verifiedBadge: {
    fontSize: 12,
    color: ColorDefault.green,
    fontWeight: '500',
  },
  menuSection: {
    backgroundColor: ColorDefault.white,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorDefault.grey600,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: ColorDefault.grey100,
  },
  menuIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    color: ColorDefault.grey800,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: ColorDefault.white,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    color: ColorDefault.red,
    fontWeight: '600',
  },
  authContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: ColorDefault.white,
  },
  authTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: ColorDefault.grey800,
    marginBottom: 24,
    textAlign: 'center',
  },
  switchAuthButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  switchAuthText: {
    color: ColorDefault.primary,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default AccountSettingScreen;
