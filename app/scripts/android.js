/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const {execSync} = require('child_process');
const {loadEnvFile} = require('./common');

(async function () {
  const {argv, platform} = process;
  const envJson = await loadEnvFile();

  console.log('Loaded environment variables:', envJson);

  // uninstall android app with adb
  try {
    const devicesString = execSync('adb devices').toString().trim();
    console.log('ADB devices:', devicesString);
    const cmd = platform === 'darwin' ? 'grep' : 'findstr';
    if (devicesString.includes('device')) {
      const isAppInstalled = execSync(
        `adb shell pm list packages | ${cmd} app.sdhub.com`,
      )
        .toString()
        .trim();
      if (isAppInstalled) {
        console.log('Uninstalling old app:', envJson.BUNDLE_IDENTIFIER);
        execSync(`adb uninstall ${envJson.BUNDLE_IDENTIFIER}`);
      }
    } else {
      console.log('No connected devices found.');
    }
  } catch (error) {
    console.log('Failed to uninstall old app:', error.message);
  }

  const commandUnix = `ENVFILE=${argv[2]} && cd android && ./gradlew clean '-PdefaultEnvFile=${argv[2]}' && cd .. && npx react-native run-android --mode=debug --appId=${envJson.BUNDLE_IDENTIFIER}`;
  //const commandWindows = `set ENVFILE=${argv[2]} && cd android && gradlew.bat clean -PdefaultEnvFile=${argv[2]} && cd .. && npx react-native run-android --mode=${argv[3]} --appId=${envJson.BUNDLE_IDENTIFIER}`;
  const commandWindows = `set ENVFILE=${argv[2]} && npx react-native run-android --mode=${argv[3]} --appId=${envJson.BUNDLE_IDENTIFIER}`;

  if (platform === 'darwin' || platform === 'linux') {
    console.log(`${platform === 'darwin' ? 'MacOS' : 'Linux'} is detected`);
    execSync(commandUnix, {stdio: 'inherit'});
  } else if (platform === 'win32') {
    console.log('Windows is detected');
    execSync(commandWindows, {stdio: 'inherit', shell: 'cmd.exe'});
  }
})();
