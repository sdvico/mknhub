import {useRoute} from '@react-navigation/core';
import React, {useMemo, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {ShipSelector} from '../../components/ShipSelector';
import {useInfiniteList} from '../../hooks/useInfiniteList';
import {Text} from '../../library/components';
import {ColorDefault} from '../../themes/color';
import HeaderBasic from '../common/components/header/header-basic';
import LocationInfoCard from '../common/components/LocationInfoCard';
import {Report} from './types';

const ReportScreen = () => {
  const ship = (useRoute() as any)?.params?.ship;
  const [selectedShipId, setSelectedShipId] = useState<string>(ship?.id || '');

  const params = useMemo(() => {
    return {
      ship_id: selectedShipId,
    };
  }, [selectedShipId]);

  const paramsStringKey = useMemo(
    () => Object.values(params).join('&'),
    [params],
  );

  const {data, loading, refreshing, loadMore, refresh} =
    useInfiniteList<Report>({
      url: '/api/reports/my-reports',
      params: params,
      paramsStringKey: paramsStringKey,
    });

  const renderReportItem = ({item}: {item: Report}) => {
    // console.log('item', item);

    return (
      <View style={styles.reportItem}>
        <View style={styles.reportHeader}>
          {item.reporter_ship?.plate_number && (
            <Text style={styles.shipName}>
              {item.reporter_ship?.plate_number}
            </Text>
          )}
          <View>
            <Text style={styles.timestamp}>
              {new Date(item.reported_at).toLocaleString('vi-VN')}
            </Text>
          </View>
        </View>

        {item.lat && (
          <View style={styles.locationContainer}>
            <LocationInfoCard
              time={item.reported_at}
              lat={item.lat}
              lng={item.lng}
              source={item.source || 'web'}
              statusLabel={'Đã khai báo'}
              showMap={false}
            />
          </View>
        )}
        <View>
          <Text>
            <Text style={styles.note}>{'Ghi chú: '}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </Text>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loading) {
      return null;
    }
    return (
      <View style={styles.loaderFooter}>
        <ActivityIndicator size="small" color={ColorDefault.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return null;
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Chưa có báo cáo nào</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderBasic title="Báo cáo GPS" isBackButton={true} />
      <View style={styles.content}>
        <ShipSelector
          selectedShipId={selectedShipId}
          onSelectShip={(id?: string) => setSelectedShipId(id || '')}
        />
        <FlatList
          data={(data as unknown as Report[]) || []}
          renderItem={renderReportItem}
          keyExtractor={item => item.id}
          onRefresh={refresh}
          refreshing={refreshing}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={[
            styles.listContent,
            !data?.length && styles.emptyList,
          ]}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
        />

        {/* <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateReport}>
          <Text style={styles.createButtonText}>Tạo báo cáo mới</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorDefault.background,
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyList: {
    flex: 1,
  },
  reportItem: {
    backgroundColor: ColorDefault.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ColorDefault.grey200,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: ColorDefault.grey600,
  },
  note: {
    fontSize: 16,
    color: ColorDefault.text,
  },
  shipName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColorDefault.facebook_blue,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pendingBadge: {
    backgroundColor: ColorDefault.grey100,
  },
  inProgressBadge: {
    backgroundColor: ColorDefault.facebook_blue,
  },
  resolvedBadge: {
    backgroundColor: ColorDefault.green,
  },
  rejectedBadge: {
    backgroundColor: ColorDefault.error,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: ColorDefault.grey800,
    marginBottom: 12,
  },
  locationContainer: {},
  locationLabel: {
    fontSize: 14,
    color: ColorDefault.grey600,
    width: 60,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: ColorDefault.grey800,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    marginHorizontal: -4,
  },
  image: {
    width: 100,
    height: 100,
    margin: 4,
    borderRadius: 4,
  },
  responseContainer: {
    backgroundColor: ColorDefault.grey200,
    padding: 12,
    borderRadius: 8,
  },
  responseLabel: {
    fontSize: 12,
    color: ColorDefault.grey600,
    marginBottom: 4,
  },
  responseContent: {
    fontSize: 14,
    color: ColorDefault.grey800,
  },
  createButton: {
    backgroundColor: ColorDefault.primary,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: ColorDefault.white,
    fontSize: 16,
    fontWeight: '600',
  },
  loaderFooter: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: ColorDefault.grey600,
  },
});

export default ReportScreen;
