// src/pages/Home/Dashboard.tsx
import React, { useEffect, useState, useCallback } from 'react'; // Added useCallback
import { Container, Grid, Box, Typography, CircularProgress, Alert } from '@mui/material'; // Removed useMediaQuery, useTheme from here as theme is used below
import { styled, useTheme } from '@mui/material/styles'; // useTheme is here

// Import dashboard components
import DashboardHeader from './DashboardHeader';
import StatCards from './StatCards';
import RecentChantiers from './RecentChantiers';
import PendingPdps from './PendingPdps';
// import NotificationsPanel from './NotificationsPanel';
import ActivityChart from './ActivityChart';

// --- NEW: Import our shiny hooks ---
import useDashboardActivity from '../../hooks/useDashboardActivity';
import useDashboardNotifications from '../../hooks/useDashboardNotifications';

// --- NEW: Import NotificationSidebar (We'll create this component next) ---
// import NotificationSidebar from './NotificationSidebar'; // Placeholder for now

// Import other hooks for data
import useChantier from '../../hooks/useChantier';
import usePdp from '../../hooks/usePdp';
import useRisque from '../../hooks/useRisque';
import useWoker from '../../hooks/useWoker'; // Typo: should be useWorker

// Type definitions
import { ChantierDTO } from '../../utils/entitiesDTO/ChantierDTO';
import { PdpDTO } from '../../utils/entitiesDTO/PdpDTO';
import RisqueDTO from '../../utils/entitiesDTO/RisqueDTO';
import { DocumentStatus } from '../../utils/enums/DocumentStatus';
import { ChantierStatus } from '../../utils/enums/ChantierStatus';
import DashboardNotificationCenter from './DashboardNotificationCenter';
// import { WorkerDTO } from '../../utils/entitiesDTO/WorkerDTO'; // Not directly used in this component's state
// import { ActivityChartDataPoint } from '../../utils/entitiesDTO/DashboardDataDTO'; // Handled by useDashboardActivity
// import { DashboardNotification } from '../../utils/entitiesDTO/NotificationDTO'; // Handled by useDashboardNotifications


// Styled container for the dashboard
const DashboardContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.mode === 'light'
    ? theme.palette.grey[50]
    : theme.palette.background.default,
  borderRadius: theme.shape.borderRadius * 2,
  minHeight: '90vh',
  position: 'relative',
}));

interface DashboardStats {
  activeChantiersCount: number;
  pendingPdpsCount: number;
  highRisksCount: number;
  assignedWorkersCount: number;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();

  const [statsData, setStatsData] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [recentChantiersData, setRecentChantiersData] = useState<ChantierDTO[]>([]);
  const [recentChantiersLoading, setRecentChantiersLoading] = useState<boolean>(true);
  const [recentChantiersError, setRecentChantiersError] = useState<string | null>(null);

  const [pendingPdpsData, setPendingPdpsData] = useState<PdpDTO[]>([]);
  const [pendingPdpsLoading, setPendingPdpsLoading] = useState<boolean>(true);
  const [pendingPdpsError, setPendingPdpsError] = useState<string | null>(null);


  const [workerDistributionData, setWorkerDistributionData] = useState<any[]>([]); // Define proper type later
  const [workerDistributionLoading, setWorkerDistributionLoading] = useState<boolean>(true);
  const [workerDistributionError, setWorkerDistributionError] = useState<string | null>(null);

  const {
    activityData,
    isLoading: activityLoading,
    error: activityError,
    fetchActivityForMonths,
  } = useDashboardActivity();

  const {
    notifications,
    unreadCount,
    isLoading: notificationsLoading,
    error: notificationsError,
    fetchNotifications,
    refreshUnreadCount,
  } = useDashboardNotifications();

  const { getRecentChantiers, getAllChantiers } = useChantier();
  const { getRecentPdps, getAllPDPs } = usePdp();
  const { getAllRisques, risques: risquesMap } = useRisque(); // Assuming risquesMap is exposed for direct use after fetch
  const { getAllWorkers } = useWoker(); // Typo: useWorker

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      }).reverse();
      fetchActivityForMonths(lastSixMonths);
      fetchNotifications('unread', 0, 10);
      refreshUnreadCount();

      try {
        setStatsLoading(true);
        const [chantiersList, pdpsList, fetchedRisquesForStats, workersList] = await Promise.all([
          getAllChantiers(),
          getAllPDPs(),
          getAllRisques(), // Assuming this returns RisqueDTO[] or populates a map accessible via the hook
          getAllWorkers()
        ]);
        

        const allRisksArrayForStats: RisqueDTO[] = fetchedRisquesForStats;


        const activeChantiers = chantiersList.filter(c => c.status !== 'COMPLETED' && c.status !== ChantierStatus.ACTIVE);
        
        // Corrected highRisksCount calculation
        const highRiskItemsCount = allRisksArrayForStats.filter(r => r.travailleDangereux).length;

        setStatsData({
          activeChantiersCount: activeChantiers.length,
          pendingPdpsCount: pdpsList.filter(p => p.status === DocumentStatus.NEEDS_ACTION).length,
          highRisksCount: highRiskItemsCount, // Use the corrected count
          assignedWorkersCount: workersList.length,
        });

        setStatsError(null);
      } catch (err) {
        console.error("Error fetching stats data:", err);
        setStatsError("Erreur chargement stats");
      } finally {
        setStatsLoading(false);
      }

      try {
        setRecentChantiersLoading(true);
        const recentChantiers = await getRecentChantiers();
        setRecentChantiersData(recentChantiers);
        setRecentChantiersError(null);
      } catch (err) {
        console.error("Error fetching recent chantiers:", err);
        setRecentChantiersError("Erreur chargement chantiers récents");
      } finally {
        setRecentChantiersLoading(false);
      }

      try {
        setPendingPdpsLoading(true);
        const pending = await getRecentPdps();
        setPendingPdpsData(pending);
        setPendingPdpsError(null);
      } catch (err) {
        console.error("Error fetching pending PDPs:", err);
        setPendingPdpsError("Erreur chargement PDPs en attente");
      } finally {
        setPendingPdpsLoading(false);
      }



      try {
        setWorkerDistributionLoading(true);
        const chantiersForDist = await getRecentChantiers(); // Use already fetched chantiers if possible
        setWorkerDistributionData(chantiersForDist.map(chantier => ({
          name: chantier.nom || `Chantier ${chantier.id}`,
        })));
        setWorkerDistributionError(null);
      } catch (err) {
        console.error("Error fetching worker distribution:", err);
        setWorkerDistributionError("Erreur chargement distribution employés");
      } finally {
        setWorkerDistributionLoading(false);
      }
    };

    fetchAllDashboardData();
  }, [ 
    ]);

  const pageLoading = statsLoading || recentChantiersLoading || pendingPdpsLoading || activityLoading || notificationsLoading || workerDistributionLoading;
  const overallError = statsError || recentChantiersError || pendingPdpsError || activityError || notificationsError || workerDistributionError;

  if (pageLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement du tableau de bord...</Typography>
      </Box>
    );
  }

  if (overallError && !pageLoading) {
    return (
      <DashboardContainer maxWidth="xl" sx={{ textAlign: 'center', mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
          Une ou plusieurs erreurs sont survenues lors du chargement des données du tableau de bord:
          {statsError && <Typography variant="body2">- Stats: {statsError}</Typography>}
          {recentChantiersError && <Typography variant="body2">- Chantiers Récents: {recentChantiersError}</Typography>}
          {pendingPdpsError && <Typography variant="body2">- PDPs en Attente: {pendingPdpsError}</Typography>}
          {activityError && <Typography variant="body2">- Activité: {activityError}</Typography>}
          {notificationsError && <Typography variant="body2">- Notifications: {notificationsError}</Typography>}
          {workerDistributionError && <Typography variant="body2">- Distribution Employés: {workerDistributionError}</Typography>}
        </Alert>
        <Typography>Veuillez réessayer plus tard ou contacter le support.</Typography>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer maxWidth="xl">
      <DashboardHeader />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {statsData && !statsLoading ? <StatCards stats={statsData} /> : statsLoading ? <CircularProgress size={20} /> : null }
        </Grid>

        <Grid item xs={12} lg={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              { !recentChantiersLoading ? (
                <RecentChantiers chantiers={recentChantiersData} isLoading={recentChantiersLoading} error={recentChantiersError} />
              ) : <CircularProgress size={20} />}
            </Grid>
            <Grid item xs={12}>
              { !activityLoading ? (
                <ActivityChart data={activityData} isLoading={activityLoading} error={activityError} />
              ) : <CircularProgress size={20} />}
            </Grid>
            <Grid item xs={12}>
              { !pendingPdpsLoading ? (
                <PendingPdps pdps={pendingPdpsData} isLoading={pendingPdpsLoading} error={pendingPdpsError} />
              ) : <CircularProgress size={20} />}
            </Grid>
          </Grid>
        </Grid>



      <Grid item xs={12} lg={4}>
  <Grid container spacing={3} direction="column">
    <Grid item xs={12} sx={{ height: '100%' /* Ensure grid item can grow */ }}>
       {/* You might not need the notificationsLoading check from Dashboard.tsx here anymore,
           as DashboardNotificationCenter handles its own loading state */}
      <DashboardNotificationCenter />
    </Grid>
    {/* You might want to add other panels for this column below the Notification Center */}
    {/* For example, if NotificationsPanel.tsx also had Quick Actions,
        you could create a separate QuickActionsPanel component and place it here */}
  </Grid>
</Grid>


      </Grid>
    </DashboardContainer>
  );
};

export default Dashboard;