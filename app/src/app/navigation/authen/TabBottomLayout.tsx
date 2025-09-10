import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Text} from '../../library/components';
import Utils from '../../library/utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {APP_SCREEN, RootStackParamList} from '../../navigation/screen-types';
import {useTheme} from '../../themes';
import {styles} from './style';

type TypeTab = {
  id: number | string;
  SCREEN: keyof RootStackParamList;
  name: string;
  iconName: string;
  isOverrideColorIcon?: boolean;
  showBadge?: boolean;
  textKey?: string;
};

const TabBottomLayout = (props: BottomTabBarProps): React.ReactElement => {
  const {
    state: {index},
  } = props;

  const {t} = useTranslation();

  const TabList: TypeTab[] = [
    {
      id: 1,
      SCREEN: APP_SCREEN.TAB_FISHING_GROUND,
      name: 'Ngư trường',
      iconName: 'fish',
      isOverrideColorIcon: true,
      textKey: 'Ngư trường',
    },
    {
      id: 4,
      SCREEN: APP_SCREEN.TAB_WEATHER,
      name: 'Thời tiết',
      iconName: 'partly-sunny',
      isOverrideColorIcon: true,
      textKey: 'Thời tiết',
    },

    {
      id: 2,
      SCREEN: APP_SCREEN.TAB_TRACKING,
      name: 'Tracking',
      iconName: 'boat',
      isOverrideColorIcon: true,
      textKey: 'Tracking',
    },
    // {
    //   id: 3,
    //   SCREEN: APP_SCREEN.TAB_NOTIFICATION,
    //   name: t('common:notification'),
    //   iconName: 'notifications-outline',
    //   isOverrideColorIcon: true,
    //   showBadge: true,
    //   textKey: t('common:notification'),
    // },
    {
      id: 5,
      SCREEN: APP_SCREEN.TAB_FEEDBACK,
      name: 'Phản ánh',
      iconName: 'chatbox',
      isOverrideColorIcon: true,
      textKey: 'Phản ánh',
    },
    {
      id: 5,
      SCREEN: APP_SCREEN.TAB_ACCOUNT,
      name: t('common:account'),
      iconName: 'person-outline',
      isOverrideColorIcon: true,
      textKey: t('common:account'),
    },
  ];

  const theme = useTheme();

  const onPress = (item: TypeTab) => {
    Utils.navigation.navigate(item.SCREEN);
  };

  const stylesTab = styles(theme);

  const renderItemTab = (
    item: TypeTab,
    indexTab: number,
  ): React.ReactElement => {
    const {isOverrideColorIcon, textKey} = item;
    const isForcus = indexTab === index;
    const currenColor =
      indexTab === index ? theme.colors.primary : theme.colors.text_black;

    return (
      <TouchableOpacity
        key={item.SCREEN}
        onPress={() => onPress(item)}
        style={stylesTab.itemStyle}>
        <View>
          <Ionicons
            name={item.iconName}
            color={currenColor}
            size={isForcus ? 24 : 20}
          />
        </View>
        <Text
          color={currenColor}
          fontSize={10}
          style={{textAlign: 'center', marginTop: 4}}>
          {t('' + textKey)}
        </Text>
      </TouchableOpacity>
    );
  };

  const insets = useSafeAreaInsets();
  return (
    <View style={[stylesTab.container, {paddingBottom: insets.bottom}]}>
      {TabList.map(renderItemTab)}
    </View>
  );
};

export {TabBottomLayout};
