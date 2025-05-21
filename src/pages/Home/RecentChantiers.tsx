// src/components/dashboard/RecentChantiers.tsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Button, 
  IconButton,
  Avatar,
  LinearProgress,
  Tooltip,
  Chip,
  Menu,
  MenuItem,
  useMediaQuery,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import {
  ChevronRight as ChevronRightIcon,
  MoreVert as MoreVertIcon,
  Construction as ConstructionIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Import hooks and types
import useChantier from '../../hooks/useChantier';
import useLocalisation from '../../hooks/useLocalisation';
import useEntreprise from '../../hooks/useEntreprise';
import {ChantierDTO} from '../../utils/entitiesDTO/ChantierDTO';
import { getRoute } from '../../Routes';
import { ChantierStatus } from '../../utils/enums/ChantierStatus';

// Interfaces
interface RecentChantiersProps {
  chantiers?: ChantierDTO[];
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
    color: theme.palette.primary.main,
  },
}));

const ChantierItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.background.default, 0.5),
  marginBottom: theme.spacing(2),
  '&:last-child': {
    marginBottom: 0,
  },
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
    backgroundColor: theme.palette.background.paper,
  },
}));

const StatusChip = styled(Chip)<{ status?: ChantierStatus }>(({ theme, status }) => {


  const statusColors: Record<ChantierStatus, { bg: string, color: string }> = {
    'ACTIVE': {
      bg: alpha(theme.palette.success.main, 0.12),
      color: theme.palette.success.dark,
    },
    'PENDING_BDT': {
      bg: alpha(theme.palette.info.main, 0.12),
      color: theme.palette.info.dark,
    },
    'PENDING_PDP': {
      bg: alpha(theme.palette.warning.main, 0.12),
      color: theme.palette.warning.dark,
    },
    'INACTIVE_TODAY': {
      bg: alpha(theme.palette.error.main, 0.12),
      color: theme.palette.error.dark,
    },
    'COMPLETED': {
      bg: alpha(theme.palette.primary.main, 0.12),
      color: theme.palette.primary.dark,
    },
    'CANCELED': {
      bg: alpha(theme.palette.grey[400], 0.12),
      color: theme.palette.grey[700],
    },
  };

  const colorConfig = status && statusColors[status] ? statusColors[status] : {
    bg: alpha(theme.palette.grey[500], 0.12),
    color: theme.palette.text.secondary,
  };

  return {
    backgroundColor: colorConfig.bg,
    color: colorConfig.color,
    fontWeight: 600,
    borderRadius: '16px',
    border: 'none',
  };
});

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  '& .MuiSvgIcon-root': {
    fontSize: '0.9rem',
    marginRight: theme.spacing(0.75),
    color: theme.palette.text.secondary,
  },
  '& .MuiTypography-root': {
    fontSize: '0.85rem',
    color: theme.palette.text.secondary,
  },
}));

const ProgressWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(1.5),
  '& .MuiLinearProgress-root': {
    height: 8,
    borderRadius: 4,
    backgroundColor: alpha(theme.palette.grey[500], 0.12),
    flexGrow: 1,
    marginRight: theme.spacing(1),
  },
}));

// Function to format date as DD/MM/YYYY
const formatDate = (date: Date | string | undefined): string => {
  if (!date) return 'Date non définie';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  return `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
};

// Helper function to determine chantier status based on dates
const getChantierStatus = (chantier: ChantierDTO): ChantierStatus => {
  return chantier.status || ChantierStatus.INACTIVE_TODAY;
};

const RecentChantiers: React.FC<RecentChantiersProps> = ({ 
  chantiers: providedChantiers, 
  maxItems = 5,
  isLoading: providedLoading, 
  error: providedError 
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for menu
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedChantierId, setSelectedChantierId] = useState<number | null>(null);
  
  // State for data
  const [chantiers, setChantiers] = useState<ChantierDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(providedLoading || false);
  const [error, setError] = useState<string | null>(providedError || null);

  // Hooks
  const { getRecentChantiers,deleteChantier } = useChantier();
  const { localisations, getAllLocalisations } = useLocalisation();
  const { entreprises, getAllEntreprises } = useEntreprise();

  // Fetch data if not provided as props
  useEffect(() => {
    // If chantiers are provided as props, use them
    if (providedChantiers) {
      setChantiers(providedChantiers.slice(0, maxItems));
      return;
    }

    const fetchChantiers = async () => {
      try {
        setLoading(true);
        
        // Fetch chantiers and related data
        const [chantiersData] = await Promise.all([
          getRecentChantiers(),
          getAllLocalisations(),
          getAllEntreprises()
        ]);

        // Sort by date (most recent first) and limit to maxItems
        const sortedChantiers = chantiersData
          .sort((a, b) => {
            const dateA = a.dateDebut ? new Date(a.dateDebut).getTime() : 0;
            const dateB = b.dateDebut ? new Date(b.dateDebut).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, maxItems);

        setChantiers(sortedChantiers);
        setError(null);
      } catch (err) {
        console.error('Error fetching recent chantiers:', err);
        setError('Failed to load recent chantiers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchChantiers();
  }, []);

  // Menu handlers
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, chantierId: number | undefined) => {
    event.stopPropagation();
    if (chantierId) {
      setMenuAnchorEl(event.currentTarget);
      setSelectedChantierId(chantierId);
    }
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedChantierId(null);
  };

  // Navigation handlers
  const handleViewDetails = (chantierId: number | undefined) => {
    if (chantierId) {
      navigate(getRoute('VIEW_CHANTIER', { id: chantierId.toString() }));
    }
    handleMenuClose();
  };

  const handleEditChantier = (chantierId: number | undefined) => {
    if (chantierId) {
      navigate(getRoute('EDIT_CHANTIER', { id: chantierId.toString() }));
    }
    handleMenuClose();
  };

  const handleDeleteChantier =async (chantierId: number | undefined) => {
    // Implement delete logic or confirmation dialog
    console.log('Delete chantier:', chantierId);
   
    await deleteChantier(chantierId as number);
   
    setChantiers((prevChantiers) => prevChantiers.filter((chantier) => chantier.id !== chantierId));
    
    handleMenuClose();
  };
  
  const getProgressColor = (progress: number) => {
    if (progress >= 75) return theme.palette.success.main;
    if (progress >= 40) return theme.palette.info.main;
    return theme.palette.warning.main;
  };

  // Handle view all navigation
  const handleViewAll = () => {
    navigate(getRoute('CHANTIER_LIST'));
  };

  return (
    <CardWrapper>
      <CardHeader>
        <CardTitle variant="h6" as="h2">
          <ConstructionIcon fontSize="small" />
          Chantiers Récents
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
      
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
        ) : chantiers.length > 0 ? (
          chantiers.map((chantier) => {
            // Calculate status and progress
            const status = getChantierStatus(chantier);
            
            // Get location and enterprise details
            const location = chantier.localisation ? localisations.get(chantier.localisation) : undefined;
            const entreprise = chantier.entrepriseUtilisatrice ? entreprises.get(chantier.entrepriseUtilisatrice) : undefined;

            return (
              <ChantierItem key={chantier.id} onClick={() => handleViewDetails(chantier.id)}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      {chantier.nom || "Chantier sans nom"}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? 1 : 2 }}>
                      <InfoItem>
                        <BusinessIcon />
                        <Typography>{chantier.operation || "Opération non définie"}</Typography>
                      </InfoItem>
                      
                      <InfoItem>
                        <CalendarIcon />
                        <Typography>Fin: {formatDate(chantier.dateFin)}</Typography>
                      </InfoItem>
                      
                      {location && (
                        <InfoItem>
                          <LocationIcon />
                          <Typography>{location.nom}</Typography>
                        </InfoItem>
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    <StatusChip label={status} size="small" status={status} />
                    <IconButton 
                      size="small" 
                      onClick={(e) => handleMenuClick(e, chantier.id)}
                      sx={{ ml: 1 }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </ChantierItem>
            );
          })
        ) : (
          <Typography color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
            Aucun chantier récent trouvé
          </Typography>
        )}
      </Box>
      
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewDetails(selectedChantierId || undefined)}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          Afficher le détail
        </MenuItem>
        <MenuItem onClick={() => handleEditChantier(selectedChantierId || undefined)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Modifier
        </MenuItem>
        <MenuItem onClick={() => handleDeleteChantier(selectedChantierId || undefined)} sx={{ color: theme.palette.error.main }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Supprimer
        </MenuItem>
      </Menu>
    </CardWrapper>
  );
};

export default RecentChantiers;