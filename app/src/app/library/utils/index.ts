/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {get} from 'lodash';
import {images} from '../../assets/image';
import {FontSize} from '../../common';
import {FontDefault} from '../../themes/typography';
// eslint-disable-next-line react-native/split-platform-components
import moment from 'moment';
// eslint-disable-next-line react-native/split-platform-components
import {Alert, Dimensions, PermissionsAndroid, Platform} from 'react-native';
import Geolocation, {GeoPosition} from '@react-native-community/geolocation';
import ImageResizer from 'react-native-image-resizer';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import {
  getStatusBarHeight,
  isIPhone12,
  isIPhone12Max,
  isIPhoneX,
  isIPhoneXMax,
} from 'react-native-safearea-height';
import NavigationService from '../../navigation/navigation-service';
import {getMoneyFormat} from './money';
import {reduxPersistStorage} from './storage';
import {colord} from 'colord';
export * from './i18n/translate';
export * from './storage';
import {
  PERMISSIONS,
  Permission,
  request,
  check,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

function nlog(...val: any) {
  console.log(...val);
}
export const lineScale = 3;
export const paddingBase = 8;
export const paddingHorizontal = paddingBase * 2;
export const paddingVertical = paddingBase * 2;

export const LATITUDE_DELTA = 0.04;
export const LONGITUDE_DELTA = 0.04;

export const httpRegex =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/i;

// 2. Padding
export const PaddingSize = {
  size16: 16,
  size66: 66,
  size32: 32,
  size24: 24,
  size13: 13,
  size1: 1,
  size2: 2,
  size3: 3,
  xsmall: paddingBase / 4,
  small: paddingBase / 2,
  base: paddingBase,
  paddingVertical: paddingVertical,
  vertical24: paddingBase * 3,
  vertical16: paddingBase * 2,
  vertical10: paddingBase * 1.25,
  vertical8: paddingBase,
  vertical4: paddingBase / 2,
  vertical2: paddingBase / 4,
  vertical6: paddingBase / 0.75,
  paddingHorizontal: paddingHorizontal,
  horizontal8: paddingBase,
  horizontal4: paddingBase / 2,
  horizontal2: paddingBase / 4,
  statusbar: getStatusBarHeight(),
  bottomLayoutIP: getBottomSpace(),
};
export const IcontSize = {
  icon8: FontSize.scale(8),
  icon12: FontSize.scale(12),
  icon14: FontSize.scale(14),
  icon16: FontSize.scale(16),
  icon18: FontSize.scale(18),
  icon20: FontSize.scale(20),
  icon24: FontSize.scale(24),
  icon30: FontSize.scale(30),
  icon40: FontSize.scale(40),
  icon50: FontSize.scale(50),
  icon60: FontSize.scale(60),
  icon70: FontSize.scale(70),
  icon90: FontSize.scale(90),
};
const fontSizeBase = FontSize.scale(16);

export const TextSize = {
  lineScale: 1.34,
  middotCharacter: '\u00B7',
  fontSize: {
    size1: 1,
    size4: 4,
    size10: 10,
    size12: 12,
    size14: 14,
    size15: 15,
    size16: 16,
    size18: 18,
    size20: 20,
    size24: 24,
    xxxxlarge: fontSizeBase + 6,
    xxxlarge: fontSizeBase + 4,
    xxlarge: fontSizeBase + 3,
    xlarge: fontSizeBase + 2, //
    large: fontSizeBase + 1,
    normal: fontSizeBase, // Item View title element font size.
    small: fontSizeBase - 1, // Item view summary element font size.
    xsmall: fontSizeBase - 2,
    xxsmall: fontSizeBase - 3,
    xxxsmall: fontSizeBase - 4,
    xxxxsmall: fontSizeBase - 5,
    xxxxxsmall: fontSizeBase - 6,
  },
};

export const BorderSize = {
  xxxxlarge: fontSizeBase + 6,
  xxxlarge: fontSizeBase + 4,
  xxlarge: fontSizeBase + 3,
  xlarge: fontSizeBase + 2, //
  large: fontSizeBase,
  normal: fontSizeBase / 2, // Item View title element font size.
  small: fontSizeBase / 4, // Item view summary element font size.
  tiny: fontSizeBase / 32, // 0.5
  size2: 2,
};

const FontWeight = {
  thin: '100', // Thin
  ultralight: '200', // Ultra Light
  light: '300', // Light
  regular: '400', // Regular
  normal: '400',
  medium: '500', // Medium
  semibold: '700', // Semibold
  bold: '700', // Bold
  heavy: '800', // Heavy
  black: '900', // Black
};
export const getDatetimeText = () => {
  const path = 'common:date';

  return {
    second: `${path}.second`,
    MotPhutTruoc: `${path}.MotPhutTruoc`,
    MotPhutTruocKeTuHienTai: `${path}.MotPhutTruocKeTuHienTai`,
    minute: `${path}.minute`,
    MotGioTruoc: `${path}.MotGioTruoc`,
    MotGioTruocTuBayGio: `${path}.MotGioTruocTuBayGio`,
    hour: `${path}.hour`,
    yesterday: `${path}.yesterday`,
    tomorrow: `${path}.tomorrow`,
    day: `${path}.day`,
    last_week: `${path}.last_week`,
    next_week: `${path}.next_week`,
    week: `${path}.week`,
    ago: `${path}.ago`,
    now: `${path}.now`,
    from_now: `${path}.from_now`,
    month: `${path}.month`,
    lastMonth: `${path}.lastMonth`,
    lastYear: `${path}.lastYear`,
    year: `${path}.year`,
    nextMonth: `${path}.nextMonth`,
    nextYear: `${path}.nextYear`,
  };
};

const fomatTimeAgo = (time: any): string => {
  switch (typeof time) {
    case 'number':
      break;
    case 'string':
      time = +new Date(time);
      break;
    case 'object':
      if (time.constructor === Date) {
        time = time.getTime();
      }
      break;
    default:
      time = +new Date();
  }
  const messages = getDatetimeText();

  const timeFormats = [
    [60, messages.second, 1], // 60
    [120, messages.MotPhutTruoc, messages.MotPhutTruocKeTuHienTai], // 60*2
    [3600, messages.minute, 60], // 60*60, 60
    [7200, messages.MotGioTruoc, messages.MotGioTruocTuBayGio], // 60*60*2
    [86400, messages.hour, 3600], // 60*60*24, 60*60
    [172800, messages.yesterday, messages.tomorrow], // 60*60*24*2
    [604800, messages.day, 86400], // 60*60*24*7, 60*60*24
    [1209600, messages.last_week, messages.next_week], // 60*60*24*7*4*2
    [2419200, messages.week, 604800], // 60*60*24*7*4, 60*60*24*7
    [4838400, messages.lastMonth, messages.nextMonth], // 60*60*24*7*4*2
    [29030400, messages.month, 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, messages.lastYear, messages.year], // 60*60*24*7*4*12*2
    [2903040000, messages.year, 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, 'Thập kỷ trước', 'Thập kỷ sau'], // 60*60*24*7*4*12*100*2
    [58060800000, 'thập kỷ', 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  let seconds = (+new Date() - time) / 1000,
    token = messages.ago,
    listChoice = 1;

  if (seconds === 0) {
    return messages.now;
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = messages.from_now;
    listChoice = 2;
  }
  let i = 0,
    format;
  while ((format = timeFormats[i++])) {
    if (seconds < format[0]) {
      if (typeof format[2] === 'string') {
        return format[listChoice];
      } else {
        return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
      }
    }
  }
  return time;
};

const timeFormat = (time: string) => {
  return moment(time).format('DD-MM-YYYY');
};
const deviceWidth = Math.min(
  Dimensions.get('screen').width,
  Dimensions.get('screen').height,
);
const deviceHeight = Math.max(
  Dimensions.get('screen').height,
  Dimensions.get('screen').width,
);

type CallBack = (data: GeoPosition) => void;

export const checkLocationPermission = async (
  showAlert = false,
): Promise<boolean> => {
  const result = await check(
    Platform.select<any>({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    }),
  );

  if (result === RESULTS.GRANTED) {
    return true;
  }

  if (result === RESULTS.UNAVAILABLE) {
    Alert.alert('Chức năng này không khả dụng trên thiết bị này');
    return false;
  }

  let isOpenSetting = false;
  if (result === RESULTS.DENIED) {
    let resultRequest = await request(
      Platform.select<any>({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      }),
    );

    if (resultRequest === RESULTS.GRANTED) {
      return true;
    } else {
      isOpenSetting = true;
    }
  }

  if (result === RESULTS.BLOCKED || isOpenSetting) {
    showAlert &&
      Alert.alert(
        'Quyền vị trí bị chặn',
        'Vui lòng mở Cài đặt và cấp lại quyền truy cập vị trí để ứng dụng hoạt động đúng.',
        [{text: 'Hủy'}, {text: 'Mở Cài đặt', onPress: () => openSettings()}],
      );
    return false;
  }

  return true;
};

const getCurrentPosition = async (
  callback?: CallBack,
  options?: {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
    distanceFilter?: number;
  },
) => {
  const permission = await checkLocationPermission();

  if (!permission) {
    return null;
  }

  if (Platform.OS === 'ios') {
    Geolocation.setRNConfiguration({
      skipPermissionRequests: true,
      authorizationLevel: 'whenInUse',
      locationProvider: 'auto',
      enableBackgroundLocationUpdates: false,
    });
  }

  try {
    // const position =
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          resolve({
            ...position,
            timestamp: Date.now(),
          });
          return callback?.(position);
        },
        error => {
          reject(error);
          return error;
        },
        {
          enableHighAccuracy: true,
          // timeout: 10 * 1000,
          timeout: 2 * 60 * 1000,
          maximumAge: 0,
          distanceFilter: 100,
          ...(options || {}),
        },
      );
    });
  } catch (e) {
    console.log('e------------>555', e);
    Alert.alert('Thông báo', 'Lỗi thấy GPS Điện thoại');
    return null;
  }
};

export const convertLocalIdentifierToAssetLibrary = (
  localIdentifier,
  ext = 'jpg',
) => {
  const hash = localIdentifier.split('/')[0];
  return `assets-library://asset/asset.${ext}?id=${hash}&ext=${ext}`;
};

export const convertArrayImageAsset = async (arr: Array<any>, ext?: string) => {
  if (Platform.OS === 'android') {
    return arr;
  }
  if (!ext) {
    ext = 'jpg';
  }
  let newArr: any[] = [];
  for (let index = 0; index < arr.length; index++) {
    let item = arr[index];
    const filemine = 'image/jpeg';
    item = await ImageResizer.createResizedImage(
      item.image?.uri || item.path,
      deviceWidth,
      deviceHeight,
      'JPEG',
      70,
    );
    newArr = [
      ...newArr,
      {
        ...item,
        mime: filemine,
        uri: item.path,
        filename: item.path.split('.').pop(),
      },
    ];
  }
  return newArr;
};

function inputMoney(value, isNeg = false, dec = 9) {
  if (value == undefined) {
    value = '0';
  }
  let stemp = '';
  let svalue = value.toString();
  //check dấu âm
  let iam = '';
  if (isNeg && svalue.length > 0 && svalue[0] == '-') {
    iam = '-';
  }
  //xoá ký tự khác số trước khi format
  for (let i = 0; i < svalue.length; i++) {
    //xoá tất cả kí tự không phải là số hợp lệ
    const tchar = svalue[i];
    if (tchar != '.' && isNaN(parseInt(tchar, 10))) {
      while (true) {
        svalue = svalue.replace(tchar, '');
        if (!svalue.includes(tchar)) {
          i = i - 1;
          break;
        }
      }
    }
  }
  //kiểm tra lấy thập phân
  const mval = svalue.split('.');
  let thapphan = '';
  if (mval.length >= 2) {
    svalue = mval[0].slice();
    thapphan = mval[1];
    if (dec != 0 && thapphan == '') {
      thapphan = '.';
    } else {
      thapphan = thapphan.substr(
        0,
        thapphan.length < dec ? thapphan.length : dec,
      );
      thapphan = '.' + thapphan;
    }
  }
  //format chuỗi số
  if (!isNaN(parseFloat(svalue))) {
    svalue = parseFloat(svalue).toString();
  }
  let icount = 0;
  for (let i = svalue.length - 1; i >= 0; i--) {
    stemp = svalue[i] + stemp;
    icount++;
    if (icount == 3 && i > 0) {
      icount = 0;
      stemp = ',' + stemp;
    }
  }
  if (stemp == '') {
    stemp = '0';
  } else {
    stemp = iam + stemp;
  }
  return stemp + thapphan;
}

function formatNumber(value) {
  if (
    value == null ||
    value == undefined ||
    value == '' ||
    isNaN(parseFloat(value))
  ) {
    value = '0';
  }
  for (let i = 0; i < value.length; i++) {
    const inum = value[i];
    if (isNaN(parseFloat(inum)) && inum != '.') {
      value = value.replace(inum, '');
      i--;
    }
  }
  return parseFloat(value);
}

function cleanMoney(value: string, char = ','): number {
  if (!value) {
    return Number('0');
  }
  return Number(value?.split(char).join(''));
}

let RefNotificationPopup;

const setRefNofificationPopUp = ref => {
  RefNotificationPopup = ref;
};

const showPopUp = (notification: {
  onPress: () => void;
  appTitle?: string;
  timeText?: string;
  title?: string;
  body?: string;
}) => {
  RefNotificationPopup?.show({
    onPress: notification.onPress,
    appIconSource: images.default,
    appTitle: notification.appTitle || 'Miaket',
    timeText: 'Now',
    title: notification.title,
    body: notification.body,
    slideOutTime: 5000,
  });
};

function removeAccents(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function removeAccentsAndLowerCase(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    ?.toLocaleLowerCase();
}

function getDistanceFromLatLonInKm(
  latitude1,
  longitude1,
  latitude2,
  longitude2,
  unit = 'miles',
) {
  const theta = longitude1 - longitude2;
  const distance =
    60 *
    1.1515 *
    (180 / Math.PI) *
    Math.acos(
      Math.sin(latitude1 * (Math.PI / 180)) *
        Math.sin(latitude2 * (Math.PI / 180)) +
        Math.cos(latitude1 * (Math.PI / 180)) *
          Math.cos(latitude2 * (Math.PI / 180)) *
          Math.cos(theta * (Math.PI / 180)),
    );
  if (unit == 'miles') {
    return Math.round(distance);
  } else if (unit == 'nmi') {
    return Math.round(distance * 1.609344) / 1.852;
  } else if (unit == 'kilometers') {
    return Math.round(distance * 1.609344);
  }
}
export interface IdentifyData {
  type?: number;
  source_id?: number | string;
  store_id?: number | string;
  user_id?: number | string;
  tracker?: number;
  price?: number;
  coupon_id?: number | string;
  coupon_code?: string;
}

const createIdentifyKey = (props: IdentifyData) => {
  let keys = '';
  Object.keys(props).forEach(key => {
    if (props[key]) {
      keys = keys + ';' + `${key}:${props[key]}`;
    }
  });
  return keys;
};

const getDataFormIdentifyKey = (keys: string): IdentifyData => {
  if (!keys) {
    return {};
  }
  const Data = {};
  const ArrData = keys.split(';');
  for (let index = 0; index < ArrData.length; index++) {
    const element = ArrData[index];
    const value = element.split(':');
    Data[value[0]] = value[1];
  }
  return Data;
};

export const regionToBoundingBox = (longitude, latitude, radius) => {
  const longitudeDelta = Number(radius / 50);
  let lngD: number;
  if (longitudeDelta < 0) {
    lngD = longitudeDelta + 360;
  } else {
    lngD = longitudeDelta;
  }

  return {
    min_lng: Number(longitude - lngD / 2), // westLng - min lng
    min_lat: Number(latitude - longitudeDelta), // southLat - min lat
    max_lng: Number(longitude) + Number(lngD / 2), // eastLng - max lng
    max_lat: Number(latitude) + Number(longitudeDelta), // northLat - max lat
  };
};

export const checkShowWhen = (data, query = []): boolean => {
  if (!query || query?.length === 0) {
    return true;
  }

  for (let index = 0; index < query.length; index++) {
    const element: Record<string, any> = query[index];
    if (element.type === 'un_same') {
      if (get(data, element.key) === element.value) {
        return false;
      }
    } else {
      if (!(get(data, element.key) === element.value)) {
        return false;
      }
    }
  }
  return true;
};
//

export const keyExtractor = (item: number | string, index: number): string => {
  if (typeof item === 'number') {
    return `${item}`;
  } else {
    return `${index}.${item}`;
  }
};

function dmsToDecimal(degrees, minutes, seconds, direction) {
  let decimal = degrees + minutes / 60 + seconds / 3600;

  if (direction == 'S' || direction == 'W') {
    decimal = decimal * -1;
  }

  return decimal;
}
/**
 * Converts latitude and longitude to degrees, minutes, and seconds format.
 * @param latitude - The latitude to convert.
 * @param longitude - The longitude to convert.
 * @returns An object containing the converted values.
 */
export const convertLatLongToDMS = (
  latitude: number,
  longitude: number,
): {lat: string; lng: string} => {
  const toDMS = (coordinate: number, isLat: boolean): string => {
    const absolute = Math.abs(coordinate);
    const degrees = Math.floor(absolute);
    const minutes = Math.floor((absolute - degrees) * 60);
    const seconds = ((absolute - degrees - minutes / 60) * 3600).toFixed(2);
    const direction = coordinate >= 0 ? (isLat ? 'N' : 'E') : isLat ? 'S' : 'W';
    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  return {
    lat: toDMS(latitude, true),
    lng: toDMS(longitude, false),
  };
};

function convertDMS(lat, lng) {
  try {
    const latAbs = Math.abs(lat);
    const lngAbs = Math.abs(lng);
    const latDeg = Math.floor(latAbs);
    const lngDeg = Math.floor(lngAbs);
    const latMin = Math.floor((latAbs - latDeg) * 60);
    const lngMin = Math.floor((lngAbs - lngDeg) * 60);
    const latSec = ((latAbs - latDeg - latMin / 60) * 3600).toFixed(2);
    const lngSec = ((lngAbs - lngDeg - lngMin / 60) * 3600).toFixed(2);
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';

    return [
      [latDeg, latMin, latSec, latDir],
      [lngDeg, lngMin, lngSec, lngDir],
    ];
  } catch (error) {}
}

const checkShowWhenObject = (
  showWhen: Record<string, any>,
  data: Record<string, any>,
) => {
  let show = true;
  if (!showWhen) {
    return show;
  }

  Object.keys(showWhen).map(key => {
    console.log('data[key] !== showWhen[key]', data[key], showWhen[key]);

    if (data[key] !== showWhen[key]) {
      show = false;
    }
  });
  return show;
};

const getPortSort = (
  port: any[],
  {
    coords,
    timestamp: ts,
  }: {coords: {latitude: number; longitude: number}; timestamp: number},
  extratime: number,
) => {
  let data = {};
  const toRad = (deg: number): number => (deg * Math.PI) / 180;
  const R = 6371;
  const {latitude: lat1, longitude: lon1} = coords;
  const computeDist = (lat2: number, lon2: number): number => {
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  if (port.length) {
    // setSelectedDate(new Date(ts));
    console.info('ts', ts, extratime, new Date(ts), new Date(ts + extratime));
    data.selectedDate = new Date(ts + extratime);
    const sortedList = [...port].sort(
      (a, b) => computeDist(a.lat, a.lng) - computeDist(b.lat, b.lng),
    );

    data.sortedList = sortedList;
    data.selectedPort = sortedList[0];
  }

  return data;
};

const Version = '1.0.9-1';

const inPutNumber = (value: string) => {
  return value.replace(/[^0-9]/g, '');
};

function formatDotStrict(value, keepDecimal = true) {
  const str = String(value).replace(/,/g, '.'); // chuẩn hóa dấu thập phân thành .
  const [intPart, decPart] = str.split('.');

  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (!keepDecimal || !decPart) {
    return formattedInt;
  }

  return `${formattedInt},${decPart}`;
}

const Utils = {
  formatDotStrict,
  inPutNumber,
  getPortSort,
  checkShowWhenObject,
  convertDMS,
  dmsToDecimal,
  timeFormat,
  keyExtractor,
  checkShowWhen,
  Version,
  createIdentifyKey,
  getDataFormIdentifyKey,
  getDistanceFromLatLonInKm,
  regionToBoundingBox,
  removeAccents,
  showPopUp,
  setRefNofificationPopUp,
  cleanMoney,
  formatNumber,
  inputMoney,
  convertArrayImageAsset,
  convertLocalIdentifierToAssetLibrary,
  deviceWidth,
  deviceHeight,
  FontSize,
  nlog,
  navigation: NavigationService,
  store: reduxPersistStorage,
  PaddingSize,
  IcontSize,
  TextSize,
  BorderSize,
  FontDefault,
  FontWeight,
  isAndroid: Platform.OS === 'android',
  isIos: Platform.OS === 'ios',
  isIPhoneX: isIPhoneX(),
  isIPhoneXMax: isIPhoneXMax(),
  isIPhone12: isIPhone12(),
  isIPhone12Max: isIPhone12Max(),
  bottomSpace: PaddingSize.bottomLayoutIP,
  bottomTabHeight: 54 + PaddingSize.bottomLayoutIP,
  fomatTimeAgo,
  getCurrentPosition,
  RefNotificationPopup,
  getMoneyFormat,
  removeAccentsAndLowerCase,
};
export default Utils;
