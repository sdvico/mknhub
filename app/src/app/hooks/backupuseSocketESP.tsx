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
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectedRef = useRef(false);
  const MAX_RETRIES = 9999;
  const RETRY_DELAY = 3000;
  const HEARTBEAT_INTERVAL = 10000; // 10 seconds
  const CONNECTION_VERIFY_DELAY = 2000; // 2 seconds after onopen

  console.info('🔄 ESPProvider mounted');

  const cleanUpWebSocket = () => {
    if (socketRef.current) {
      console.info('🔄 cleanUpWebSocket called');

      // Clear heartbeat
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }

      // Reset connection status
      isConnectedRef.current = false;

      // Close and clean up WebSocket
      socketRef.current.close();
      socketRef.current.onopen = null;
      socketRef.current.onclose = null;
      socketRef.current.onerror = null;
      socketRef.current.onmessage = null;
      socketRef.current = null;
      setSocket(null);

      // Set ESP status to false
      dispatch({type: SET_ESP_STATUS, payload: false});
    }
  };

  const startHeartbeat = (ws: WebSocket) => {
    // Clear existing heartbeat
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    heartbeatIntervalRef.current = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          // Send ping message
          ws.send(JSON.stringify({type: 'ping'}));
          console.info('💗 Heartbeat ping sent');
        } catch (error) {
          console.error('❌ Heartbeat failed:', error);
          isConnectedRef.current = false;
          dispatch({type: SET_ESP_STATUS, payload: false});
          // Trigger reconnection
          initWebSocket();
        }
      } else {
        console.info('💔 WebSocket not open during heartbeat');
        isConnectedRef.current = false;
        dispatch({type: SET_ESP_STATUS, payload: false});
      }
    }, HEARTBEAT_INTERVAL);
  };

  const verifyConnection = (ws: WebSocket) => {
    return new Promise<boolean>(resolve => {
      // Wait a bit after onopen to ensure connection is stable
      setTimeout(() => {
        if (ws.readyState === WebSocket.OPEN) {
          try {
            // Send a test message to verify connection
            ws.send(JSON.stringify({type: 'connection_test'}));
            console.info('🧪 Connection test message sent');
            resolve(true);
          } catch (error) {
            console.error('❌ Connection verification failed:', error);
            resolve(false);
          }
        } else {
          console.error('❌ WebSocket not open during verification');
          resolve(false);
        }
      }, CONNECTION_VERIFY_DELAY);
    });
  };

  const initWebSocket = () => {
    console.info('🔄 initWebSocket called');
    cleanUpWebSocket();

    try {
      console.info('🔄 Attempting to connect to ws://192.168.4.1/ws');
      const ws = new WebSocket('ws://192.168.4.1/ws');
      console.info('🔄 WebSocket instance created', {
        readyState: ws.readyState,
        url: ws.url,
      });

      // Add timeout to detect hanging connections
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          console.error('❌ WebSocket connection timeout');
          ws.close();
          if (retryCountRef.current < MAX_RETRIES) {
            console.info(
              `🔴 Connection timeout. Retrying in ${
                RETRY_DELAY / 1000
              } seconds... (Attempt ${
                retryCountRef.current + 1
              }/${MAX_RETRIES})`,
            );
            retryCountRef.current += 1;
            setTimeout(initWebSocket, RETRY_DELAY);
          } else {
            console.info('🔴 Max retries exceeded');
          }
        }
      }, 8000); // Increased timeout to 8 seconds

      socketRef.current = ws;

      ws.onopen = async () => {
        clearTimeout(connectionTimeout);
        console.info('🟡 WebSocket opened, verifying connection...');

        // Verify the connection is actually working
        const isVerified = await verifyConnection(ws);

        if (isVerified && ws.readyState === WebSocket.OPEN) {
          console.info('🟢 WebSocket connection verified and ready');
          retryCountRef.current = 0;
          isConnectedRef.current = true;
          dispatch({type: SET_ESP_STATUS, payload: true});
          setSocket(ws);

          // Start heartbeat to monitor connection
          startHeartbeat(ws);
        } else {
          console.error('❌ WebSocket connection verification failed');
          ws.close();
          if (retryCountRef.current < MAX_RETRIES) {
            retryCountRef.current += 1;
            setTimeout(initWebSocket, RETRY_DELAY);
          }
        }
      };

      ws.onclose = event => {
        clearTimeout(connectionTimeout);
        console.info(
          `🔴 WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`,
        );

        isConnectedRef.current = false;
        dispatch({type: SET_ESP_STATUS, payload: false});

        // Clear heartbeat
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
          heartbeatIntervalRef.current = null;
        }

        // Only retry if it was an unexpected close (not manual close)
        if (event.code !== 1000 && retryCountRef.current < MAX_RETRIES) {
          console.info(
            `🔴 Connection lost. Retrying in ${
              RETRY_DELAY / 1000
            } seconds... (Attempt ${retryCountRef.current + 1}/${MAX_RETRIES})`,
          );
          retryCountRef.current += 1;
          setTimeout(initWebSocket, RETRY_DELAY);
        } else if (event.code === 1000) {
          console.info('🔴 WebSocket closed normally');
        } else {
          console.info('🔴 Max retries exceeded');
        }
      };

      ws.onerror = err => {
        clearTimeout(connectionTimeout);
        console.error('❌ WebSocket error:', err);

        if (err instanceof Error) {
          console.error('Error details:', {
            message: err.message,
            name: err.name,
            stack: err.stack,
          });
        }

        isConnectedRef.current = false;
        dispatch({type: SET_ESP_STATUS, payload: false});
      };

      ws.onmessage = event => {
        console.info('📨 Received message:', event.data);

        try {
          const data = JSON.parse(event.data);

          // Handle different message types
          if (data.type === 'pong') {
            console.info('💗 Heartbeat pong received');
            return;
          }

          if (data.type === 'connection_test_response') {
            console.info('🧪 Connection test response received');
            return;
          }

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
              console.error('❌ Invalid message format: missing message field');
            }
          }
        } catch (parseError) {
          console.error('❌ Failed to parse WebSocket message:', parseError);
        }
      };
    } catch (error) {
      console.error('❌ Failed to create WebSocket:', error);
      dispatch({type: SET_ESP_STATUS, payload: false});
    }
  };

  const reconnect = () => {
    console.info('🔄 Manual WebSocket reconnection triggered');
    retryCountRef.current = 0; // Reset retry count for manual reconnection
    initWebSocket();
  };

  useEffect(() => {
    console.info('🔄 useEffect for network changes triggered');
    let wasOnESP32 = false;
    let networkCheckInterval: NodeJS.Timeout;

    // Call initWebSocket on mount
    initWebSocket();

    const unsubscribe = NetInfo.addEventListener(state => {
      const isESP32Network =
        state.isConnected &&
        state.type === 'wifi' &&
        (state.details?.ipAddress?.startsWith('192.168.4.') ||
          state.details?.ssid?.includes('ESP32')); // More flexible ESP32 detection

      console.info('📶 Network state:', {
        isConnected: state.isConnected,
        type: state.type,
        ipAddress: state.details?.ipAddress,
        ssid: state.details?.ssid,
        isESP32Network,
        wasOnESP32,
      });

      if (isESP32Network && !wasOnESP32) {
        console.info(
          '📶 Connected to ESP32 WiFi → Initiating WebSocket connection',
        );
        wasOnESP32 = true;

        // Wait a bit longer for network to stabilize
        setTimeout(() => {
          reconnect();
        }, 3000);
      }

      if (!isESP32Network && wasOnESP32) {
        console.info('🌐 Disconnected from ESP32 WiFi → Cleaning up WebSocket');
        wasOnESP32 = false;
        cleanUpWebSocket();
      }
    });

    // Periodic network check as backup
    networkCheckInterval = setInterval(async () => {
      const state = await NetInfo.fetch();
      const isESP32Network =
        state.isConnected &&
        state.type === 'wifi' &&
        (state.details?.ipAddress?.startsWith('192.168.4.') ||
          state.details?.ssid?.includes('ESP32'));

      // If we should be connected but socket is not working, try to reconnect
      if (isESP32Network && (!socketRef.current || !isConnectedRef.current)) {
        console.info(
          '🔄 Periodic check: Should be connected but socket is not ready, reconnecting...',
        );
        reconnect();
      }
    }, 15000); // Check every 15 seconds

    return () => {
      unsubscribe();
      clearInterval(networkCheckInterval);
      cleanUpWebSocket();
    };
  }, []);

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
      console.info('⚠️ Please provide both ID and message.');
      return false;
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        const messageData = JSON.stringify({
          type: 'chat_message',
          message: message,
          timestamp: Date.now(), // Add timestamp for debugging
        });

        socket.send(messageData);
        console.info(`📤 Message sent to ${targetId}:`, messageData);
        return true;
      } catch (error) {
        console.error('❌ Failed to send message:', error);
        // Trigger reconnection on send failure
        reconnect();
        return false;
      }
    } else {
      console.info(
        '⚠️ Cannot send: WebSocket not connected. Current state:',
        socket?.readyState,
      );
      // Try to reconnect if socket is not open
      reconnect();
      return false;
    }
  };

  return {
    socket,
    sendPM,
    reconnect,
  };
};
