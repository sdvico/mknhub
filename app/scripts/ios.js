/* eslint-disable @typescript-eslint/no-var-requires */
const {execSync} = require('child_process');

const {loadEnvFile} = require('./common');

(async function () {
  if (process.platform !== 'darwin') {
    console.log('This script is only for macOS');
    return;
  }
  const envJson = await loadEnvFile();
  // const simulator = '03D0E6F7-9A80-457B-B592-827E8664E843'; //iPhone 14
  const simulator = 'E458910E-9AA6-4EA6-B69C-8AB1C0885957'; //iPhone 15

  // const simulator = '00008103-001839510C07C01E';
  try {
    // if simulator is not booted, it will throw an error
    // execSync(`xcrun simctl list devices | grep "${simulator}" | grep "Booted"`);
  } catch {
    // execSync(`xcrun simctl boot ${simulator}`);
  }

  // uninstall app using xcrun
  // execSync(`xcrun simctl uninstall booted "${envJson.BUNDLE_IDENTIFIER}"`);
  execSync(
    `npx react-native run-ios --port=8085 --scheme NewSoba-${envJson.APP_ENV} --udid ${simulator}`,
    {
      stdio: 'inherit',
    },
  );
})();
