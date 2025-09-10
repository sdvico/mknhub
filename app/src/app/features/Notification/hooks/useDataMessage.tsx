import React from 'react';
import {View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {RootStateReducer} from '@/app/store/types';
import {Notification} from '../types';

/**
 * Format template với context data
 */
export function formatTemplate(template: string, notification: any): string {
  const context: Record<string, any> = {
    vesselCode: notification.ship_code,
    ship_code: notification.ship_code,
    firstLostAt: formatDateTime(notification.occurred_at),
    occurred_at: formatDateTime(notification.occurred_at),
    location: formatLocation(notification.lat, notification.lng),
    lat: notification.lat,
    lng: notification.lng,
    owner_name: notification.owner_name,
    owner_phone: notification.owner_phone,
    phone: notification.owner_phone,
    content: notification.content,
    type: notification.type,
    agent_code: notification.agent_code,
  };

  let formatted = template;
  Object.keys(context).forEach(key => {
    const value = `<b>${context[key] ?? ''}</b>`;
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    formatted = formatted.replace(regex, value);
  });

  return formatted;
}

/**
 * Format datetime theo định dạng Việt Nam
 */
function formatDateTime(date?: Date | string): string {
  if (!date) return '';

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
  };

  return new Intl.DateTimeFormat('vi-VN', options).format(new Date(date));
}

/**
 * Format location từ lat/lng thành DMS
 */
function formatLocation(lat?: number, lng?: number): string {
  if (lat == null || lng == null) return '';

  const latDMS = toDMS(lat, true);
  const lngDMS = toDMS(lng, false);

  return `${latDMS}${lngDMS}`;
}

/**
 * Convert decimal degrees to DMS like 06°10'12"N105°54'24"E
 */
function toDMS(value: number, isLat: boolean): string {
  const dir = isLat ? (value >= 0 ? 'N' : 'S') : value >= 0 ? 'E' : 'W';
  const abs = Math.abs(value);
  const deg = Math.floor(abs);
  const minFloat = (abs - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = Math.round((minFloat - min) * 60);

  const degStr = String(deg).padStart(2, '0');
  const minStr = String(min).padStart(2, '0');
  const secStr = String(sec).padStart(2, '0');

  return `${degStr}°${minStr}'${secStr}"${dir}`;
}

export const useDataMessage = (notification: Notification) => {
  const notificationTypesState = useSelector(
    (state: RootStateReducer) => state.notification?.notificationTypes,
  );

  const selectedType = notificationTypesState.find(
    nt => nt.code === notification.type,
  );

  const template = selectedType?.template_message;
  if (template) {
    const message = formatTemplate(template, notification);
    return {message};
  }

  return {message: notification.content};
};

export const useNotificationFormType = (notification: Notification) => {
  const notificationTypesState = useSelector(
    (state: RootStateReducer) => state.notification?.notificationTypes,
  );

  const selectedType = notificationTypesState.find(
    nt => nt.code === notification.type,
  );

  const formTypesString = selectedType?.form_type ?? '';
  const formTypesArray = formTypesString
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const formTypesObject = Object.fromEntries(
    formTypesArray.map(item => [item, item]),
  );

  return formTypesObject;
};

export default useDataMessage;
