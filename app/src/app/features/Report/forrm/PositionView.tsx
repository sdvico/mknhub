import React, {useRef} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {
  DEFAULT_COORDINATE,
  LocationInputNomal,
  toDMS,
} from './LocationInpuNomal';
import {ColorDefault} from '@/app/themes/color';
import {Icon} from '@/app/library/components';

export const PositionValueView = ({
  pointDMS,
  disabled,
  onPress,
  leftComponent,
  isDeviceGps,
}: {
  pointDMS: {lng: string; lat: string};
  disabled: boolean;
  onPress: () => void;
  leftComponent?: React.ReactNode;
  isDeviceGps?: boolean;
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
      {leftComponent ? (
        leftComponent
      ) : isDeviceGps ? (
        <Icon icon="smart_devices" size={18} color={ColorDefault.active} />
      ) : (
        <Icon icon={'location'} size={18} color={ColorDefault.primary} />
      )}
      <Text
        numberOfLines={1}
        style={{
          fontSize: 16,
          color: ColorDefault.grey800,
          flex: 1,
          fontWeight: 'bold',
        }}>
        {pointDMS.lng} - {pointDMS.lat}
      </Text>
    </TouchableOpacity>
  );
};

export const PositionView = ({
  handleEditCoordinates,
  disabled = false,
  portOutLatLngTime,
  leftComponent = undefined,
}) => {
  const locationInputRef = useRef<{
    showModal: () => void;
    handleEditCoordinates: () => void;
    lngDMS: {
      degrees: string;
      minutes: string;
      seconds: string;
      direction: string;
    };
    setLngDMS: (dms: {
      degrees: string;
      minutes: string;
      seconds: string;
      direction: string;
    }) => void;
    latDMS: {
      degrees: string;
      minutes: string;
      seconds: string;
      direction: string;
    };
    setLatDMS: (dms: {
      degrees: string;
      minutes: string;
      seconds: string;
      direction: string;
    }) => void;
  }>(null);

  const point = portOutLatLngTime
    ? {lat: portOutLatLngTime.latitude, lng: portOutLatLngTime.longitude}
    : DEFAULT_COORDINATE;

  // Update the point variable to use DMS format
  const pointDMS = {
    lat: toDMS(point.lat, true),
    lng: toDMS(point.lng, false),
  };
  const isDeviceGps = portOutLatLngTime?.source_gps === 'device';

  return (
    <View style={{flex: 1}}>
      <PositionValueView
        leftComponent={leftComponent}
        pointDMS={pointDMS}
        disabled={disabled}
        isDeviceGps={isDeviceGps}
        onPress={() => {
          locationInputRef.current?.showModal();
        }}
      />
      {!disabled ? (
        <LocationInputNomal
          ref={locationInputRef}
          handleEditCoordinates={handleEditCoordinates}
          portOutLatLngTime={portOutLatLngTime}
        />
      ) : null}
    </View>
  );
};

export default PositionView;
