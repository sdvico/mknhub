import React from 'react';
import {Text, useWindowDimensions} from 'react-native';
import RenderHTML from 'react-native-render-html';
import useDataMessage from '../hooks/useDataMessage';
import {useSelector} from 'react-redux';
import {RootStateReducer} from '@/app/store/types';

export default function NotificationHtmlMessage({
  notification,
}: {
  notification: any;
}) {
  const {width} = useWindowDimensions();
  const {message: html} = useDataMessage(notification);

  return (
    <RenderHTML
      contentWidth={width}
      source={{html}}
      tagsStyles={{
        p: {fontSize: 16, lineHeight: 22},
        b: {fontWeight: '700'},
        strong: {fontWeight: '700'},
      }}
    />
  );
}

export function NotificationTitle({notification}: {notification: any}) {
  const notificationTypesState = useSelector(
    (state: RootStateReducer) => state.notification?.notificationTypes,
  );

  const selectedType = notificationTypesState.find(
    nt => nt.code === notification?.type,
  );

  return (
    <Text style={{fontWeight: 'bold', fontSize: 16}}>
      {`${selectedType?.title || selectedType?.name}`.toUpperCase()}
    </Text>
  );
}
