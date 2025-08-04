import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    IconButton,
    Avatar,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Snackbar,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tooltip,
    Fab,
    SelectChangeEvent
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    VerifiedUser,
    Save,
    Cancel,
    CloudUpload,
    Visibility,
    Search,
    FilterList
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import useAuditSecu from '../hooks/useAuditSecu';
import { AuditSecuDTO } from '../utils/entitiesDTO/AuditSecuDTO';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
    },
}));

interface AuditManagerProps {
    onAuditUpdated?: () => void;
    initialFilter?: string;
    viewMode?: 'table' | 'cards';
}

const AuditManager: React.FC<AuditManagerProps> = ({
    onAuditUpdated,
    initialFilter = '',
    viewMode = 'cards'
}) => {
    const [audits, setAudits] = useState<AuditSecuDTO[]>([]);
    const [filteredAudits, setFilteredAudits] = useState<AuditSecuDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingAudit, setEditingAudit] = useState<AuditSecuDTO | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>(initialFilter);
    
    // Form state
    const [formData, setFormData] = useState<Partial<AuditSecuDTO>>({
        title: '',
        description: '',
        typeOfAudit: 'INTERVENANTS'
    });
    
    // Snackbar state
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'warning' | 'info'
    });

    const auditHook = useAuditSecu();

    // Load audits on component mount
    useEffect(() => {
        loadAudits();
    }, []);

    // Filter audits when search term or type filter changes
    useEffect(() => {
        filterAudits();
    }, [audits, searchTerm, typeFilter]);

    const loadAudits = async () => {
        setLoading(true);
        try {
            const result = await auditHook.getAllAuditSecus();
            setAudits(result || []);
        } catch (error) {
            showSnackbar('Erreur lors du chargement des audits', 'error');
            console.error('Error loading audits:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterAudits = () => {
        let filtered = audits;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(audit =>
                audit.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                audit.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by type
        if (typeFilter) {
            filtered = filtered.filter(audit => audit.typeOfAudit === typeFilter);
        }

        setFilteredAudits(filtered);
    };

    const handleOpenDialog = (audit?: AuditSecuDTO) => {
        if (audit) {
            setEditingAudit(audit);
            setFormData({
                title: audit.title,
                description: audit.description,
                typeOfAudit: audit.typeOfAudit
            });
        } else {
            setEditingAudit(null);
            setFormData({
                title: '',
                description: '',
                typeOfAudit: 'INTERVENANTS'
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingAudit(null);
        setFormData({
            title: '',
            description: '',
            typeOfAudit: 'INTERVENANTS'
        });
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.description) {
            showSnackbar('Veuillez remplir tous les champs obligatoires', 'warning');
            return;
        }

        setLoading(true);
        try {
            if (editingAudit) {
                // Update existing audit
                const updatedAudit = await auditHook.updateAuditSecu(formData as AuditSecuDTO, editingAudit.id!);
                
                if (updatedAudit) {
                    setAudits(prev => prev.map(a => a.id === updatedAudit.id ? updatedAudit : a));
                    showSnackbar('Audit mis à jour avec succès', 'success');
                }
            } else {
                // Create new audit
                const newAudit = await auditHook.createAuditSecu(formData as AuditSecuDTO);
                
                if (newAudit) {
                    setAudits(prev => [...prev, newAudit]);
                    showSnackbar('Audit créé avec succès', 'success');
                }
            }
            
            handleCloseDialog();
            onAuditUpdated?.();
        } catch (error) {
            showSnackbar('Erreur lors de la sauvegarde', 'error');
            console.error('Error saving audit:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (audit: AuditSecuDTO) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet audit ?')) {
            return;
        }

        setLoading(true);
        try {
            const success = await auditHook.deleteAuditSecu(audit.id!);
            
            if (success) {
                setAudits(prev => prev.filter(a => a.id !== audit.id));
                showSnackbar('Audit supprimé avec succès', 'success');
                onAuditUpdated?.();
            }
        } catch (error) {
            showSnackbar('Erreur lors de la suppression', 'error');
            console.error('Error deleting audit:', error);
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'INTERVENANTS':
                return 'Intervenants';
            case 'OUTILS':
                return 'Outils';
            default:
                return type || 'Non spécifié';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'INTERVENANTS':
                return 'primary';
            case 'OUTILS':
                return 'secondary';
            default:
                return 'default';
        }
    };

    const renderCardsView = () => (
        <Grid container spacing={3}>
            {filteredAudits.map((audit) => (
                <Grid item xs={12} sm={6} md={4} key={audit.id}>
                    <StyledCard>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                    <VerifiedUser />
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" noWrap>
                                        {audit.title}
                                    </Typography>
                                    <Chip
                                        label={getTypeLabel(audit.typeOfAudit || '')}
                                        color={getTypeColor(audit.typeOfAudit || '') as any}
                                        size="small"
                                    />
                                </Box>
                            </Box>
                            
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mb: 2,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}
                            >
                                {audit.description}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Tooltip title="Modifier">
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenDialog(audit)}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Supprimer">
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(audit)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>
            ))}
        </Grid>
    );

    const renderTableView = () => (
        <TableContainer component={Paper} sx={{ borderRadius: '16px' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Titre</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredAudits.map((audit) => (
                        <TableRow key={audit.id} hover>
                            <TableCell>
                                <Typography variant="subtitle2">
                                    {audit.title}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={getTypeLabel(audit.typeOfAudit || '')}
                                    color={getTypeColor(audit.typeOfAudit || '') as any}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        maxWidth: 300,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {audit.description}
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Tooltip title="Modifier">
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenDialog(audit)}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Supprimer">
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(audit)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Gestion des Audits de Sécurité
                </Typography>
                
                {/* Filters and Search */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Rechercher un audit..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Filtrer par type</InputLabel>
                            <Select
                                value={typeFilter}
                                label="Filtrer par type"
                                onChange={(e: SelectChangeEvent) => setTypeFilter(e.target.value)}
                            >
                                <MenuItem value="">Tous les types</MenuItem>
                                <MenuItem value="INTERVENANTS">Intervenants</MenuItem>
                                <MenuItem value="OUTILS">Outils</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => handleOpenDialog()}
                            sx={{ height: '56px' }}
                        >
                            Ajouter
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* Content */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress size={60} />
                </Box>
            ) : filteredAudits.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '16px' }}>
                    <VerifiedUser sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                        {audits.length === 0 ? 'Aucun audit trouvé' : 'Aucun résultat pour cette recherche'}
                    </Typography>
                    {audits.length === 0 && (
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => handleOpenDialog()}
                        >
                            Créer le premier audit
                        </Button>
                    )}
                </Paper>
            ) : (
                viewMode === 'cards' ? renderCardsView() : renderTableView()
            )}

            {/* Create/Edit Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {editingAudit ? 'Modifier l\'audit' : 'Créer un nouvel audit'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Titre *"
                                value={formData.title || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Type d'audit *</InputLabel>
                                <Select
                                    value={formData.typeOfAudit || 'INTERVENANTS'}
                                    label="Type d'audit *"
                                    onChange={(e: SelectChangeEvent) => setFormData(prev => ({ ...prev, typeOfAudit: e.target.value }))}
                                >
                                    <MenuItem value="INTERVENANTS">Intervenants</MenuItem>
                                    <MenuItem value="OUTILS">Outils</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Description *"
                                value={formData.description || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDialog}
                        startIcon={<Cancel />}
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        startIcon={<Save />}
                        disabled={loading}
                    >
                        {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
                <Alert
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AuditManager;
