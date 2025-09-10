/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { View, TextStyle, ViewStyle } from 'react-native';
import Utils from '../../../library/utils';
import { useTheme } from '../../../themes';
import { ListView, Text } from '../../../library/components';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { createStyleActionBox } from './styles';
import { PaddingSize } from '../../../library/utils';
import { ColorDefault } from '../../../themes/color';


export const Item = ({
  item,
  index,
  onPressItem,
  containerItemStyle,
}: {
  item: ActionItem;
  index: number;
  containerItemStyle?: ViewStyle;
  onPressItem(value: ActionItem): void;
}) => {
  return (
    <TouchableOpacity
      key={index}
      onPress={() => onPressItem(item)}
      style={[
        {
          paddingVertical: Utils.PaddingSize.size16,
        },
        containerItemStyle,
      ]}>
      <Text fontWeight="bold">{item.label}</Text>
    </TouchableOpacity>
  );
};

export type ActionItem = {
  label: string;
  value: any;
};
export type ActionOptions = {
  options: ActionItem[];
};

export interface ActionBoxProps {
  title?: string;
  options: ActionItem[];
  defer: {
    resolve: (reason?: unknown) => boolean;
    reject: (reason?: unknown) => void;
  };
  titleStyle?: TextStyle;
  containerItemStyle?: ViewStyle;
}
const ActionBox = (props: ActionBoxProps) => {
  const { title, options, defer, titleStyle, containerItemStyle } = props;
  const theme = useTheme();
  const styles = createStyleActionBox(theme);

  const onPressItem = (item: ActionItem) => {
    Utils.navigation.goBack();
    defer.resolve(item.value);
    // setTimeout(() => {
    //   defer.resolve(item.value);
    // }, 600);
  };

  return (
    <View>
      <View
        style={{
          paddingVertical: PaddingSize.base,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          backgroundColor: ColorDefault.background_grey200,
        }}>
        <View style={styles.line} />
      </View>
      <View style={[styles.container]}>
        {!!title && (
          <View style={styles.conatinerTitle}>
            <Text style={[titleStyle]}>{title}</Text>
          </View>
        )}
        <ListView
          ItemSeparatorComponent={() => <View style={[styles.itemSeparatorComponentStyle]} />}
          data={options}
          extraData={options}
          renderItem={({ item, index }) => (
            <Item
              index={index}
              containerItemStyle={containerItemStyle}
              key={item}
              item={item}
              onPressItem={onPressItem}
            />
          )}
          keyExtractor={(_item, index) => `${index}`}
        />
      </View>
    </View>
  );
};

export default ActionBox;
