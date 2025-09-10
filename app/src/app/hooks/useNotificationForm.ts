import {useSelector} from 'react-redux';

export interface NotificationType {
  id: string;
  code: string;
  name: string;
  form_type: string;
  icon: string;
  color: string;
  background_color: string | null;
  created_at: string;
  updated_at: string;
  unread_count: number;
}

export const useNotificationForm = (notificationCode: string) => {
  const notificationTypes = useSelector(
    (state: any) => state.notification.notificationTypes,
  );

  const notificationType = notificationTypes?.find(
    (type: NotificationType) => type.code === notificationCode,
  );

  if (
    notificationType?.form_type &&
    (`${notificationType?.form_type}`.includes('KBVT') ||
      `${notificationType?.form_type}`.includes('KBCC'))
  ) {
    return {
      hasForm: true,
      formName: null,
      notificationType: null,
    };
  }

  return {
    hasForm: false,
    formName: notificationType.form_type,
    notificationType,
  };
};
