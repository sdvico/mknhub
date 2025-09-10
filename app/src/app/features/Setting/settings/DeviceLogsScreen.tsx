import {ColorDefault} from '@/app/themes/color';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderBasic from '../../common/components/header/header-basic';

interface RouteParams {
  deviceId: string;
  deviceName: string;
  hwType?: string;
}

interface LogEntry {
  hw_type: string;
  device_id: string;
  prompt: string;
  generated_code: string;
  prompt_time: string;
  status: string;
}

interface LogsResponse {
  logs: LogEntry[];
  total: number;
  has_more: boolean;
}

const DeviceLogsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const {deviceId, deviceName, hwType} = route.params as RouteParams;

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Constants
  const DAYS_PER_PAGE = 30;
  const API_BASE_URL = 'http://61.28.230.92:8023';
  const API_KEY = 'admin';
  const SECRET_KEY = '8ea73cd9b25da';

  // Calculate date range for current page
  const getDateRange = useCallback((pageNum: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - pageNum * DAYS_PER_PAGE);

    return {
      startTime: startDate.toISOString().slice(0, 19).replace('T', ' '),
      endTime: endDate.toISOString().slice(0, 19).replace('T', ' '),
    };
  }, []);

  // Fetch logs from API
  const fetchLogs = useCallback(
    async (pageNum: number, isRefresh = false) => {
      if (loading || (isRefresh ? false : loadingMore)) return;

      try {
        if (isRefresh) {
          setRefreshing(true);
          setPage(1);
        } else {
          setLoadingMore(true);
        }

        const {startTime, endTime} = getDateRange(pageNum);

        // Prepare form data
        const formData = new URLSearchParams();
        formData.append('key', API_KEY);
        formData.append('secret-key', SECRET_KEY);

        if (hwType) {
          formData.append('hw_type', hwType);
        }

        if (deviceId) {
          formData.append('device_id', deviceId);
        }

        formData.append('start_time', startTime);
        formData.append('end_time', endTime);

        const response = await fetch(`${API_BASE_URL}/v2/device/logs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: LogsResponse = await response.json();

        if (isRefresh) {
          setLogs(data.logs || []);
        } else {
          setLogs(prev => [...prev, ...(data.logs || [])]);
        }

        setHasMore(data.has_more !== false);
        setError(null);
      } catch (err) {
        console.error('Error fetching logs:', err);
        setError(err instanceof Error ? err.message : 'Không thể tải logs');

        if (isRefresh) {
          setLogs([]);
        }
      } finally {
        if (isRefresh) {
          setRefreshing(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [deviceId, hwType, loading, loadingMore, getDateRange],
  );

  // Initial load
  useEffect(() => {
    fetchLogs(1, true);
  }, [fetchLogs]);

  // Load more function
  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchLogs(nextPage);
    }
  }, [hasMore, loadingMore, loading, page, fetchLogs]);

  // Refresh function
  const onRefresh = useCallback(() => {
    fetchLogs(1, true);
  }, [fetchLogs]);

  // Render log item
  const renderLogItem = useCallback(({item}: {item: LogEntry}) => {
    const formatTime = (timeString: string) => {
      try {
        const date = new Date(timeString);
        return date.toLocaleString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
      } catch {
        return timeString;
      }
    };

    const getStatusColor = (status: string) => {
      switch (status?.toLowerCase()) {
        case 'success':
          return '#4CAF50';
        case 'error':
          return '#F44336';
        case 'processing':
          return '#FF9800';
        default:
          return '#9E9E9E';
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status?.toLowerCase()) {
        case 'success':
          return 'checkmark-circle';
        case 'error':
          return 'close-circle';
        case 'processing':
          return 'time';
        default:
          return 'help-circle';
      }
    };

    return (
      <View style={styles.logItem}>
        <View style={styles.logHeader}>
          <View style={styles.logInfo}>
            <Text style={styles.deviceId}>{item.device_id}</Text>
            <Text style={styles.hwType}>{item.hw_type}</Text>
          </View>
          <View style={styles.statusContainer}>
            <Icon
              name={getStatusIcon(item.status)}
              size={16}
              color={getStatusColor(item.status)}
            />
            <Text
              style={[styles.statusText, {color: getStatusColor(item.status)}]}>
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.promptText}>{item.prompt}</Text>

        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>Generated Code:</Text>
          <Text style={styles.codeText} numberOfLines={3}>
            {item.generated_code}
          </Text>
        </View>

        <Text style={styles.timeText}>{formatTime(item.prompt_time)}</Text>
      </View>
    );
  }, []);

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="document-text-outline" size={64} color="#ccc" />
      <Text style={styles.emptyStateText}>Chưa có logs nào</Text>
      <Text style={styles.emptyStateSubtext}>
        Không có logs build nào cho thiết bị này
      </Text>
    </View>
  );

  // Render footer with loading indicator
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator
          size="small"
          color={ColorDefault.background_primary}
        />
        <Text style={styles.footerText}>Đang tải thêm...</Text>
      </View>
    );
  };

  // Render error state
  const renderError = () => {
    if (!error) return null;
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={48} color="#F44336" />
        <Text style={styles.errorTitle}>Lỗi tải logs</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, {paddingBottom: insets.bottom}]}>
      <HeaderBasic
        title={`Logs Build - ${deviceName || 'Thiết bị'}`}
        isBackButton={true}
        rightChildren={
          <TouchableOpacity
            onPress={onRefresh}
            style={styles.refreshButton}
            disabled={refreshing}>
            <Icon
              name="refresh"
              size={24}
              color={refreshing ? '#ccc' : '#007AFF'}
            />
          </TouchableOpacity>
        }
      />

      {error && logs.length === 0 ? (
        renderError()
      ) : (
        <FlatList
          data={logs}
          renderItem={renderLogItem}
          keyExtractor={(item, index) =>
            `${item.device_id}-${item.prompt_time}-${index}`
          }
          contentContainerStyle={styles.logsList}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[ColorDefault.background_primary]}
              tintColor={ColorDefault.background_primary}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={10}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  logsList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  logItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  logInfo: {
    flex: 1,
  },
  deviceId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  hwType: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  promptText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
    fontWeight: '500',
  },
  codeContainer: {
    marginBottom: 12,
  },
  codeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  codeText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f8f8f8',
    padding: 8,
    borderRadius: 6,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: ColorDefault.background_primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  refreshButton: {
    padding: 8,
    paddingBottom: 0,
  },
});

export default DeviceLogsScreen;
