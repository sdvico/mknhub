import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ColorDefault} from '../../../themes/color';
import {ENVConfig} from '../../../config/env';
import {images} from '../../../assets/image/index';

const AboutAppScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleWebsite = () => {
    Linking.openURL('https://www.sdvico.vn/');
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://www.sdvico.vn/pages/dieu-khoan-dich-vu');
  };

  const handleTermsOfService = () => {
    Linking.openURL('https://www.sdvico.vn/pages/dieu-khoan-dich-vu');
  };

  const appInfo = {
    name: ENVConfig.APP_DISPLAY_NAME || 'SatAlert',
    version: ENVConfig.VERSION_NAME || '1.0.0',
    buildNumber: ENVConfig.VERSION_CODE || '1',
    description:
      'SatAlert là ứng dụng giám sát ngư dân thông báo cho tàu thuyền',
    features: [
      'Thông báo thông tin tàu thuyền',
      'Thông báo thông tin ngư dân',
      'Thông báo thông tin ngư trường',
      'Thông báo thông tin thời tiết',
      'Thông báo thông tin bảo vệ môi trường',
    ],
    developer: 'SDVICO',
    website: 'https://www.sdvico.vn/',
    support: 'support@sdvico.vn',
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
        <Text style={styles.headerTitle}>Về ứng dụng</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Logo & Basic Info */}
        <View style={styles.appInfoSection}>
          <View style={styles.appLogo}>
            <Image source={images.Icon} style={styles.appLogoImage} />
          </View>
          <Text style={styles.appName}>{appInfo.name}</Text>
          <Text style={styles.appVersion}>Phiên bản {appInfo.version}</Text>
          <Text style={styles.appBuildNumber}>Build {appInfo.buildNumber}</Text>
        </View>

        {/* App Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả ứng dụng</Text>
          <Text style={styles.appDescription}>{appInfo.description}</Text>
        </View>

        {/* App Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tính năng chính</Text>
          {appInfo.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Icon name="checkmark-circle" size={20} color="#34C759" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Developer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin nhà phát triển</Text>
          <View style={styles.developerInfo}>
            <Text style={styles.developerLabel}>Nhà phát triển:</Text>
            <Text style={styles.developerValue}>{appInfo.developer}</Text>
          </View>
          <View style={styles.developerInfo}>
            <Text style={styles.developerLabel}>Website:</Text>
            <TouchableOpacity onPress={handleWebsite}>
              <Text style={styles.developerLink}>{appInfo.website}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.developerInfo}>
            <Text style={styles.developerLabel}>Hỗ trợ:</Text>
            <Text style={styles.developerValue}>{appInfo.support}</Text>
          </View>
        </View>

        {/* Legal Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin pháp lý</Text>
          <TouchableOpacity
            style={styles.legalLink}
            onPress={handlePrivacyPolicy}>
            <Icon name="shield-checkmark" size={20} color="#666" />
            <Text style={styles.legalLinkText}>Chính sách bảo mật</Text>
            <Icon name="chevron-forward" size={16} color="#CCC" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.legalLink}
            onPress={handleTermsOfService}>
            <Icon name="document-text" size={20} color="#666" />
            <Text style={styles.legalLinkText}>Điều khoản sử dụng</Text>
            <Icon name="chevron-forward" size={16} color="#CCC" />
          </TouchableOpacity>
        </View>

        {/* Copyright */}
        <View style={styles.copyrightSection}>
          <Text style={styles.copyrightText}>
            © 2024 {appInfo.developer}. Tất cả quyền được bảo lưu.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  appLogoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
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
    flex: 1,
    padding: 20,
  },
  appInfoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  appBuildNumber: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  appDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    textAlign: 'justify',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  developerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  developerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    width: 100,
  },
  developerValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  developerLink: {
    fontSize: 14,
    color: ColorDefault.background_primary,
    textDecorationLine: 'underline',
    flex: 1,
  },
  legalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  legalLinkText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  copyrightSection: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
  },
  copyrightText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default AboutAppScreen;
