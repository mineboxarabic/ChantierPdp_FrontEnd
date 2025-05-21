// src/components/dashboard/DashboardNotificationCenter.tsx
import React, { useEffect, useState } from 'react';
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
  Alert,
  Tooltip,
  Badge,
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import {
  NotificationsActive as NotificationsActiveIcon,
  ChevronRight as ChevronRightIcon,
  Construction as ConstructionIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  EventNote as EventNoteIcon,
  Task as TaskIcon,
  Article as DocumentIcon,
  Info as GeneralIcon,
  MarkEmailRead as MarkAllReadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useDashboardNotifications from '../../hooks/useDashboardNotifications';
// Assuming DashboardNotification is correctly imported from your DTO file
// and useDashboardNotifications hook provides it.
import { DashboardNotification } from '../../utils/entitiesDTO/NotificationDTO';

// --- Styled Components ---
const CardWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 2px 24px rgba(0,0,0,0.07)',
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const CardHeaderStyled = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const CardTitleStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

// Using DashboardNotification['priority'] and DashboardNotification['isRead']
const NotificationItem = styled(ListItem)<{ priority: DashboardNotification['priority'], isRead: DashboardNotification['isRead'] }>(({ theme, priority, isRead }) => {
  const bgColors: Record<DashboardNotification['priority'], string> = {
    high: alpha(theme.palette.error.main, 0.08),
    medium: alpha(theme.palette.warning.main, 0.08),
    low: alpha(theme.palette.info.main, 0.08),
  };
  const hoverBgColors: Record<DashboardNotification['priority'], string> = {
    high: alpha(theme.palette.error.main, 0.12),
    medium: alpha(theme.palette.warning.main, 0.12),
    low: alpha(theme.palette.info.main, 0.12),
  };

  const priorityColor = priority === 'high' ? theme.palette.error.main :
                       priority === 'medium' ? theme.palette.warning.main :
                       theme.palette.info.main;

  return {
    padding: theme.spacing(1.5, 2),
    marginBottom: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: isRead ? alpha(theme.palette.grey[500], 0.05) : bgColors[priority],
    opacity: isRead ? 0.75 : 1,
    transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.2s',
    borderLeft: `4px solid ${isRead ? theme.palette.grey[400] : priorityColor}`,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      backgroundColor: isRead ? alpha(theme.palette.grey[500], 0.1) : hoverBgColors[priority],
    },
    '&:last-child': {
      marginBottom: 0,
    }
  };
});

// Using DashboardNotification['type']
const NotificationIconAvatar = styled(Avatar)<{ notificationUiType: DashboardNotification['type'] }>(({ theme, notificationUiType }) => {
  const typeColors: Record<DashboardNotification['type'], { main: string }> = {
    inspection: { main: theme.palette.info.main },
    worker: { main: theme.palette.success.main },
    risk: { main: theme.palette.error.main },
    event: { main: theme.palette.primary.main },
    task: { main: theme.palette.warning.main },
    document: { main: theme.palette.secondary.main }, // Assuming secondary is defined
    general: { main: theme.palette.grey[700] }, // Using a specific grey
  };

  const colorPalette = typeColors[notificationUiType] || typeColors.general;

  return {
    backgroundColor: alpha(colorPalette.main, 0.12),
    color: colorPalette.main,
    width: 40,
    height: 40,
  };
});

// Using DashboardNotification['type']
const getNotificationIcon = (uiType: DashboardNotification['type']) => {
  switch (uiType) {
    case 'inspection': return <ConstructionIcon fontSize="small" />;
    case 'worker': return <PersonIcon fontSize="small" />;
    case 'risk': return <WarningIcon fontSize="small" />;
    case 'event': return <EventNoteIcon fontSize="small" />;
    case 'task': return <TaskIcon fontSize="small" />;
    case 'document': return <DocumentIcon fontSize="small" />;
    case 'general': return <GeneralIcon fontSize="small" />;
    default: return <NotificationsActiveIcon fontSize="small" />;
  }
};
// --- End Styled Components ---

const DashboardNotificationCenter: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    refreshUnreadCount,
  } = useDashboardNotifications();

  const [displayLimit, setDisplayLimit] = useState(5);

  useEffect(() => {
    fetchNotifications('all', 0, 20); // Fetch read and unread, initial 20
    refreshUnreadCount();
  }, [fetchNotifications, refreshUnreadCount]);

  const handleMarkAsRead = async (id: number) => {
    await markNotificationAsRead(id);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
  };

  const handleRefresh = () => {
    fetchNotifications('all', 0, 20); // Re-fetch initial set
    refreshUnreadCount();
  };

  const handleNotificationClick = (notification: DashboardNotification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    if (notification.callToActionLink) {
      navigate(notification.callToActionLink);
    }
  };

  const handleShowMore = () => {
    setDisplayLimit(prev => prev + 5);
    // If all currently fetched items are displayed and more might exist on backend:
    // const nextPage = Math.floor(notifications.length / 20); // Assuming '20' is your page size for fetching
    // if (displayLimit >= notifications.length && notifications.length % 20 === 0) {
    //   fetchNotifications('all', nextPage, 20);
    // }
  };

  return (
    <CardWrapper>
      <CardHeaderStyled>
        <CardTitleStyled variant="h6">
          <Badge badgeContent={unreadCount} color="error" sx={{ mr: 1.5 }}>
            <NotificationsActiveIcon fontSize="medium" />
          </Badge>
          Centre de Notifications
        </CardTitleStyled>
        <Box>
          <Tooltip title="Rafraîchir les notifications">
            <IconButton onClick={handleRefresh} size="small" sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          {unreadCount > 0 && (
            <Tooltip title="Marquer toutes comme lues">
              <IconButton onClick={handleMarkAllRead} size="small">
                <MarkAllReadIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardHeaderStyled>
      <Divider sx={{ mb: 2 }} />

      {isLoading && notifications.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, p: 3 }}>
            <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
        </Box>
      ) : notifications.length > 0 ? (
        <>
          <List disablePadding sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 400 /* Adjust as needed */ }}>
            {notifications.slice(0, displayLimit).map((notification) => (
              <NotificationItem
                key={notification.id}
                priority={notification.priority}
                isRead={notification.isRead}
                onClick={() => handleNotificationClick(notification)}
              >
                <ListItemIcon sx={{ minWidth: 'auto', mr: 1.5 }}>
                  {/* Pass the UI-specific type to NotificationIconAvatar */}
                  <NotificationIconAvatar notificationUiType={notification.type}>
                    {getNotificationIcon(notification.type)}
                  </NotificationIconAvatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={notification.isRead ? 500 : 600} color={notification.isRead ? "text.secondary" : "text.primary"}>
                      {notification.message}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {notification.date}
                      {/* Displaying originalType can be useful for debugging or if UI needs it */}
                      {/* {notification.originalType && ` - Type: ${notification.originalType}`} */}
                    </Typography>
                  }
                />
                {!notification.isRead && (
                  <Tooltip title="Marquer comme lue">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                      sx={{ ml: 1 }}
                    >
                      <ChevronRightIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </NotificationItem>
            ))}
          </List>
          {notifications.length > displayLimit && (
            <Button onClick={handleShowMore} fullWidth sx={{ mt: 1.5 }}>
              Afficher plus ({notifications.length - displayLimit} restantes)
            </Button>
          )}
          {/* Shows a small spinner at the bottom if loading more items */}
          {isLoading && notifications.length > 0 && notifications.length <= displayLimit && (
             <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}><CircularProgress size={20}/></Box>
          )}
        </>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, p: 3 }}>
          <Typography color="text.secondary">Aucune notification pour le moment.</Typography>
        </Box>
      )}
    </CardWrapper>
  );
};

export default DashboardNotificationCenter;