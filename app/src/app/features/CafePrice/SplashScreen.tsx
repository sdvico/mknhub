import {ColorDefault} from '@/app/themes/color';
import React from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import {useAutoLogin} from '../../hooks/useAutoLogin';
import {images} from '@/app/assets/image';

export const SplashScreen = () => {
  useAutoLogin();

  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>{'Tải dữ liệu...'}</Text> */}
      <Image source={images.splash} style={styles.backgroundImage} />
      <ActivityIndicator size="large" color={ColorDefault.facebook_blue} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorDefault.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: ColorDefault.white,
  },
  backgroundImage: {
    resizeMode: 'cover',
    width: 150,
    height: 150,
  },
});
