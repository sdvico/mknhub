import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {ColorDefault} from '@/app/themes/color';
import {Icon} from '@/app/library/components';
import {NetWorkService} from '@/app/library/networking';
import {useToastAlert} from '../../components/ToastAlertContext';
import Utils from '../../library/utils';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList, APP_SCREEN} from '../../navigation/screen-types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export interface CareTemplate {
  id: string;
  name: string;
  description: string;
  totalDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  productId: string;
  product: {
    id: string;
    code: string;
    name: string;
    country: string;
    createdAt: string;
  };
}

type TemplateSelectModalRouteProp = RouteProp<
  RootStackParamList,
  APP_SCREEN.TEMPLATE_SELECT_MODAL
>;

const TemplateSelectModal = () => {
  const route = useRoute<TemplateSelectModalRouteProp>();
  const {mode, onSelectTemplate, onAddTemplate} = route.params;
  const [templates, setTemplates] = useState<CareTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const {popToast} = useToastAlert();

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await NetWorkService.Get({
        url: 'https://service.giacaphevietnam.com/api/care-product/templates',
      });

      if (response?.data) {
        setTemplates(response.data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      popToast({
        message: 'Không thể tải danh sách template',
        iconName: 'error',
        iconColor: ColorDefault.error,
        textColor: ColorDefault.error,
      });
    } finally {
      setLoading(false);
    }
  };

  const addTemplateToUser = async (template: CareTemplate) => {
    try {
      const data = {
        templateId: template.id,
        startDate: new Date().toISOString(),
      };

      const response = await NetWorkService.Post({
        url: 'https://service.giacaphevietnam.com/api/care-product/user-templates',
        body: data,
      });

      if (response?.status) {
        popToast({
          message: 'Thêm template thành công',
          iconName: 'success',
          iconColor: ColorDefault.active,
          textColor: ColorDefault.active,
        });
        onAddTemplate?.(template);
        Utils.navigation.goBack();
      }
    } catch (error) {
      console.error('Error adding template:', error);
      popToast({
        message: 'Thêm template thất bại',
        iconName: 'error',
        iconColor: ColorDefault.error,
        textColor: ColorDefault.error,
      });
    }
  };

  const handleTemplatePress = (template: CareTemplate) => {
    if (mode === 'select') {
      onSelectTemplate?.(template);
      Utils.navigation.goBack();
    } else {
      addTemplateToUser(template);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const renderTemplate = ({item}: {item: CareTemplate}) => (
    <TouchableOpacity
      style={styles.templateItem}
      onPress={() => handleTemplatePress(item)}>
      <View style={styles.templateHeader}>
        <Text style={styles.templateName}>{item.name}</Text>
        <Icon
          icon={mode === 'select' ? 'right' : 'plus'}
          size={16}
          color={ColorDefault.facebook_blue}
        />
      </View>
      <Text style={styles.templateDescription}>{item.description}</Text>
      <View style={styles.templateFooter}>
        <Text style={styles.templateMeta}>
          {item.totalDays} ngày • {item.product.name}
        </Text>
        <Text style={styles.templateStatus}>
          {item.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
        </Text>
      </View>
    </TouchableOpacity>
  );
  const inset = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingTop: inset.top}]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={Utils.navigation.goBack}
          style={styles.closeButton}>
          <Icon icon="close" size={20} color={ColorDefault.text_black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === 'select' ? 'Chọn template' : 'Thêm template'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={ColorDefault.facebook_blue} />
          <Text style={styles.loadingText}>Đang tải templates...</Text>
        </View>
      ) : (
        <FlatList
          data={templates}
          renderItem={renderTemplate}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorDefault.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: ColorDefault.grey200,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColorDefault.text_black,
  },
  placeholder: {
    width: 28,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    color: ColorDefault.grey600,
    marginTop: 16,
  },
  listContainer: {
    padding: 16,
  },
  templateItem: {
    backgroundColor: ColorDefault.white,
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ColorDefault.grey200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  templateName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ColorDefault.text_black,
    flex: 1,
  },
  templateDescription: {
    fontSize: 14,
    color: ColorDefault.grey600,
    marginBottom: 12,
    lineHeight: 20,
  },
  templateFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templateMeta: {
    fontSize: 12,
    color: ColorDefault.facebook_blue,
    fontStyle: 'italic',
  },
  templateStatus: {
    fontSize: 12,
    color: ColorDefault.active,
    fontWeight: '600',
  },
});

export default TemplateSelectModal;
