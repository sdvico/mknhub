import { pathCommon } from '../../../../common';
import { Button, Icon, TextField } from '../../../../library/components';
import { useTheme } from '../../../../themes';
import Utils from '../../../../library/utils';
import React, { memo } from 'react';
import equals from 'react-fast-compare';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { createStyleHerder } from './style';
import { HeaderSearchBasicProps } from './types';

const _HeaderSearch = (props: HeaderSearchBasicProps) => {
  const theme = useTheme();
  const {
    leftChildren,
    rightChildren,
    containerStyle,
    isBackButton,
    onBack,
    value,
    onClearText = () => { },
    ...rest
  } = props;
  const styleSearch = createStyleHerder(theme);
  const { t } = useTranslation();
  const renderBackButton = () => {
    return (
      <Button
        onPress={onBack}
        style={{
          paddingRight: Utils.PaddingSize.vertical10,
          backgroundColor: 'transparent',
        }}>
        <Icon icon="back" />
      </Button>
    );
  };
  return (
    <View style={[styleSearch.containerSearch, containerStyle]}>
      {isBackButton && renderBackButton()}
      {leftChildren}
      <TextField
        placeholder={t(`${pathCommon}:search`)}
        containerStyle={styleSearch.containerFieldSearch}
        placeholderColor={theme.colors.primary}
        style={{
          paddingHorizontal: 0,
          paddingVertical: 0,
        }}
        leftChildren={
          <View style={styleSearch.iconSearch}>
            <Icon size={18} color={theme.colors.primary} icon="search" />
          </View>
        }
        rightChildren={
          value ? (
            <Button
              onPress={onClearText}
              style={[{ paddingVertical: 0, backgroundColor: 'transparent' }, styleSearch.iconSearch]}>
              <Icon color={theme.colors.primary} icon="clear" />
            </Button>
          ) : null
        }
        value={value}
        {...rest}
      // contextMenuHidden={true}
      />
      {rightChildren}
    </View>
  );
};
const HeaderSearch = memo(_HeaderSearch, equals);
export default HeaderSearch;
