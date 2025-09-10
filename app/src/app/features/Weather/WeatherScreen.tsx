import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {Text} from '@/app/library/components';
import {ColorDefault} from '@/app/themes/color';
import HeaderBasic from '../common/components/header/header-basic';
import {WeatherReport} from './types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {fetchWeather} from '@/app/store/saga/weather.saga';

export const WeatherScreen = () => {
  const dispatch = useDispatch();
  const {reports, loading} = useSelector((state: any) => state.weather);

  useEffect(() => {
    dispatch(fetchWeather());
  }, [dispatch]);

  const refresh = () => {
    dispatch(fetchWeather());
  };

  const renderWeatherItem = ({item}: {item: WeatherReport}) => {
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
      <TouchableOpacity
        style={styles.weatherItem}
        onPress={handlePress}
        disabled={!item.link}>
        <View style={styles.header}>
          <View style={styles.regionContainer}>
            <Ionicons
              name="location"
              size={20}
              color={ColorDefault.facebook_blue}
            />
            <Text style={styles.region}>{item.region}</Text>
          </View>
          <Text style={styles.date}>
            {new Date(item.published_at || item.created_at).toLocaleString(
              'vi-VN',
            )}
          </Text>
        </View>

        <Text style={styles.summary}>{item.summary}</Text>

        <View style={styles.detailsContainer}>
          {item.cloud && (
            <View style={styles.detailItem}>
              <Ionicons name="cloud" size={20} color={ColorDefault.grey600} />
              <Text style={styles.detailText}>{item.cloud}</Text>
            </View>
          )}
          {item.rain && (
            <View style={styles.detailItem}>
              <Ionicons name="rainy" size={20} color={ColorDefault.grey600} />
              <Text style={styles.detailText}>{item.rain}</Text>
            </View>
          )}
          {item.wind && (
            <View style={styles.detailItem}>
              <Ionicons
                name="speedometer"
                size={20}
                color={ColorDefault.grey600}
              />
              <Text style={styles.detailText}>{item.wind}</Text>
            </View>
          )}
          {item.wave && (
            <View style={styles.detailItem}>
              <Ionicons name="water" size={20} color={ColorDefault.grey600} />
              <Text style={styles.detailText}>{item.wave}</Text>
            </View>
          )}
          {item.visibility && (
            <View style={styles.detailItem}>
              <Ionicons name="eye" size={20} color={ColorDefault.grey600} />
              <Text style={styles.detailText}>{item.visibility}</Text>
            </View>
          )}
        </View>

        {(item.advice || item.recommendation) && (
          <View style={styles.warningContainer}>
            <Ionicons
              name="warning"
              size={20}
              color={ColorDefault.orange}
              style={styles.warningIcon}
            />
            <Text style={styles.warningText}>
              {item.advice || item.recommendation}
            </Text>
          </View>
        )}

        {item.link && (
          <View style={styles.linkContainer}>
            <Ionicons
              name="open-outline"
              size={16}
              color={ColorDefault.facebook_blue}
            />
            <Text style={styles.linkText}>Xem chi tiết</Text>
          </View>
        )}
      </TouchableOpacity>
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
        <Text style={styles.emptyText}>Không có dữ liệu thời tiết</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderBasic title="Thời tiết biển" />
      <FlatList
        data={reports}
        renderItem={renderWeatherItem}
        keyExtractor={item => item.id}
        onRefresh={refresh}
        refreshing={loading}
        contentContainerStyle={[
          styles.listContent,
          !reports?.length && styles.emptyList,
        ]}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
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
  emptyList: {
    flex: 1,
  },
  weatherItem: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  regionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  region: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorDefault.grey800,
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: ColorDefault.grey600,
  },
  summary: {
    fontSize: 14,
    color: ColorDefault.grey800,
    lineHeight: 20,
    marginBottom: 12,
  },
  detailsContainer: {
    backgroundColor: ColorDefault.grey100,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    color: ColorDefault.grey800,
  },
  warningContainer: {
    flexDirection: 'row',
    backgroundColor: ColorDefault.warningbg,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  warningIcon: {
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: ColorDefault.grey800,
    lineHeight: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 4,
  },
  linkText: {
    fontSize: 14,
    color: ColorDefault.facebook_blue,
  },
  loaderFooter: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: ColorDefault.grey600,
  },
});
