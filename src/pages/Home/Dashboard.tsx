// src/pages/Home/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

// Import dashboard components
import DashboardHeader from './DashboardHeader';
import RecentChantiers from './RecentChantiers';
import PendingPdps from './PendingPdps';
import ActivityChart from './ActivityChart';
import DashboardNotificationCenter from './DashboardNotificationCenter';

// Import hooks
import useDashboardActivity from '../../hooks/useDashboardActivity';
import useDashboardNotifications from '../../hooks/useDashboardNotifications';
import useChantier from '../../hooks/useChantier';
import usePdp from '../../hooks/usePdp';

// Type definitions
import { ChantierDTO } from '../../utils/entitiesDTO/ChantierDTO';
import { PdpDTO } from '../../utils/entitiesDTO/PdpDTO';


// Styled container for the dashboard - full screen width
const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3), // Reduced padding
  backgroundColor: theme.palette.mode === 'light'
    ? theme.palette.grey[50]
    : theme.palette.background.default,
  minHeight: '90vh',
  width: '90vw', // Full viewport width
  margin: 0,
  position: 'relative',
  overflow: 'hidden', // Prevent horizontal scroll
}));

interface DashboardStats {
  activeChantiersCount: number;
  pendingPdpsCount: number;
  highRisksCount: number;
  assignedWorkersCount: number;
}

const Dashboard: React.FC = () => {
  const [recentChantiersData, setRecentChantiersData] = useState<ChantierDTO[]>([]);
  const [recentChantiersLoading, setRecentChantiersLoading] = useState<boolean>(true);
  const [recentChantiersError, setRecentChantiersError] = useState<string | null>(null);

  const [pendingPdpsData, setPendingPdpsData] = useState<PdpDTO[]>([]);
  const [pendingPdpsLoading, setPendingPdpsLoading] = useState<boolean>(true);
  const [pendingPdpsError, setPendingPdpsError] = useState<string | null>(null);

  const {
    activityData,
    isLoading: activityLoading,
    error: activityError,
    fetchActivityForMonths,
  } = useDashboardActivity();

  const {
    isLoading: notificationsLoading,
    error: notificationsError,
    fetchNotifications,
    refreshUnreadCount,
  } = useDashboardNotifications();

  const { getRecentChantiers } = useChantier();
  const { getRecentPdps } = usePdp();

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
    };

    fetchAllDashboardData();
  }, []);

  const pageLoading = recentChantiersLoading || pendingPdpsLoading || activityLoading || notificationsLoading;
  const overallError = recentChantiersError || pendingPdpsError || activityError || notificationsError;

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
      <DashboardContainer sx={{ textAlign: 'center', mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
          Une ou plusieurs erreurs sont survenues lors du chargement des données du tableau de bord:
          {recentChantiersError && <Typography variant="body2">- Chantiers Récents: {recentChantiersError}</Typography>}
          {pendingPdpsError && <Typography variant="body2">- PDPs en Attente: {pendingPdpsError}</Typography>}
          {activityError && <Typography variant="body2">- Activité: {activityError}</Typography>}
          {notificationsError && <Typography variant="body2">- Notifications: {notificationsError}</Typography>}
        </Alert>
        <Typography>Veuillez réessayer plus tard ou contacter le support.</Typography>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader onlyCreateChantierButton={true} />
      <Grid container spacing={3}>
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
            <Grid item xs={12} sx={{ height: '100%' }}>
              <DashboardNotificationCenter />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
};

export default Dashboard;