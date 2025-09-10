import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {ColorDefault} from '../../themes/color';
import {Icon} from '@/app/library/components';

interface DMSInput {
  degrees: string;
  minutes: string;
  seconds: string;
}

interface ManualLocationFormProps {
  plateNumber?: string;
  onSubmit: (data: {lat: number; lng: number; time: string}) => void;
  onClose: () => void;
}

export const ManualLocationForm: React.FC<ManualLocationFormProps> = ({
  plateNumber,
  onSubmit,
  onClose,
}) => {
  const [latitude, setLatitude] = useState<DMSInput>({
    degrees: '0',
    minutes: '0',
    seconds: '0',
  });
  const [longitude, setLongitude] = useState<DMSInput>({
    degrees: '0',
    minutes: '0',
    seconds: '0',
  });

  // Vietnam sea zone boundaries
  const VIETNAM_SEA_BOUNDS = {
    north: 21.505833, // 21°30'21"N
    south: 5.852778, // 05°51'10"N
    east: 117.978333, // 117°58'42"E
    west: 102.201667, // 102°12'06"E
  };

  const dmsToDecimal = (dms: DMSInput): number => {
    const degrees = parseFloat(dms.degrees) || 0;
    const minutes = parseFloat(dms.minutes) || 0;
    const seconds = parseFloat(dms.seconds) || 0;
    const decimal = degrees + minutes / 60 + seconds / 3600;
    return parseFloat(decimal.toFixed(6));
  };

  const validateVietnamSeaZone = (lat: number, lng: number): boolean => {
    return (
      lat >= VIETNAM_SEA_BOUNDS.south &&
      lat <= VIETNAM_SEA_BOUNDS.north &&
      lng >= VIETNAM_SEA_BOUNDS.west &&
      lng <= VIETNAM_SEA_BOUNDS.east
    );
  };

  const validateDMS = (dms: DMSInput): boolean => {
    const degrees = parseFloat(dms.degrees);
    const minutes = parseFloat(dms.minutes);
    const seconds = parseFloat(dms.seconds);
    if (isNaN(degrees) || isNaN(minutes) || isNaN(seconds)) {
      return false;
    }
    return (
      degrees >= 0 &&
      degrees <= 180 &&
      minutes >= 0 &&
      minutes < 60 &&
      seconds >= 0 &&
      seconds < 60
    );
  };

  const handleSubmit = () => {
    // Auto-fill seconds with "00" if empty
    let updatedLatitude = {...latitude};
    let updatedLongitude = {...longitude};

    if (!latitude.seconds) {
      updatedLatitude.seconds = '00';
    }
    if (!longitude.seconds) {
      updatedLongitude.seconds = '00';
    }

    if (!validateDMS(updatedLatitude) || !validateDMS(updatedLongitude)) {
      Alert.alert('Lỗi', 'Vui lòng nhập đúng định dạng DMS (độ, phút, giây)');
      return;
    }

    const latDecimal = dmsToDecimal(updatedLatitude);
    const lngDecimal = dmsToDecimal(updatedLongitude);

    if (!validateVietnamSeaZone(latDecimal, lngDecimal)) {
      Alert.alert(
        'Vị trí ngoài vùng biển Việt Nam',
        'Vị trí này nằm ngoài vùng biển Việt Nam. Vui lòng kiểm tra lại tọa độ.',
      );
      return;
    }

    const currentTime = new Date().toISOString();
    onSubmit({
      lat: latDecimal,
      lng: lngDecimal,
      time: currentTime,
    });
  };

  const renderDMSInput = (
    label: string,
    value: DMSInput,
    onChange: (dms: DMSInput) => void,
  ) => (
    <View style={styles.dmsSection}>
      <Text style={styles.sectionTitle}>{label}</Text>
      <View style={styles.dmsRow}>
        <View style={styles.dmsField}>
          <Text style={styles.dmsLabel}>° (Độ)</Text>
          <TextInput
            style={styles.dmsInput}
            value={value.degrees}
            onChangeText={text => onChange({...value, degrees: text})}
            placeholder="0"
            keyboardType="numeric"
            maxLength={3}
          />
        </View>
        <View style={styles.dmsField}>
          <Text style={styles.dmsLabel}>' (Phút)</Text>
          <TextInput
            style={styles.dmsInput}
            value={value.minutes}
            onChangeText={text => onChange({...value, minutes: text})}
            placeholder="0"
            keyboardType="numeric"
            maxLength={2}
          />
        </View>
        <View style={styles.dmsField}>
          <Text style={styles.dmsLabel}>(Giây)</Text>
          <TextInput
            style={styles.dmsInput}
            value={value.seconds}
            onChangeText={text => onChange({...value, seconds: text})}
            placeholder="0"
            keyboardType="numeric"
            maxLength={7}
            onBlur={() => {
              if (!value.seconds) {
                onChange({...value, seconds: '00'});
              }
            }}
          />
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Icon icon="arrow_back" size={24} color={ColorDefault.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Khai báo vị trí</Text>
        <View style={styles.placeholder} />
      </View>

      {plateNumber && (
        <View style={styles.shipInfo}>
          <Icon icon="boat" size={20} color={ColorDefault.orange} />
          <Text style={styles.shipLabel}>Khai báo vị trí cho tàu:</Text>
          <Text style={styles.shipCode}>{plateNumber}</Text>
        </View>
      )}

      {renderDMSInput('Vĩ độ (Latitude)', latitude, setLatitude)}
      {renderDMSInput('Kinh độ (Longitude)', longitude, setLongitude)}

      <View style={styles.infoBox}>
        <Icon icon="info" size={20} color={ColorDefault.primary} />
        <Text style={styles.infoText}>
          Vui lòng nhập tọa độ trong vùng biển Việt Nam
        </Text>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>OK</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorDefault.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: ColorDefault.grey200,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: ColorDefault.grey800,
  },
  placeholder: {
    width: 40,
  },
  shipInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorDefault.orange + '20',
    borderColor: ColorDefault.orange + '40',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  shipLabel: {
    fontSize: 16,
    color: ColorDefault.orange,
    marginLeft: 8,
  },
  shipCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColorDefault.orange,
    marginLeft: 8,
  },
  dmsSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
    backgroundColor: ColorDefault.background,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: ColorDefault.grey800,
    marginBottom: 12,
  },
  dmsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  dmsField: {
    flex: 1,
    alignItems: 'center',
  },
  dmsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: ColorDefault.grey600,
    marginBottom: 8,
  },
  dmsInput: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: ColorDefault.grey300,
    borderRadius: 8,
    paddingHorizontal: 12,
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: ColorDefault.white,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: ColorDefault.primary,
    marginLeft: 8,
    flex: 1,
  },
  submitButton: {
    backgroundColor: ColorDefault.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 18,
    fontWeight: '600',
    color: ColorDefault.white,
  },
});
