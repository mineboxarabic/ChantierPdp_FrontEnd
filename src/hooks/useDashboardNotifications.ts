// Suggested ChantierPdp_FrontEnd/src/hooks/useDashboardNotifications.ts
import { useState, useCallback, useEffect } from 'react';
import { useNotifications as useSnackbar } from '@toolpad/core/useNotifications';
import fetchApi from '../api/fetchApi'; //
import {
  NotificationDTO as BackendNotificationDTO, //
  FrontendNotificationType, //
  DashboardNotification, //
} from '../utils/entitiesDTO/NotificationDTO'; //

// Helper function (keep as is or refine based on all backend NotificationType.java values)
const transformToDashboardNotification = (dto: BackendNotificationDTO): DashboardNotification => {
  let panelType: DashboardNotification['type'] = 'general'; // Default type
  let priority: DashboardNotification['priority'] = 'medium'; // Default priority

  // Mapping backend NotificationType enum (from Java) to frontend display types
  // This needs to be exhaustive based on your com.danone.pdpbackend.Utils.NotificationType
  switch (dto.type?.toString().toUpperCase()) { // Convert to string and uppercase for robust matching
    case 'DOCUMENT_REQUIRED': //
      panelType = 'document';
      priority = 'high';
      break;
    case 'RISK_IDENTIFIED': //
      panelType = 'risk';
      priority = 'high';
      break;
    case 'INSPECTION_NEEDED': //
      panelType = 'inspection';
      priority = 'medium';
      break;
    case 'CHANTIER_UPDATE': //
      panelType = 'event';
      priority = 'medium';
      break;
    case 'TASK_ASSIGNED': //
      panelType = 'task';
      priority = 'medium';
      break;
    case 'WORKER_ADDED': //
       panelType = 'worker';
       priority = 'low';
       break;
    case 'GENERAL_ALERT': //
       panelType = 'general';
       priority = 'medium';
       break;
    // Add more cases from your NotificationType.java
    // e.g. NEW_PDP_SUBMITTED, ACTION_REQUIRED, USER_MENTIONED etc.
    default:
      // Fallback for unknown types, or try to infer from message
      if (dto.message?.toLowerCase().includes('urgent') || dto.message?.toLowerCase().includes('critical')) {
        priority = 'high';
      }
      console.warn(`Unhandled notification type: ${dto.type}`);
      break;
  }

  return {
    id: dto.id,
    message: dto.message,
    date: dto.timestamp ? new Date(dto.timestamp).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Date inconnue',
    isRead: dto.isRead,
    type: panelType,
    priority: priority,
    callToActionLink: dto.callToActionLink || undefined,
    originalType: dto.type, //
  };
};

interface PaginatedNotificationsResponse {
  content: BackendNotificationDTO[];
  totalPages: number;
  totalElements: number;
  // Add other pagination fields your backend might send
}

interface UseDashboardNotificationsReturn {
  notifications: DashboardNotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: (
    readStatus?: 'all' | 'read' | 'unread',
    page?: number,
    size?: number
  ) => Promise<DashboardNotification[] | undefined>;
  markNotificationAsRead: (notificationId: number) => Promise<boolean>;
  markAllNotificationsAsRead: () => Promise<boolean>;
  refreshUnreadCount: () => Promise<void>;
}

const useDashboardNotifications = (): UseDashboardNotificationsReturn => {
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const snackbar = useSnackbar();

  const fetchNotificationsHook = useCallback(
    async (
      readStatus: 'all' | 'read' | 'unread' = 'unread',
      page: number = 0,
      size: number = 10 // Default size
    ): Promise<DashboardNotification[] | undefined> => {
      setIsLoading(true);
      setError(null);
      try {
        // Endpoint from NotificationController.java
        const response = await fetchApi<PaginatedNotificationsResponse>(
          `/api/notifications?readStatus=${readStatus}&page=${page}&size=${size}&sort=timestamp,desc`,
          'GET'
        );

        if (response.data && response.data.content) {
          const transformed = response.data.content.map(transformToDashboardNotification);
          setNotifications(prev => page === 0 ? transformed : [...prev, ...transformed]); // Append for infinite scroll, replace for first page
          return transformed;
        } else {
          if (page === 0) setNotifications([]);
          console.warn('No notification content in response:', response);
          return [];
        }
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err.message || 'Erreur de chargement des notifications.';
        setError(errorMessage);
        snackbar.show(errorMessage, { severity: 'error' });
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [snackbar]
  );

  const markNotificationAsReadHook = useCallback(
    async (notificationId: number): Promise<boolean> => {
      setIsLoading(true); // Potentially set a specific loading state for this action
      try {
        // Endpoint from NotificationController.java
        await fetchApi<BackendNotificationDTO>(`/api/notifications/${notificationId}/read`, 'PATCH');
        setNotifications(prev =>
          prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
        );
        // Decrement unread count locally for immediate feedback
        setUnreadCount(prev => (prev > 0 ? prev - 1 : 0));
        snackbar.show('Notification marquée comme lue.', { severity: 'success' });
        return true;
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err.message || 'Erreur lors de la mise à jour de la notification.';
        setError(errorMessage); // Set specific error?
        snackbar.show(errorMessage, { severity: 'error' });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [snackbar]
  );

  const markAllNotificationsAsReadHook = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Endpoint from NotificationController.java
      await fetchApi<string>(`/api/notifications/mark-all-read`, 'POST');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0); // All marked as read
      snackbar.show('Toutes les notifications marquées comme lues.', { severity: 'success' });
      return true;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err.message || 'Erreur lors de la mise à jour des notifications.';
      setError(errorMessage);
      snackbar.show(errorMessage, { severity: 'error' });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [snackbar]);

  const fetchUnreadCountHook = useCallback(async () => {
    // Not setting global isLoading for this, as it's a background update
    try {
      // Endpoint from NotificationController.java
      const response = await fetchApi<number>(`/api/notifications/unread-count`, 'GET');
      if (typeof response.data === 'number') {
        setUnreadCount(response.data);
      }
    } catch (err: any) {
      // Silently fail or show a very subtle error, as this is often a background task
      console.error('Failed to fetch unread notification count:', err);
      // snackbar.show("Impossible de récupérer le nombre de notifications non lues.", { severity: 'warning', autoHideDuration: 2000 });
    }
  }, []);

  // Fetch unread count on initial load
  useEffect(() => {
    fetchUnreadCountHook();
  }, [fetchUnreadCountHook]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications: fetchNotificationsHook,
    markNotificationAsRead: markNotificationAsReadHook,
    markAllNotificationsAsRead: markAllNotificationsAsReadHook,
    refreshUnreadCount: fetchUnreadCountHook,
  };
};

export default useDashboardNotifications;