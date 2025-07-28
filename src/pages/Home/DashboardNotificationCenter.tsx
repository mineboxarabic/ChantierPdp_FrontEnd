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
import { styled, alpha } from '@mui/material/styles';
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

type NotificationFilter = 'all' | 'unread' | 'read';

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

  const getPriorityColor = (priority: DashboardNotification['priority']) => {
    switch (priority) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.info.main;
      default: return theme.palette.info.main;
    }
  };

  const priorityColor = getPriorityColor(priority);

  return {
    padding: theme.spacing(1.5, 2),
    marginBottom: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: isRead 
      ? alpha(theme.palette.grey[400], 0.1) // More prominent gray for read notifications
      : bgColors[priority],
    opacity: isRead ? 0.7 : 1, // Slightly more faded for read notifications
    transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.2s',
    borderLeft: `4px solid ${isRead ? theme.palette.grey[500] : priorityColor}`, // Gray border for read notifications
    // Add stronger visual cues for read notifications
    filter: isRead ? 'grayscale(0.5)' : 'none', // More grayscale for read notifications
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      backgroundColor: isRead 
        ? alpha(theme.palette.grey[400], 0.15) // Gray hover for read notifications
        : hoverBgColors[priority],
      filter: isRead ? 'grayscale(0.3)' : 'none', // Less grayscale on hover
    },
    '&:last-child': {
      marginBottom: 0,
    }
  };
});

// Using DashboardNotification['type']
const NotificationIconAvatar = styled(Avatar)<{ notificationUiType: DashboardNotification['type'], isRead?: boolean }>(({ theme, notificationUiType, isRead }) => {
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
  
  // Use gray colors for read notifications
  const finalColor = isRead ? theme.palette.grey[500] : colorPalette.main;

  return {
    backgroundColor: alpha(finalColor, 0.12),
    color: finalColor,
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
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount: backendUnreadCount,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    totalElements,
    fetchNotifications,
    loadMoreNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    refreshUnreadCount,
  } = useDashboardNotifications();

  const [displayLimit, setDisplayLimit] = useState(5);
  const [filter, setFilter] = useState<NotificationFilter>('all');

  // Calculate actual unread count from notifications data as fallback
  const actualUnreadCount = notifications.filter(n => !n.isRead).length;
  
  // Use backend count if it seems correct, otherwise use calculated count
  const unreadCount = backendUnreadCount > 0 ? backendUnreadCount : actualUnreadCount;

  useEffect(() => {
    fetchNotifications(filter, 0, 20);
    refreshUnreadCount();
  }, [fetchNotifications, refreshUnreadCount, filter]);


  useEffect(() => {
  console.log('Notifications updated:', notifications);
  }, [notifications]);

  const handleFilterChange = (newFilter: NotificationFilter) => {
    console.log('Filter changing to:', newFilter, 'Backend unread count:', backendUnreadCount, 'Calculated unread count:', actualUnreadCount);
    setFilter(newFilter);
    setDisplayLimit(5); // Reset display limit when filter changes
  };

  const handleMarkAsRead = async (id: number) => {
    await markNotificationAsRead(id);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
  };

  const handleRefresh = () => {
    fetchNotifications(filter, 0, 20); // Use current filter
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
    if (displayLimit >= notifications.length && hasMore) {
      // Load more from backend
      loadMoreNotifications();
    } else {
      // Show more from current loaded notifications
      setDisplayLimit(prev => prev + 5);
    }
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

      {/* Filter Controls */}
      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant={filter === 'all' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => handleFilterChange('all')}
        >
          Toutes {filter === 'all' && totalElements > 0 && `(${totalElements})`}
        </Button>
        <Button
          variant={filter === 'unread' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => handleFilterChange('unread')}
          color="warning"
        >
          Non lues ({unreadCount})
        </Button>
        <Button
          variant={filter === 'read' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => handleFilterChange('read')}
          color="info"
        >
          Lues ({filter === 'read' && totalElements > 0 ? totalElements : Math.max(0, totalElements - unreadCount)})
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {(() => {
        console.log('Render logic - filter:', filter, 'notifications:', notifications.length, 'isLoading:', isLoading, 'error:', error);
        console.log('Backend unread count:', backendUnreadCount, 'Calculated unread count:', actualUnreadCount, 'Using:', unreadCount);
        
        if (isLoading && notifications.length === 0) {
          return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, p: 3 }}>
              <CircularProgress />
            </Box>
          );
        }
        if (error) {
          return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, p: 3 }}>
              <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
            </Box>
          );
        }
        
        // Since backend filtering is now working correctly, we can rely on the backend-filtered notifications
        const filteredNotifications = notifications;
        
        console.log('Displaying notifications:', filteredNotifications.length);
        
        if (filteredNotifications.length > 0) {
          return (
            <>
              <List disablePadding sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 400 /* Adjust as needed */ }}>
                {filteredNotifications.slice(0, displayLimit).map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    priority={notification.priority}
                    isRead={notification.isRead}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <ListItemIcon sx={{ minWidth: 'auto', mr: 1.5 }}>
                      {/* Pass the UI-specific type and isRead status to NotificationIconAvatar */}
                      <NotificationIconAvatar notificationUiType={notification.type} isRead={notification.isRead}>
                        {getNotificationIcon(notification.type)}
                      </NotificationIconAvatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="body2" 
                            fontWeight={notification.isRead ? 500 : 700} 
                            color={notification.isRead ? "text.secondary" : "text.primary"}
                            sx={{ 
                              lineHeight: 1.4
                            }}
                          >
                            {notification.message}
                          </Typography>
                          {!notification.isRead && (
                            <Box 
                              sx={{ 
                                width: 8, 
                                height: 8, 
                                borderRadius: '50%', 
                                backgroundColor: 'primary.main',
                                flexShrink: 0
                              }} 
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {notification.date}
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
              {(filteredNotifications.length > displayLimit || hasMore) && (
                <Button 
                  onClick={handleShowMore} 
                  fullWidth 
                  sx={{ mt: 1.5 }}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} />
                      Chargement...
                    </Box>
                  ) : (
                    (() => {
                      if (displayLimit < filteredNotifications.length) {
                        return `Afficher plus (${filteredNotifications.length - displayLimit} restantes)`;
                      }
                      if (hasMore) {
                        return 'Afficher plus (plus de notifications)';
                      }
                      return 'Afficher plus';
                    })()
                  )}
                </Button>
              )}
              {/* Shows a small spinner at the bottom if loading more items */}
              {isLoadingMore && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                  <CircularProgress size={20}/>
                </Box>
              )}
            </>
          );
        }
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, p: 3 }}>
            <Typography color="text.secondary">
              {filter === 'unread' && 'Aucune notification non lue pour le moment.'}
              {filter === 'read' && 'Aucune notification lue pour le moment.'}
              {filter === 'all' && 'Aucune notification pour le moment.'}
            </Typography>
          </Box>
        );
      })()}
    </CardWrapper>
  );
};

export default DashboardNotificationCenter;