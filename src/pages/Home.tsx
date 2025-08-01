import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  CircularProgress,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  Divider,
  Button,
  LinearProgress,
  IconButton,
} from '@mui/material';
import {
  Construction as ConstructionIcon,
  AssignmentLate as AssignmentLateIcon,
  WarningAmber as WarningAmberIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  ChevronRight as ChevronRightIcon,
  NotificationsActive as NotificationsActiveIcon,
} from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';

// Import your specific DTOs and hooks if needed for data fetching
// Example imports (adjust paths and names based on your project structure):
// import useChantier from '../hooks/useChantier';
// import usePdp from '../hooks/usePdp';
// import useRisque from '../hooks/useRisque';
// import useWorker from '../hooks/useWoker';
// import ChantierDTO from '../utils/entitiesDTO/ChantierDTO';
// import { PdpDTO } from '../utils/entitiesDTO/PdpDTO';
// import RisqueDTO from '../utils/entitiesDTO/RisqueDTO';
// import WorkerDTO from '../utils/entitiesDTO/WorkerDTO';

// Styled component for consistent Card appearance
const DashboardCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
}));

const DashboardPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  border: `1px solid ${theme.palette.divider}`,
   boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
}));

const Home: React.FC = () => {
  const theme = useTheme();
  // --- Example State and Data Fetching (Replace with your actual logic) ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Example State (replace with fetched data)
  const [activeChantiersCount, setActiveChantiersCount] = useState(5); // Example
  const [pendingPdpsCount, setPendingPdpsCount] = useState(2); // Example
  const [highRisksCount, setHighRisksCount] = useState(3); // Example
  const [assignedWorkersCount, setAssignedWorkersCount] = useState(12); // Example

  const [recentChantiers, setRecentChantiers] = useState([ // Example data
    { id: 1, nom: 'Chantier Alpha', operation: 'Opération Principale', dateFin: new Date(2025, 4, 1), status: 'Actif' },
    { id: 2, nom: 'Site Bêta', operation: 'Maintenance', dateFin: new Date(2025, 3, 15), status: 'En cours' },
    { id: 3, nom: 'Projet Gamma', operation: 'Nouvelle Construction', dateFin: new Date(2025, 8, 30), status: 'Planifié' },
  ]);
  const [pendingPdps, setPendingPdps] = useState([ // Example data
    { id: 101, chantier: 1, entrepriseExterieure: 201, status: 'Signature Requise', entrepriseNom: 'EE Externe A' },
    { id: 102, chantier: 2, entrepriseExterieure: 202, status: 'Validation Requise', entrepriseNom: 'Autre EE B' },
  ]);
  const [keyRisks, setKeyRisks] = useState([ // Example data
      { id: 301, title: 'Travail en Hauteur', level: 'Élevé', chantier: 'Chantier Alpha'},
      { id: 302, title: 'Risque Électrique', level: 'Moyen', chantier: 'Site Bêta'},
      { id: 303, title: 'Espaces Confinés', level: 'Élevé', chantier: 'Chantier Alpha'},
  ]);

  /*
  // const { getAllChantiers } = useChantier();
  // const { getRecentPdps } = usePdp();
  // const { getAllRisques } = useRisque();
  // const { getAllWorkers } = useWorker(); // Or a specific query for assigned workers

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // --- Fetch all necessary data in parallel ---
        // const [chantiersData, pdpsData, risquesData, workersData] = await Promise.all([
        //   getAllChantiers(), // Or a query for active ones
        //   getRecentPdps(), // Or a query for pending ones
        //   getAllRisques(), // Or a query for high risks
        //   getAllWorkers(), // Or a query for assigned ones
        // ]);

        // --- Process and set state ---
        // setActiveChantiersCount(chantiersData.filter(c => c.status === 'Actif').length); // Example processing
        // setPendingPdpsCount(pdpsData.filter(p => p.status === 'PENDING').length); // Example processing
        // setHighRisksCount(risquesData.filter(r => r.level === 'Élevé').length); // Example processing
        // setAssignedWorkersCount(workersData.length); // Example processing

        // setRecentChantiers(chantiersData.slice(0, 3)); // Example: show top 3
        // setPendingPdps(pdpsData.filter(p => ['PENDING_SIGNATURE', 'PENDING_VALIDATION'].includes(p.status))); // Example: filter pending actions
        // setKeyRisks(risquesData.filter(r => r.level === 'Élevé').slice(0, 3)); // Example: top 3 high risks

      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data.');
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    // fetchData();
  }, []); // Add dependencies like getAllChantiers etc. if they aren't stable references
  */

  // --- Render Logic ---
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography color="error">Error loading dashboard: {error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4, backgroundColor: theme.palette.background.default, p: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom component="h1" sx={{ mb: 3, fontWeight: 'bold' }}>
        Tableau de Bord
      </Typography>
      <Grid container spacing={3}>
        {/* == Summary Cards == */}
        {[
          { title: 'Chantiers Actifs', value: activeChantiersCount, icon: <ConstructionIcon fontSize="large" color="primary" />, color: theme.palette.primary.light },
          { title: 'PDPs en Attente', value: pendingPdpsCount, icon: <AssignmentLateIcon fontSize="large" color="warning" />, color: theme.palette.warning.light },
          { title: 'Risques Élevés', value: highRisksCount, icon: <WarningAmberIcon fontSize="large" color="error" />, color: theme.palette.error.light },
          { title: 'Ouvriers Assignés', value: assignedWorkersCount, icon: <PeopleIcon fontSize="large" color="success" />, color: theme.palette.success.light },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <DashboardCard elevation={0}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1 }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom sx={{ fontWeight: 'medium' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {item.value}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: item.color, width: 56, height: 56 }}>
                  {item.icon}
                </Avatar>
              </CardContent>
            </DashboardCard>
          </Grid>
        ))}

        {/* == Recent Chantiers Section == */}
        <Grid item xs={12} lg={7}>
          <DashboardPaper elevation={0}>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" component="h2">Chantiers Récents</Typography>
                <Button size="small" endIcon={<ChevronRightIcon />}>Voir Tout</Button>
             </Box>
            <Divider sx={{ mb: 2 }} />
            <List disablePadding>
              {recentChantiers.length > 0 ? recentChantiers.map((chantier) => (
                <ListItem key={chantier.id} disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                      <ConstructionIcon fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={chantier.nom}
                    secondary={`${chantier.operation} - Fin: ${chantier.dateFin?.toLocaleDateString() ?? 'N/A'}`}
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                  <Chip label={chantier.status} size="small" color={chantier.status === 'Actif' ? 'success' : chantier.status === 'Planifié' ? 'info' : 'warning'} variant="outlined" />
                </ListItem>
              )) : <Typography color="text.secondary" sx={{p: 2}}>Aucun chantier récent.</Typography>}
            </List>
          </DashboardPaper>
        </Grid>

        {/* == PDPs Requiring Action Section == */}
        <Grid item xs={12} lg={5}>
          <DashboardPaper elevation={0}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                 <Typography variant="h6" component="h2">PDPs en Attente</Typography>
                <Button size="small" endIcon={<ChevronRightIcon />}>Voir Tout</Button>
             </Box>
            <Divider sx={{ mb: 2 }} />
            <List disablePadding>
              {pendingPdps.length > 0 ? pendingPdps.map((pdp) => (
                <ListItem key={pdp.id} disablePadding sx={{ mb: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar sx={{ bgcolor: pdp.status === 'Validation Requise' ? 'error.light' : 'warning.light', width: 32, height: 32 }}>
                      <AssignmentLateIcon fontSize="small"/>
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={`PDP Chantier ${pdp.chantier} - ${pdp.entrepriseNom}`} // You might need to fetch names
                    secondary={pdp.status}
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                   />
                    <Button variant="contained" size="small" sx={{ ml: 1 }}>
                        Action
                    </Button>
                </ListItem>
              )) : <Typography color="text.secondary" sx={{p: 2}}>Aucun PDP en attente.</Typography>}
            </List>
          </DashboardPaper>
        </Grid>

         {/* == Risk Overview Section (Example Placeholder) == */}
         <Grid item xs={12} md={6}>
          <DashboardPaper elevation={0}>
            <Typography variant="h6" component="h2" gutterBottom>Aperçu des Risques</Typography>
            <Divider sx={{ mb: 2 }} />
             {keyRisks.length > 0 ? keyRisks.map((risk) => (
                <Box key={risk.id} sx={{ display: 'flex', alignItems: 'center', mb: 1.5, '&:last-child': { mb: 0 } }}>
                   <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar sx={{ bgcolor: risk.level === 'Élevé' ? 'error.main' : 'warning.main', width: 32, height: 32 }}>
                      <WarningAmberIcon fontSize="small"/>
                    </Avatar>
                  </ListItemIcon>
                   <ListItemText
                    primary={risk.title}
                    secondary={`Chantier: ${risk.chantier} - Niveau: ${risk.level}`}
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                   />
                   <IconButton size="small">
                      <ChevronRightIcon />
                   </IconButton>
                </Box>
             )) : <Typography color="text.secondary" sx={{p: 2}}>Aucun risque majeur identifié.</Typography>}
             {/* Placeholder for a simple bar chart or more detailed list */}
             {/* <Box sx={{ height: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', mt: 2 }}>
                 <Box sx={{ width: '20%', height: '60%', bgcolor: 'primary.light', borderRadius: '4px 4px 0 0' }}></Box>
                 <Box sx={{ width: '20%', height: '80%', bgcolor: 'warning.light', borderRadius: '4px 4px 0 0' }}></Box>
                 <Box sx={{ width: '20%', height: '40%', bgcolor: 'error.light', borderRadius: '4px 4px 0 0' }}></Box>
             </Box> */}
          </DashboardPaper>
        </Grid>

         {/* == Quick Actions / Notifications (Example Placeholder) == */}
         <Grid item xs={12} md={6}>
          <DashboardPaper elevation={0}>
             <Typography variant="h6" component="h2" gutterBottom>Notifications / Actions Rapides</Typography>
             <Divider sx={{ mb: 2 }} />
            <List disablePadding>
                <ListItem>
                    <ListItemIcon><NotificationsActiveIcon color="action" /></ListItemIcon>
                    <ListItemText primary="Inspection requise pour Chantier Alpha" secondary="Demain" />
                </ListItem>
                 <ListItem>
                    <ListItemIcon><NotificationsActiveIcon color="action" /></ListItemIcon>
                    <ListItemText primary="Nouveau travailleur ajouté: J. Dupont" secondary="Aujourd'hui" />
                </ListItem>
            </List>
            <Box sx={{ mt: 2, display: 'flex', gap: 1}}>
                <Button variant="outlined" size="small">Créer Chantier</Button>
                <Button variant="outlined" size="small">Créer PDP</Button>
            </Box>
          </DashboardPaper>
        </Grid>

      </Grid>
    </Container>
  );
};

export default Home;