import React, {createContext, useContext, ReactNode} from 'react';

interface NotificationContextType {
  productCode: string | null;
  setProductCode: (code: string | null) => void;
  pendingAction: string | null;
  setPendingAction: (action: string | null) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotificationContext must be used within NotificationProvider',
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [productCode, setProductCode] = React.useState<string | null>(null);
  const [pendingAction, setPendingAction] = React.useState<string | null>(null);

  const value = {
    productCode,
    setProductCode,
    pendingAction,
    setPendingAction,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
