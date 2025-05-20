// src/components/dashboard/StatCards.tsx
import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Avatar, useMediaQuery, CircularProgress, Alert } from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import {
  Construction as ConstructionIcon,
  AssignmentLate as AssignmentLateIcon,
  WarningAmber as WarningAmberIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';

// Import your API hooks
import useChantier from '../../hooks/useChantier';
import usePdp from '../../hooks/usePdp';
import useRisque from '../../hooks/useRisque';
import useWoker from '../../hooks/useWoker';

// Interface for statistics data
export interface DashboardStats {
  activeChantiersCount: number;
  pendingPdpsCount: number;
  highRisksCount: number;
  assignedWorkersCount: number;
}

// Interface for component props
interface StatCardsProps {
  stats?: DashboardStats;
  isLoading?: boolean;
  error?: string | null;
}

// Styled component for the stat cards
const StatsCard = styled(Box)<{ color?: 'primary' | 'warning' | 'error' | 'success' }>(({ theme, color = 'primary' }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(theme.palette[color].light, 0.12),
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 24px -4px ${alpha(theme.palette[color].main, 0.15)}`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '30%',
    height: '100%',
    backgroundImage: `linear-gradient(to right, transparent, ${alpha(theme.palette[color].main, 0.05)})`,
    borderTopRightRadius: theme.shape.borderRadius * 2,
    borderBottomRightRadius: theme.shape.borderRadius * 2,
  }
}));

const IconWrapper = styled(Avatar)<{ color?: 'primary' | 'warning' | 'error' | 'success' }>(({ theme, color = 'primary' }) => ({
  backgroundColor: alpha(theme.palette[color].main, 0.12),
  color: theme.palette[color].main,
  width: 56,
  height: 56,
  borderRadius: '18px',
  marginRight: theme.spacing(2.5),
}));

const StatContent = styled(Box)(({ theme }) => ({
  flex: 1,
}));

const TrendIcon = styled(Box)<{ positive?: boolean }>(({ theme, positive = true }) => ({
  display: 'flex',
  alignItems: 'center',
  color: positive ? theme.palette.success.main : theme.palette.error.main,
  marginLeft: theme.spacing(1),
}));

const StatCards: React.FC<StatCardsProps> = ({ stats: providedStats, isLoading: providedLoading, error: providedError }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for internally managed data
  const [stats, setStats] = useState<DashboardStats | undefined>(providedStats);
  const [loading, setLoading] = useState<boolean>(providedLoading || false);
  const [error, setError] = useState<string | null>(providedError || null);

  // Hooks for API data
  const { getAllChantiers } = useChantier();
  const { getAllPDPs } = usePdp();
  const { getAllRisques } = useRisque();
  const { getAllWorkers } = useWoker();

  // Fetch data if not provided as props
  useEffect(() => {
    // If stats are provided as props, use them
    if (providedStats) {
      setStats(providedStats);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch data from each service
        const [chantiers, pdps, risques, workers] = await Promise.all([
          getAllChantiers(),
          getAllPDPs(),
          getAllRisques(),
          getAllWorkers()
        ]);

        // Calculate statistics
        // You'll need to adapt this based on your actual data structure and criteria
        const activeChantiers = chantiers.filter(chantier => 
          new Date(chantier.dateFin as Date) >= new Date()).length;
        
        const pendingPdps = pdps.length; // You may need additional filtering based on status
        
        // Example: count high risk items - replace with your actual criteria
        const highRisks = risques.filter(risque => risque.travailleDangereux).length;
        
        const assignedWorkers = workers.length; // You may need additional filtering

        // Set the stats
        setStats({
          activeChantiersCount: activeChantiers,
          pendingPdpsCount: pendingPdps,
          highRisksCount: highRisks,
          assignedWorkersCount: assignedWorkers
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching statistics data:', err);
        setError('Failed to load dashboard statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [providedStats, providedLoading, providedError, getAllChantiers, getAllPDPs, getAllRisques, getAllWorkers]);

  // If loading, show loading indicator
  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  // If no stats available, show placeholder
  if (!stats) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No statistics data available.
      </Alert>
    );
  }

  // Data for the cards
  const cardsData = [
    {
      title: 'Chantiers Actifs',
      value: stats.activeChantiersCount,
      icon: <ConstructionIcon />,
      color: 'primary' as const,
      trend: '+12% ce mois',
      trendPositive: true
    },
    {
      title: 'PDPs en Attente',
      value: stats.pendingPdpsCount,
      icon: <AssignmentLateIcon />,
      color: 'warning' as const,
      trend: '-3% ce mois',
      trendPositive: true
    },
    {
      title: 'Risques Élevés',
      value: stats.highRisksCount,
      icon: <WarningAmberIcon />,
      color: 'error' as const,
      trend: '+2% ce mois',
      trendPositive: false
    },
    {
      title: 'Travailleurs Assignés',
      value: stats.assignedWorkersCount,
      icon: <PeopleIcon />,
      color: 'success' as const,
      trend: '+8% ce mois',
      trendPositive: true
    }
  ];

  return (
    <Grid container spacing={3}>
      {cardsData.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatsCard color={card.color}>
            <IconWrapper color={card.color}>
              {card.icon}
            </IconWrapper>
            
            <StatContent>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {card.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 0.5 }}>
                <Typography variant="h4" component="div" fontWeight={700}>
                  {card.value}
                </Typography>
                
                {!isMobile && (
                  <TrendIcon positive={card.trendPositive}>
                    {card.trendPositive ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                    <Typography variant="caption" fontWeight={600} sx={{ ml: 0.5 }}>
                      {card.trend}
                    </Typography>
                  </TrendIcon>
                )}
              </Box>
            </StatContent>
          </StatsCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatCards;