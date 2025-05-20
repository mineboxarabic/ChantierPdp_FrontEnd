// src/components/dashboard/styles.js
// Shared styles for dashboard components to maintain consistency

import { styled, alpha } from '@mui/material/styles';
import { 
  Box, 
  Typography, 
  Card, 
  Button, 
  IconButton,
  Chip, 
  Avatar, 
  TextField,
  Tabs,
  Tab
} from '@mui/material';

// Base card style used throughout the dashboard
export const DashboardCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 2px 24px rgba(0,0,0,0.07)',
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  },
}));

// Header section for cards
export const CardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

// Card title with icon
export const CardTitle = styled(Typography)(({ theme, iconColor = 'primary' }) => ({
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
    color: theme.palette[iconColor].main,
  },
}));

// Stats card style
export const StatsCard = styled(Box)(({ theme, color = 'primary' }) => ({
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

// Icon wrapper for stats cards
export const IconWrapper = styled(Avatar)(({ theme, color = 'primary' }) => ({
  backgroundColor: alpha(theme.palette[color].main, 0.12),
  color: theme.palette[color].main,
  width: 56,
  height: 56,
  borderRadius: '18px',
  marginRight: theme.spacing(2.5),
}));

// List item styles for various lists
export const ListItemCard = styled(Box)(({ theme, selected = false }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: selected 
    ? alpha(theme.palette.primary.light, 0.08) 
    : alpha(theme.palette.background.default, 0.5),
  marginBottom: theme.spacing(1.5),
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
    backgroundColor: selected 
      ? alpha(theme.palette.primary.light, 0.12) 
      : theme.palette.background.paper,
  },
  '&:last-child': {
    marginBottom: 0,
  }
}));

// Status chip with dynamic colors based on status
export const StatusChip = styled(Chip)(({ theme, status, type = 'default' }) => {
  const statusColors = {
    default: {
      'Actif': {
        bg: alpha(theme.palette.success.main, 0.12),
        color: theme.palette.success.dark,
      },
      'En cours': {
        bg: alpha(theme.palette.info.main, 0.12),
        color: theme.palette.info.dark,
      },
      'Planifié': {
        bg: alpha(theme.palette.warning.main, 0.12),
        color: theme.palette.warning.dark,
      },
      'Terminé': {
        bg: alpha(theme.palette.grey[500], 0.12),
        color: theme.palette.text.secondary,
      },
      'Validation Requise': {
        bg: alpha(theme.palette.error.main, 0.12),
        color: theme.palette.error.dark,
      },
      'Signature Requise': {
        bg: alpha(theme.palette.warning.main, 0.12),
        color: theme.palette.warning.dark,
      }
    },
    risk: {
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
      }
    }
  };

  const typeColors = statusColors[type] || statusColors.default;
  const colorConfig = typeColors[status] || {
    bg: alpha(theme.palette.grey[500], 0.12),
    color: theme.palette.text.secondary,
  };

  return {
    backgroundColor: colorConfig.bg,
    color: colorConfig.color,
    fontWeight: 600,
    borderRadius: '16px',
    border: 'none',
    '& .MuiChip-icon': {
      color: colorConfig.color,
    }
  };
});

// Search input styling
export const SearchInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 5,
    transition: 'all 0.2s',
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    },
    '&.Mui-focused': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    }
  }
}));

// Action button styling
export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 5,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 2.5),
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  }
}));

// Tab styling
export const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 5,
  minHeight: 40,
  height: 40,
  backgroundColor: alpha(theme.palette.primary.light, 0.08),
  '& .MuiTabs-indicator': {
    height: '100%',
    borderRadius: theme.shape.borderRadius * 5,
    backgroundColor: theme.palette.primary.main,
    opacity: 0.1,
    zIndex: 0
  },
  '& .MuiTab-root': {
    zIndex: 1,
    textTransform: 'none',
    minHeight: 40,
    fontWeight: 500,
    '&.Mui-selected': {
      color: theme.palette.primary.main,
      fontWeight: 600
    }
  }
}));

// Info text styling for small labels with icons
export const InfoText = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  '& .MuiSvgIcon-root': {
    fontSize: '0.9rem',
    marginRight: theme.spacing(0.5),
  }
}));

// Progress wrapper for linear progress with label
export const ProgressWrapper = styled(Box)(({ theme }) => ({
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

// Custom tooltip container for charts
export const TooltipContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));


export const SectionTitle = styled(Typography)(({ theme }) => ({
  position: "relative",
  fontWeight: 600, // Making it a bit bolder, like a section title should be
  marginBottom: theme.spacing(3), // Or theme.spacing(2) if 3 is too much
  paddingBottom: theme.spacing(1),
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "50px", // Or "30%" for a responsive width
    height: "4px", // A bit thicker for emphasis
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius / 2, // Optional: slightly rounded underline
  },
}));