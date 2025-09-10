import {getState} from '../../common';
import {ENVConfig} from '../../config/env';
import {
  CONST_DATA_LOCAL,
  deleteFile,
  getListFile,
} from '../../features/logbook/CallAPINKKT';
import {nkktState} from '../../features/logbook/redux/reducer';
import {AxiosInstance, tokenKeyHeader} from '../../library/networking';
import {AxiosRequestConfig} from 'axios';
import {AppState, Platform} from 'react-native';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'react-native-blob-util';

const dirs = RNFetchBlob.fs.dirs;
export const LOG_FILE = 'logfile.txt';
export const LOG_FILE_0 = 'logfile0.txt';
export const USER_FILE = 'userfile.txt';
export const PING = 'ping';
export const GPS = 'gps';
export const ID = 'id';
export const LISTFILE = 'listFile';
export const DATA = 'data.txt';
export const TRIP_DATA = 'data_trip.txt';

export const CONST_NKKT = {
  LOG_FILE,
  USER_FILE,
  PING,
  GPS,
  ID,
  LISTFILE,
  DATA,
};

export const getData = async (cmd: string) => {
  return fetch(ENVConfig.API_NKKT + `url/read?cmd=${cmd}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  });
};
// console.log('ENVConfig', ENVConfig);

const syncLogFile = async list => {
  // downLoadFile(LOG_FILE);
  // const resListFile = await getListFile();
  // const list = `${resListFile?.data}`?.split(' ')?.filter(item => !!item);

  const objectKey = {};
  const listKey = [];
  // let leng = 0;
  //check has logfile0,1,2

  for (let index = 0; index < list.length; index++) {
    const element = list[index];

    console.info('file===============>down------', element);

    if (element === TRIP_DATA) {
      console.info('syncLogFile TRIP_DATA length', element.length);

      const reslt = await writeOrReadFile(TRIP_DATA, '', true);
      console.info('syncLogFile TRIP_DATA', reslt);

      const parseJson = JSON.parse(reslt);

      console.info('syncLogFile TRIP_DATA parseJson', parseJson);

      // console.info('syncLogFile TRIP_DATA tripLogGps', tripLogGps);
    }
    if (element.length > 30) {
      // deleteFile(element);
    } else if (element.includes('logfile') && !element.includes(LOG_FILE)) {
      try {
        await downLoadFile(element, true);
        const read = await writeOrReadFile(element, undefined, true);
        const key = read?.slice?.(19, 37).split(',').join('');
        // leng += read.length;

        // console.log('file===============>down---1', read.length);
        objectKey[key] = read;
        const _number = Number(key);

        console.info('syncLogFileWrite', key, _number);

        console.info(
          'file===============>down----2',
          read.length,
          key,
          element,
        );
        listKey.push(_number);
      } catch (error) {
        console.log('error----', error);
      }
    }
  }

  // console.log('file===============>listKey=-----------------');

  console.info('file===============>listKey', listKey);

  const compare = (a, b) => a - b;

  const _sort = listKey.sort(compare);

  let txt = '';
  for (let index = 0; index < _sort.length; index++) {
    const element = _sort[index];
    console.info(
      'file===============>sort====>element',
      element,
      objectKey[element],
    );
    txt = txt + objectKey[element];
  }

  console.info('file===============>sort====>txt', listKey, txt);

  await writeOrReadFile(LOG_FILE, txt, false);

  const reslt = await writeOrReadFile(LOG_FILE, txt, true);

  console.info('syncLogFile', reslt);
  return reslt;
};

export const deleteOldFile = async () => {
  // console.log('file===============>deleteOldFile------');
  // downLoadFile(LOG_FILE);
  const resListFile = await getListFile();
  const list = `${resListFile?.data}`?.split(' ')?.filter(item => !!item);
  console.log('resListFile', list.length);

  for (let index = 0; index < list.length; index++) {
    const element = list[index];

    // console.log('file===============>down------', element);

    if (element.length > 30) {
      console.info('deleteOldFile', element);

      deleteFile(element);
    }
  }
};

export const downLoadFile = async (
  fileName: string,
  disableListFile = false,
) => {
  try {
    const {enableDevices}: nkktState = getState('nkkt');

    console.info('downLoadFile', fileName, enableDevices);

    console.info('fileName === LOG_FILE', fileName === LOG_FILE);

    let resListFile;
    if (disableListFile) {
    } else {
      resListFile = await getListFile();
    }

    console.info('resListFile', resListFile);

    const list = resListFile
      ? `${resListFile?.data}`?.split(' ')?.filter(item => !!item)
      : [];

    console.info('list', list);

    // console.log('file===============>downLoadFile------', enableDevices);

    if (!enableDevices) {
      return -1;
    }

    // console.log(
    //   'syncLogFile',
    //   fileName === LOG_FILE,
    //   list,
    //   CONST_DATA_LOCAL[CONST_DATA_LOCAL.current_device] === 2,
    //   list?.includes(LOG_FILE_0),
    // );

    console.info('process.env.NODE_ENV', process.env.NODE_ENV);

    console.info('CONST_DATA_LOCAL', CONST_DATA_LOCAL);

    console.info(
      'syncLogFile',
      fileName,
      list,
      CONST_DATA_LOCAL.current_device,
    );

    console.info(
      '(list?.includes(LOG_FILE_0) || list?.includes(`/${LOG_FILE_0}`))',
      list?.includes(LOG_FILE_0) || list?.includes(`/${LOG_FILE_0}`),
    );

    if (
      fileName === LOG_FILE &&
      CONST_DATA_LOCAL.current_device !== '' &&
      (list?.includes(LOG_FILE_0) || list?.includes(`/${LOG_FILE_0}`))
    ) {
      console.info('syncLogFiles', list);

      return syncLogFile(list);
    }
    //
    const temp = dirs.DocumentDir + '/' + fileName;
    console.info('download temp', temp);
    return RNFetchBlob.config({
      fileCache: true,
      path: temp,
    })
      .fetch(
        'POST',
        ENVConfig.API_NKKT + 'download',
        {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        'filename=' + fileName,
      )
      .then(res => {
        console.info('download res: ', res);
        console.info('download res1: ', res.json());
        console.info('File path:', res.path());

        return res;
      })
      .catch(() => {
        return -1;
      });
  } catch (error) {
    return -1;
  }
};

export const uploadLoadFile = async (fileName: string) => {
  try {
    const {token}: AppState = getState('app');
    const {trip_id}: nkktState = getState('nkkt');
    const temp = dirs.DocumentDir + '/' + fileName;
    const checkExis = await RNFetchBlob.fs.exists(temp);

    if (!checkExis) {
      return -100;
    }
    const form = new FormData();

    const file = {
      uri: (Platform.OS === 'android' ? 'file://' : '') + temp,
      type: 'text/plain',
      name: `${trip_id}.txt`,
    };

    const resRNFS = await RNFS.readFile(temp, 'utf8');

    if (!resRNFS) {
      return -1;
    }

    form.append('file', file);
    form.append(`${trip_id}`, file);

    const defaultConfig: AxiosRequestConfig = {
      timeout: 5000,
      headers: {
        [tokenKeyHeader]: token ? `Bearer ${token}` : '',
        'Content-Type': 'multipart/form-data',
      },
    };

    const res = await AxiosInstance.post(
      ENVConfig.API_URL + 'api/common2/upfile',
      form,
      {
        ...defaultConfig,
      },
    );
    return res;
  } catch (error) {
    return -1;
  }
};

export const uploadLoadLogFile = async (fileName: string) => {
  try {
    const {token}: AppState = getState('app');
    const {server_trip_id}: nkktState = getState('nkkt');
    const temp = dirs.DocumentDir + '/' + fileName;
    const checkExis = await RNFetchBlob.fs.exists(temp);

    console.info('uploadLoadLogFileUtil', server_trip_id, temp, checkExis);

    if (!checkExis) {
      return -100;
    }
    const form = new FormData();

    const file = {
      uri: (Platform.OS === 'android' ? 'file://' : '') + temp,
      type: 'text/plain',
      name: `${server_trip_id}.txt`,
    };

    const resRNFS = await RNFS.readFile(temp, 'utf8');

    if (!resRNFS) {
      return -1;
    }

    form.append('file', file);
    form.append(`${server_trip_id}`, file);

    const defaultConfig: AxiosRequestConfig = {
      timeout: 5000,
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'multipart/form-data',
      },
    };

    console.info('form', form);

    const res = await AxiosInstance.post(
      ENVConfig.API_URL + 'api/nkkt_sync/syncAsyncGPS_file',
      form,
      defaultConfig,
    );
    return res;
  } catch (error) {
    return -1;
  }
};

export const uploadLoadFileNKKT = (fileName: string, url: string) => {
  const temp = dirs.DocumentDir + '/' + fileName;

  console.info('Uploading file from:', temp);
  console.info('Uploading to URL:', url);

  return RNFetchBlob.fetch(
    'POST',
    url,
    {
      'Content-Type': 'multipart/form-data',
    },
    [
      {
        name: 'file',
        filename: fileName,
        type: 'text/plain',
        data: RNFetchBlob.wrap(temp),
      },
    ],
  )
    .then(response => {
      console.info('Upload response:', response);
      return response;
    })
    .catch(error => {
      console.error('Upload failed with error:', error);
      return -1;
    });
};

export const writeOrReadFile = (
  fileName: string,
  data: any,
  isRead: boolean,
) => {
  try {
    const temp = dirs.DocumentDir + '/' + fileName;
    if (isRead) {
      RNFS.exists(temp).then(exists => {
        console.info('RNFS says file exists:', exists);
      });

      return RNFS.readFile(temp, 'utf8');
    } else {
      console.info('temp--------', temp);
      console.info('data--------', data);
      return RNFS.writeFile(temp, data, 'utf8');
    }
  } catch (error) {
    return null;
  }
};

export const deleteFileByName = async (fileName: string) => {
  try {
    const temp = dirs.DocumentDir + '/' + fileName;
    const exists = await RNFS.exists(temp);

    if (!exists) {
      console.info('File does not exist:', temp);
      return -1; // File not found
    }

    await RNFS.unlink(temp);
    console.info('File deleted:', temp);
    return 1; // Success
  } catch (error) {
    console.error('Error deleting file:', error);
    return -1; // Error occurred
  }
};

export const deleteFileByAPI = async (fileName: string, url: string) => {
  try {
    console.info('Deleting file via API:', fileName);
    console.info('Delete URL:', `${url}/delete?file=${fileName}`);

    const response = await RNFetchBlob.fetch(
      'GET',
      `${url}/delete?file=${fileName}`,
    );

    console.info('Delete response:', response);
    return response;
  } catch (error) {
    console.error('Delete failed with error:', error);
    return -1;
  }
};
