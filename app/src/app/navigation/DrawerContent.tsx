import {DrawerActions, useNavigation} from '@react-navigation/core';
import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PlateInfo from '../features/logbook/newScreens/PortOut/components/PlateInfo';
import WelcomeView from '../features/logbook/newScreens/PortOut/components/WelcomeView';
import {Divider, Icon} from '../library/components';
import Utils, {PaddingSize} from '../library/utils';
import {ColorDefault} from '../themes/color';
import {APP_SCREEN} from './screen-types';
import {useToastAlert} from '../components/ToastAlertContext';

const menu = [
  {
    id: -1,
    name: 'Ứng dụng',
    childs: [
      {
        id: 1,
        name: 'Thông báo',
        path: APP_SCREEN.NOTIFICATION_LIST,
      },
      {
        id: 1,
        name: 'Nhật ký khai thác',
        path: APP_SCREEN.TAB_HOME,
      },

      {
        id: 1,
        name: 'Thanh toán S-Tracking',
        path: APP_SCREEN.HOME_PAYMENT,
      },
      {
        id: 1,
        name: 'Lịch sử thanh toán',
        path: APP_SCREEN.HOME_PAYMENT,
      },
      {
        id: 1,
        name: 'Báo cáo vị trí thủ công',
        path: APP_SCREEN.HOME_REPORT_LOCATION,
      },
    ],
  },

  {
    id: 3,
    name: 'Tài khoản và bảo mật',
    childs: [
      {
        id: 2,
        name: 'Thông tin tài khoản',
      },
      {
        id: 2,
        name: 'Sao lưu và khôi phục',
        path: APP_SCREEN.HOME_BACKUP_DATA,
      },
      {
        id: 2,
        name: 'Yêu cầu xoá tài khoản',
        path: APP_SCREEN.AUTH_DELETE_ACCOUNT,
      },
      {
        id: 2,
        name: 'Đổi mật khẩu',
        path: APP_SCREEN.CHANGE_PASSWORD,
      },
    ],
  },

  {
    id: 2,
    name: 'Chính sách và quy định',
    childs: [
      {
        id: 2,
        name: 'Điều khoản sử dụng',
        path: APP_SCREEN.WEBVIEW_SCREEN,
        params: {
          title: 'Điều khoản sử dụng',
          url: 'https://soba.vn/chinh-sach-su-dung',
        },
      },
      {
        id: 3,
        name: 'Chính sách bảo mật',
        path: APP_SCREEN.WEBVIEW_SCREEN,
        params: {
          title: 'Chính sách bảo mật',
          url: 'https://soba.vn/chinh-sach-bao-mat',
        },
      },
      {
        id: 5,
        name: 'Quy chế',
        path: APP_SCREEN.WEBVIEW_SCREEN,
        params: {
          title: 'Quy chế',
          url: 'https://soba.vn/quy-che',
        },
      },
      {
        id: 4,
        name: 'Chính sách giải quyết tranh chấp',
        path: APP_SCREEN.WEBVIEW_SCREEN,
        params: {
          title: 'Chính sách giải quyết tranh chấp',
          url: 'https://soba.vn/chinh-sach-giai-quyet-tranh-chap',
        },
      },
    ],
  },
];

export const DrawerContentView = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {showAlert, popToast} = useToastAlert();

  const onPress = item => {
    navigation.dispatch(DrawerActions.closeDrawer());
    if (item.path) {
      setTimeout(() => {
        Utils.navigation.push(item.path, item.params || {});
      }, 500);
    } else {
      popToast({
        message: 'Chức năng đang phát triển',
        iconName: 'info',
        iconColor: ColorDefault.facebook_blue,
        textColor: ColorDefault.facebook_blue,
        backgroundColor: ColorDefault.white,
      });
    }
  };

  const renderItemMenu = (item, index, islast) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => onPress(item)}
          key={index}
          style={{
            paddingInline: 16,
            paddingVertical: 16,
            flexDirection: 'row',
            paddingLeft: 16,
          }}>
          <Text style={{fontSize: 18, color: ColorDefault.white, flex: 1}}>
            {item.name}
          </Text>
          <Icon icon="right" size={14} color={ColorDefault.grey800} />
        </TouchableOpacity>
        {!islast && (
          <View style={{flexDirection: 'row', paddingLeft: 16}}>
            <Divider
              style={{
                backgroundColor: ColorDefault.grey800,
              }}
            />
          </View>
        )}
      </View>
    );
  };

  const renderGroupMenu = (item, index) => {
    return (
      <View key={index} style={{padding: 8, paddingHorizontal: 16}}>
        <Text
          style={{
            color: ColorDefault.text_grey600,
            paddingBottom: 16,
            fontWeight: 'bold',
            marginLeft: 16,
          }}>
          {item.name}
        </Text>
        <View
          style={{
            backgroundColor: ColorDefault.background_modal,
            borderRadius: 8,
            // paddingBottom: 16,
            // padding: 8,
          }}>
          {item.childs?.map((_item, index) => {
            return renderItemMenu(
              _item,
              index,
              item.childs?.length - 1 === index,
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        paddingTop: insets.top,
        backgroundColor: ColorDefault.primary,
        paddingBottom: insets.bottom + 20,
      }}>
      <View style={{flex: 1, gap: 10}}>
        <WelcomeView />
        <View style={{paddingHorizontal: PaddingSize.size24}}>
          <PlateInfo fontSize={30} isShowLogout={true} />
        </View>
        <View style={{flex: 1}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {menu.map(renderGroupMenu)}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default DrawerContentView;
