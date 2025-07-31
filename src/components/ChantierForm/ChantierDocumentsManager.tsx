import React, { FC, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    Paper,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Alert,
    Stack,
    Card,
    CardContent,
    CardActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import {
    Assignment as PdpIcon,         // Specific for PDP
    Work as BdtIcon,               // Specific for BDT
    AddCircleOutline as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    FileCopy as DuplicateIcon,
    Add as NewIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';

import { PdpDTO } from '../../utils/entitiesDTO/PdpDTO';
import { BdtDTO } from '../../utils/entitiesDTO/BdtDTO';
import { EntrepriseDTO } from '../../utils/entitiesDTO/EntrepriseDTO';
import { DocumentStatus } from '../../utils/enums/DocumentStatus';
import { ActionType } from '../../utils/enums/ActionType';
import { SectionTitle } from '../../pages/Home/styles.js'; // Adjust path
import { getRoute } from '../../Routes'; // Adjust path
import usePdp from '../../hooks/usePdp'; // For deleting PDPs if needed directly from here
import useBdt from '../../hooks/useBdt';   // For deleting BDTs
import useDocument from '../../hooks/useDocument'; // For duplicating documents

interface ChantierDocumentsManagerProps {
    chantierId?: number; // ID of the current chantier, crucial for new docs
    currentPdpIds: number[];
    currentBdtIds: number[];
    onPdpIdsChange: (ids: number[]) => void;
    onBdtIdsChange: (ids: number[]) => void;
    allPdpsMap: Map<number, PdpDTO>; // All PDPs loaded in the wrapper
    allBdtsMap: Map<number, BdtDTO>;   // All BDTs loaded in the wrapper
    allEntreprisesMap: Map<number, EntrepriseDTO>; // For PDP details
    navigate: (path: string) => void;
    onTriggerSave?: () => Promise<any>; // Optional: To save chantier before navigating
    needPdp?: boolean; // Optional: To indicate if PDP is needed
    onUpdateBdtsMap?: (newBdt: BdtDTO) => void; // Optional: To update BDTs map with new data
    onUpdatePdpsMap?: (newPdp: PdpDTO) => void; // Optional: To update PDPs map with new data
}

const ChantierDocumentsManager: FC<ChantierDocumentsManagerProps> = ({
    chantierId,
    currentPdpIds,
    currentBdtIds,
    onPdpIdsChange,
    onBdtIdsChange,
    allPdpsMap,
    allBdtsMap,
    allEntreprisesMap,
    navigate,
    onTriggerSave,
    needPdp,
    onUpdateBdtsMap,
    onUpdatePdpsMap
}) => {
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [actionToConfirm, setActionToConfirm] = useState<(() => void) | null>(null);
    const [dialogContent, setDialogContent] = useState({ title: '', message: ''});
    const [pdpCreateDialogOpen, setPdpCreateDialogOpen] = useState(false);

    const { deletePdp: deletePdpHook } = usePdp();
    const { deleteBDT: deleteBdtHook } = useBdt();
    const { duplicateDocument } = useDocument();

    // Helper function to get status chip color
    const getStatusColor = (status?: DocumentStatus) => {
        switch (status) {
            case DocumentStatus.ACTIVE:
                return 'success';
            case DocumentStatus.COMPLETED:
                return 'info';
            case DocumentStatus.NEEDS_ACTION:
                return 'warning';
            case DocumentStatus.EXPIRED:
            case DocumentStatus.CANCELED:
                return 'error';
            case DocumentStatus.DRAFT:
                return 'default';
            default:
                return 'default';
        }
    };

    // Helper function to get action type display
    const getActionTypeInfo = (actionType?: ActionType) => {
        switch (actionType) {
            case ActionType.SIGNATURES_MISSING:
                return { text: 'Signatures manquantes', icon: <WarningIcon fontSize="small" />, color: 'warning' as const };
            case ActionType.PERMIT_MISSING:
                return { text: 'Permis manquant', icon: <WarningIcon fontSize="small" />, color: 'error' as const };
            case ActionType.NONE:
                return { text: 'Aucune action requise', icon: <CheckCircleIcon fontSize="small" />, color: 'success' as const };
            default:
                return null;
        }
    };

    // Helper function to format status text
    const getStatusText = (status?: DocumentStatus) => {
        switch (status) {
            case DocumentStatus.ACTIVE:
                return 'Actif';
            case DocumentStatus.COMPLETED:
                return 'Terminé';
            case DocumentStatus.NEEDS_ACTION:
                return 'Action requise';
            case DocumentStatus.EXPIRED:
                return 'Expiré';
            case DocumentStatus.CANCELED:
                return 'Annulé';
            case DocumentStatus.DRAFT:
                return 'Brouillon';
            default:
                return 'Statut inconnu';
        }
    };

    const handleNavigation = async (path: string, requiresChantierSave: boolean) => {
        const shouldSaveFirst = requiresChantierSave && chantierId === undefined && onTriggerSave;
        const cannotProceed = requiresChantierSave && chantierId === undefined && !onTriggerSave;
        
        if (shouldSaveFirst) {
            const executeSaveAndNavigate = async () => {
                try {
                    const savedChantier = await onTriggerSave();
                    if (savedChantier?.id) {
                        navigate(getRoute('EDIT_CHANTIER', { id: savedChantier.id }));
                    }
                } catch (error) {
                    console.error("Failed to save chantier before navigation", error);
                }
            };

            setDialogContent({
                title: "Enregistrer le chantier d'abord?",
                message: "Pour créer ou lier ce document, le chantier doit être enregistré. Voulez-vous enregistrer le chantier maintenant?"
            });
            setActionToConfirm(() => executeSaveAndNavigate);
            setConfirmDialogOpen(true);
        } else if (cannotProceed) {
            alert("Veuillez d'abord enregistrer le chantier pour ajouter des documents.");
        } else {
            navigate(path);
        }
    };

    const executeDocumentDelete = async (
        docId: number,
        deleteHook: (id: number) => Promise<any>,
        updateIds: (ids: number[]) => void,
        currentIds: number[]
    ) => {
        try {
            await deleteHook(docId);
            const updatedIds = currentIds.filter(id => id !== docId);
            updateIds(updatedIds);
        } catch (error) {
            console.error("Failed to delete document", error);
        }
    };

    const showDeleteConfirmation = (
        docId: number,
        docType: string,
        deleteHook: (id: number) => Promise<any>,
        updateIds: (ids: number[]) => void,
        currentIds: number[]
    ) => {
        setDialogContent({
            title: `Confirmer la Suppression du ${docType}`,
            message: `Êtes-vous sûr de vouloir supprimer ce ${docType} (ID: ${docId})? Cette action pourrait être irréversible.`
        });
        setActionToConfirm(() => () => executeDocumentDelete(docId, deleteHook, updateIds, currentIds));
        setConfirmDialogOpen(true);
    };

    const handleDeletePdp = (pdpId: number) => {
        showDeleteConfirmation(pdpId, 'PDP', deletePdpHook, onPdpIdsChange, currentPdpIds);
    };

    const handleDeleteBdt = (bdtId: number) => {
        showDeleteConfirmation(bdtId, 'BDT', deleteBdtHook, onBdtIdsChange, currentBdtIds);
    };

    const handleDuplicateBdt = async (bdtId: number) => {
        try {
            const duplicatedBdt = await duplicateDocument(bdtId);
                console.log('Duplicated BDT:', duplicatedBdt);
            if (duplicatedBdt?.id) {
                // Update the BDTs map with the new BDT data
                if (onUpdateBdtsMap) {
                    onUpdateBdtsMap(duplicatedBdt);
                }
                
                // Add the duplicated BDT to the current list
                const updatedBdtIds = [...currentBdtIds, duplicatedBdt.id];
                onBdtIdsChange(updatedBdtIds);
            }
        } catch (error) {
            console.error('Error duplicating BDT:', error);
        }
    };

    const handleDuplicatePdp = async (pdpId: number) => {
        try {
            const duplicatedPdp = await duplicateDocument(pdpId);
            if (duplicatedPdp?.id) {
                // Update the PDPs map with the new PDP data
                if (onUpdatePdpsMap) {
                    onUpdatePdpsMap(duplicatedPdp);
                }
                
                // Add the duplicated PDP to the current list
                const updatedPdpIds = [...currentPdpIds, duplicatedPdp.id];
                onPdpIdsChange(updatedPdpIds);
            }
        } catch (error) {
            console.error('Error duplicating PDP:', error);
        }
    };

    const handlePdpCreateClick = () => {
        setPdpCreateDialogOpen(true);
    };

    const handleCreateNewPdp = () => {
        setPdpCreateDialogOpen(false);
        handleNavigation(getRoute('CREATE_PDP', { chantierId: chantierId || 'new' }), true);
    };

    const handleDuplicateExistingPdp = () => {
        setPdpCreateDialogOpen(false);
        // For now, just show an alert. You can implement PDP selection logic here
        alert('Sélectionnez un PDP existant à dupliquer. Cette fonctionnalité sera implémentée prochainement.');
    };


    const renderPdpItem = (pdpId: number) => {
        const pdp = allPdpsMap.get(pdpId);
        if (!pdp) return (
            <Card key={`pdp-placeholder-${pdpId}`} sx={{ mb: 2 }}>
                <CardContent>
                    <Typography color="error">PDP ID: {pdpId} (Données non trouvées)</Typography>
                </CardContent>
            </Card>
        );

        const entrepriseExterieure = pdp.entrepriseExterieure ? allEntreprisesMap.get(pdp.entrepriseExterieure) : null;
        const statusText = getStatusText(pdp.status);
        const statusColor = getStatusColor(pdp.status);
        const actionInfo = getActionTypeInfo(pdp.actionType);

        return (
            <Card key={pdp.id} sx={{ mb: 2 }}>
                <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PdpIcon color="primary" />
                            <Typography variant="h6" component="div">
                                PDP #{pdp.id}
                            </Typography>
                            <Chip 
                                label={statusText} 
                                size="small" 
                                color={statusColor}
                                variant="outlined"
                            />
                            {actionInfo && (
                                <Chip 
                                    label={actionInfo.text}
                                    size="small" 
                                    color={actionInfo.color}
                                    icon={actionInfo.icon}
                                    variant="filled"
                                />
                            )}
                        </Box>
                        <CardActions sx={{ p: 0 }}>
                            <IconButton 
                                size="small" 
                                onClick={() => navigate(getRoute('VIEW_PDP', { id: pdp.id }))} 
                                color="info"
                                title="Voir le PDP"
                            >
                                <ViewIcon />
                            </IconButton>
                            <IconButton 
                                size="small" 
                                onClick={() => handleNavigation(getRoute('EDIT_PDP', { id: pdp.id }), false)} 
                                color="primary"
                                title="Modifier le PDP"
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton 
                                size="small" 
                                onClick={() => handleDuplicatePdp(pdp.id as number)} 
                                color="secondary"
                                title="Dupliquer le PDP"
                            >
                                <DuplicateIcon />
                            </IconButton>
                            <IconButton 
                                size="small" 
                                onClick={() => handleDeletePdp(pdp.id as number)} 
                                color="error"
                                title="Supprimer le PDP"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </CardActions>
                    </Box>
                    
                    <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Entreprise:</strong> {entrepriseExterieure?.nom || 'Non spécifiée'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Inspection:</strong> {pdp.dateInspection ? dayjs(pdp.dateInspection).format('DD/MM/YYYY') : 'Non planifiée'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Créé:</strong> {pdp.creationDate ? dayjs(pdp.creationDate).format('DD/MM/YYYY') : 'N/A'}
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        );
    };

    const renderBdtTable = () => {
        if (currentBdtIds.length === 0) {
            return (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    Aucun BDT lié à ce chantier.
                </Typography>
            );
        }

        return (
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Nom</strong></TableCell>
                            <TableCell><strong>Statut</strong></TableCell>
                            <TableCell><strong>Entreprise</strong></TableCell>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell align="center"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentBdtIds.map((bdtId) => {
                            const bdt = allBdtsMap.get(bdtId);
                            if (!bdt) {
                                return (
                                    <TableRow key={`bdt-placeholder-${bdtId}`}>
                                        <TableCell>{bdtId}</TableCell>
                                        <TableCell colSpan={4}>
                                            <Typography color="error">Données non trouvées</Typography>
                                        </TableCell>
                                        <TableCell />
                                    </TableRow>
                                );
                            }

                            const entrepriseExterieure = bdt.entrepriseExterieure ? allEntreprisesMap.get(bdt.entrepriseExterieure) : null;
                            const statusText = getStatusText(bdt.status);
                            const statusColor = getStatusColor(bdt.status);
                            const actionInfo = getActionTypeInfo(bdt.actionType);

                            return (
                                <TableRow key={bdt.id}>
                                    <TableCell>#{bdt.id}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <BdtIcon fontSize="small" color="secondary" />
                                            {bdt.nom || `BDT #${bdt.id}`}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                                            <Chip 
                                                label={statusText} 
                                                size="small" 
                                                color={statusColor}
                                                variant="outlined"
                                            />
                                            {actionInfo && (
                                                <Chip 
                                                    label={actionInfo.text}
                                                    size="small" 
                                                    color={actionInfo.color}
                                                    icon={actionInfo.icon}
                                                    variant="filled"
                                                />
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{entrepriseExterieure?.nom || 'Non spécifiée'}</TableCell>
                                    <TableCell>
                                        {bdt.date ? dayjs(bdt.date).format('DD/MM/YYYY') : 'Non définie'}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => navigate(getRoute('VIEW_BDT', { id: bdt.id }))} 
                                                color="info"
                                                title="Voir le BDT"
                                            >
                                                <ViewIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleNavigation(getRoute('EDIT_BDT', { id: bdt.id }), false)} 
                                                color="primary"
                                                title="Modifier le BDT"
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleDuplicateBdt(bdt.id as number)} 
                                                color="secondary"
                                                title="Dupliquer le BDT"
                                            >
                                                <DuplicateIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleDeleteBdt(bdt.id as number)} 
                                                color="error"
                                                title="Supprimer le BDT"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ mb: 3 }}>
                <SectionTitle variant="h6">Gestion des Documents du Chantier</SectionTitle>
                 {!chantierId && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Vous devez enregistrer le chantier avant de pouvoir créer et lier des PDPs ou BDTs.
                    </Alert>
                )}
            </Box>

            {/* Plans de Prévention (PDP) Section - Cards taking full width */}
            {needPdp && (
                <Box sx={{ mb: 4 }}>
                    <Paper variant="outlined" sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                                <PdpIcon sx={{ mr: 1 }} /> Plans de Prévention (PDP)
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handlePdpCreateClick}
                                disabled={!chantierId && !onTriggerSave}
                            >
                                Nouveau PDP
                            </Button>
                        </Box>
                        
                        {currentPdpIds.length > 0 ? (
                            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                                {currentPdpIds.map(renderPdpItem)}
                            </Box>
                        ) : (
                            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                Aucun PDP lié à ce chantier.
                            </Typography>
                        )}
                    </Paper>
                </Box>
            )}

            {/* Bons de Travail (BDT) Section - Table */}
            <Box>
                <Paper variant="outlined" sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                            <BdtIcon sx={{ mr: 1 }} /> Bons de Travail (BDT)
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                startIcon={<NewIcon />}
                                onClick={() => handleNavigation(getRoute('CREATE_BDT', { chantierId: chantierId || 'new' }), true)}
                                disabled={!chantierId && !onTriggerSave}
                                size="small"
                            >
                                Nouveau BDT
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleNavigation(getRoute('CREATE_BDT', { chantierId: chantierId || 'new' }), true)}
                                disabled={!chantierId && !onTriggerSave}
                            >
                                Ajouter BDT
                            </Button>
                        </Box>
                    </Box>
                    
                    {renderBdtTable()}
                </Paper>
            </Box>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
            >
                <DialogTitle>{dialogContent.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogContent.message}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)} color="inherit">
                        Annuler
                    </Button>
                    <Button
                        onClick={() => {
                            if (actionToConfirm) actionToConfirm();
                            setConfirmDialogOpen(false);
                        }}
                        color="primary"
                        variant="contained"
                    >
                        Confirmer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* PDP Creation Choice Dialog */}
            <Dialog
                open={pdpCreateDialogOpen}
                onClose={() => setPdpCreateDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PdpIcon color="primary" />
                        Créer un nouveau PDP
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 3 }}>
                        Comment souhaitez-vous créer ce nouveau Plan de Prévention ?
                    </DialogContentText>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleCreateNewPdp}
                            sx={{ justifyContent: 'flex-start', p: 2 }}
                        >
                            <Box sx={{ textAlign: 'left' }}>
                                <Typography variant="subtitle1">Créer un nouveau PDP</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Commencer avec un formulaire vierge
                                </Typography>
                            </Box>
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<DuplicateIcon />}
                            onClick={handleDuplicateExistingPdp}
                            sx={{ justifyContent: 'flex-start', p: 2 }}
                        >
                            <Box sx={{ textAlign: 'left' }}>
                                <Typography variant="subtitle1">Dupliquer un PDP existant</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Copier les données d'un PDP existant
                                </Typography>
                            </Box>
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPdpCreateDialogOpen(false)} color="inherit">
                        Annuler
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ChantierDocumentsManager;