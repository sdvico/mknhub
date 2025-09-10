import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import {ColorDefault} from '@/app/themes/color';
import {useSelector} from 'react-redux';

import {Ship} from '@/app/features/Tracking/types';

interface ShipSelectorRequiredProps {
  selectedShipId?: string;
  onSelectShip: (shipId: string) => void;
  customShips?: Ship[]; // Optional prop for custom ships list
}

export const ShipSelectorRequired: React.FC<ShipSelectorRequiredProps> = ({
  selectedShipId,
  onSelectShip,
  customShips,
}) => {
  const {ships} = useSelector((state: any) => state.ship) || {ships: []};
  const shipList = customShips || ships;
  const [modalVisible, setModalVisible] = useState(false);

  const selectedShip = shipList?.find(
    (ship: Ship) => ship.id === selectedShipId,
  );

  // Auto select first ship if no ship is selected and ships are available
  useEffect(() => {
    if (!selectedShipId && shipList && shipList.length > 0) {
      onSelectShip(shipList[0].id);
    }
  }, [shipList, selectedShipId, onSelectShip]);

  const renderShipItem = ({item}: {item: Ship}) => (
    <TouchableOpacity
      style={styles.shipItem}
      onPress={() => {
        onSelectShip(item.id);
        setModalVisible(false);
      }}>
      <View>
        <Text style={styles.shipName}>{item.plate_number}</Text>
      </View>
      {selectedShipId === item.id && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.selectedText}>Đã chọn</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Không có tàu nào</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.selectorText}>
          {selectedShip ? selectedShip.plate_number : 'Chọn tàu'}
        </Text>
        <Text style={styles.arrowText}>▼</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn tàu</Text>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>

            <FlatList
              data={shipList}
              renderItem={renderShipItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderEmpty}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  selector: {
    backgroundColor: ColorDefault.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ColorDefault.grey300,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorText: {
    fontSize: 16,
    color: ColorDefault.text_black,
    fontWeight: '500',
    flex: 1,
  },
  arrowText: {
    fontSize: 12,
    color: ColorDefault.grey600,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: ColorDefault.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: ColorDefault.grey200,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColorDefault.text_black,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: ColorDefault.grey600,
  },
  shipItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: ColorDefault.grey200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shipName: {
    fontSize: 16,
    fontWeight: '500',
    color: ColorDefault.text_black,
    marginBottom: 4,
  },
  selectedIndicator: {
    backgroundColor: ColorDefault.activebg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedText: {
    color: ColorDefault.active,
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: ColorDefault.grey600,
  },
});
