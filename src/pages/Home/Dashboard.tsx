// src/components/dashboard/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Container, Grid, Box, Typography, CircularProgress, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// Import dashboard components
import DashboardHeader from './DashboardHeader';
import StatCards from './StatCards';
import RecentChantiers from './RecentChantiers';
import PendingPdps from './PendingPdps';
import RiskOverview from './RiskOverview';
import NotificationsPanel from './NotificationsPanel';
import ActivityChart from './ActivityChart';
import WorkerDistribution from './WorkerDistribution';

// Import hooks for data fetching
import useChantier from '../../hooks/useChantier';
import usePdp from '../../hooks/usePdp';
import useRisque from '../../hooks/useRisque';
import useWoker from '../../hooks/useWoker';

// Type definitions
import {ChantierDTO} from '../../utils/entitiesDTO/ChantierDTO.ts';
import { PdpDTO } from '../../utils/entitiesDTO/PdpDTO';
import RisqueDTO from '../../utils/entitiesDTO/RisqueDTO';
import {WorkerDTO} from '../../utils/entitiesDTO/WorkerDTO';

// Interfaces for component props and state
interface DashboardData {
  stats: {
    activeChantiersCount: number;
    pendingPdpsCount: number;
    highRisksCount: number;
    assignedWorkersCount: number;
  };
  recentChantiers: ChantierDTO[];
  pendingPdps: PdpDTO[];
  keyRisks: {
    id: number;
    title: string;
    level: 'Élevé' | 'Moyen' | 'Faible';
    chantier: string;
    impacts: string[];
    progress: number;
  }[];
  notifications: {
    id: number;
    type: 'inspection' | 'worker' | 'risk' | 'event' | 'task';
    message: string;
    date: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  activityData: {
    month: string;
    chantiers: number;
    pdps: number;
    risques: number;
  }[];
  workerDistribution: {
    name: string;
    workers: number;
  }[];
}

// Styled container for the dashboard
const DashboardContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.mode === 'light' 
    ? theme.palette.grey[50] 
    : theme.palette.background.default,
  borderRadius: theme.shape.borderRadius * 2,
  minHeight: '90vh',
}));

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  // Get hooks for data fetching
  const { getRecentChantiers, getAllChantiers } = useChantier();
  const { getRecentPdps, getAllPDPs } = usePdp();
  const { getAllRisques, risques } = useRisque();
  const { getAllWorkers, getSelectedWorkersForChantier } = useWoker();

  // Load data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [chantiers, pdps, risquesData, workers] = await Promise.all([
          getRecentChantiers(),
          getRecentPdps(),
          getAllRisques(),
          getAllWorkers()
        ]);

        // Process the data
        // 1. Get active chantiers count (those not yet finished)
        const activeChantiers = chantiers.filter(chantier => {
          const dateFin = chantier.dateFin ? new Date(chantier.dateFin) : null;
          return dateFin && dateFin > new Date();
        });

        // 2. Get pending PDPs (simplified - in real world, you'd check status)
        const pendingPdps = pdps.slice(0, 5); // Just take first 5 for demo

        // 3. Get high risk items - here we assume items with travailleDangereux=true are high risk
        const highRiskItems = Array.from(risques.values())
          .filter(risque => risque.travailleDangereux)
          .slice(0, 3);  // Limit to 3 for demo

        // Create formatted risk items
        const keyRisks = highRiskItems.map((risque, index) => {
          // Randomly assign to a chantier for demo
          const randomChantier = chantiers[Math.floor(Math.random() * chantiers.length)];
          return {
            id: risque.id || index,
            title: risque.title || `Risque ${index + 1}`,
            level: 'Élevé' as const,  // All are high risk in this example
            chantier: randomChantier?.nom || 'Chantier inconnu',
            impacts: ['Chute', 'Blessure grave'], // Example impacts
            progress: Math.floor(Math.random() * 100)  // Random progress for demo
          };
        });

        // 4. Create activity data (in a real app, this would be from actual analytics)
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'];
        const activityData = months.map(month => ({
          month,
          chantiers: Math.floor(Math.random() * 7) + 2,
          pdps: Math.floor(Math.random() * 6) + 1,
          risques: Math.floor(Math.random() * 8) + 1
        }));

        // 5. Worker distribution
        const workerDistribution = chantiers.slice(0, 3).map(chantier => ({
          name: chantier.nom || `Chantier ${chantier.id}`,
          workers: chantier.workers?.length || Math.floor(Math.random() * 10) + 1  // Use real data if available, else mock
        }));

        // 6. Mock notifications (in a real app, these would come from your notification system)
        const notifications = [
          {
            id: 401,
            type: 'inspection' as const,
            message: 'Inspection requise pour Chantier Alpha',
            date: 'Demain',
            priority: 'high' as const
          },
          {
            id: 402,
            type: 'worker' as const,
            message: 'Nouveau travailleur ajouté: J. Dupont',
            date: 'Aujourd\'hui',
            priority: 'medium' as const
          },
          {
            id: 403,
            type: 'risk' as const,
            message: 'Nouveau risque identifié sur Site Bêta',
            date: 'Hier',
            priority: 'high' as const
          }
        ];

        // Set all the dashboard data
        setDashboardData({
          stats: {
            activeChantiersCount: activeChantiers.length,
            pendingPdpsCount: pendingPdps.length,
            highRisksCount: highRiskItems.length,
            assignedWorkersCount: workers.length
          },
          recentChantiers: chantiers.slice(0, 5),
          pendingPdps,
          keyRisks,
          notifications,
          activityData,
          workerDistribution
        });

        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Une erreur est survenue lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography color="error">Erreur de chargement: {error}</Typography>
      </Container>
    );
  }

  return (
    <DashboardContainer maxWidth="xl">
      <DashboardHeader />
      
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12}>
          <StatCards stats={dashboardData?.stats} />
        </Grid>
        
        {/* Main Content - Left Column */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <RecentChantiers chantiers={dashboardData?.recentChantiers} />
            </Grid>
            <Grid item xs={12}>
              <ActivityChart data={dashboardData?.activityData} />
            </Grid>
          </Grid>
        </Grid>
        
        {/* Right Column - Sidebar */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <PendingPdps pdps={dashboardData?.pendingPdps} />
            </Grid>
            <Grid item xs={12}>
              <RiskOverview risks={dashboardData?.keyRisks} />
            </Grid>
            <Grid item xs={12}>
              <NotificationsPanel notifications={dashboardData?.notifications} />
            </Grid>
            <Grid item xs={12}>
              <WorkerDistribution data={dashboardData?.workerDistribution} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
};

export default Dashboard;