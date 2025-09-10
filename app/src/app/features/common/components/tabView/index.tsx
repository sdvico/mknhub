/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  // StyleSheet,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React, { ComponentType } from 'react';
import { IconTypes } from '../../../../assets/icon';
import { NavigationState, Route, TabView } from 'react-native-tab-view';
import { Text } from '../../../../library/components';
import Utils from '../../../../library/utils';
import { useTheme } from '../../../../themes';
import { ColorDefault } from '../../../../themes/color';

const initialLayout = { width: Dimensions.get('window').width };
interface ItemTab extends Omit<Route, 'icon'> {
  data?: any;
  view: ComponentType<any>;
  icon?: IconTypes;
}
interface TabViewContainerProps {
  dataItem: ItemTab[];
  initIndex?: number;
  onChangeIndex?: (value: number) => void;
  enabelScroll?: boolean;
  containerTab?: ViewStyle;
}
const TabViewContainer = (props: TabViewContainerProps) => {
  const { dataItem, initIndex = 0, enabelScroll = false, containerTab, onChangeIndex = () => { } } = props;
  const [routes] = React.useState<ItemTab[]>(dataItem);
  const [value, setValue] = React.useState<number>(initIndex);

  const theme = useTheme();
  const renderScene = ({ route }: { route: ItemTab }) => {
    const ItemView = route.view;
    return <ItemView setIndex={setValue} data={route.data} />;
  };

  const renderTabBar = ({ navigationState }: { navigationState: NavigationState<ItemTab> }) => {
    return (
      <View>
        <View
          style={[
            {
              flexDirection: 'row',
              paddingTop: Utils.PaddingSize.vertical8,
            },
            containerTab,
          ]}>
          {enabelScroll ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: '100%' }}>
              {navigationState.routes.map((item: ItemTab, i: number) => {
                return (
                  <TouchableOpacity
                    key={i.toString()}
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      paddingVertical: Utils.PaddingSize.vertical10,
                    }}
                    onPress={() => {
                      onChangeIndex(i);
                      setValue(i);
                    }}>
                    <Text style={{ color: value === item.data ? ColorDefault.secondary : 'black' }}>{item.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            navigationState.routes.map((item: ItemTab, i: number) => {
              return (
                <TouchableOpacity
                  key={i.toString()}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    paddingVertical: Utils.PaddingSize.vertical10,
                  }}
                  onPress={() => {
                    setValue(i);
                    onChangeIndex(i);
                  }}>
                  <Text fontWeight="bold" style={{ color: value === i ? ColorDefault.primary : theme.colors.text }}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>
        <View
          style={{
            height: 3,
            backgroundColor: theme.colors.grey200,
            flexDirection: 'row',
          }}>
          {navigationState.routes.map((_: ItemTab, i: number) => {
            return (
              <View
                key={'line' + i}
                style={{
                  flex: 1,
                  backgroundColor: navigationState.index === i ? theme.colors.primary : 'transparent',
                  marginHorizontal: 10,
                }}
              />
            );
          })}
        </View>
      </View>
    );
  };
  return (
    <TabView
      navigationState={{ index: value, routes }}
      renderScene={renderScene}
      onIndexChange={index => {
        onChangeIndex(index);
        setValue(index);
      }}
      renderTabBar={renderTabBar}
      initialLayout={initialLayout}
      lazy={true}
      swipeEnabled={false}
    />
  );
};

export default TabViewContainer;
