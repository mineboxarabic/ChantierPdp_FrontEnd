// Backend NotificationType enum - must match com.danone.pdpbackend.Utils.NotificationType
export enum BackendNotificationType {
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  CHANTIER_UPDATE = 'CHANTIER_UPDATE',
  DOCUMENT_REQUIRED = 'DOCUMENT_REQUIRED',
  RISK_IDENTIFIED = 'RISK_IDENTIFIED',
  INSPECTION_NEEDED = 'INSPECTION_NEEDED',
  WORKER_ADDED = 'WORKER_ADDED',
  GENERAL_ALERT = 'GENERAL_ALERT',
  CHANTIER_STATUS_BAD = 'CHANTIER_STATUS_BAD',
  CHANTIER_PENDING_BDT = 'CHANTIER_PENDING_BDT',
  // Add more types as they are added to the backend
}

// Backend DTO - must match com.danone.pdpbackend.entities.dto.NotificationDTO exactly
export interface NotificationDTO {
  id: number; // Backend sends Long, frontend receives as number
  message: string;
  timestamp: string; // ISO 8601 string from backend
  isRead: boolean;
  type: BackendNotificationType | string; // Backend NotificationType enum
  relatedEntityId?: number | null; // Backend sends Long, frontend receives as number
  relatedEntityType?: string | null;
  relatedEntityDescription?: string | null; // e.g., "Chantier: Test Chantier for BDT"
  callToActionLink?: string | null; // e.g., "/view/chantier/2379"
}


export type DashboardNotification = {
  id: number;
  type: 'inspection' | 'worker' | 'risk' | 'event' | 'task' | 'document' | 'general'; // Frontend display types
  message: string;
  date: string; // Formatted date string
  priority: 'high' | 'medium' | 'low';
  callToActionLink?: string | null;
  isRead: boolean;
  originalType: BackendNotificationType | string; // Keep original backend type for logic if needed
};