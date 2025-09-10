import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ColorDefault} from '@/app/themes/color';
import {format} from 'date-fns';
import {StatusBadge} from '@/app/components/StatusBadge';
import {ShipSelector} from '@/app/components/ShipSelector';
import {useInfiniteList} from '@/app/hooks/useInfiniteList';
import HeaderBasic from '../common/components/header/header-basic';

interface FishingGroundItem {
  id: string;
  title: string;
  description: string;
  link: string;
  total_views: number;
  total_clicks: number;
  enable: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

// Example ships data - replace with your actual data source
const mockShips = [
  {
    id: '1',
    name: 'BV-12345-TS',
    location: 'Ngoài khơi',
    monitoringDevice: 'VIETTEL',
  },
  {
    id: '2',
    name: 'BV-11111-TS',
    location: 'Vân Thanh',
    monitoringDevice: 'Không có thiết bị',
  },
];

export const FishingGroundScreen = () => {
  const insets = useSafeAreaInsets();
  const [selectedShipId, setSelectedShipId] = useState<string>();

  const {data, refreshing, loadMore, refresh} =
    useInfiniteList<FishingGroundItem>({
      url: '/api/fishing-zones/list',
    });

  //

  console.log('data---->', data);

  const handleShipSelect = (shipId: string | undefined) => {
    setSelectedShipId(shipId);
    // Implement ship selection logic here
  };

  const renderFishingGroundItem = ({item}: {item: FishingGroundItem}) => {
    const handlePress = async () => {
      if (item.link) {
        try {
          await Linking.openURL(item.link);
        } catch (error) {
          console.error('Error opening link:', error);
        }
      }
    };

    return (
      <TouchableOpacity style={styles.fishingGroundItem} onPress={handlePress}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <StatusBadge
            type={item.enable ? 'success' : 'error'}
            value={item.enable ? 'Đang hoạt động' : 'Ngừng hoạt động'}
          />
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Ngày đăng:</Text>
            <Text style={styles.dateValue}>
              {format(new Date(item.published_at), 'dd/MM/yyyy HH:mm')}
            </Text>
          </View>
          <StatusBadge
            type="info"
            value={`${item.total_views || 0} lượt xem`}
            style={styles.viewsBadge}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container]}>
      <HeaderBasic title="Ngư trường" />
      <FlatList
        data={data || []}
        renderItem={renderFishingGroundItem}
        keyExtractor={item => item.id}
        onRefresh={refresh}
        refreshing={refreshing}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorDefault.background,
  },
  listContent: {
    padding: 16,
  },
  fishingGroundItem: {
    backgroundColor: ColorDefault.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ColorDefault.grey200,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: ColorDefault.grey800,
    marginRight: 12,
  },
  description: {
    fontSize: 14,
    color: ColorDefault.grey600,
    marginBottom: 16,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 14,
    color: ColorDefault.grey600,
    marginRight: 8,
  },
  dateValue: {
    fontSize: 14,
    color: ColorDefault.grey800,
    fontWeight: '500',
  },
  viewsBadge: {
    marginLeft: 8,
  },
});
