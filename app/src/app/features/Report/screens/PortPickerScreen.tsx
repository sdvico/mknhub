import React, {useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {APP_SCREEN, RootStackParamList} from '../../../navigation/screen-types';
import {useDispatch, useSelector} from 'react-redux';
import {fetchPorts} from '@/app/store/saga/notification.saga';
import {ColorDefault} from '../../../themes/color';

type Props = StackScreenProps<
  RootStackParamList,
  APP_SCREEN.PORT_PICKER_SCREEN
>;

type Port = {
  code: string;
  name: string;
  loCode?: string;
  lat?: number;
  lng?: number;
  [key: string]: any;
};

export const PortPickerScreen: React.FC<Props> = ({route, navigation}) => {
  const {onSelect} = route.params;
  const dispatch = useDispatch();
  const ports: Port[] = useSelector((state: any) => state.notification.ports);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!ports || ports.length === 0) {
      dispatch(fetchPorts());
    }
  }, [dispatch, ports]);

  const normalized = (s: string) => s.toLowerCase().trim();
  const filteredPorts = useMemo(() => {
    const q = normalized(query);
    if (!q) {
      return ports || [];
    }
    return (ports || []).filter(
      p =>
        normalized(p.name || '').includes(q) ||
        normalized(p.code || '').includes(q),
    );
  }, [ports, query]);

  const handleSelectPort = (port: Port) => {
    onSelect(port);
    navigation.goBack();
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const renderPortItem = ({item}: {item: Port}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleSelectPort(item)}>
      <Text style={styles.itemTitle}>{item.name}</Text>
      <Text style={styles.itemSubtitle}>{item.code}</Text>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>Không có dữ liệu</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Chọn cảng</Text>
      </View>

      <View style={styles.content}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Tìm theo tên hoặc mã cảng"
          placeholderTextColor={ColorDefault.grey600}
        />

        <FlatList
          data={filteredPorts}
          keyExtractor={(item: Port) => item.code}
          renderItem={renderPortItem}
          ListEmptyComponent={renderEmpty}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  empty: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
});
