import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import {fetchPorts} from '@/app/store/saga/notification.saga';
import {ColorDefault} from '@/app/themes/color';
import {Text} from '@/app/library/components';

type Port = {
  code: string;
  name: string;
  loCode?: string;
  lat?: number;
  lng?: number;
  [key: string]: any;
};

type Props = {
  title?: string;
  onSelect: (port: Port) => void;
};

export type PortPickerSheetRef = {
  open: () => void;
  close: () => void;
};

export const PortPickerSheet = forwardRef<PortPickerSheetRef, Props>(
  ({title = 'Chọn cảng', onSelect}, ref) => {
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['90%'], []);
    const dispatch = useDispatch();
    const ports: Port[] = useSelector((state: any) => state.notification.ports);

    const [query, setQuery] = useState('');

    useImperativeHandle(ref, () => ({
      open: () => {
        if (!ports || ports.length === 0) {
          dispatch(fetchPorts());
        }
        sheetRef.current?.expand();
      },
      close: () => sheetRef.current?.close(),
    }));

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      [],
    );

    const normalized = (s: string) => s.toLowerCase().trim();
    const filteredPorts = useMemo(() => {
      const q = normalized(query);
      if (!q) return ports || [];
      return (ports || []).filter(
        p =>
          normalized(p.name || '').includes(q) ||
          normalized(p.code || '').includes(q),
      );
    }, [ports, query]);

    return (
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetIndicator}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Tìm theo tên hoặc mã cảng"
            placeholderTextColor={ColorDefault.grey600}
          />
          <BottomSheetFlatList
            data={filteredPorts}
            keyExtractor={(item: Port) => item.code}
            renderItem={({item}: {item: Port}) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  onSelect(item);
                  sheetRef.current?.close();
                }}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemSubtitle}>{item.code}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Không có dữ liệu</Text>
              </View>
            )}
          />
        </View>
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  sheetBackground: {backgroundColor: ColorDefault.white},
  sheetIndicator: {backgroundColor: ColorDefault.grey600},
  container: {flex: 1, padding: 16},
  title: {fontSize: 18, fontWeight: '700', color: ColorDefault.grey800},
  searchInput: {
    marginTop: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: ColorDefault.grey200,
    borderRadius: 8,
    padding: 12,
    color: ColorDefault.grey800,
    fontSize: 16,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: ColorDefault.grey100,
  },
  itemTitle: {fontSize: 16, color: ColorDefault.grey800, fontWeight: '600'},
  itemSubtitle: {fontSize: 13, color: ColorDefault.grey600, marginTop: 2},
  empty: {padding: 24, alignItems: 'center'},
  emptyText: {color: ColorDefault.grey600},
});

export default PortPickerSheet;
