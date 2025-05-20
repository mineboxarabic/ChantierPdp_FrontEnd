// ChantierPdp_FrontEnd/src/hooks/useDashboardNotifications.ts
import { useState, useCallback } from 'react';
import { useNotifications as useSnackbar } from '@toolpad/core/useNotifications';
import fetchApi, { ApiResponse } from '../api/fetchApi'; // Assuming ApiResponse is exported from fetchApi
import {
  NotificationDTO as BackendNotificationDTO,
  FrontendNotificationType, // Make sure this enum is robust
  DashboardNotification,
} from '../utils/entitiesDTO/NotificationDTO';

// Helper function to transform backend DTO to frontend display type
const transformToDashboardNotification = (dto: BackendNotificationDTO): DashboardNotification => {
  let panelType: DashboardNotification['type'] = 'general';
  let priority: DashboardNotification['priority'] = 'medium';

  switch (dto.type) {
    case FrontendNotificationType.DOCUMENT_REQUIRED:
    case 'DOCUMENT_REQUIRED': // If type comes as string
      panelType = 'document';
      priority = 'high';
      break;
    case FrontendNotificationType.RISK_IDENTIFIED:
    case 'RISK_IDENTIFIED':
      panelType = 'risk';
      priority = 'high';
      break;
    // Add all your FrontendNotificationType cases and desired mappings
    default:
      // Try to match common patterns if type is a string
      if (typeof dto.type === 'string') {
        if (dto.type.toLowerCase().includes('inspection')) panelType = 'inspection';
        else if (dto.type.toLowerCase().includes('worker')) panelType = 'worker';
        else if (dto.type.toLowerCase().includes('event')) panelType = 'event';
        else if (dto.type.toLowerCase().includes('task')) panelType = 'task';
      }
      // Default priority can also be smart based on keywords in dto.message
      if (dto.message.toLowerCase().includes('urgent') || dto.message.toLowerCase().includes('critical')) {
        priority = 'high';
      }
      break;
  }
  
  return {
    id: dto.id,
    message: dto.message,
    date: new Date(dto.timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }), // Simpler date
    isRead: dto.isRead,
    type: panelType,
    priority: priority,
    callToActionLink: dto.callToActionLink || undefined,
    originalType: dto.type,
  };
};

// Define the structure for the paginated response if your backend sends it
interface PaginatedNotificationsResponse {
  content: BackendNotificationDTO[];
  totalPages: number;
  totalElements: number;
  // Add other pagination fields your backend might send
}

interface UseDashboardNotificationsReturn {
  notifications: DashboardNotification[];
  isLoading: boolean;
  error: string | null;
  fetchNotifications: (
    readStatus?: 'all' | 'read' | 'unread',
    page?: number,
    size?: number
  ) => Promise<DashboardNotification[] | undefined>; // Return fetched data
  // markNotificationAsRead: (notificationId: number) => Promise<void>; // You can add this later
}

const useDashboardNotifications = (): UseDashboardNotificationsReturn => {
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const snackbar = useSnackbar();

  const fetchNotificationsHook = useCallback(
    async (
      readStatus: 'all' | 'read' | 'unread' = 'unread',
      page: number = 0,
      size: number = 5 // Default to 5 for a typical panel display
    ): Promise<DashboardNotification[] | undefined> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchApi<PaginatedNotificationsResponse>(
          `/api/notifications?readStatus=${readStatus}&page=${page}&size=${size}&sort=timestamp,desc`, // Added sort
          'GET'
        );

        if (response.data && response.data.content) {
          const transformed = response.data.content.map(transformToDashboardNotification);
          setNotifications(transformed);
          return transformed;
        } else {
          setNotifications([]); // Clear if no data
          console.warn('No notification content in response or response.data is undefined', response);
          return [];
        }
      } catch (err: any) {
        const errorMessage = err.message || 'Erreur de chargement des notifications.';
        setError(errorMessage);
        snackbar.show(errorMessage, { severity: 'error' });
        // throw err; // Re-throw if components need to act on the error too
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [snackbar] // useCallback dependency
  );

  return {
    notifications,
    isLoading,
    error,
    fetchNotifications: fetchNotificationsHook,
  };
};

export default useDashboardNotifications;