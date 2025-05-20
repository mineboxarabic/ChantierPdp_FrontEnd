// src/components/dashboard/RiskOverview.tsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Button, 
  IconButton,
  Avatar,
  LinearProgress,
  Chip,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import {
  WarningAmber as WarningAmberIcon,
  ChevronRight as ChevronRightIcon,
  Construction as ConstructionIcon,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';

// Import hooks and types
import useRisque from '../../hooks/useRisque';
import useChantier from '../../hooks/useChantier';
import RisqueDTO from '../../utils/entitiesDTO/RisqueDTO';
import { getRoute } from '../../Routes';

// Define interfaces
interface RiskData {
  id: number | undefined;
  title: string;
  level: 'Élevé' | 'Moyen' | 'Faible';
  chantier: string;
  impacts: string[];
  progress: number;
}

interface RiskOverviewProps {
  risks?: RiskData[];
  maxItems?: number;
  isLoading?: boolean;
  error?: string | null;
}

// Styled components
const CardWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 2px 24px rgba(0,0,0,0.07)',
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const CardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
    color: theme.palette.error.main,
  },
}));

const RiskItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.background.default, 0.5),
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
    backgroundColor: theme.palette.background.paper,
  },
  '&:last-child': {
    marginBottom: 0,
  }
}));

const StatusAvatar = styled(Avatar)<{ level?: string }>(({ theme, level }) => {
  const colors: Record<string, string> = {
    'Élevé': theme.palette.error.main,
    'Moyen': theme.palette.warning.main,
    'Faible': theme.palette.success.main,
  };
  
  const bgColor = level && colors[level] ? colors[level] : theme.palette.grey[500];
  
  return {
    backgroundColor: alpha(bgColor, 0.12),
    color: bgColor,
    width: 40,
    height: 40,
    marginRight: theme.spacing(2),
  };
});

const StatusChip = styled(Chip)<{ level?: string }>(({ theme, level }) => {
  const colors: Record<string, { bg: string, color: string }> = {
    'Élevé': {
      bg: alpha(theme.palette.error.main, 0.12),
      color: theme.palette.error.dark,
    },
    'Moyen': {
      bg: alpha(theme.palette.warning.main, 0.12),
      color: theme.palette.warning.dark,
    },
    'Faible': {
      bg: alpha(theme.palette.success.main, 0.12),
      color: theme.palette.success.dark,
    },
  };

  const colorConfig = level && colors[level] ? colors[level] : {
    bg: alpha(theme.palette.grey[500], 0.12),
    color: theme.palette.text.secondary,
  };

  return {
    backgroundColor: colorConfig.bg,
    color: colorConfig.color,
    fontWeight: 600,
    borderRadius: '16px',
    border: 'none',
    height: 24,
    '& .MuiChip-label': {
      padding: '0 8px',
    }
  };
});

const ProgressWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(1),
  '& .MuiLinearProgress-root': {
    height: 6,
    borderRadius: 3,
    backgroundColor: alpha(theme.palette.grey[500], 0.12),
    flexGrow: 1,
    marginRight: theme.spacing(1),
  },
}));

// Main Component
const RiskOverview: React.FC<RiskOverviewProps> = ({ 
  risks: providedRisks, 
  maxItems = 3,
  isLoading: providedLoading,
  error: providedError 
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // State
  const [risks, setRisks] = useState<RiskData[]>([]);
  const [loading, setLoading] = useState<boolean>(providedLoading || false);
  const [error, setError] = useState<string | null>(providedError || null);
  const [distributionData, setDistributionData] = useState<Array<{ name: string, value: number, color: string }>>([]);

  // Hooks
  const { getAllRisques, risques } = useRisque();
  const { getAllChantiers } = useChantier();

  // Fetch data if not provided as props
  useEffect(() => {
    // If risks are provided as props, use them
    if (providedRisks) {
      setRisks(providedRisks.slice(0, maxItems));
      generateDistributionData(providedRisks);
      return;
    }

    const fetchRisks = async () => {
      try {
        setLoading(true);
        
        // Fetch risques and related data
        const [risquesData, chantiersData] = await Promise.all([
          getAllRisques(),
          getAllChantiers()
        ]);

        // Transform data into the format we need
        const transformedRisks: RiskData[] = Array.from(risques.values())
          .filter(risque => risque.travailleDangereux) // Example: Filter for dangerous risks
          .map((risque, index) => {
            // Randomly assign to a chantier for demo (you'd use real associations in production)
            const randomChantier = chantiersData[Math.floor(Math.random() * chantiersData.length)];
            
            // Determine risk level based on some criteria
            let level: 'Élevé' | 'Moyen' | 'Faible';
            if (risque.travailleDangereux) {
              level = 'Élevé';
            } else if (risque.travaillePermit) {
              level = 'Moyen';
            } else {
              level = 'Faible';
            }
            
            return {
              id: risque.id,
              title: risque.title || `Risque ${index + 1}`,
              level,
              chantier: randomChantier?.nom || 'Chantier inconnu',
              impacts: ['Impact 1', 'Impact 2'], // Sample impacts (would come from real data)
              progress: Math.floor(Math.random() * 100), // Sample progress (would come from real data)
            };
          })
          .slice(0, maxItems);

        setRisks(transformedRisks);
        generateDistributionData(transformedRisks);
        setError(null);
      } catch (err) {
        console.error('Error fetching risks data:', err);
        setError('Failed to load risk data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRisks();
  }, [providedRisks, providedLoading, providedError, maxItems, getAllRisques, getAllChantiers, risques]);

  // Generate pie chart data
  const generateDistributionData = (risksData: RiskData[]) => {
    // Count risks by level
    const counts = {
      'Élevé': 0,
      'Moyen': 0,
      'Faible': 0
    };
    
    risksData.forEach(risk => {
      if (risk.level in counts) {
        counts[risk.level]++;
      }
    });
    
    // Create chart data
    const chartData = [
      { name: 'Élevé', value: counts['Élevé'], color: theme.palette.error.main },
      { name: 'Moyen', value: counts['Moyen'], color: theme.palette.warning.main },
      { name: 'Faible', value: counts['Faible'], color: theme.palette.success.main },
    ];
    
    setDistributionData(chartData);
  };
  
  // Helper to get progress color
  const getProgressColor = (level: string) => {
    switch (level) {
      case 'Élevé': return theme.palette.error.main;
      case 'Moyen': return theme.palette.warning.main;
      case 'Faible': return theme.palette.success.main;
      default: return theme.palette.grey[500];
    }
  };
  
  // Custom tooltip for the chart
  const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ 
          backgroundColor: 'background.paper', 
          p: 1.5, 
          boxShadow: 3, 
          borderRadius: 1 
        }}>
          <Typography variant="body2" fontWeight={600}>
            {payload[0].name}: {payload[0].value}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Navigation handler
  const handleViewAll = () => {
    navigate(getRoute('RISK_LIST'));
  };

  return (
    <CardWrapper>
      <CardHeader>
        <CardTitle variant="h6" component="h2">
          <WarningAmberIcon fontSize="small" />
          Aperçu des Risques
        </CardTitle>
        <Button 
          size="small" 
          endIcon={<ChevronRightIcon />}
          onClick={handleViewAll}
          sx={{ 
            textTransform: 'none', 
            fontWeight: 600,
            '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.08) }
          }}
        >
          Voir Tout
        </Button>
      </CardHeader>
      <Divider sx={{ mb: 2 }} />
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
      ) : (
        <>
          {/* Chart section */}
          <Box sx={{ height: 160, mb: 2 }}>
            {distributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography color="text.secondary">Aucune donnée disponible</Typography>
              </Box>
            )}
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Risques Principaux
            </Typography>
          </Box>
          
          {/* Risk list */}
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            {risks.length > 0 ? (
              risks.map((risk) => (
                <RiskItem key={risk.id || risk.title}>
                  <StatusAvatar level={risk.level}>
                    <WarningAmberIcon fontSize="small" />
                  </StatusAvatar>
                  
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {risk.title}
                      </Typography>
                      <StatusChip label={risk.level} size="small" level={risk.level} />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <ConstructionIcon sx={{ fontSize: '0.9rem', mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {risk.chantier}
                      </Typography>
                    </Box>
                    
                    <ProgressWrapper>
                      <LinearProgress 
                        variant="determinate" 
                        value={risk.progress} 
                        sx={{ 
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getProgressColor(risk.level)
                          }
                        }}
                      />
                      <Typography variant="caption" fontWeight={600}>
                        {risk.progress}%
                      </Typography>
                    </ProgressWrapper>
                  </Box>
                </RiskItem>
              ))
            ) : (
              <Typography color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                Aucun risque majeur identifié
              </Typography>
            )}
          </Box>
        </>
      )}
    </CardWrapper>
  );
};

export default RiskOverview;