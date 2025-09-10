import {Alert, Linking, BackHandler, Platform} from 'react-native';
import {getVersion} from 'react-native-device-info';

/**
 * Checks for app updates and prompts the user to update if a new version is available.
 * Shuts down the app if the user chooses not to update.
 */
const checkForUpdate = async (): Promise<void> => {
  try {
    // const response = await axios.get('https://your-server.com/api/check-version');
    // const latestVersion = response.data.version;
    const latestVersion = '1.5.2';
    const currentVersion = getVersion();

    if (latestVersion !== currentVersion) {
      Alert.alert(
        'Cập nhật ứng dụng',
        'Ứng dụng đã có phiên bản mới, vui lòng cập nhật để tiếp tục sử dụng.',
        [
          {
            text: 'Cập nhật',
            onPress: () => {
              if (Platform.OS === 'android') {
                Linking.openURL(
                  'https://play.google.com/store/apps/details?id=app.sdhub.com&hl=vi',
                );
              } else {
                Linking.openURL(
                  'https://apps.apple.com/vn/app/sobas-vn/id6446695443',
                );
              }
            },
          },
          {
            text: 'Thoát',
            onPress: () => {
              BackHandler.exitApp();
            },
          },
        ],
        {cancelable: false},
      );
    }
  } catch (error) {
    console.error('Error checking for update:', error);
  }
};

export default checkForUpdate;
