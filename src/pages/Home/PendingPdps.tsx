// src/components/dashboard/PendingPdps.tsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Button, 
  IconButton,
  Avatar,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import {
  AssignmentLate as AssignmentLateIcon,
  ChevronRight as ChevronRightIcon,
  BusinessCenter as BusinessIcon,
  CalendarToday as CalendarIcon,
  Receipt as ReceiptIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Import hooks & types
import usePdp from '../../hooks/usePdp';
import useEntreprise from '../../hooks/useEntreprise';
import { PdpDTO } from '../../utils/entitiesDTO/PdpDTO';
import { getRoute } from '../../Routes';
import { GridColumnHeaderFilterIconButton } from '@mui/x-data-grid';
import { hashQueryKeyByOptions } from 'react-query/types/core/utils';

// Interfaces
interface PendingPdpsProps {
  pdps?: PdpDTO[];
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
    color: theme.palette.warning.main,
  },
}));

const PdpItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
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

const StatusAvatar = styled(Avatar)<{ status?: string }>(({ theme, status }) => {
  const isSignature = status === 'Signature Requise';
  return {
    backgroundColor: isSignature 
      ? alpha(theme.palette.warning.main, 0.12)
      : alpha(theme.palette.error.main, 0.12),
    color: isSignature 
      ? theme.palette.warning.main
      : theme.palette.error.main,
    width: 40,
    height: 40,
    marginRight: theme.spacing(2),
  };
});

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 5,
  textTransform: 'none',
  fontWeight: 600,
  minWidth: 'auto',
  padding: theme.spacing(0.5, 2),
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  }
}));

const InfoText = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  marginTop: theme.spacing(0.5),
  '& .MuiSvgIcon-root': {
    fontSize: '0.9rem',
    marginRight: theme.spacing(0.5),
  }
}));

// Function to format date as DD/MM/YYYY
const formatDate = (date: Date | string | undefined): string => {
  if (!date) return 'Date non définie';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  return `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
};

// Calculate time since the request
const getTimeAgo = (date: Date | string | undefined): string => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Aujourd\'hui';
  if (diffInDays === 1) return 'Hier';
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
  if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`;
  return `Il y a ${Math.floor(diffInDays / 30)} mois`;
};

// Determine PDP status based on its properties
const determinePdpStatus = (pdp: PdpDTO): string => {
  // A simple example - adjust according to your business logic
  if (pdp.signatures && pdp.signatures.length > 0) {
    return 'Signature Requise';
  } else {
    return 'Validation Requise';
  }
};

// Main Component
const PendingPdps: React.FC<PendingPdpsProps> = ({ 
  pdps: providedPdps, 
  maxItems = 5,
  isLoading: providedLoading, 
  error: providedError 
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // State
  const [pdps, setPdps] = useState<PdpDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(providedLoading || false);
  const [error, setError] = useState<string | null>(providedError || null);

  // Hooks
  const { getRecentPdps } = usePdp();
  const { getAllEntreprises, entreprises } = useEntreprise();

  // Fetch data if not provided as props
  useEffect(() => {
    // If pdps are provided as props, use them
    if (providedPdps) {
      setPdps(providedPdps.slice(0, maxItems));
      return;
    }

    const fetchPdps = async () => {
      try {
        setLoading(true);
        
        // Fetch pdps and related data
        const [pdpsData] = await Promise.all([
          getRecentPdps(),
          getAllEntreprises()
        ]);

        // Sort by date (most recent first) and limit to maxItems
        const sortedPdps = pdpsData
          .sort((a, b) => {
            const dateA = a.dateInspection ? new Date(a.dateInspection).getTime() : 0;
            const dateB = b.dateInspection ? new Date(b.dateInspection).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, maxItems);

        setPdps(sortedPdps);
        setError(null);
      } catch (err) {
        console.error('Error fetching pending PDPs:', err);
        setError('Failed to load pending PDPs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPdps();
  }, []);

  // Navigation handler
  const handleViewAll = () => {
    navigate(getRoute('PDP_LIST'));
  };

  const handleAction = (pdp: PdpDTO) => {
    if (pdp.id) {
      navigate(getRoute('EDIT_PDP', { id: pdp.id.toString() }));
    }
  };

  return (
    <CardWrapper>
      <CardHeader>
        <CardTitle variant="h6">
          <AssignmentLateIcon fontSize="small" />
          PDPs en Attente
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
        ) : pdps.length > 0 ? (
          pdps.map((pdp) => {
            const status = determinePdpStatus(pdp);
            const entrepriseExt = pdp.entrepriseExterieure ? entreprises.get(pdp.entrepriseExterieure) : undefined;
            
            return (
              <PdpItem key={pdp.id}>
                <StatusAvatar status={status}>
                  <AssignmentLateIcon fontSize="small" />
                </StatusAvatar>
                
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        PDP #{pdp.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {entrepriseExt?.nom || "Entreprise inconnue"}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                        <InfoText>
                          <BusinessIcon /> {status}
                        </InfoText>
                        <InfoText>
                          <CalendarIcon /> {getTimeAgo(pdp.dateInspection)}
                        </InfoText>
                      </Box>
                    </Box>
                    
                    <Tooltip title="Prendre action">
                      <ActionButton 
                        variant="contained" 
                        color={status === 'Signature Requise' ? 'warning' : 'primary'}
                        size="small"
                        onClick={() => handleAction(pdp)}
                      >
                        Action
                      </ActionButton>
                    </Tooltip>
                  </Box>
                </Box>
              </PdpItem>
            );
          })
        ) : (
          <Typography color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
            Aucun PDP en attente
          </Typography>
        )}
      </Box>
    </CardWrapper>
  );
};

export default PendingPdps;