/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import io, {Socket} from 'socket.io-client';
import {useSelector} from 'react-redux';
import {RootStateReducer} from '../store/types';
import {dispatch, getState} from '../common';
import {
  ADD_MESSAGE,
  MARK_AS_READ,
  SET_BLOCK,
  SET_IMEISTRACKING,
  SET_SOCKETIOSTATUS,
} from '../features/chat/redux/constants';

import {ENVConfig} from '../config/env';
import PushNotification from 'react-native-push-notification';
import {Platform} from 'react-native';
import notifee, {EventType} from '@notifee/react-native';
import {decryptMessageFromString} from './useEncrypt';
import {AppState} from '../store/app/redux/type';
import Utils from '../library/utils';
import {APP_SCREEN} from '../navigation/screen-types';
import {Person} from '../features/chat/redux/reducer';

interface SocketContextType {
  socket: Socket | null;
}
interface MessageNKKT {
  sender_id: string;
  received_id: string;
  content: string;
  block_count: string;
  time: string;
}
const SocketContext = createContext<SocketContextType>({socket: null});

export const SocketProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const userId = useSelector(
    (state: RootStateReducer) => state.nkkt.currentAccount?.id,
  );

  const {socketIOStatus, listPersonChat, logEntries} = useSelector(
    (state: RootStateReducer) => state.chat,
  ) || {
    socketIOStatus: false,
    listPersonChat: [],
    logEntries: [],
  };

  const [socket, setSocket] = useState<Socket | null>(null);

  // Initialize notifications on component mount
  useEffect(() => {
    // Configure the notification library
    PushNotification.configure({
      onRegister: function (token: string) {
        console.info('TOKEN:', token);
      },
      onNotification: function (notification: any) {
        console.info('NOTIFICATION:', notification);

        const {screen, roomId, roomName, receiverUser} = notification.data;
        if (notification.userInteraction) {
          const currentRoute = Utils.navigation.getCurrentRoute();

          if (currentRoute?.name !== APP_SCREEN.CHAT_ROOM) {
            if (receiverUser) {
              dispatch({type: MARK_AS_READ, payload: roomId});
              Utils.navigation.navigate(APP_SCREEN.CHAT_ROOM, {
                roomId: roomId,
                roomName: roomName,
                receiverUser: receiverUser as number,
              });
            }
          }
        }
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    // Create channel for Android
    PushNotification.createChannel(
      {
        channelId: 'chat-messages',
        channelName: 'Chat Messages',
        channelDescription: 'Notifications for new chat messages',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created: any) => console.info(`Channel created: ${created}`),
    );
  }, []);

  useEffect(() => {
    if (userId) {
      const socketConnection = io(ENVConfig.SOCKETIO_URL, {
        transports: ['websocket'],
      });

      setSocket(socketConnection);
      socketConnection.on('connect', () => {
        console.info('Kết nối socket');

        socketConnection.emit('join-room', userId);

        const {token}: AppState = getState('app');

        const fetchBlock = async () => {
          const res = await fetch(
            `${ENVConfig.API_URL}api/common3/get?action=getBlockUser`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const data = await res.json();

          if (data.success) {
            const block = data.data?.data?.[0]?.total;
            dispatch({type: SET_BLOCK, payload: block});
          }
        };

        console.info('saturday nights:', logEntries);
        const syncLog = async () => {
          const formattedLogs = logEntries.map(log => ({
            time: new Date(log.timestamp).toLocaleString('en-GB'),
            type: log.type === 'sent' ? true : false,
            idSender: log.senderId,
            idReceiver: log.receiverId,
            iri: log.imei || '',
            content: log.message,
          }));
          const res = await fetch(
            `${ENVConfig.API_URL}api/SMSSconnect/SaveLogSMS`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formattedLogs),
            },
          );

          const data = await res.json();
          console.info('sync data ok or not: ', data);
        };
        syncLog();
        fetchBlock();

        dispatch({
          type: SET_IMEISTRACKING,
          payload: '',
        });
        dispatch({
          type: SET_SOCKETIOSTATUS,
          payload: true,
        });
      });

      socketConnection.on('connect_error', error => {
        dispatch({
          type: SET_SOCKETIOSTATUS,
          payload: false,
        });
        console.info('SocketIO Connection error');
      });

      socketConnection.on('messageSconnect', async (msg: MessageNKKT) => {
        console.info('message_nkkt:', msg);

        const decryptMsg = decryptMessageFromString(msg.content);
        console.info('decryptMsg', decryptMsg);
        const senderName = listPersonChat.find(
          person =>
            person.id.toString().trim() === msg.sender_id.toString().trim(),
        )?.name;
        console.log('senderName get usesocket', senderName);
        const messageContent = msg.content.split('$$')[0]; // Get content before $$
        dispatch({
          type: ADD_MESSAGE,
          payload: {
            senderId: msg.sender_id,
            senderName: senderName || msg.sender_id,
            receiverId: msg.received_id,
            text: messageContent,
            createTime: msg.time,
          },
        });

        // Show notification using the new library
        await showNotification(
          'Tin nhắn mới từ ' + msg.sender_id,
          messageContent,
          msg,
          listPersonChat,
        );

        console.info('done save and show notify', msg);
      });

      socketConnection.on('disconnect', () => {
        dispatch({
          type: SET_SOCKETIOSTATUS,
          payload: false,
        });
        console.info('disconnect socketio');
      });

      return () => {
        socketConnection.disconnect();
      };
    }
  }, [listPersonChat, logEntries, userId]);

  const value = useMemo(() => ({socket}), [socket]);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};

// Platform-specific notification function
const showNotification = async (
  title: string,
  body: string,
  msg: any,
  listPersonChat: any,
) => {
  const roomId =
    parseInt(String(msg?.sender_id), 10) >
    parseInt(String(msg?.received_id), 10)
      ? `${msg?.received_id}-${msg?.sender_id}`
      : `${msg?.sender_id}-${msg?.received_id}`;
  const senderName = listPersonChat.find(
    (person: Person) =>
      person.id.toString().trim() === msg.sender_id.toString().trim(),
  )?.name;
  if (Platform.OS === 'ios') {
    // iOS: Use Notifee
    await notifee.requestPermission();

    // Set up notification press listener for iOS
    notifee.onForegroundEvent(({type, detail}) => {
      if (type === EventType.PRESS) {
        const currentRoute = Utils.navigation.getCurrentRoute();

        if (currentRoute?.name !== APP_SCREEN.CHAT_ROOM) {
          dispatch({type: MARK_AS_READ, payload: roomId});
          Utils.navigation.navigate(APP_SCREEN.CHAT_ROOM, {
            roomId: roomId,
            roomName: senderName,
            receiverUser: parseInt(String(msg?.sender_id), 10),
          });
        }
      }
    });

    // Set up background notification press listener for iOS
    notifee.onBackgroundEvent(async ({type, detail}) => {
      if (type === EventType.PRESS) {
        const currentRoute = Utils.navigation.getCurrentRoute();

        if (currentRoute?.name !== APP_SCREEN.CHAT_ROOM) {
          dispatch({type: MARK_AS_READ, payload: roomId});
          Utils.navigation.navigate(APP_SCREEN.CHAT_ROOM, {
            roomId: roomId,
            roomName: senderName,
            receiverUser: parseInt(String(msg?.sender_id), 10),
          });
        }
      }
    });

    await notifee.displayNotification({
      title,
      body,
      ios: {
        // iOS resource (.wav, aiff, .caf)
        sound: 'default',
        // Add these iOS-specific configurations
        categoryId: 'message',
        foregroundPresentationOptions: {
          alert: true,
          badge: true,
          sound: true,
        },
        // Optional: Add attachment for rich notifications
        attachments: [],
      },
      // Add data for navigation handling
      data: {
        screen: 'RoomList',
      },
    });
    await notifee.incrementBadgeCount();
  } else {
    // Android: Use react-native-push-notification
    PushNotification.localNotification({
      channelId: 'chat-messages',
      title,
      message: body,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      vibrate: true,
      vibration: 300,
      data: {
        screen: 'RoomList',
        roomId: roomId,
        roomName: senderName,
        receiverUser: parseInt(String(msg?.sender_id), 10),
      },
    });
  }
};
