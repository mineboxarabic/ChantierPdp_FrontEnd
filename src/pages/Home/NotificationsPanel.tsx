// src/components/dashboard/NotificationsPanel.tsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import {
  NotificationsActive as NotificationsActiveIcon,
  ChevronRight as ChevronRightIcon,
  Construction as ConstructionIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  EventNote as EventNoteIcon,
  Task as TaskIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getRoute } from '../../Routes';

// Interfaces
interface Notification {
  id: number | string;
  type: 'inspection' | 'worker' | 'risk' | 'event' | 'task';
  message: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

interface NotificationsPanelProps {
  notifications?: Notification[];
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
    color: theme.palette.primary.main,
  },
}));

const NotificationItem = styled(ListItem)<{ priority?: 'high' | 'medium' | 'low' }>(({ theme, priority = 'medium' }) => {
  const bgColors = {
    high: alpha(theme.palette.error.main, 0.04),
    medium: alpha(theme.palette.warning.main, 0.04),
    low: alpha(theme.palette.success.main, 0.04),
  };
  
  return {
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: bgColors[priority] || 'transparent',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      backgroundColor: bgColors[priority] ? alpha(bgColors[priority], 2) : alpha(theme.palette.background.default, 0.8),
    },
    '&:last-child': {
      marginBottom: 0,
    }
  };
});

const NotificationIcon = styled(Avatar)<{ type?: string }>(({ theme, type = 'event' }) => {
  const colors: Record<string, string> = {
    inspection: theme.palette.info.main,
    worker: theme.palette.success.main,
    risk: theme.palette.error.main,
    task: theme.palette.warning.main,
    event: theme.palette.primary.main,
  };
  
  const bgColor = colors[type] || theme.palette.grey[500];
  
  return {
    backgroundColor: alpha(bgColor, 0.12),
    color: bgColor,
    width: 36,
    height: 36,
  };
});

const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const QuickActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 5,
  textTransform: 'none',
  fontWeight: 600,
  flex: 1,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  }
}));

// Get icon based on notification type
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'inspection': return <ConstructionIcon fontSize="small" />;
    case 'worker': return <PersonIcon fontSize="small" />;
    case 'risk': return <WarningIcon fontSize="small" />;
    case 'event': return <EventNoteIcon fontSize="small" />;
    case 'task': return <TaskIcon fontSize="small" />;
    default: return <NotificationsActiveIcon fontSize="small" />;
  }
};

// Main Component
const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ 
  notifications: providedNotifications,
  isLoading: providedLoading,
  error: providedError
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  // State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(providedLoading || false);
  const [error, setError] = useState<string | null>(providedError || null);

  // Initialize with mock data if none provided
  useEffect(() => {
    if (providedNotifications) {
      setNotifications(providedNotifications);
      return;
    }

    // Mock data if not provided
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        // This would be replaced with an actual API call
        
        // Mock data generation
        setTimeout(() => {
          const mockNotifications: Notification[] = [
            {
              id: 401,
              type: 'inspection',
              message: 'Inspection requise pour Chantier Alpha',
              date: 'Demain',
              priority: 'high'
            },
            {
              id: 402,
              type: 'worker',
              message: 'Nouveau travailleur ajouté: J. Dupont',
              date: 'Aujourd\'hui',
              priority: 'medium'
            },
            {
              id: 403,
              type: 'risk',
              message: 'Nouveau risque identifié sur Site Bêta',
              date: 'Hier',
              priority: 'high'
            }
          ];
          
          setNotifications(mockNotifications);
          setLoading(false);
          setError(null);
        }, 500);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications. Please try again later.');
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [providedNotifications, providedLoading, providedError]);

  // Navigation handlers
  const handleCreateChantier = () => {
    navigate(getRoute('CREATE_CHANTIER'));
  };

  const handleCreatePDP = () => {
    navigate(getRoute('CREATE_PDP', { chantierId: '0' }));
  };

  const handleViewAll = () => {
   // navigate(getRoute('NOTIFICATIONS'));
  };

  return (
    <CardWrapper>
      <CardHeader>
        <CardTitle variant="h6" as="h2">
          <NotificationsActiveIcon fontSize="small" />
          Notifications / Actions Rapides
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
      
      <List disablePadding sx={{ flexGrow: 1, overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem 
              key={notification.id}
              priority={notification.priority}
            >
              <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                <NotificationIcon type={notification.type}>
                  {getNotificationIcon(notification.type)}
                </NotificationIcon>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight={600}>
                    {notification.message}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {notification.date}
                  </Typography>
                }
              />
              <IconButton size="small">
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </NotificationItem>
          ))
        ) : (
          <Typography color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
            Aucune notification
          </Typography>
        )}
      </List>
      
      <ActionButtonsContainer>
        <QuickActionButton 
          variant="outlined" 
          size="small"
          startIcon={<ConstructionIcon fontSize="small" />}
          onClick={handleCreateChantier}
        >
          Créer Chantier
        </QuickActionButton>
        <QuickActionButton 
          variant="outlined" 
          size="small"
          startIcon={<TaskIcon fontSize="small" />}
          onClick={handleCreatePDP}
        >
          Créer PDP
        </QuickActionButton>
      </ActionButtonsContainer>
    </CardWrapper>
  );
};

export default NotificationsPanel;