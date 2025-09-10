/* eslint-disable @typescript-eslint/no-explicit-any */
import { DATE_FORMAT, DATE_FORMAT_REQUEST } from '@common';
import { format, formatDistance } from 'date-fns';
import moment from 'moment';
import { getDatetimeText } from './index';

export const formatDate = (value: string | null | undefined, formatString: string = DATE_FORMAT): string => {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  return format(date, formatString);
};

export const formatDateRequest = (
  value: string | null | undefined,
  formatString: string = DATE_FORMAT_REQUEST,
): string => {
  return moment(value, 'DD/MM/yyyy').format(formatString);
};

export const formatDateDistance = (date?: string) => {
  if (!date) {
    return '';
  }

  return formatDistance(new Date(date), new Date(), { addSuffix: true });
};

export const useFormatTime = (time: any) => {
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
    [4838400, 'Tháng trước', 'Tháng tiếp theo'], // 60*60*24*7*4*2
    [29030400, 'tháng', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, 'Năm ngoái', 'Năm sau'], // 60*60*24*7*4*12*2
    [2903040000, 'năm', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
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
  let i = 0;
  let formatTime: any;

  while ((formatTime = timeFormats[i++])) {
    if (seconds < formatTime[0]) {
      if (typeof formatTime[2] === 'string') {
        return formatTime[listChoice];
      } else {
        return Math.floor(seconds / formatTime[2]) + ' ' + formatTime[1] + ' ' + token;
      }
    }
  }
  return time;
};
