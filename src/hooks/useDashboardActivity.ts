// Suggested ChantierPdp_FrontEnd/src/hooks/useDashboardActivity.ts
import { useState, useCallback } from 'react';
import { useNotifications as useSnackbar } from '@toolpad/core/useNotifications';
import fetchApi from '../api/fetchApi'; // Assuming ApiResponse is exported
import {
  ActivityChartDataPoint,
  BackendMonthlyActivityStatsDTO,
} from '../utils/entitiesDTO/DashboardDataDTO'; //

const transformToActivityChartDataPoint = (dto: BackendMonthlyActivityStatsDTO): ActivityChartDataPoint => {
  let monthDisplay = dto.month; // Default to YYYY-MM
  try {
    // Ensures the date is treated as UTC to avoid off-by-one day issues with timezones
    const year = parseInt(dto.month.substring(0, 4), 10);
    const month = parseInt(dto.month.substring(5, 7), 10);
    monthDisplay = new Date(Date.UTC(year, month - 1, 2)).toLocaleDateString('fr-FR', { month: 'short' });
  } catch (e) {
    console.warn(`Could not parse month: ${dto.month}`, e);
  }

  return {
    month: monthDisplay,
    // Using chantiersActiveDuringMonth as primary source for active chantiers
    chantiers: dto.chantiersActiveDuringMonth || 0, //
    pdps: dto.chantiersWithPdpPending || 0, //
    // Risques: This needs clarification. Assuming 0 for now or backend enhancement.
    risques: 0, // Placeholder - Requires backend DTO enhancement or alternative data source
  };
};

interface UseDashboardActivityReturn {
  activityData: ActivityChartDataPoint[];
  isLoading: boolean;
  error: string | null;
  fetchActivityForMonths: (months: string[]) => Promise<ActivityChartDataPoint[] | undefined>; // Expects "YYYY-MM"
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
        const monthPromises = months.map(monthStr =>
          fetchApi<BackendMonthlyActivityStatsDTO>( // Ensure fetchApi is correctly typed or expect 'any'
            `/api/dashboard/monthly-stats?month=${monthStr}`, // Endpoint from DashboardController.java
            'GET'
          )
        );
        const responses = await Promise.all(monthPromises);

        const transformedData = responses
          .map((response, index) => {
            if (response.data) {
              return transformToActivityChartDataPoint(response.data);
            }
            // Fallback for failed requests or no data, to maintain chart structure
            console.warn(`No data or error for month: ${months[index]}`, response);
            return transformToActivityChartDataPoint({
              month: months[index], // Use the input month string
              chantiersCreated: 0,
              chantiersCompleted: 0,
              chantiersWithPdpPending: 0,
              chantiersWithBdtPending: 0,
              documentsSigned: 0,
              actionsRequiredOnDocuments: 0,
              chantiersActiveDuringMonth: 0,
              documentsCurrentlyNeedingAction: 0,
            } as BackendMonthlyActivityStatsDTO);
          })
          .filter(point => point !== null) as ActivityChartDataPoint[];

        // Sort data by the original YYYY-MM string to ensure correct chronological order
        transformedData.sort((a, b) => {
            // Find original "YYYY-MM" to sort correctly by finding the original month string
            // This is a bit convoluted due to the transformation of 'month' to 'short' name.
            // A more robust way would be to sort based on the original 'YYYY-MM' before transformation,
            // or to convert back to a comparable date object.
            const originalMonthA = months.find(m => transformToActivityChartDataPoint({month: m} as BackendMonthlyActivityStatsDTO).month === a.month || m === a.month ) || a.month;
            const originalMonthB = months.find(m => transformToActivityChartDataPoint({month: m} as BackendMonthlyActivityStatsDTO).month === b.month || m === b.month) || b.month;
            return new Date(originalMonthA + '-02').getTime() - new Date(originalMonthB + '-02').getTime();
        });

        setActivityData(transformedData);
        return transformedData;
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err.message || "Erreur de chargement des données d'activité.";
        setError(errorMessage);
        snackbar.show(errorMessage, { severity: 'error' });
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [snackbar]
  );

  return {
    activityData,
    isLoading,
    error,
    fetchActivityForMonths: fetchActivityForMonthsHook,
  };
};

export default useDashboardActivity;