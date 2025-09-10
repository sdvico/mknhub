/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import {useSelector} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import {RootStateReducer} from '../store/types';
import {dispatch} from '../common';
import {
  SET_ESP_STATUS,
  SET_PLATE_NUMBER_TRANSMISSION,
} from '../features/logbook/redux/constants';

interface SocketContextType {
  socket: WebSocket | null;
  reconnect: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  reconnect: () => {},
});

const forkDisabled = true;

export const ESPProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const userId = useSelector(
    (state: RootStateReducer) => state.nkkt.currentAccount?.id,
  );

  const {currentTrip} = useSelector((state: RootStateReducer) => state.nkkt);

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const socketRef = useRef<WebSocket | null>(null);
  const MAX_RETRIES = 9999;
  const RETRY_DELAY = 3000;

  const cleanUpWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.onopen = null;
      socketRef.current.onclose = null;
      socketRef.current.onerror = null;
      socketRef.current.onmessage = null;
      socketRef.current.close();
      socketRef.current = null;
      setSocket(null);
    }
  };

  const initWebSocket = () => {
    cleanUpWebSocket();

    const ws = new WebSocket('ws://192.168.4.1/ws');
    socketRef.current = ws;

    ws.onopen = () => {
      console.info('🟢 Đã kết nối đến ESP32');
      retryCountRef.current = 0;
      dispatch({type: SET_ESP_STATUS, payload: true});
      setSocket(ws);
    };

    ws.onclose = () => {
      dispatch({type: SET_ESP_STATUS, payload: false});
      if (retryCountRef.current < MAX_RETRIES) {
        console.info(
          `🔴 Mất kết nối WebSocket. Thử lại sau ${RETRY_DELAY / 1000} giây...`,
        );
        retryCountRef.current += 1;
        setTimeout(initWebSocket, RETRY_DELAY);
      } else {
        console.info('🔴 Đã vượt quá số lần thử kết nối tối đa');
      }
    };

    ws.onerror = err => {
      console.error('WebSocket lỗi:', err.message);
      dispatch({type: SET_ESP_STATUS, payload: false});
    };

    ws.onmessage = event => {
      const data = JSON.parse(event.data);
      if (data.type === 'chat_message') {
        if (data.message) {
          const message = JSON.parse(data.message);
          if (message.tripId === currentTrip.tripid) {
            dispatch({
              type: SET_PLATE_NUMBER_TRANSMISSION,
              payload: message.plateNumber,
            });
          }
        } else {
          console.error('WebSocket lỗi: message không hợp lệ');
        }
      }
    };
  };

  const reconnect = () => {
    console.info('🔄 Thực hiện reconnect WebSocket thủ công');
    !forkDisabled && initWebSocket();
  };

  // Tự reconnect khi mạng thay đổi
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (
        state.isConnected &&
        state.type === 'wifi' &&
        state.details?.ipAddress?.startsWith('192.168.4.') // có thể tùy chỉnh
      ) {
        console.info('📶 Phát hiện WiFi phần cứng. Reconnect WebSocket...');
        setTimeout(() => {
          reconnect();
        }, 1500); // delay nhẹ để mạng ổn định
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (userId) {
      !forkDisabled && initWebSocket();
    }

    return () => {
      cleanUpWebSocket();
    };
  }, [userId]);

  const value = useMemo(() => ({socket, reconnect}), [socket]);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};

export const useSocketESPCall = () => {
  const {socket, reconnect} = useContext(SocketContext);

  const sendPM = (targetId: string, message: string) => {
    if (!targetId || !message) {
      console.info('⚠️ Vui lòng nhập cả ID và tin nhắn.');
      return false;
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: 'chat_message',
          message: message,
        }),
      );
      console.info(`📤 Gửi tới ${targetId}: ${message}`);
      return true;
    } else {
      console.info('⚠️ Không thể gửi: WebSocket chưa kết nối.');
      return false;
    }
  };

  return {
    socket,
    sendPM,
    reconnect,
  };
};
