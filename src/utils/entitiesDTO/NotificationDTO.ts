export enum FrontendNotificationType {
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  CHANTIER_UPDATE = 'CHANTIER_UPDATE',
  DOCUMENT_REQUIRED = 'DOCUMENT_REQUIRED',
  RISK_IDENTIFIED = 'RISK_IDENTIFIED',
  INSPECTION_NEEDED = 'INSPECTION_NEEDED',
  WORKER_ADDED = 'WORKER_ADDED',
  GENERAL_ALERT = 'GENERAL_ALERT',
  // Add other types from your backend's NotificationType enum
  // The mock data used 'inspection', 'worker', 'risk', 'event', 'task'
  // You'll need to decide how your backend NotificationType maps to these or update the panel
}

export interface NotificationDTO {
  id: number;
  message: string;
  timestamp: string; // ISO 8601 string, can be converted to Date object or formatted string
  isRead: boolean;
  type: FrontendNotificationType | string; // Use the enum, or string if types are very dynamic
  relatedEntityId?: number | null;
  relatedEntityType?: string | null;
  relatedEntityDescription?: string | null;
  callToActionLink?: string | null;
}


export type DashboardNotification = {
  id: number;
  type: 'inspection' | 'worker' | 'risk' | 'event' | 'task' | 'document' | 'general'; // Example types for the panel
  message: string;
  date: string; // Formatted date string
  priority: 'high' | 'medium' | 'low';
  callToActionLink?: string | null;
  isRead: boolean;
  originalType: FrontendNotificationType | string; // Keep original type for logic if needed
};