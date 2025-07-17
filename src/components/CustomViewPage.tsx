import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  Divider,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  ArrowBack as BackIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Visibility as ViewIcon,
  KeyboardArrowRight as ArrowRightIcon,
  Info as InfoIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
// Wrapper for centering
const CenteredWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  width: '100vw',
  backgroundColor: theme.palette.background.default,
}));

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  height: '90vh',
  width: '90vw',
  margin: '0 auto',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const HeaderPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderRadius: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
  color: theme.palette.primary.contrastText,
  position: 'relative',
  overflow: 'hidden',
  flexShrink: 0,
  margin: theme.spacing(2, 2, 0),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '200px',
    height: '200px',
    background: `radial-gradient(circle, ${alpha(theme.palette.common.white, 0.1)} 0%, transparent 60%)`,
    transform: 'translate(50%, -50%)',
  },
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  minHeight: 0, // Allow flex children to shrink
}));

const ContentArea = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  textTransform: 'none',
  fontWeight: 600,
  minWidth: 120,
}));

const SideDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 350,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
}));

const ClickableCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    borderColor: theme.palette.primary.main,
  },
}));

const FloatingActionButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  zIndex: 1000,
}));

// Internal data display component
const DataDisplaySection = styled(Box)(({ theme }) => ({
  padding: 0,
}));

const FieldRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '200px 1fr',
  gap: theme.spacing(2),
  alignItems: 'flex-start',
  marginBottom: theme.spacing(1),
  '&:last-child': {
    marginBottom: 0,
  },
}));

const FieldLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
}));

const FieldValue = styled(Box)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '0.875rem',
  wordBreak: 'break-word',
}));

// Helper functions for formatting
const formatFieldName = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/_/g, ' ')
    .trim();
};

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
  
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return (
      <Box display="flex" alignItems="center" gap={0.5}>
        <CalendarIcon fontSize="small" color="action" />
        <span>{new Date(value).toLocaleDateString('fr-FR')}</span>
      </Box>
    );
  }
  
  if (typeof value === 'string' && value.includes('@')) {
    return (
      <Box display="flex" alignItems="center" gap={0.5}>
        <PersonIcon fontSize="small" color="action" />
        <span>{value}</span>
      </Box>
    );
  }
  
  if (Array.isArray(value)) {
    return (
      <Box display="flex" gap={0.5} flexWrap="wrap">
        {value.map((item, index) => (
          <Chip
            key={`array-item-${index}-${typeof item === 'object' ? item.id || item.nom || item.name || index : item}`}
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

// Simple data display component
const SimpleDataDisplay: React.FC<{ data: any; excludeFields?: string[] }> = ({ 
  data, 
  excludeFields = ['id', 'createdAt', 'updatedAt'] 
}) => {
  if (!data || typeof data !== 'object') {
    return (
      <Typography color="text.secondary">
        Aucune donnée disponible
      </Typography>
    );
  }

  const filteredData = Object.entries(data).filter(
    ([key]) => !excludeFields.includes(key)
  );

  return (
    <DataDisplaySection>
      {filteredData.map(([key, value]) => (
        <FieldRow key={`field-${key}`}>
          <FieldLabel>
            {formatFieldName(key)}:
          </FieldLabel>
          <Box>
            {formatFieldValue(value)}
          </Box>
        </FieldRow>
      ))}
    </DataDisplaySection>
  );
};

// Interfaces
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface CustomViewPageProps {
  data: any;
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  avatar?: React.ReactNode;
  status?: string;
  
  // Main content configuration
  tabs?: Array<{
    label: string;
    content: any; // Can be object data or custom component
    icon?: React.ReactNode;
  }>;
  
  // Drawer content
  drawerContent?: Array<{
    title: string;
    data: any;
    type: 'list' | 'cards' | 'details';
  }>;
  
  // Clickable cards for related items
  relatedCards?: Array<{
    title: string;
    subtitle?: string;
    data: any;
    onClick: () => void;
    status?: string;
    icon?: React.ReactNode;
  }>;
  
  // Actions
  primaryActions?: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    variant?: 'contained' | 'outlined' | 'text';
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  }>;
  
  secondaryActions?: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }>;
  
  // Configuration
  showDrawer?: boolean;
  fabAction?: {
    icon: React.ReactNode;
    onClick: () => void;
    label: string;
  };
  
  onBack?: () => void;
}

// Tab Panel Component
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      sx={{
        flex: 1,
        display: value === index ? 'block' : 'none',
        p: 3,
      }}
      {...other}
    >
      {value === index && children}
    </Box>
  );
};

const CustomViewPage: React.FC<CustomViewPageProps> = ({
  data,
  title,
  subtitle,
  breadcrumbs = [],
  avatar,
  status,
  tabs = [],
  drawerContent = [],
  relatedCards = [],
  primaryActions = [],
  secondaryActions = [],
  showDrawer = false,
  fabAction,
  onBack,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [currentTab, setCurrentTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleCardClick = (card: any) => {
    setSelectedCard(card);
    setDialogOpen(true);
    if (card.onClick) {
      card.onClick();
    }
  };

  const renderTabContent = (tabData: any, type: string = 'object') => {
    if (React.isValidElement(tabData)) {
      return tabData;
    }
    
    if (typeof tabData === 'object' && tabData !== null) {
      return (
        <SimpleDataDisplay
          data={tabData}
        />
      );
    }
    
    return (
      <Typography color="text.secondary">
        Aucun contenu disponible pour cet onglet
      </Typography>
    );
  };

  const renderDrawerSection = (section: any) => {
    switch (section.type) {
      case 'list':
        return (
          <List>
            {Array.isArray(section.data) ? section.data.map((item: any, index: number) => (
              <ListItem key={`list-item-${index}-${item.id || item.nom || index}`} divider>
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText
                  primary={item.title || item.nom || item.name || `Item ${index + 1}`}
                  secondary={item.description || item.subtitle}
                />
              </ListItem>
            )) : (
              <ListItem>
                <ListItemText primary="Aucun élément" />
              </ListItem>
            )}
          </List>
        );
      
      case 'cards':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Array.isArray(section.data) ? section.data.map((item: any, index: number) => (
              <Card key={`card-item-${index}-${item.id || item.nom || index}`} variant="outlined" sx={{ cursor: 'pointer' }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    {item.title || item.nom || item.name || `Card ${index + 1}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description || item.subtitle}
                  </Typography>
                </CardContent>
              </Card>
            )) : (
              <Typography color="text.secondary">Aucune carte disponible</Typography>
            )}
          </Box>
        );
      
      case 'details':
      default:
        return (
          <SimpleDataDisplay
            data={section.data}
          />
        );
    }
  };

  return (
    <CenteredWrapper>
      <PageContainer>
      {/* Header */}
      <HeaderPaper elevation={0}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            {onBack && (
              <IconButton onClick={onBack} sx={{ color: 'inherit' }}>
                <BackIcon />
              </IconButton>
            )}
            {avatar && (
              <Avatar sx={{ width: 48, height: 48, bgcolor: 'rgba(255,255,255,0.2)' }}>
                {avatar}
              </Avatar>
            )}
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom={false}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
          
          {status && (
            <Chip
              label={status}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'inherit',
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <Breadcrumbs
            separator={<ArrowRightIcon fontSize="small" />}
            sx={{ color: 'inherit', opacity: 0.8, mb: 2 }}
          >
            {breadcrumbs.map((crumb, index) => (
              <Link
                key={`breadcrumb-${index}-${crumb.href || crumb.label}`}
                color="inherit"
                href={crumb.href}
                underline="hover"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {crumb.label}
              </Link>
            ))}
          </Breadcrumbs>
        )}

        {/* Actions */}
        <Box display="flex" gap={2} flexWrap="wrap">
          {primaryActions.map((action, index) => (
            <ActionButton
              key={`primary-action-${index}-${action.label}`}
              variant={action.variant || 'contained'}
              color={action.color || 'primary'}
              startIcon={action.icon}
              onClick={action.onClick}
              sx={{
                bgcolor: action.variant === 'contained' ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: 'inherit',
                borderColor: action.variant === 'outlined' ? 'rgba(255,255,255,0.5)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                },
              }}
            >
              {action.label}
            </ActionButton>
          ))}
          
          {showDrawer && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ color: 'inherit' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </HeaderPaper>

      <ContentContainer>
        {/* Main Content with Tabs */}
        {tabs.length > 0 ? (
          <Paper sx={{ borderRadius: 2, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, width: '100%' }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={`tab-${index}-${tab.label}`}
                  label={tab.label}
                  icon={tab.icon as any}
                  iconPosition="start"
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                />
              ))}
            </Tabs>
            
            {tabs.map((tab, index) => (
              <TabPanel key={`tabpanel-${index}-${tab.label}`} value={currentTab} index={index}>
                {renderTabContent(tab.content)}
              </TabPanel>
            ))}
          </Paper>
        ) : (
          // Default content if no tabs
          <Paper sx={{ p: 3, borderRadius: 2, flex: 1 }}>
            <SimpleDataDisplay
              data={data}
            />
          </Paper>
        )}

        {/* Related Cards Section */}
        {relatedCards.length > 0 && (
          <Box sx={{ flexShrink: 0 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Éléments associés
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
              {relatedCards.map((card, index) => (
                <ClickableCard key={`related-card-${index}-${card.title}`} onClick={() => handleCardClick(card)} sx={{ height: '100%' }}>
                  <CardContent sx={{ pb: 1 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      {card.icon && (
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          {card.icon}
                        </Avatar>
                      )}
                      <Box flex={1}>
                        <Typography variant="subtitle2" fontWeight={600} noWrap>
                          {card.title}
                        </Typography>
                        {card.subtitle && (
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {card.subtitle}
                          </Typography>
                        )}
                      </Box>
                      {card.status && (
                        <Chip label={card.status} size="small" />
                      )}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ pt: 0 }}>
                    <Button size="small" startIcon={<ViewIcon />}>
                      Voir détails
                    </Button>
                  </CardActions>
                </ClickableCard>
              ))}
            </Box>
          </Box>
        )}
      </ContentContainer>

      {/* Side Drawer */}
      <SideDrawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            Informations complémentaires
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        {drawerContent.map((section, index) => (
          <Box key={`drawer-section-${index}-${section.title}`} mb={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {section.title}
            </Typography>
            {renderDrawerSection(section)}
          </Box>
        ))}
      </SideDrawer>

      {/* Quick View Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedCard && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={2}>
                {selectedCard.icon}
                {selectedCard.title}
              </Box>
            </DialogTitle>
            <DialogContent>
              <SimpleDataDisplay
                data={selectedCard.data}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Fermer</Button>
              <Button variant="contained" startIcon={<ViewIcon />}>
                Voir en détail
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Floating Action Button */}
      {fabAction && (
        <FloatingActionButton
          color="primary"
          onClick={fabAction.onClick}
          aria-label={fabAction.label}
        >
          {fabAction.icon}
        </FloatingActionButton>
      )}
      </PageContainer>
    </CenteredWrapper>
  );
};

export default CustomViewPage;
