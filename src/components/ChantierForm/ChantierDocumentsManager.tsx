// src/components/ChantierForm/ChantierDocumentsManager.tsx
import React, { FC, useState } from 'react';
import {
    Grid,
    Box,
    Typography,
    Button,
    List,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Paper,
    Divider,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Alert,
} from '@mui/material';
import {
    Description as DescriptionIcon, // General document icon
    Assignment as PdpIcon,         // Specific for PDP
    Work as BdtIcon,               // Specific for BDT
    AddCircleOutline as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';

import { PdpDTO } from '../../utils/entitiesDTO/PdpDTO';
import { BdtDTO } from '../../utils/entitiesDTO/BdtDTO'; // Assuming BdtDTO, adjust if needed
import { EntrepriseDTO } from '../../utils/entitiesDTO/EntrepriseDTO';
import { SectionTitle, ListItemCard } from '../../pages/Home/styles.js'; // Adjust path
import { getRoute } from '../../Routes'; // Adjust path
import usePdp from '../../hooks/usePdp'; // For deleting PDPs if needed directly from here
import useBdt from '../../hooks/useBdt';   // For deleting BDTs

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
}) => {
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [actionToConfirm, setActionToConfirm] = useState<(() => void) | null>(null);
    const [dialogContent, setDialogContent] = useState({ title: '', message: ''});

    const { deletePdp: deletePdpHook } = usePdp();
    const { deleteBDT: deleteBdtHook } = useBdt();

    const handleNavigation = async (path: string, requiresChantierSave: boolean) => {
        if (requiresChantierSave && chantierId === undefined && onTriggerSave) {
            setDialogContent({
                title: "Enregistrer le chantier d'abord?",
                message: "Pour créer ou lier ce document, le chantier doit être enregistré. Voulez-vous enregistrer le chantier maintenant?"
            });
            setActionToConfirm(() => async () => {
                try {
                    const savedChantier = await onTriggerSave();
                    if (savedChantier && savedChantier.id) {
                        // If path depends on new chantier ID, it should be constructed in onTriggerSave or use navigate(getRoute('...', {id: savedChantier.id}))
                        // For now, assuming path is static or already has placeholders if needed.
                        // Better to navigate to EDIT_CHANTIER first, then add document from there
                        navigate(getRoute('EDIT_CHANTIER', { id: savedChantier.id })); // Navigate to edit mode
                        // Then user can add document. Or, you could adapt `path` to include the new ID.
                    }
                } catch (error) {
                    console.error("Failed to save chantier before navigation", error);
                    // Show error to user
                }
            });
            setConfirmDialogOpen(true);
        } else if (requiresChantierSave && chantierId === undefined && !onTriggerSave) {
             // Cannot proceed if save is required but no save function provided
            alert("Veuillez d'abord enregistrer le chantier pour ajouter des documents.");
        }
        else {
            navigate(path);
        }
    };

    const handleDeletePdp = (pdpId: number) => {
        setDialogContent({
            title: "Confirmer la Suppression du PDP",
            message: `Êtes-vous sûr de vouloir supprimer ce Plan de Prévention (ID: ${pdpId})? Cette action pourrait être irréversible.`
        });
        setActionToConfirm(() => async () => {
            try {
                await deletePdpHook(pdpId); // Assuming deletePdpHook handles BE deletion
                onPdpIdsChange(currentPdpIds.filter(id => id !== pdpId));
            } catch (error) {
                console.error("Failed to delete PDP", error);
                // Show error to user
            }
        });
        setConfirmDialogOpen(true);
    };

    const handleDeleteBdt = (bdtId: number) => {
         setDialogContent({
            title: "Confirmer la Suppression du BDT",
            message: `Êtes-vous sûr de vouloir supprimer ce Bon de Travail (ID: ${bdtId})? Cette action pourrait être irréversible.`
        });
        setActionToConfirm(() => async () => {
            try {
                await deleteBdtHook(bdtId); // Assuming deleteBdtHook handles BE deletion
                onBdtIdsChange(currentBdtIds.filter(id => id !== bdtId));
            } catch (error) {
                console.error("Failed to delete BDT", error);
                // Show error to user
            }
        });
        setConfirmDialogOpen(true);
    };


    const renderPdpItem = (pdpId: number) => {
        const pdp = allPdpsMap.get(pdpId);
        if (!pdp) return <ListItemCard sx={{mb:1}} key={`pdp-placeholder-${pdpId}`}><ListItemText primary={`PDP ID: ${pdpId} (Données non trouvées)`} /></ListItemCard>;

        const entrepriseExterieure = pdp.entrepriseExterieureId ? allEntreprisesMap.get(pdp.entrepriseExterieureId) : null;
        const status = pdp.status || 'Inconnu'; // Make sure PdpDTO has a status

        return (
            <ListItemCard key={pdp.id} sx={{ mb: 1 }}>
                <PdpIcon color="primary" sx={{ mr: 1.5, alignSelf: 'center' }} />
                <ListItemText
                    primary={`PDP #${pdp.id} - ${entrepriseExterieure ? entrepriseExterieure.nom : 'Non spécifié'}`}
                    secondary={
                        <>
                            Date d'inspection: {pdp.dateInspection ? dayjs(pdp.dateInspection).format('DD/MM/YYYY') : 'Non planifiée'}
                            <br />
                            Statut: <Chip label={status} size="small" color={status === 'Validé' ? 'success' : 'default'} />
                        </>
                    }
                />
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="view" onClick={() => navigate(getRoute('VIEW_PDP', { id: pdp.id }))} color="info">
                        <ViewIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleNavigation(getRoute('EDIT_PDP', { id: pdp.id }), false)} color="primary">
                        <EditIcon />
                    </IconButton>
                     {/* In a real app, "deleting" a PDP might mean unlinking, not hard deleting if it's shared */}
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeletePdp(pdp.id as number)} color="error">
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItemCard>
        );
    };

    const renderBdtItem = (bdtId: number) => {
        const bdt = allBdtsMap.get(bdtId);
        // Ensure BdtDTO has relevant fields like `nom`, `statut`, `dateCreation` etc.
        if (!bdt) return <ListItemCard sx={{mb:1}} key={`bdt-placeholder-${bdtId}`}><ListItemText primary={`BDT ID: ${bdtId} (Données non trouvées)`} /></ListItemCard>;
        
        const bdtName = bdt.nom || `Bon de Travail #${bdt.id}`;
        const bdtRisksCount = bdt.risques?.length || 0; // Assuming BdtDTO has a risques array

        return (
            <ListItemCard key={bdt.id} sx={{ mb: 1 }}>
                <BdtIcon sx={{ mr: 1.5, color: 'secondary.main', alignSelf: 'center' }} />
                <ListItemText
                    primary={bdtName}
                    secondary={
                        <>
                            Risques identifiés: {bdtRisksCount}
                            <br />
                            Créé le: {bdt.dateCreation ? dayjs(bdt.dateCreation).format('DD/MM/YYYY') : 'Date inconnue'}
                        </>
                    }
                />
                <ListItemSecondaryAction>
                     <IconButton edge="end" aria-label="view" onClick={() => navigate(getRoute('VIEW_BDT', { id: bdt.id }))} color="info">
                        <ViewIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleNavigation(getRoute('EDIT_BDT', { id: bdt.id }), false)} color="primary">
                        <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteBdt(bdt.id as number)} color="error">
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItemCard>
        );
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <SectionTitle variant="h6">Gestion des Documents du Chantier</SectionTitle>
                 {!chantierId && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Vous devez enregistrer le chantier avant de pouvoir créer et lier des PDPs ou BDTs.
                    </Alert>
                )}
            </Grid>

            {/* Plans de Prévention (PDP) Section */}
            <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                            <PdpIcon sx={{ mr: 1 }} /> Plans de Prévention (PDP)
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleNavigation(getRoute('CREATE_PDP', { chantierId: chantierId || 'new' }), true)}
                            disabled={!chantierId && !onTriggerSave} // Disable if new chantier and no save function
                        >
                            Nouveau PDP
                        </Button>
                    </Box>
                    {currentPdpIds.length > 0 ? (
                        <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>{currentPdpIds.map(renderPdpItem)}</List>
                    ) : (
                        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>Aucun PDP lié à ce chantier.</Typography>
                    )}
                </Paper>
            </Grid>

            {/* Bons de Travail (BDT) Section */}
            <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                            <BdtIcon sx={{ mr: 1 }} /> Bons de Travail (BDT)
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleNavigation(getRoute('CREATE_BDT', { chantierId: chantierId || 'new' }), true)}
                            disabled={!chantierId && !onTriggerSave}
                        >
                            Nouveau BDT
                        </Button>
                    </Box>
                    {currentBdtIds.length > 0 ? (
                        <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>{currentBdtIds.map(renderBdtItem)}</List>
                    ) : (
                        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>Aucun BDT lié à ce chantier.</Typography>
                    )}
                </Paper>
            </Grid>

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
        </Grid>
    );
};

export default ChantierDocumentsManager;