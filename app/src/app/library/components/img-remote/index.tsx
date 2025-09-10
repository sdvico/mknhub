import React from 'react';
import { StyleProp, View } from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';

interface Props {
  width?: number;
  height?: number;
  minRatio?: number;
  maxRatio?: number;
  aspectRatio?: number;
  source: string | undefined;
  style?: StyleProp<ImageStyle>;
  sizeGet?: number;
  preload?: boolean;
}

const ImageRemoteCom: React.FC<Props> = props => {
  const { style = {}, source = '', sizeGet, preload, ...rest } = props;

  const onloadEnd = () => {
    if (preload) {
      FastImage.preload([
        {
          uri: props.source,
        },
      ]);
    }
  };

  const imageSource = React.useMemo(() => {
    if (!sizeGet) {
      return source;
    } else {
      const data = `${source}`?.split('/');
      const imageNew = data?.pop();
      if (sizeGet <= 75) {
        return data.join('/') + `/75x75_${imageNew}`;
      }
      if (sizeGet <= 100) {
        return data.join('/') + `/100x100_${imageNew}`;
      }
      if (sizeGet <= 150) {
        return data.join('/') + `/150x150_${imageNew}`;
      }
      if (sizeGet <= 340) {
        return data.join('/') + `/340x340_${imageNew}`;
      }
      if (sizeGet <= 500) {
        return data.join('/') + `/500x500_${imageNew}`;
      }
      if (sizeGet <= 1024) {
        return data.join('/') + `/1024x1024_${imageNew}`;
      }
      return source;
    }
  }, [sizeGet, source]);

  if (!source) {
    return <View {...rest} style={style} />;
  }

  return <FastImage {...rest} source={{ uri: imageSource || '' }} style={style} onLoadEnd={onloadEnd} />;
};

export const ImageRemote = React.memo(ImageRemoteCom);
