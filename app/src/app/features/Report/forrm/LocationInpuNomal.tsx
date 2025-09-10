import React, {useImperativeHandle, useState} from 'react';
import {StatusBar} from 'react-native';
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';

export const DEFAULT_COORDINATE = {
  lat: 0,
  lng: 0,
};
export const toDMS = (decimal: number, isLatitude: boolean) => {
  const degrees = Math.floor(Math.abs(decimal));
  const minutes = Math.floor((Math.abs(decimal) - degrees) * 60);
  const seconds = parseFloat(
    ((Math.abs(decimal) - degrees - minutes / 60) * 3600).toFixed(2),
  );

  let direction;
  if (isLatitude) {
    direction = decimal >= 0 ? 'N' : 'S';
  } else {
    direction = decimal >= 0 ? 'E' : 'W';
  }

  return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
};

interface LocationInputProps {
  handleEditCoordinates: (coords: {
    latDMS: {
      degrees: string;
      minutes: string;
      seconds: string;
      direction: string;
    };
    lngDMS: {
      degrees: string;
      minutes: string;
      seconds: string;
      direction: string;
    };
  }) => void;
  portOutLatLngTime?: {
    latitude: number;
    longitude: number;
  };
}

export const LocationInputNomal = React.forwardRef<any, LocationInputProps>(
  ({handleEditCoordinates, portOutLatLngTime}, ref) => {
    const [isModalVisible, setModalVisible] = useState(false);

    const splitDMS = (dms: string) => {
      const regex = /(\d+)° (\d+)' (\d+(\.\d+)?)" ([NSEW])/;
      const match = dms.match(regex);
      if (match) {
        return {
          degrees: match[1],
          minutes: match[2],
          seconds: match[3],
          direction: match[5],
        };
      }
      return {degrees: '0', minutes: '0', seconds: '0', direction: 'N'}; // Default values
    };

    // useEffect(() => {
    //   const hideSub = Keyboard.addListener('keyboardDidHide', () => {
    //     setModalVisible(false);
    //   });

    //   return () => hideSub.remove();
    // }, []);

    const initlatDMS = splitDMS(toDMS(portOutLatLngTime?.latitude || 0, true));
    const initlngDMS = splitDMS(
      toDMS(portOutLatLngTime?.longitude || 0, false),
    );

    const [latDMS, setLatDMS] = useState(
      splitDMS(toDMS(DEFAULT_COORDINATE.lat, true)),
    );
    const [lngDMS, setLngDMS] = useState(
      splitDMS(toDMS(DEFAULT_COORDINATE.lng, false)),
    );

    useImperativeHandle(ref, () => ({
      showModal: () => {
        setLatDMS({
          degrees: initlatDMS.degrees,
          minutes: initlatDMS.minutes,
          seconds: initlatDMS.seconds,
          direction: initlatDMS.direction,
        });
        setLngDMS({
          degrees: initlngDMS.degrees,
          minutes: initlngDMS.minutes,
          seconds: initlngDMS.seconds,
          direction: initlngDMS.direction,
        });
        setModalVisible(true);
      },
      handleEditCoordinates,
      lngDMS,
      setLngDMS,
      latDMS,
      setLatDMS,
    }));

    const sanitizeNumeric = (text: string, max: number) => {
      if (!text) return '';

      // lấy phần trước dấu . hoặc , nếu người dùng gõ vô tình
      let s = text.split(/[.,]/)[0];

      // giữ chỉ chữ số
      s = s.replace(/\D/g, '');

      // xóa 0 đầu nếu >=2 ký tự
      if (s.length >= 2) {
        s = s.replace(/^0+/, '');
        if (s === '') s = '0';
      }

      if (s === '') return '';

      const num = Math.min(parseInt(s, 10), max);
      return String(num);
    };

    // const sanitizeNumeric = (text: string, max: number) => {
    //   let sanitized = text.replace(/[^0-9]/g, '');
    //   if (sanitized.length >= 2) {
    //     sanitized = sanitized.replace(/^0+/, '');
    //   }
    //   if (sanitized !== '') {
    //     const num = Math.min(parseInt(sanitized, 10), max);
    //     sanitized = String(num);
    //   }
    //   return sanitized;
    // };

    return (
      <Modal transparent visible={isModalVisible} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.pickerModalContainerPosition}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 15,
              color: '#000',
            }}>
            Chỉnh tọa độ
          </Text>
          <View
            style={{
              flexDirection: 'row',
              gap: 5,
              alignItems: 'center',
              marginBottom: 15,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                width: 70,
                color: '#000',
              }}>
              Kinh độ :
            </Text>
            <View style={styles.coordinateInputContainer}>
              <TextInput
                style={styles.coordinateInput}
                placeholder="Degrees"
                placeholderTextColor="#666"
                value={lngDMS.degrees}
                onChangeText={text => {
                  const sanitized = sanitizeNumeric(text, 180);
                  setLngDMS(prev => ({...prev, degrees: sanitized}));
                }}
                inputMode="numeric"
              />
              <Text style={{color: '#000', fontSize: 18}}>°</Text>
            </View>
            <View style={styles.coordinateInputContainer}>
              <TextInput
                style={styles.coordinateInput}
                placeholder="Minutes"
                placeholderTextColor="#666"
                value={lngDMS.minutes}
                onChangeText={text => {
                  const sanitized = sanitizeNumeric(text, 90);
                  setLngDMS(prev => ({...prev, minutes: sanitized}));
                }}
                inputMode="numeric"
              />
              <Text style={{color: '#000', fontSize: 18}}>'</Text>
            </View>
            <View style={styles.coordinateInputContainer}>
              <TextInput
                style={styles.coordinateInput}
                placeholder="Seconds"
                placeholderTextColor="#666"
                value={lngDMS.seconds}
                onChangeText={text => {
                  const sanitized = sanitizeNumeric(text, 90);
                  setLngDMS(prev => ({...prev, seconds: sanitized}));
                }}
                inputMode="numeric"
              />
              <Text style={{color: '#000', fontSize: 18}}>"</Text>
            </View>
            <Text style={styles.coordinateDirectionInput}>
              {lngDMS.direction}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              gap: 5,
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                width: 70,
                color: '#000',
              }}>
              Vĩ độ :
            </Text>
            <View style={styles.coordinateInputContainer}>
              <TextInput
                style={styles.coordinateInput}
                placeholder="Degrees"
                placeholderTextColor="#666"
                value={latDMS.degrees}
                onChangeText={text => {
                  const sanitized = sanitizeNumeric(text, 180);
                  setLatDMS(prev => ({...prev, degrees: sanitized}));
                }}
                inputMode="numeric"
              />
              <Text style={{color: '#000', fontSize: 18}}>°</Text>
            </View>
            <View style={styles.coordinateInputContainer}>
              <TextInput
                style={styles.coordinateInput}
                placeholder="Minutes"
                placeholderTextColor="#666"
                value={latDMS.minutes}
                onChangeText={text => {
                  const sanitized = sanitizeNumeric(text, 90);
                  setLatDMS(prev => ({...prev, minutes: sanitized}));
                }}
                inputMode="numeric"
              />
              <Text style={{color: '#000', fontSize: 18}}>'</Text>
            </View>
            <View style={styles.coordinateInputContainer}>
              <TextInput
                style={styles.coordinateInput}
                placeholder="Seconds"
                placeholderTextColor="#666"
                value={latDMS.seconds}
                onChangeText={text => {
                  const sanitized = sanitizeNumeric(text, 90);
                  setLatDMS(prev => ({...prev, seconds: sanitized}));
                }}
                inputMode="numeric"
              />
              <Text style={{color: '#000', fontSize: 18}}>"</Text>
            </View>
            <Text style={styles.coordinateDirectionInput}>
              {latDMS.direction}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              const normalize = (d: any) => ({
                degrees: d.degrees === '' ? '0' : d.degrees,
                minutes: d.minutes === '' ? '0' : d.minutes,
                seconds: d.seconds === '' ? '0' : d.seconds,
                direction: d.direction,
              });
              handleEditCoordinates({
                latDMS: normalize(latDMS),
                lngDMS: normalize(lngDMS),
              });
              setModalVisible(false);
            }}
            style={{
              backgroundColor: '#005492',
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 22}}>
              Lưu
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  safeArea: {
    height: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight,
  },
  headerImage: {
    height: 120,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    marginTop: -30,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    width: '100%',
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#212121',
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#757575',
  },
  infoSection: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#424242',
  },
  row: {flexDirection: 'row', alignItems: 'center', gap: 10},
  scheduleTxt: {
    fontSize: 20,
    color: '#000',
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  pickerModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  pickerModalContainerPosition: {
    position: 'absolute',
    top: '25%',
    left: '10%',
    right: '10%',
    padding: 10,
    marginHorizontal: -25,
    maxHeight: Platform.OS === 'ios' ? 250 : 265,
    backgroundColor: '#fff',
    borderRadius: 8,
    gap: 10,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  goButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 1 : 10,
    width: '100%',
    backgroundColor: '#005492',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonTxt: {color: '#fff', fontWeight: 'bold', fontSize: 22},
  mapContainer: {
    flex: 1,
    marginBottom: Platform.OS === 'ios' ? 40 : 50,
    borderRadius: 20,
    backgroundColor: 'red',
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#1976d2',
    position: 'relative',
  },
  coordinatesContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(25, 118, 210, 0.7)',
    borderRadius: 8,
    padding: 10,
    zIndex: 1,
    flexDirection: 'column',
  },
  coordinateText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  editButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    color: 'white',
    fontSize: 14,
  },
  locationMarker: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 10,
    top: '50%',
    left: '50%',
    marginLeft: -10,
    marginTop: -10,
  },
  submitButton: {
    backgroundColor: '#1565c0',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 30,
    padding: 5,
    zIndex: 1000,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#005492',
    fontWeight: 'bold',
  },
  coordinateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#AFCDEE',
    borderRadius: 16,
    paddingHorizontal: 4,
    height: 40,
  },
  coordinateInput: {
    width: 45,
    height: 38,
    fontSize: 18,
    textAlign: 'center',
    color: '#000',
    padding: 0,
  },
  coordinateDirectionInput: {
    fontSize: 24,
    textAlign: 'center',
    color: '#000',
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
});
