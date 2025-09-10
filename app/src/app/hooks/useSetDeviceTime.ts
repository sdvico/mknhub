import {ENVConfig} from '../config/env';

export async function setDeviceTime() {
  console.info('go get time');
  const timestamp = Math.floor(new Date().getTime() / 1000);
  const base64Timestamp = btoa(timestamp.toString());
  var CryptoJS = require('crypto-js');
  //hmac_256
  const hashSign = CryptoJS.HmacSHA256(
    base64Timestamp,
    ENVConfig.HMAC256_SIGN_SECRET,
  ).toString(CryptoJS.enc.Hex);

  const response = await fetch(
    `${ENVConfig.API_NKKT}update_time?timestamp=${base64Timestamp}&sign=${hashSign}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  console.info('res set time', response);
  let data: any;
  const res = await response.text();
  console.info('Response text:', res);

  const match = res.match(/success\s*:\s*"?([^"}]+)"?/);
  data = match ? {success: match[1]} : null;
  console.info('Parsed Response data:', data.success);
  return data;
}
