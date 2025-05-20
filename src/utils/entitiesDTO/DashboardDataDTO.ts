// ChantierPdp_FrontEnd/src/utils/entitiesDTO/DashboardDataDTO.ts

// This represents the structure the ActivityChart component expects
export interface ActivityChartDataPoint {
  month: string; // e.g., "Jan", "Fév" or "2024-01"
  chantiers: number;
  pdps: number;
  risques: number;
}

// This can be the raw structure from your backend endpoint /api/dashboard/monthly-stats
export interface BackendMonthlyActivityStatsDTO {
  month: string; // Format "YYYY-MM"
  chantiersCreated: number;
  chantiersCompleted: number;
  chantiersWithPdpPending: number;
  chantiersWithBdtPending: number;
  documentsSigned: number;
  actionsRequiredOnDocuments: number;
  chantiersActiveDuringMonth: number;
  documentsCurrentlyNeedingAction: number;
}