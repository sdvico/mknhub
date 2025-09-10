import {NOTIFICATION_ACTIONS} from '../saga/notification.saga';

interface NotificationType {
  code: string;
  name: string;
  unread_count: number;
}

interface Notification {
  id: string;
  type: string;
  content: string;
  occurred_at: string;
  ship_code: string;
  report: boolean;
}

interface NotificationState {
  productCode: string | null;
  pendingAction: string | null;
  notifications: Notification[];
  notificationTypes: NotificationType[];
  typesMap: Record<string, string>;
  loading: boolean;
  error: string | null;
  total_unread: number;
  ports: any[];
}

const initialState: NotificationState = {
  productCode: null,
  pendingAction: null,
  notifications: [],
  notificationTypes: [],
  typesMap: {},
  loading: false,
  error: null,
  total_unread: 0,
  ports: [],
};

export const notificationReducer = (
  state = initialState,
  action: any,
): NotificationState => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.SET_PRODUCT_CODE:
      return {
        ...state,
        productCode: action.payload,
      };

    case NOTIFICATION_ACTIONS.SET_PENDING_ACTION:
      return {
        ...state,
        pendingAction: action.payload,
      };

    case NOTIFICATION_ACTIONS.CLEAR_PENDING_ACTION:
      return {
        ...state,
        pendingAction: null,
      };

    // Notifications
    case NOTIFICATION_ACTIONS.FETCH_NOTIFICATIONS:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case NOTIFICATION_ACTIONS.FETCH_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload,
      };

    case NOTIFICATION_ACTIONS.FETCH_NOTIFICATIONS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Notification Types
    case NOTIFICATION_ACTIONS.FETCH_NOTIFICATION_TYPES:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case NOTIFICATION_ACTIONS.FETCH_NOTIFICATION_TYPES_SUCCESS:
      let total_unread = 0;
      const typesMap = action.payload.reduce(
        (acc: Record<string, string>, type: NotificationType) => {
          acc[type.code] = type.name;
          total_unread += type.unread_count;
          return acc;
        },
        {},
      );

      return {
        ...state,
        loading: false,
        notificationTypes: [
          {code: 'all', name: 'Tất cả', unread_count: 0},
          ...action.payload,
        ],
        typesMap,
        total_unread,
      };

    case NOTIFICATION_ACTIONS.FETCH_NOTIFICATION_TYPES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Ports
    case NOTIFICATION_ACTIONS.FETCH_PORTS:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case NOTIFICATION_ACTIONS.FETCH_PORTS_SUCCESS:
      return {
        ...state,
        loading: false,
        ports: action.payload,
      };
    case NOTIFICATION_ACTIONS.FETCH_PORTS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
