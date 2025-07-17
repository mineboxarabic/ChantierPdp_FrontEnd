import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    borderColor: alpha(theme.palette.primary.main, 0.2),
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
}));

const StatusChip = styled(Chip)<{ status?: string }>(({ theme, status }) => {
  const getStatusColor = () => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'actif':
      case 'completed':
      case 'terminé':
        return { bg: theme.palette.success.main, text: theme.palette.success.contrastText };
      case 'pending':
      case 'en_attente':
        return { bg: theme.palette.warning.main, text: theme.palette.warning.contrastText };
      case 'cancelled':
      case 'annulé':
        return { bg: theme.palette.error.main, text: theme.palette.error.contrastText };
      default:
        return { bg: theme.palette.grey[500], text: theme.palette.common.white };
    }
  };

  const colors = getStatusColor();
  return {
    backgroundColor: colors.bg,
    color: colors.text,
    fontWeight: 600,
    fontSize: '0.75rem',
  };
});

// Interface for component props
interface CustomViewComponentProps {
  data: any;
  title?: string;
  subtitle?: string;
  avatar?: string | React.ReactNode;
  status?: string;
  primaryFields?: string[]; // Fields to highlight
  excludeFields?: string[]; // Fields to hide
  actions?: Array<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  }>;
  maxWidth?: number;
  showDividers?: boolean;
  compact?: boolean;
}

// Helper function to format field names
const formatFieldName = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/_/g, ' ')
    .trim();
};

// Helper function to format field values
const formatFieldValue = (value: any): React.ReactNode => {
  if (value === null || value === undefined) return '-';
  
  if (typeof value === 'boolean') {
    return (
      <Chip
        size="small"
        icon={value ? <CheckCircleIcon /> : <WarningIcon />}
        label={value ? 'Oui' : 'Non'}
        color={value ? 'success' : 'default'}
        variant="outlined"
      />
    );
  }
  
  if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
    return (
      <Box display="flex" alignItems="center" gap={0.5}>
        <CalendarIcon fontSize="small" color="action" />
        <Typography variant="body2">
          {new Date(value).toLocaleDateString('fr-FR')}
        </Typography>
      </Box>
    );
  }
  
  if (typeof value === 'string' && value.includes('@')) {
    return (
      <Box display="flex" alignItems="center" gap={0.5}>
        <PersonIcon fontSize="small" color="action" />
        <Typography variant="body2">{value}</Typography>
      </Box>
    );
  }
  
  if (Array.isArray(value)) {
    return (
      <Box display="flex" gap={0.5} flexWrap="wrap">
        {value.map((item, index) => (
          <Chip
            key={index}
            label={typeof item === 'object' ? item.nom || item.name || 'Item' : item}
            size="small"
            variant="outlined"
          />
        ))}
      </Box>
    );
  }
  
  if (typeof value === 'object' && value.nom) {
    return value.nom;
  }
  
  if (typeof value === 'object' && value.name) {
    return value.name;
  }
  
  if (typeof value === 'number') {
    return value.toLocaleString('fr-FR');
  }
  
  return String(value);
};

// Helper function to get appropriate icon
const getFieldIcon = (key: string, value: any) => {
  const lowerKey = key.toLowerCase();
  
  if (lowerKey.includes('date') || lowerKey.includes('time')) return <CalendarIcon fontSize="small" />;
  if (lowerKey.includes('user') || lowerKey.includes('person')) return <PersonIcon fontSize="small" />;
  if (lowerKey.includes('entreprise') || lowerKey.includes('company')) return <BusinessIcon fontSize="small" />;
  if (lowerKey.includes('risque') || lowerKey.includes('danger')) return <WarningIcon fontSize="small" />;
  if (lowerKey.includes('status') || lowerKey.includes('état')) return <CheckCircleIcon fontSize="small" />;
  
  return null;
};

const CustomViewComponent: React.FC<CustomViewComponentProps> = ({
  data,
  title,
  subtitle,
  avatar,
  status,
  primaryFields = [],
  excludeFields = ['id', 'createdAt', 'updatedAt'],
  actions = [],
  maxWidth = 400,
  showDividers = true,
  compact = false,
}) => {
  if (!data || typeof data !== 'object') {
    return (
      <StyledCard sx={{ maxWidth }}>
        <CardContent>
          <Typography color="text.secondary">Aucune donnée disponible</Typography>
        </CardContent>
      </StyledCard>
    );
  }

  const filteredData = Object.entries(data).filter(
    ([key]) => !excludeFields.includes(key)
  );

  const primaryData = filteredData.filter(([key]) => primaryFields.includes(key));
  const secondaryData = filteredData.filter(([key]) => !primaryFields.includes(key));

  return (
    <StyledCard sx={{ maxWidth, width: '100%' }}>
      <CardContent sx={{ p: compact ? 2 : 3 }}>
        {/* Header Section */}
        <HeaderSection>
          <Box display="flex" alignItems="center" gap={2}>
            {avatar && (
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {typeof avatar === 'string' ? avatar.charAt(0).toUpperCase() : avatar}
              </Avatar>
            )}
            <Box>
              {title && (
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            {status && <StatusChip label={status} status={status} size="small" />}
            {actions.map((action, index) => (
              <Tooltip key={index} title={action.label}>
                <IconButton
                  size="small"
                  onClick={action.onClick}
                  color={action.color || 'default'}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: theme => alpha(theme.palette[action.color || 'primary'].main, 0.1) 
                    }
                  }}
                >
                  {action.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </HeaderSection>

        {showDividers && (title || subtitle) && <Divider sx={{ mb: 2 }} />}

        {/* Primary Fields */}
        {primaryData.length > 0 && (
          <Box mb={showDividers ? 2 : 1}>
            <Grid container spacing={compact ? 1 : 2}>
              {primaryData.map(([key, value]) => {
                const icon = getFieldIcon(key, value);
                return (
                  <Grid item xs={12} key={key}>
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      {icon}
                      <Typography variant="subtitle2" fontWeight={600} color="primary.main">
                        {formatFieldName(key)}:
                      </Typography>
                    </Box>
                    <Box ml={icon ? 3 : 0}>
                      {formatFieldValue(value)}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
            {showDividers && secondaryData.length > 0 && <Divider sx={{ mt: 2 }} />}
          </Box>
        )}

        {/* Secondary Fields */}
        {secondaryData.length > 0 && (
          <Grid container spacing={compact ? 1 : 2}>
            {secondaryData.map(([key, value]) => {
              const icon = getFieldIcon(key, value);
              return (
                <Grid item xs={12} sm={compact ? 12 : 6} key={key}>
                  <Box display="flex" alignItems="flex-start" gap={1}>
                    <Box display="flex" alignItems="center" gap={0.5} minWidth="40%">
                      {icon}
                      <Typography variant="body2" fontWeight={500} color="text.secondary">
                        {formatFieldName(key)}:
                      </Typography>
                    </Box>
                    <Box flex={1}>
                      <Typography variant="body2" color="text.primary">
                        {formatFieldValue(value)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default CustomViewComponent;
