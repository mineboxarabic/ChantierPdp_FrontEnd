// Suggested ChantierPdp_FrontEnd/src/hooks/useDashboardNotifications.ts
import { useState, useCallback, useEffect } from 'react';
import { useNotifications as useSnackbar } from '@toolpad/core/useNotifications';
import fetchApi from '../api/fetchApi'; //
import {
  NotificationDTO as BackendNotificationDTO, //
  DashboardNotification, //
} from '../utils/entitiesDTO/NotificationDTO'; //

// Helper function (keep as is or refine based on all backend NotificationType.java values)
type NotificationFilter = 'all' | 'read' | 'unread';

const transformToDashboardNotification = (dto: BackendNotificationDTO): DashboardNotification => {
  let panelType: DashboardNotification['type'] = 'general'; // Default type
  let priority: DashboardNotification['priority'] = 'medium'; // Default priority

  // Debug: Check what we're getting from the backend
  console.log('Raw backend notification:', dto);
  console.log('Backend isRead field:', dto.isRead, 'Type:', typeof dto.isRead);
  console.log('Backend read field:', (dto as any).read, 'Type:', typeof (dto as any).read);

  // Handle the isRead field - backend might send it as 'read' or 'isRead'
  let isReadValue: boolean;
  if (dto.isRead !== undefined) {
    isReadValue = dto.isRead;
  } else if ((dto as any).read !== undefined) {
    isReadValue = (dto as any).read;
  } else {
    console.warn('No isRead or read field found in notification, defaulting to false');
    isReadValue = false;
  }

  // Mapping backend NotificationType enum (from Java) to frontend display types
  // This needs to be exhaustive based on your com.danone.pdpbackend.Utils.NotificationType
  switch (dto.type?.toString().toUpperCase()) { // Convert to string and uppercase for robust matching
    case 'DOCUMENT_REQUIRED': //
      panelType = 'document';
      priority = 'high';
      break;
    case 'RISK_IDENTIFIED': //
    case 'CHANTIER_STATUS_BAD': //
      panelType = 'risk';
      priority = 'high';
      break;
    case 'INSPECTION_NEEDED': //
      panelType = 'inspection';
      break;
    case 'CHANTIER_UPDATE': //
      panelType = 'event';
      break;
    case 'TASK_ASSIGNED': //
    case 'CHANTIER_PENDING_BDT': //
      panelType = 'task';
      break;
    case 'WORKER_ADDED': //
       panelType = 'worker';
       priority = 'low';
       break;
    case 'GENERAL_ALERT': //
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

  const transformed = {
    id: dto.id,
    message: dto.message,
    date: dto.timestamp ? new Date(dto.timestamp).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Date inconnue',
    isRead: isReadValue,
    type: panelType,
    priority: priority,
    callToActionLink: dto.callToActionLink || undefined,
    originalType: dto.type, //
  };

  console.log('Transformed notification:', transformed);
  return transformed;
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
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  totalElements: number;
  fetchNotifications: (
    readStatus?: NotificationFilter,
    page?: number,
    size?: number
  ) => Promise<DashboardNotification[] | undefined>;
  loadMoreNotifications: () => Promise<void>;
  markNotificationAsRead: (notificationId: number) => Promise<boolean>;
  markAllNotificationsAsRead: () => Promise<boolean>;
  refreshUnreadCount: () => Promise<void>;
}

const useDashboardNotifications = (): UseDashboardNotificationsReturn => {
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [currentFilter, setCurrentFilter] = useState<NotificationFilter>('all');
  const snackbar = useSnackbar();

  const fetchNotificationsHook = useCallback(
    async (
      readStatus: NotificationFilter = 'unread',
      page: number = 0,
      size: number = 10 // Default size
    ): Promise<DashboardNotification[] | undefined> => {
      const isFirstPage = page === 0;
      const isNewFilter = readStatus !== currentFilter;
      
      if (isFirstPage || isNewFilter) {
        setIsLoading(true);
        setCurrentPage(0);
        if (isNewFilter) {
          setCurrentFilter(readStatus);
          // Clear notifications immediately when switching filters
          setNotifications([]);
        }
      } else {
        setIsLoadingMore(true);
      }
      
      setError(null);
      try {
        // Convert frontend filter to backend readStatus format
        const getBackendReadStatus = (filter: NotificationFilter): string => {
          switch (filter) {
            case 'unread': return 'false';
            case 'read': return 'true';
            case 'all': return 'all';
            default: return 'all';
          }
        };
        
        const backendReadStatus = getBackendReadStatus(readStatus);
        
        // Endpoint from NotificationController.java
        const response = await fetchApi<PaginatedNotificationsResponse>(
          `/api/notifications?readStatus=${backendReadStatus}&page=${page}&size=${size}&sort=timestamp,desc`,
          'GET'
        );

        if (response.data?.content) {
          const transformed = response.data.content.map(transformToDashboardNotification);
          
          // Debug: Check what we're getting from the API
          console.log(`Fetched ${transformed.length} notifications for filter "${readStatus}" (backend: "${backendReadStatus}")`);
          
          // Update pagination state
          setTotalElements(response.data.totalElements || 0);
          setHasMore(page < (response.data.totalPages - 1));
          setCurrentPage(page);
          
          if (isFirstPage || isNewFilter) {
            setNotifications(transformed);
            // Update unread count based on actual notifications when fetching 'all'
            if (readStatus === 'all') {
              const actualUnreadCount = transformed.filter(n => !n.isRead).length;
              console.log('Updating unread count from notifications:', actualUnreadCount);
              setUnreadCount(actualUnreadCount);
            }
          } else {
            console.log(notifications, 'Appending new notifications');
            setNotifications(prev => [...prev, ...transformed]);
          }
          
          return transformed;
        } else {
          if (isFirstPage || isNewFilter) {
            setNotifications([]);
          }
          setHasMore(false);
          setTotalElements(0);
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
        setIsLoadingMore(false);
      }
    },
    [snackbar, currentFilter]
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

  const loadMoreNotificationsHook = useCallback(async () => {
    if (hasMore && !isLoadingMore && !isLoading) {
      await fetchNotificationsHook(currentFilter, currentPage + 1);
    }
  }, [hasMore, isLoadingMore, isLoading, currentFilter, currentPage, fetchNotificationsHook]);

  const fetchUnreadCountHook = useCallback(async () => {
    // Not setting global isLoading for this, as it's a background update
    try {
      // Endpoint from NotificationController.java
      const response = await fetchApi<number>(`/api/notifications/unread-count`, 'GET');
      console.log('Unread count from API:', response.data);
      if (typeof response.data === 'number') {
        setUnreadCount(response.data);
      }
    } catch (err: any) {
      // Silently fail or show a very subtle error, as this is often a background task
      console.error('Failed to fetch unread notification count:', err);
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
    isLoadingMore,
    error,
    hasMore,
    totalElements,
    fetchNotifications: fetchNotificationsHook,
    loadMoreNotifications: loadMoreNotificationsHook,
    markNotificationAsRead: markNotificationAsReadHook,
    markAllNotificationsAsRead: markAllNotificationsAsReadHook,
    refreshUnreadCount: fetchUnreadCountHook,
  };
};

export default useDashboardNotifications;