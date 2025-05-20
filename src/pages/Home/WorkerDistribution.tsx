// src/components/dashboard/WorkerDistribution.tsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import {
  People as PeopleIcon
} from '@mui/icons-material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

// Import hooks
import useWoker from '../../hooks/useWoker';
import useChantier from '../../hooks/useChantier';
import ChantierDTO from '../../utils/entitiesDTO/ChantierDTO';

// Interfaces
interface WorkerDistributionData {
  name: string;
  workers: number;
}

interface WorkerDistributionProps {
  data?: WorkerDistributionData[];
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
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
    color: theme.palette.success.main,
  },
}));

// Custom tooltip for the chart
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: 'background.paper',
          p: 1.5,
          boxShadow: 3,
          borderRadius: 1,
        }}
      >
        <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
          {label}
        </Typography>
        <Typography variant="body2">
          <strong>{payload[0].value}</strong> travailleurs
        </Typography>
      </Box>
    );
  }
  return null;
};

// Main Component
const WorkerDistribution: React.FC<WorkerDistributionProps> = ({ 
  data: providedData,
  isLoading: providedLoading,
  error: providedError
}) => {
  const theme = useTheme();
  
  // State
  const [data, setData] = useState<WorkerDistributionData[]>([]);
  const [loading, setLoading] = useState<boolean>(providedLoading || false);
  const [error, setError] = useState<string | null>(providedError || null);
  const [totalWorkers, setTotalWorkers] = useState<number>(0);

  // Hooks
  const { getAllWorkers, getSelectedWorkersForChantier, workers } = useWoker();
  const { getAllChantiers } = useChantier();
  
  // Set up colors for bars
  const colors = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.error.main,
  ];

  // Fetch data if not provided as props
  useEffect(() => {
    // If data is provided as props, use it
    if (providedData) {
      setData(providedData);
      setTotalWorkers(providedData.reduce((total, item) => total + item.workers, 0));
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get all chantiers and workers
        const [chantiersData] = await Promise.all([
          getAllChantiers(),
          getAllWorkers() // Fetch all workers to have them in the cache
        ]);
        
        // Limit to 5 chantiers and get workers for each
        const limitedChantiers = chantiersData.slice(0, 5);
        const workerDistributionData: WorkerDistributionData[] = [];
        let totalCount = 0;
        
        // For each chantier, get the assigned workers
        for (const chantier of limitedChantiers) {
          if (chantier.id) {
            try {
              // Get workers for this chantier
              const chantierWorkers = await getSelectedWorkersForChantier(chantier.id);
              const count = chantierWorkers.length;
              
              workerDistributionData.push({
                name: chantier.nom || `Chantier ${chantier.id}`,
                workers: count
              });
              
              totalCount += count;
            } catch (err) {
              console.error(`Error fetching workers for chantier ${chantier.id}:`, err);
            }
          }
        }
        
        // Sort by worker count (descending)
        workerDistributionData.sort((a, b) => b.workers - a.workers);
        
        setData(workerDistributionData);
        setTotalWorkers(totalCount);
        setError(null);
      } catch (err) {
        console.error('Error fetching worker distribution data:', err);
        setError('Failed to load worker distribution data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [providedData, providedLoading, providedError, getAllChantiers, getAllWorkers, getSelectedWorkersForChantier]);

  return (
    <CardWrapper>
      <CardHeader>
        <CardTitle variant="h6" component="h2">
          <PeopleIcon fontSize="small" />
          Distribution des Travailleurs
        </CardTitle>
      </CardHeader>
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ flexGrow: 1, height: 180 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={alpha(theme.palette.divider, 0.5)} />
              <XAxis 
                type="number" 
                tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                axisLine={{ stroke: theme.palette.divider }}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: theme.palette.text.primary, fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: theme.palette.divider }}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
              <Bar dataKey="workers" radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography color="text.secondary">Aucune donnée disponible</Typography>
          </Box>
        )}
      </Box>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          {totalWorkers} travailleurs répartis sur {data.length} chantiers
        </Typography>
      </Box>
    </CardWrapper>
  );
};

export default WorkerDistribution;