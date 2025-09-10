// ToastAlertContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useRef,
} from 'react';
import {ViewStyle, TextStyle} from 'react-native';
import CustomToast from './CustomToast';
import CustomAlert from './CustomAlert';

// Toast Types
export type ToastPosition = 'top' | 'bottom' | 'center';
export type ToastIconType = 'error' | 'success' | 'info';

export interface ToastOptions {
  message: string;
  iconName?: ToastIconType;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  position?: ToastPosition;
  duration?: number;
  customStyles?: {
    container?: ViewStyle;
    text?: TextStyle;
    icon?: ViewStyle;
  };
}

// Alert Types
export type AlertIconType = 'error' | 'success' | 'info';

export interface AlertOptions {
  title?: string;
  message: string;
  buttonText?: string;
  confirmText?: string;
  iconName?: AlertIconType;
  backgroundColor?: string;
  primaryColor?: string;
  confirmColor?: string;
  customStyles?: {
    container?: ViewStyle;
    title?: TextStyle;
    message?: TextStyle;
    button?: ViewStyle;
    buttonText?: TextStyle;
    confirmButton?: ViewStyle;
    confirmButtonText?: TextStyle;
  };
  onClose?: () => void;
  onConfirm?: () => void;
}

// Context Types
interface ToastAlertContextType {
  popToast: (options: ToastOptions) => void;
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
}

// Create the context
const ToastAlertContext = createContext<ToastAlertContextType | undefined>(
  undefined,
);

// Provider Props
interface ToastAlertProviderProps {
  children: ReactNode;
}

export const ToastAlertProvider: React.FC<ToastAlertProviderProps> = ({
  children,
}) => {
  // Toast state
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastOptions, setToastOptions] = useState<ToastOptions>({
    message: '',
    position: 'top',
    duration: 3000,
  });
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Alert state
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertOptions, setAlertOptions] = useState<AlertOptions>({
    title: 'Alert',
    message: '',
    buttonText: 'OK',
  });
  const [alertCloseCallback, setAlertCloseCallback] = useState<
    (() => void) | undefined
  >(undefined);
  const [alertConfirmCallback, setAlertConfirmCallback] = useState<
    (() => void) | undefined
  >(undefined);

  // Toast methods
  const popToast = useCallback((options: ToastOptions) => {
    // Clear any existing timer
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setToastOptions(options);
    setToastVisible(true);
  }, []);

  const hideToast = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToastVisible(false);
  }, []);

  // Alert methods
  const showAlert = useCallback((options: AlertOptions) => {
    const {onClose, onConfirm, ...restOptions} = options;
    setAlertOptions(restOptions);
    setAlertCloseCallback(() => onClose);
    setAlertConfirmCallback(() => onConfirm);
    setAlertVisible(true);
  }, []);

  const hideAlert = useCallback(() => {
    setAlertVisible(false);
    if (alertCloseCallback) {
      alertCloseCallback();
    }
  }, [alertCloseCallback]);

  const confirmAlert = useCallback(() => {
    setAlertVisible(false);
    if (alertConfirmCallback) {
      alertConfirmCallback();
    }
  }, [alertConfirmCallback]);

  // Context value
  const contextValue: ToastAlertContextType = {
    popToast,
    showAlert,
    hideAlert,
  };

  return (
    <ToastAlertContext.Provider value={contextValue}>
      {children}

      {/* Toast component */}
      <CustomToast
        visible={toastVisible}
        onHide={hideToast}
        message={toastOptions.message}
        iconName={toastOptions.iconName}
        backgroundColor={toastOptions.backgroundColor}
        textColor={toastOptions.textColor}
        iconColor={toastOptions.iconColor}
        position={toastOptions.position}
        duration={toastOptions.duration}
        customStyles={toastOptions.customStyles}
      />

      {/* Alert component */}
      <CustomAlert
        visible={alertVisible}
        onClose={hideAlert}
        onConfirm={alertConfirmCallback ? confirmAlert : undefined}
        title={alertOptions.title}
        message={alertOptions.message}
        buttonText={alertOptions.buttonText}
        confirmText={alertOptions.confirmText}
        iconName={alertOptions.iconName}
        backgroundColor={alertOptions.backgroundColor || '#ebffee'} // Default light green background
        primaryColor={alertOptions.primaryColor}
        confirmColor={alertOptions.confirmColor}
        customStyles={alertOptions.customStyles}
      />
    </ToastAlertContext.Provider>
  );
};

// Custom hook for using the toast and alert functionalities
export const useToastAlert = (): ToastAlertContextType => {
  const context = useContext(ToastAlertContext);
  if (context === undefined) {
    throw new Error('useToastAlert must be used within a ToastAlertProvider');
  }
  return context;
};
