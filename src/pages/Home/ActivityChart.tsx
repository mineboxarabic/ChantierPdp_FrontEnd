// src/components/dashboard/ActivityChart.tsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  ToggleButtonGroup,
  ToggleButton,
  useMediaQuery,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import {
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

// Import your API hooks
import usePdp from '../../hooks/usePdp';
import useChantier from '../../hooks/useChantier';
import useRisque from '../../hooks/useRisque';

// Define interfaces for our component props and data
interface ActivityData {
  month: string;
  chantiers: number;
  pdps: number;
  risques: number;
}

interface ActivityChartProps {
  data?: ActivityData[];
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
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.light, 0.08),
  borderRadius: theme.shape.borderRadius * 5,
  '& .MuiToggleButtonGroup-grouped': {
    border: 0,
    borderRadius: theme.shape.borderRadius * 5,
    margin: 2,
    padding: theme.spacing(0.5, 1.5),
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.8rem',
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      }
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius * 5,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius * 5,
    },
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
        {payload.map((entry: any, index: number) => (
          <Box key={`item-${index}`} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Box
              component="span"
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: entry.color,
                mr: 1,
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {entry.name}: <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>{entry.value}</Box>
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

// Main Component
const ActivityChart: React.FC<ActivityChartProps> = ({ data: providedData, isLoading: providedLoading, error: providedError }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  
  // State for internally managed data
  const [activityData, setActivityData] = useState<ActivityData[] | undefined>(providedData);
  const [loading, setLoading] = useState<boolean>(providedLoading || false);
  const [error, setError] = useState<string | null>(providedError || null);

  // Hooks for API data
  const { getRecentPdps } = usePdp();
  const { getRecentChantiers } = useChantier();
  const { getAllRisques } = useRisque();

  useEffect(() => {
    // If data is provided as a prop, use it
    if (providedData) {
      setActivityData(providedData);
      return;
    }

    // Otherwise fetch and build data
    const fetchActivityData = async () => {
      try {
        setLoading(true);
        
        // Fetch recent data for chantiers, pdps, and risques
        const [pdps, chantiers, risques] = await Promise.all([
          getRecentPdps(),
          getRecentChantiers(),
          getAllRisques(),
        ]);

        // Process data to create monthly activity statistics
        // This is a simplified approach - you'll need to modify this based on your actual data structure
        const monthlyData = generateMonthlyData(chantiers, pdps, risques);
        setActivityData(monthlyData);
        setError(null);
      } catch (err) {
        console.error('Error fetching activity data:', err);
        setError('Failed to load activity data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, [providedData, providedLoading, providedError, getRecentPdps, getRecentChantiers, getAllRisques]);

  // Function to generate monthly activity data from API responses
  const generateMonthlyData = (chantiers: any, pdps: any, risques: any) => {
    // This is a placeholder implementation
    // You'll need to modify this to properly aggregate your data by month
    
    // Example: Get the last 5 months
    const months = getLastMonths(5);
    
    // Create a month-based activity summary
    return months.map(month => {
      return {
        month: month,
        // Count items created in each month - implement your actual counting logic based on date fields
        chantiers: Math.floor(Math.random() * 10),  // Replace with actual counts
        pdps: Math.floor(Math.random() * 8),        // Replace with actual counts
        risques: Math.floor(Math.random() * 12)     // Replace with actual counts 
      };
    });
  };

  // Helper to get abbreviated month names for the last n months
  const getLastMonths = (count: number): string[] => {
    const months: string[] = [];
    const now = new Date();
    
    for (let i = count - 1; i >= 0; i--) {
      const pastDate = new Date();
      pastDate.setMonth(now.getMonth() - i);
      months.push(pastDate.toLocaleString('default', { month: 'short' }));
    }
    
    return months;
  };

  const handleChartTypeChange = (event: React.MouseEvent<HTMLElement>, newType: 'line' | 'bar' | null) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };
  
  // Chart color scheme
  const chartColors = {
    chantiers: theme.palette.primary.main,
    pdps: theme.palette.warning.main,
    risques: theme.palette.error.main,
  };

  return (
    <CardWrapper>
      <CardHeader>
        <CardTitle variant="h6">
          Activité Récente
        </CardTitle>
        <StyledToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          aria-label="chart type"
          size="small"
        >
          <ToggleButton value="line" aria-label="line chart">
            <TimelineIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="bar" aria-label="bar chart">
            <BarChartIcon fontSize="small" />
          </ToggleButton>
        </StyledToggleButtonGroup>
      </CardHeader>
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ flexGrow: 1, height: 300 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : activityData && activityData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart
                data={activityData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  axisLine={{ stroke: theme.palette.divider }} 
                />
                <YAxis 
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  axisLine={{ stroke: theme.palette.divider }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ 
                    paddingTop: 20,
                    fontSize: 12
                  }}
                  formatter={(value) => (
                    <span style={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                      {value === 'chantiers' ? 'Chantiers' : 
                       value === 'pdps' ? 'PDPs' : 
                       value === 'risques' ? 'Risques' : value}
                    </span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="chantiers"
                  stroke={chartColors.chantiers}
                  strokeWidth={2}
                  dot={{ r: 4, stroke: chartColors.chantiers, strokeWidth: 2, fill: theme.palette.background.paper }}
                  activeDot={{ r: 6, stroke: theme.palette.background.paper, strokeWidth: 2, fill: chartColors.chantiers }}
                />
                <Line
                  type="monotone"
                  dataKey="pdps"
                  stroke={chartColors.pdps}
                  strokeWidth={2}
                  dot={{ r: 4, stroke: chartColors.pdps, strokeWidth: 2, fill: theme.palette.background.paper }}
                  activeDot={{ r: 6, stroke: theme.palette.background.paper, strokeWidth: 2, fill: chartColors.pdps }}
                />
                <Line
                  type="monotone"
                  dataKey="risques"
                  stroke={chartColors.risques}
                  strokeWidth={2}
                  dot={{ r: 4, stroke: chartColors.risques, strokeWidth: 2, fill: theme.palette.background.paper }}
                  activeDot={{ r: 6, stroke: theme.palette.background.paper, strokeWidth: 2, fill: chartColors.risques }}
                />
              </LineChart>
            ) : (
              <BarChart
                data={activityData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  axisLine={{ stroke: theme.palette.divider }} 
                />
                <YAxis 
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  axisLine={{ stroke: theme.palette.divider }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ 
                    paddingTop: 20,
                    fontSize: 12
                  }}
                  formatter={(value) => (
                    <span style={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                      {value === 'chantiers' ? 'Chantiers' : 
                       value === 'pdps' ? 'PDPs' : 
                       value === 'risques' ? 'Risques' : value}
                    </span>
                  )}
                />
                <Bar 
                  dataKey="chantiers" 
                  fill={chartColors.chantiers} 
                  radius={[4, 4, 0, 0]}
                  name="Chantiers"
                />
                <Bar 
                  dataKey="pdps" 
                  fill={chartColors.pdps} 
                  radius={[4, 4, 0, 0]}
                  name="PDPs"
                />
                <Bar 
                  dataKey="risques" 
                  fill={chartColors.risques} 
                  radius={[4, 4, 0, 0]}
                  name="Risques"
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography color="text.secondary">No activity data available</Typography>
          </Box>
        )}
      </Box>
    </CardWrapper>
  );
};

export default ActivityChart;