import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text} from '@/app/library/components';
import HeaderBasic from '../common/components/header/header-basic';
import {ColorDefault} from '@/app/themes/color';
import {MapView} from '../Map/MapView';
import {APP_SCREEN, RootStackParamList} from '@/app/navigation/screen-types';
import {StackScreenProps} from '@react-navigation/stack';
import {toDMS} from './forrm/LocationInpuNomal';

type Props = StackScreenProps<RootStackParamList, APP_SCREEN.REPORT_MAP_VIEW>;

export const ReportMapScreen: React.FC<Props> = ({route, navigation}) => {
  const {report} = route.params;

  return (
    <View style={styles.container}>
      <HeaderBasic
        isBackButton={true}
        title={report?.ship_code || 'Vị trí báo cáo'}
      />
      <View style={styles.mapContainer}>
        <View
          style={{
            margin: 16,
            borderWidth: 1,
            borderColor: ColorDefault.active,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 8,
          }}>
          <Text style={styles.locationInfoText}>
            Vĩ độ: {toDMS(report.lat, true)}
          </Text>
          <Text style={styles.locationInfoText}>
            Kinh độ:
            {toDMS(report.lng, false)}
          </Text>
        </View>
        <MapView
          point={{lat: report.lat as number, lng: report.lng as number}}
          handleMapMessage={() => {}}
          showInBottomSheet={false}
          onSendLocation={undefined}
        />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.closeText}>Đóng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: ColorDefault.white},
  mapContainer: {flex: 1},
  locationInfoText: {
    fontSize: 18,
    color: ColorDefault.grey800,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  footer: {padding: 16},
  closeButton: {
    backgroundColor: ColorDefault.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  closeText: {color: ColorDefault.white, fontWeight: '600', fontSize: 16},
});

export default ReportMapScreen;
