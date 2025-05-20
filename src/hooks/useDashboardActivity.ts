// ChantierPdp_FrontEnd/src/hooks/useDashboardActivity.ts
import { useState, useCallback } from 'react';
import { useNotifications as useSnackbar } from '@toolpad/core/useNotifications';
import fetchApi, { ApiResponse } from '../api/fetchApi';
import {
  ActivityChartDataPoint,
  BackendMonthlyActivityStatsDTO,
} from '../utils/entitiesDTO/DashboardDataDTO';

// Helper to transform backend DTO to chart data point
const transformToActivityChartDataPoint = (dto: BackendMonthlyActivityStatsDTO): ActivityChartDataPoint => {
  let monthDisplay = dto.month; // Default to YYYY-MM
  try {
      monthDisplay = new Date(dto.month + '-02').toLocaleDateString('fr-FR', { month: 'short' });
  } catch (e) {
    console.warn(`Could not parse month: ${dto.month}`, e);
  }

  return {
    month: monthDisplay,
    chantiers: dto.chantiersActiveDuringMonth || dto.chantiersCreated || 0,
    pdps: dto.chantiersWithPdpPending || 0,
    risques: 0, // Placeholder: MonthlyActivityStatsDTO doesn't directly provide this.
                // Consider enhancing backend DTO or using another data source.
  };
};

interface UseDashboardActivityReturn {
  activityData: ActivityChartDataPoint[];
  isLoading: boolean;
  error: string | null;
  fetchActivityForMonths: (
    months: string[] // Expects "YYYY-MM" format
  ) => Promise<ActivityChartDataPoint[] | undefined>;
}

const useDashboardActivity = (): UseDashboardActivityReturn => {
  const [activityData, setActivityData] = useState<ActivityChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const snackbar = useSnackbar();

  const fetchActivityForMonthsHook = useCallback(
    async (months: string[]): Promise<ActivityChartDataPoint[] | undefined> => {
      if (!months || months.length === 0) {
        setActivityData([]);
        return [];
      }
      setIsLoading(true);
      setError(null);
      try {
        // Fetch data for each month in parallel
        const monthPromises = months.map(monthStr =>
          fetchApi<BackendMonthlyActivityStatsDTO>(
            `/api/dashboard/monthly-stats?month=${monthStr}`,
            'GET'
          )
        );
        const responses = await Promise.all(monthPromises);

        const transformed = responses
          .map((response, index) => {
            if (response.data) {
              return transformToActivityChartDataPoint(response.data);
            }
            // If a specific month fetch fails or returns no data, create a default point
            // This ensures the chart still has an entry for each requested month.
            console.warn(`No data for month: ${months[index]}`, response);
            return transformToActivityChartDataPoint({
                month: months[index], // Use the input month string directly
                chantiersCreated: 0, chantiersCompleted: 0, chantiersWithPdpPending: 0,
                chantiersWithBdtPending: 0, documentsSigned: 0, actionsRequiredOnDocuments: 0,
                chantiersActiveDuringMonth: 0, documentsCurrentlyNeedingAction: 0,
            } as BackendMonthlyActivityStatsDTO);
          })
          .filter(point => point !== null) as ActivityChartDataPoint[]; // Filter out nulls if any transform fails badly

        // Sort data by month before setting state, as Promise.all doesn't guarantee order of resolution
        // though the mapping from 'months' array should maintain it if responses are processed sequentially.
        // Explicit sort is safer.
        transformed.sort((a, b) => {
            // Find original "YYYY-MM" to sort correctly
            const originalMonthA = months.find(m => new Date(m + '-02').toLocaleDateString('fr-FR', { month: 'short' }) === a.month || m === a.month);
            const originalMonthB = months.find(m => new Date(m + '-02').toLocaleDateString('fr-FR', { month: 'short' }) === b.month || m === b.month);
            if (originalMonthA && originalMonthB) {
                return new Date(originalMonthA + '-02').getTime() - new Date(originalMonthB + '-02').getTime();
            }
            return 0;
        });

        setActivityData(transformed);
        return transformed;
      } catch (err: any) {
        const errorMessage = err.message || "Erreur de chargement des données d'activité.";
        setError(errorMessage);
        snackbar.show(errorMessage, { severity: 'error' });
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [snackbar] // useCallback dependency
  );

  return {
    activityData,
    isLoading,
    error,
    fetchActivityForMonths: fetchActivityForMonthsHook,
  };
};

export default useDashboardActivity;