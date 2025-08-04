import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
    Divider,
    Chip,
    Avatar,
    IconButton,
    Paper,
    Tooltip,
    CircularProgress,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Tab,
    Tabs
} from '@mui/material';
import {
    Close as CloseIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    Engineering as EngineeringIcon,
    Construction as ConstructionIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Assignment as AssignmentIcon,
    Work as WorkIcon,
    DocumentScanner as DocumentScannerIcon
} from '@mui/icons-material';
import { WorkerDTO as Worker } from "../../utils/entitiesDTO/WorkerDTO";
import useWoker from "../../hooks/useWoker.ts";
import useChantier from "../../hooks/useChantier.ts";
import useEntreprise from "../../hooks/useEntreprise.ts";
import usePdp from "../../hooks/usePdp.ts";
import { EntityRef } from "../../components/GenericCRUD/TypeConfig";
import { TabPanel } from '@mui/lab';

interface WorkerModalProps {
    open: boolean;
    onClose: () => void;
    workerId: number | null;
    onEdit?: (worker: Worker) => void;
    onDelete?: (workerId: number) => void;
}

const WorkerModal: React.FC<WorkerModalProps> = ({
                                                     open,
                                                     onClose,
                                                     workerId,
                                                     onEdit,
                                                     onDelete
                                                 }) => {
    const [worker, setWorker] = useState<Worker | null>(null);
    const [currentTab, setCurrentTab] = useState(0);
    const [loading, setLoading] = useState(false);

    const workerService = useWoker();
    const chantierService = useChantier();
    const entrepriseService = useEntreprise();
    const pdpService = usePdp();

    const [entrepriseName, setEntrepriseName] = useState<string>('');
    const [chantiersList, setChantiersList] = useState<any[]>([]);
    const [pdpsList, setPdpsList] = useState<any[]>([]);

    useEffect(() => {
        if (open && workerId) {
            fetchWorkerDetails(workerId);
        } else {
            setWorker(null);
        }
    }, [open, workerId]);

    const fetchWorkerDetails = async (id: number) => {
        setLoading(true);
        try {
            // Fetch worker details
            const workerDetails = await workerService.getWorker(id);
            setWorker(workerDetails);

            // Fetch enterprise details if available
            if (workerDetails.entreprise) {
                const entrepriseDetails = await entrepriseService.getEntreprise(workerDetails.entreprise as number);
                setEntrepriseName(entrepriseDetails?.nom || '');
            }

            
        } catch (error) {
            console.error('Error fetching worker details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = () => {
        if (worker && onEdit) {
            onEdit(worker);
        }
    };

    const handleDeleteClick = () => {
        if (worker && worker.id && onDelete) {
            onDelete(worker.id);
            onClose();
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    if (!open) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component="div">
                        <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Worker Details
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <Divider />

            <DialogContent>
                {loading ? (
                    <Box display="flex" justifyContent="center" my={4}>
                        <CircularProgress />
                    </Box>
                ) : worker ? (
                    <>
                        <Box mb={3}>
                            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <Box display="flex" alignItems="center">
                                            <Avatar
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    bgcolor: 'primary.main',
                                                    mr: 2
                                                }}
                                            >
                                                {worker.prenom?.charAt(0) || ''}{worker.nom?.charAt(0) || ''}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h5" component="div">
                                                    {worker.prenom} {worker.nom}
                                                </Typography>
                                                <Chip
                                                    size="small"
                                                    icon={<BusinessIcon />}
                                                    label={entrepriseName || 'No Company'}
                                                    sx={{ mt: 1 }}
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} md={8}>
                                        <Box display="flex" justifyContent="flex-end">
                                            {onEdit && (
                                                <Tooltip title="Edit Worker">
                                                    <IconButton onClick={handleEditClick} color="primary">
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {onDelete && (
                                                <Tooltip title="Delete Worker">
                                                    <IconButton onClick={handleDeleteClick} color="error">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>

                                        <Box mt={2}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        ID
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {worker.id || 'N/A'}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Assignments
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {chantiersList.length} Chantiers, {pdpsList.length} PDPs
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>

                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                                value={currentTab}
                                onChange={handleTabChange}
                                variant="fullWidth"
                                sx={{ mb: 2 }}
                            >
                                <Tab icon={<ConstructionIcon />} label="Chantiers" />
                                <Tab icon={<AssignmentIcon />} label="PDPs" />
                                
                            </Tabs>
                        </Box>

                        {currentTab === 0 && (
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Assigned Chantiers
                                </Typography>
                                {chantiersList.length > 0 ? (
                                    <Grid container spacing={2}>
                                        {chantiersList.map((chantier) => (
                                            <Grid item xs={12} md={6} key={chantier.id}>
                                                <Card variant="outlined">
                                                    <CardContent>
                                                        <Typography variant="h6" component="div">
                                                            {chantier.nom}
                                                        </Typography>
                                                        <Typography color="text.secondary" gutterBottom>
                                                            {chantier.operation}
                                                        </Typography>
                                                        <Box mt={1}>
                                                            <Typography variant="body2" display="flex" alignItems="center">
                                                                <WorkIcon fontSize="small" sx={{ mr: 1 }} />
                                                                {new Date(chantier.dateDebut).toLocaleDateString()} - {new Date(chantier.dateFin).toLocaleDateString()}
                                                            </Typography>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Typography variant="body1" color="text.secondary">
                                        Not assigned to any chantiers.
                                    </Typography>
                                )}
                            </Box>
                        )}

                        {currentTab === 1 && (
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Associated PDPs
                                </Typography>
                                {pdpsList.length > 0 ? (
                                    <List>
                                        {pdpsList.map((pdp) => (
                                            <ListItem key={pdp.id} divider>
                                                <ListItemIcon>
                                                    <AssignmentIcon />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={`PDP #${pdp.id}`}
                                                    secondary={
                                                        <>
                                                            {pdp.dateInspection && `Inspection: ${new Date(pdp.dateInspection).toLocaleDateString()}`}
                                                            {pdp.entrepriseExterieureEnt?.nom && ` • Entreprise: ${pdp.entrepriseExterieureEnt.nom}`}
                                                        </>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body1" color="text.secondary">
                                        Not associated with any PDPs.
                                    </Typography>
                                )}
                            </Box>
                        )}

                        
                    </>
                ) : (
                    <Typography variant="body1" color="text.secondary" align="center">
                        Worker not found or no worker selected.
                    </Typography>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default WorkerModal;