import AsyncStorage from '@react-native-async-storage/async-storage';
import {ENVConfig} from '../config/env';
import {convertBase64BigEndian} from './useEncrypt';
import {dispatch} from '../common';
import {showMessage} from 'react-native-flash-message';

export const callUpdateImeiToServer = async () => {
  const storedData = await AsyncStorage.getItem('persist:nkkt');
  const chatStoredData = await AsyncStorage.getItem('persist:chat');

  if (storedData && chatStoredData) {
    const parsedData = JSON.parse(storedData);
    const convertedEnableDevices = parsedData.enableDevices.replace(/"/g, '');
    var enableDevices = convertedEnableDevices === 'true';

    const parsedDataChat = JSON.parse(chatStoredData);
    // const convertedSocketIOStatus = parsedDataChat.socketIOStatus.replace(
    //   /"/g,
    //   '',
    // );
    const convertedBlock = parsedDataChat.block.replace(/"/g, '');
    const numBlock = parseInt(convertedBlock, 10);
    // var socketIOStatus = convertedSocketIOStatus === 'true';

    const convertedImei = parsedDataChat.imeiStracking
      .replace(/"/g, '')
      .replace(/\\/g, '');
    console.info('asdasdIMEI', convertedImei);

    const cleanedString = parsedData.idNKKT.replace(/"/g, '');
    const numValue = +cleanedString;
    parsedData.idNKKT = numValue;

    try {
      if (enableDevices && parsedData.idNKKT) {
        const callDevname = await fetch(
          `${ENVConfig.API_NKKT}read?cmd=devname`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        console.info('res devname', callDevname);

        const res = await callDevname.text();
        console.info('Response text:', res);

        if (res !== convertedImei) {
          dispatch({
            type: 'SET_IMEISTRACKING',
            payload: res.toString(),
          });
          console.info('ok set imei');

          const encryptMsg = convertBase64BigEndian(
            parsedData.idNKKT,
            parsedData.idNKKT,
            1,
            '',
          );
          console.info('bytesent encrypt: ', encryptMsg);

          const CryptoJS = require('crypto-js');
          const hashSign = CryptoJS.HmacSHA256(
            encryptMsg,
            ENVConfig.HMAC256_SIGN_SECRET,
          ).toString(CryptoJS.enc.Hex);

          const response = await fetch(
            `${ENVConfig.API_NKKT}send_sms?msg=${encryptMsg}&sign=${hashSign}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
          console.info('res sent sms', await response.text());
         
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }
};
