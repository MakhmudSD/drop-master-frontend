import { useReactiveVar } from '@apollo/client/react';
import { notificationVar, showNotification, hideNotification } from '@/lib/apollo/store';

interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface UseNotificationResult {
  notification: NotificationState | null;
  showNotification: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  hideNotification: () => void;
}

export const useNotification = (): UseNotificationResult => {
  const notification = useReactiveVar(notificationVar);

  return {
    notification,
    showNotification,
    hideNotification,
  };
};
