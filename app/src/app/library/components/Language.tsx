import { Icon } from '../../library/components';
import Utils, { PaddingSize } from '../../library/utils';
import i18next from 'i18next';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { TouchableOpacity, View } from 'react-native';

const LanguageComponent = () => {
  const [lang, setLang] = React.useState(i18next.language);

  const onChangeLang = () => {
    const _lang = i18next.language === 'vi_VN' ? 'es_US' : 'vi_VN';
    setLang(_lang);
    i18next.changeLanguage(_lang);
  };

  return (
    <View
      style={{
        position: 'absolute',
        paddingHorizontal: Utils.PaddingSize.vertical16,
        paddingTop: Utils.PaddingSize.statusbar,
        flexDirection: 'row',
        paddingBottom: PaddingSize.base,
        zIndex: 100,
        opacity: 1,
        right: 0,
      }}>
      <TouchableOpacity onPress={onChangeLang} style={{ justifyContent: 'center' }}>
        <Icon icon={lang === 'es_US' ? 'ic_united_states' : 'ic_vietnam'} size={40} />
      </TouchableOpacity>
    </View>
  );
};

export const Language = memo(LanguageComponent, isEqual);
