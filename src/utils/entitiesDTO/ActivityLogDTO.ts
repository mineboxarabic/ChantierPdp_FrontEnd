// ChantierPdp_FrontEnd/src/utils/entitiesDTO/ActivityLogDTO.ts

export interface ActivityLogDTO {
  id: number;
  actorUsername?: string;
  actionKey: string; // e.g., 'CHANTIER_CREATED', 'PDP_SIGNED'
  timestamp: string; // ISO 8601 string
  targetEntityId?: number | null;
  targetEntityType?: string | null;
  targetEntityDescription?: string | null;
  details?: Record<string, any> | null; // For JSON object details
}