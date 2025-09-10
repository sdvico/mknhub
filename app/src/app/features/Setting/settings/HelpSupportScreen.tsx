import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ColorDefault} from '../../../themes/color';

interface ContactMethod {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  action: () => void;
}

const HelpSupportScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handlePhoneCall = () => {
    Linking.openURL('tel:+84123456789');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@sdvico.com');
  };

  const handleWebsite = () => {
    Linking.openURL('https://www.sdvico.vn');
  };

  const handleChat = () => {
    Alert.alert('Hỗ trợ trực tuyến', 'Tính năng đang phát triển');
  };

  const contactMethods: ContactMethod[] = [
    {
      id: '1',
      title: 'Gọi điện thoại',
      description: 'Liên hệ trực tiếp với đội ngũ hỗ trợ',
      icon: 'call',
      iconColor: '#34C759',
      action: handlePhoneCall,
    },
    {
      id: '2',
      title: 'Gửi email',
      description: 'Gửi email để được hỗ trợ',
      icon: 'mail',
      iconColor: '#007AFF',
      action: handleEmail,
    },
    {
      id: '3',
      title: 'Trang web hỗ trợ',
      description: 'Truy cập trang web hỗ trợ chính thức',
      icon: 'globe',
      iconColor: '#5856D6',
      action: handleWebsite,
    },
    {
      id: '4',
      title: 'Chat trực tuyến',
      description: 'Chat với nhân viên hỗ trợ',
      icon: 'chatbubbles',
      iconColor: '#FF9500',
      action: handleChat,
    },
  ];

  const faqItems = [
    {
      question: 'Làm thế nào để đặt lại mật khẩu?',
      answer:
        'Bạn có thể sử dụng tính năng "Quên mật khẩu" trong màn hình đăng nhập.',
    },
    {
      question: 'Ứng dụng có hỗ trợ đa ngôn ngữ không?',
      answer: 'Hiện tại ứng dụng chỉ hỗ trợ tiếng Việt và tiếng Anh.',
    },
    {
      question: 'Làm thế nào để báo cáo lỗi?',
      answer:
        'Bạn có thể gửi email hoặc sử dụng tính năng báo cáo lỗi trong ứng dụng.',
    },
  ];

  return (
    <View style={[styles.container]}>
      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trợ giúp & Hỗ trợ</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Liên hệ hỗ trợ</Text>
          <Text style={styles.sectionDescription}>
            Chọn phương thức liên hệ phù hợp với bạn
          </Text>
        </View>

        {contactMethods.map(method => (
          <TouchableOpacity
            key={method.id}
            style={styles.contactItem}
            onPress={method.action}>
            <View
              style={[
                styles.iconContainer,
                {backgroundColor: method.iconColor + '20'},
              ]}>
              <Icon name={method.icon} size={24} color={method.iconColor} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>{method.title}</Text>
              <Text style={styles.contactDescription}>
                {method.description}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>
        ))}

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Câu hỏi thường gặp</Text>
          <Text style={styles.sectionDescription}>
            Tìm câu trả lời cho các câu hỏi phổ biến
          </Text>
        </View>

        {faqItems.map((item, index) => (
          <View key={index} style={styles.faqItem}>
            <Text style={styles.faqQuestion}>{item.question}</Text>
            <Text style={styles.faqAnswer}>{item.answer}</Text>
          </View>
        ))}

        {/* Additional Info */}
        <View style={styles.infoSection}>
          <Icon name="information-circle" size={20} color="#666" />
          <Text style={styles.infoText}>
            Thời gian hỗ trợ: Thứ 2 - Thứ 6 (8:00 - 18:00)
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
  placeholder: {
    width: 40,
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
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
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
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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

export default HelpSupportScreen;
