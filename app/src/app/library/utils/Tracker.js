/* eslint-disable no-nested-ternary */
import md5 from 'md5';

const MAX_TRACKER_NUMBER = 1e10;
let TRACKER_NUMBER = 1;

export function nextTrackerId(entity) {
  return entity
    ? md5(JSON.stringify(entity))
    : ++TRACKER_NUMBER > MAX_TRACKER_NUMBER
    ? (TRACKER_NUMBER = 1)
    : TRACKER_NUMBER;
}
