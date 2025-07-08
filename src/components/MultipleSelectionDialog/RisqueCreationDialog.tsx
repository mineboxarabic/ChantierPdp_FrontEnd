// src/components/MultipleSelectionDialog/RisqueCreationDialog.tsx
import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    FormControlLabel,
    Checkbox,
    MenuItem,
    Alert,
    Typography,
    Grid,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';

import RisqueDTO from '../../utils/entitiesDTO/RisqueDTO';
import PermiTypes from '../../utils/PermiTypes';
import useRisque from '../../hooks/useRisque';
import { ImageModel } from '../../utils/image/ImageModel';

interface RisqueCreationDialogProps {
    open: boolean;
    onClose: () => void;
    onRiskCreated: (newRisk: RisqueDTO) => void;
}

const RisqueCreationDialog: React.FC<RisqueCreationDialogProps> = ({
    open,
    onClose,
    onRiskCreated
}) => {
    const [formData, setFormData] = useState<Partial<RisqueDTO>>({
        title: '',
        description: '',
        travailleDangereux: false,
        travaillePermit: false,
        permitType: PermiTypes.NONE,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isCreating, setIsCreating] = useState(false);

    const { createRisque } = useRisque();

    const handleInputChange = (field: keyof RisqueDTO, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title?.trim()) {
            newErrors.title = 'Le titre est requis';
        }

        if (!formData.description?.trim()) {
            newErrors.description = 'La description est requise';
        }

        if ((formData.travailleDangereux || formData.travaillePermit) && 
            (!formData.permitType || formData.permitType === PermiTypes.NONE)) {
            newErrors.permitType = 'Le type de permis est requis pour les travaux dangereux';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreate = async () => {
        if (!validateForm()) return;

        setIsCreating(true);
        try {
            // Create default image
            const defaultImage: ImageModel = {
                imageData: '',
                mimeType: 'image/png'
            };

            const newRisque: RisqueDTO = {
                id: undefined,
                title: formData.title!,
                description: formData.description!,
                logo: defaultImage,
                travailleDangereux: formData.travailleDangereux || false,
                travaillePermit: formData.travaillePermit || false,
                permitType: formData.permitType || PermiTypes.NONE,
            };

            const createdRisk = await createRisque(newRisque);
            
            if (createdRisk) {
                onRiskCreated(createdRisk);
                handleReset();
            }
        } catch (error: any) {
            setErrors({ general: error?.message || 'Erreur lors de la création du risque' });
        } finally {
            setIsCreating(false);
        }
    };

    const handleReset = () => {
        setFormData({
            title: '',
            description: '',
            travailleDangereux: false,
            travaillePermit: false,
            permitType: PermiTypes.NONE,
        });
        setErrors({});
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <AddIcon color="primary" />
                    Créer un Nouveau Risque
                </Box>
            </DialogTitle>
            
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    {errors.general && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {errors.general}
                        </Alert>
                    )}

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Titre du Risque"
                                value={formData.title || ''}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                error={!!errors.title}
                                helperText={errors.title}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                value={formData.description || ''}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                error={!!errors.description}
                                helperText={errors.description}
                                required
                                multiline
                                rows={3}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.travailleDangereux || false}
                                        onChange={(e) => handleInputChange('travailleDangereux', e.target.checked)}
                                    />
                                }
                                label="Travail Dangereux"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.travaillePermit || false}
                                        onChange={(e) => handleInputChange('travaillePermit', e.target.checked)}
                                    />
                                }
                                label="Nécessite un Permis"
                            />
                        </Grid>

                        {(formData.travailleDangereux || formData.travaillePermit) && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Type de Permis"
                                    value={formData.permitType || PermiTypes.NONE}
                                    onChange={(e) => handleInputChange('permitType', e.target.value as PermiTypes)}
                                    error={!!errors.permitType}
                                    helperText={errors.permitType || 'Sélectionnez le type de permis requis pour ce risque'}
                                    required
                                >
                                    <MenuItem value={PermiTypes.NONE}>Aucun</MenuItem>
                                    <MenuItem value={PermiTypes.FOUILLE}>Fouille (Travaux d'excavation)</MenuItem>
                                    <MenuItem value={PermiTypes.ATEX}>ATEX (Atmosphère explosive)</MenuItem>
                                    <MenuItem value={PermiTypes.ESPACE_CONFINE}>Espace Confiné</MenuItem>
                                    <MenuItem value={PermiTypes.LEVAGE}>Levage</MenuItem>
                                    <MenuItem value={PermiTypes.HAUTEUR}>Travail en Hauteur</MenuItem>
                                    <MenuItem value={PermiTypes.TOITURE}>Travail sur Toiture</MenuItem>
                                </TextField>
                            </Grid>
                        )}
                    </Grid>

                    <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            Le risque créé sera automatiquement ajouté à votre sélection et pourra être réutilisé dans d'autres documents.
                        </Typography>
                    </Alert>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} startIcon={<CloseIcon />}>
                    Annuler
                </Button>
                <LoadingButton
                    variant="contained"
                    onClick={handleCreate}
                    loading={isCreating}
                    startIcon={<AddIcon />}
                    disabled={!formData.title?.trim() || !formData.description?.trim()}
                >
                    Créer le Risque
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default RisqueCreationDialog;
