import {StatusBadge} from '@/app/components/StatusBadge';
import {ColorDefault} from '@/app/themes/color';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface Props {
  time?: string | Date;
  lat?: number | null;
  lng?: number | null;
  statusLabel?: string;
  title?: string;
  source?: string;
}

const toDMS = (decimal?: number, isLatitude?: boolean) => {
  if (decimal === undefined || decimal === null || isNaN(decimal)) {
    return '';
  }
  const abs = Math.abs(decimal);
  const degrees = Math.floor(abs);
  const minutesFloat = (abs - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;
  const direction = isLatitude
    ? decimal >= 0
      ? 'N'
      : 'S'
    : decimal >= 0
    ? 'E'
    : 'W';
  return `${degrees}°${minutes}'${seconds.toFixed(3)}"${direction}`;
};

export const LocationInfoCard = forwardRef<any, Props>(
  (
    {time, lat, lng, statusLabel, title = 'Thông tin vị trí', source = 'web'},
    ref,
  ) => {
    useImperativeHandle(ref, () => ({}));

    const currentLat = lat;
    const currentLng = lng;
    const currentTime = time;

    const hasLocation =
      typeof currentLat === 'number' && typeof currentLng === 'number';
    const parsedTime = currentTime
      ? new Date(currentTime).toLocaleString('vi-VN')
      : undefined;

    return (
      <View style={styles.infoCard}>
        <View style={styles.headerRow}>
          <Text style={styles.infoTitle}>{title}</Text>
          <StatusBadge type={'success'} value={source || 'KXD'} />
        </View>
        {parsedTime && (
          <View style={styles.row}>
            <Text style={styles.label}>Thời gian:</Text>
            <Text style={styles.value}>{parsedTime}</Text>
          </View>
        )}
        {hasLocation && (
          <View style={styles.row}>
            <Text style={styles.label}>Vị trí:</Text>
            <Text style={styles.value}>
              {currentLat?.toFixed(6)}, {currentLng?.toFixed(6)}
            </Text>
          </View>
        )}
        {hasLocation && (
          <View style={styles.row}>
            <Text style={styles.label}>DMS:</Text>
            <Text style={styles.value}>
              {toDMS(currentLat || 0, true)}, {toDMS(currentLng || 0, false)}
            </Text>
          </View>
        )}
        {!!statusLabel && (
          <View style={styles.row}>
            <Text style={styles.label}>Trạng thái:</Text>
            <Text style={[styles.status, {color: ColorDefault.active}]}>
              {statusLabel}
            </Text>
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: ColorDefault.white,
  },
  manualLocationButton: {
    backgroundColor: ColorDefault.green,
  },
  actionButton: {
    backgroundColor: ColorDefault.facebook_blue,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  cardContainer: {},
  infoCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ColorDefault.grey200,
    padding: 12,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ColorDefault.grey800,
    marginBottom: 8,
  },
  getLocationButton: {
    backgroundColor: ColorDefault.orange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  getLocationText: {
    fontSize: 12,
    color: ColorDefault.white,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    width: 90,
    color: ColorDefault.text_black,
    fontSize: 16,
  },
  value: {
    flex: 1,
    color: ColorDefault.grey800,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusRow: {
    alignItems: 'center',
    marginTop: 6,
  },
  status: {
    color: ColorDefault.black,
    fontSize: 16,
    fontWeight: '700',
  },
  mapContainer: {
    marginTop: 12,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: ColorDefault.white,
  },
  sheetBackground: {
    backgroundColor: ColorDefault.white,
  },
  sheetIndicator: {
    backgroundColor: ColorDefault.grey300,
  },
  sheetContent: {
    padding: 16,
  },
  sendButton: {
    marginTop: 16,
    backgroundColor: ColorDefault.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  sendButtonText: {
    color: ColorDefault.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LocationInfoCard;
