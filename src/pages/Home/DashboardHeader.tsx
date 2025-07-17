// src/components/dashboard/DashboardHeader.jsx
import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  InputAdornment, 
  Button, 
  IconButton,
  Tabs,
  Tab,
  Badge,
  Menu,
  MenuItem,
  useMediaQuery
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  NotificationsOutlined as NotificationsIcon,
  AddCircleOutline as AddIcon,
  TuneOutlined as CustomizeIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getRoute } from '../../Routes';

// Styled components
const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(4),
}));

const SearchInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 8,
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

const StyledTabs = styled(Tabs)(({ theme }) => ({
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

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 5,
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  padding: theme.spacing(1, 2.5),
}));

// Dashboard Header Component
interface DashboardHeaderProps {
  onlyCreateChantierButton?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onlyCreateChantierButton = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  
  const naviate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleCreateChantier = () => {
    //Go to create chantier page
    naviate(getRoute('CREATE_CHANTIER'));
  }

  return (
    <HeaderContainer>
      {!onlyCreateChantierButton && (
        <>
          {/* Title and User Row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
            </Box>
            
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  size="small"
                  sx={{ 
                    backgroundColor: alpha(theme.palette.primary.light, 0.1),
                    '&:hover': { backgroundColor: alpha(theme.palette.primary.light, 0.2) }
                  }}
                >
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon color="primary" />
                  </Badge>
                </IconButton>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                </Box>
              </Box>
            )}
          </Box>
          
          {/* Search and Actions Row */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isTablet ? 'column' : 'row', 
            justifyContent: 'space-between', 
            alignItems: isTablet ? 'stretch' : 'center',
            gap: 2
          }}>
            <SearchInput
              placeholder="Rechercher un chantier, PDP, entreprise..."
              variant="outlined"
              fullWidth={isTablet}
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        size="small" 
                        onClick={handleFilterClick}
                        sx={{ 
                          backgroundColor: alpha(theme.palette.primary.light, 0.1),
                          '&:hover': { backgroundColor: alpha(theme.palette.primary.light, 0.2) }
                        }}
                      >
                        <FilterListIcon fontSize="small" />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={handleMenuClose}>Tous les chantiers</MenuItem>
                        <MenuItem onClick={handleMenuClose}>Chantiers actifs</MenuItem>
                        <MenuItem onClick={handleMenuClose}>PDPs en attente</MenuItem>
                        <MenuItem onClick={handleMenuClose}>Risques élevés</MenuItem>
                      </Menu>
                    </InputAdornment>
                  )
                }
              }}
              sx={{ maxWidth: isTablet ? '100%' : 400 }}
            />
            
            <Box sx={{ 
              display: 'flex', 
              gap: 1.5,
              flexDirection: isMobile ? 'column' : 'row', 
              alignItems: isMobile ? 'stretch' : 'center',
            }}>
              <ActionButton
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                disableElevation
                onClick={handleCreateChantier}
              >
                Créer Chantier
              </ActionButton>
              
              <IconButton 
                sx={{ 
                  display: { xs: 'none', sm: 'flex' },
                  backgroundColor: alpha(theme.palette.grey[500], 0.1),
                  '&:hover': { backgroundColor: alpha(theme.palette.grey[500], 0.2) }
                }}
              >
                <DateRangeIcon />
              </IconButton>
              
              <IconButton 
                sx={{ 
                  display: { xs: 'none', sm: 'flex' },
                  backgroundColor: alpha(theme.palette.grey[500], 0.1),
                  '&:hover': { backgroundColor: alpha(theme.palette.grey[500], 0.2) }
                }}
              >
                <CustomizeIcon />
              </IconButton>
            </Box>
          </Box>
          
          {/* Tabs Row */}
          <StyledTabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
          >
            <Tab label="Vue d'ensemble" />
            <Tab label="Chantiers" />
            <Tab label="PDPs" />
            <Tab label="Risques" />
            <Tab label="Travailleurs" />
          </StyledTabs>
        </>
      )}
      
      {onlyCreateChantierButton && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          alignItems: 'center',
          mb: 2
        }}>
          <ActionButton
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            disableElevation
            onClick={handleCreateChantier}
          >
            Créer Chantier
          </ActionButton>
        </Box>
      )}
    </HeaderContainer>
  );
};

export default DashboardHeader;