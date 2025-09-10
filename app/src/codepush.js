/* eslint-disable react/jsx-filename-extension */
import CodePush, { RemotePackage } from 'react-native-code-push';
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
// import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';

import { ColorDefault } from './app/themes/color';
import BootSplash from 'react-native-bootsplash';

export let UtilsCodePush = React.createRef(null);

export const CODE_PUSH_BUILD_NUMBER = 2;

const CODE_PUSH_OPTIONS = {
  checkFrequency: CodePush.CheckFrequency.MANUAL,
  // installMode: CodePush.InstallMode.
};

const withCodePush = WrappedComponent => {
  class WrappedApp extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isUpdate: false,
        totalBytes: 0,
        receivedBytes: 0,
        isLoad: false,
        data: {},
      };
      UtilsCodePush.current = this;
    }

    componentDidMount() {
      UtilsCodePush.current.checkUpdate();
    }
    checkUpdate = () => {
      BootSplash.hide({ fade: true });
      CodePush.checkForUpdate().then((update: RemotePackage) => {
        console.log('update---------------', update);

        if (!update) {
          // alert('Ứng dụng đã được cập nhật!');
        } else {
          console.log('update---------------', update);
          // alert('Cần update ứng dung!');
          // console.log(
          //     'Đã có bản cập nhật! Chúng ta có nên tải xuống không?',
          // );
          //   this.update();
          this.setState({ isUpdate: true, data: update });
          CodePush.getUpdateMetadata().then(() => {
            // Utils.nlog('giá tị version', update, val);
          });

          // Utils.showMessageBoxOKCancel(
          //     'Thông báo',
          //     'Đã có bản cập nhật mới bạn có muốn cập nhật hay không',
          //     'Cập nhật',
          //     'Để sau',
          //     this.update,
          //     () => {},
          // );
        }
      });
    };
    update = () => {
      this.setState({ isLoad: true });
      CodePush.sync(
        {
          installMode: CodePush.InstallMode.IMMEDIATE,
        },
        this.syncWithCodePush,
        this.downloadProgressCallback,
      );
    };

    syncWithCodePush = status => {
      console.log(status);
    };
    downloadProgressCallback = ({ totalBytes, receivedBytes }) => {
      this.setState({ totalBytes, receivedBytes });
    };

    render() {
      const { isUpdate, totalBytes, receivedBytes, isLoad } = this.state;
      if (isUpdate) {
        return (
          <LinearGradient
            start={{ x: 0, y: 0.6 }}
            end={{ x: 1, y: 1 }}
            colors={['white', '#256ED1']}
            style={{
              flex: 1,
              alignContent: 'center',
              justifyContent: 'center',
              // backgroundColor: colors.blueGrey_20,
            }}>
            <View style={{ paddingHorizontal: 50 }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 16,
                  color: '#256ED1',
                  lineHeight: 25,
                }}>
                {'Bạn đang sử dụng phiên bản cũ.\nVui lòng cập nhật phiên bản mới hơn để trải nghiệm tốt hơn !'}
              </Text>
            </View>
            <View
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: ColorDefault.grey200,
                backgroundColor: ColorDefault.white,
                marginVertical: 20,
                alignSelf: 'center',
              }}>
              {isLoad ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#256ED1',
                      fontSize: 12,
                    }}>{`${(receivedBytes / 1024).toFixed(2)}/${(totalBytes / 1024).toFixed(2)} Kb`}</Text>
                </View>
              ) : (
                <TouchableOpacity>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: '#256ED1',
                      fontSize: 16,
                    }}>
                    {' '}
                    {'Cập nhật version' + this.state.data?.appVersion + this.state.data?.label}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {isLoad ? null : (
              <View
                pointerEvents={isLoad ? 'none' : 'auto'}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: ColorDefault.grey200,
                    padding: 10,
                    margin: 10,
                    flex: 1,
                    borderRadius: 3,
                  }}
                  onPress={() => this.setState({ isUpdate: false })}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: ColorDefault.grey800,
                    }}>
                    {'Bỏ qua'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    padding: 10,
                    margin: 10,
                    flex: 1,
                    backgroundColor: ColorDefault.primary,
                    borderRadius: 3,
                  }}
                  onPress={this.update}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: ColorDefault.white,
                    }}>
                    {'Cập nhật ngay'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </LinearGradient>
        );
      } else {
        return <WrappedComponent checkUpdate={this.checkUpdate} />;
      }
    }
  }

  return CodePush(CODE_PUSH_OPTIONS)(WrappedApp);
};
export default withCodePush;
