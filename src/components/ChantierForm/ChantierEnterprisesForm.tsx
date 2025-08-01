// src/components/ChantierForm/ChantierEnterprisesForm.tsx
import React, { FC, useMemo } from 'react';
import {
    Grid,
    TextField,
    Autocomplete,
    Box,
    Typography,
    IconButton,
    List,
    ListItem as MuiListItem, // Renamed to avoid conflict with our styled ListItem
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    Chip,
    Paper,
    FormHelperText,
} from '@mui/material';
import { Delete as DeleteIcon, Business as BusinessIcon, AddCircleOutline } from '@mui/icons-material';

import { ChantierDTO } from '../../utils/entitiesDTO/ChantierDTO'; // Adjust path
import { EntrepriseDTO } from '../../utils/entitiesDTO/EntrepriseDTO'; // Adjust path
import { SectionTitle, ListItemCard } from '../../pages/Home/styles.js'; // Or your common styled components

interface ChantierEnterprisesFormProps {
    formData: ChantierDTO;
    onInputChange: (field: keyof ChantierDTO, value: any) => void;
    errors: Record<string, string>;
    allEntreprises: EntrepriseDTO[]; // Expecting an array of EntrepriseDTO
}

const ChantierEnterprisesForm: FC<ChantierEnterprisesFormProps> = ({
    formData,
    onInputChange,
    errors,
    allEntreprises,
}) => {

    const selectedEntrepriseUtilisatrice = useMemo(() => {
        return allEntreprises.find(e => e.id === formData.entrepriseUtilisatrice) || null;
    }, [formData.entrepriseUtilisatrice, allEntreprises]);

    const selectedEntreprisesExterieures = useMemo(() => {
        return formData.entrepriseExterieurs?.map(id => allEntreprises.find(e => e.id === id)).filter(Boolean) as EntrepriseDTO[] || [];
    }, [formData.entrepriseExterieurs, allEntreprises]);

    const availableEntreprisesExterieures = useMemo(() => {
        const selectedIds = new Set(formData.entrepriseExterieurs || []);
        if (formData.entrepriseUtilisatrice) {
            selectedIds.add(formData.entrepriseUtilisatrice);
        }
        return allEntreprises.filter(e => !selectedIds.has(e.id as number));
    }, [formData.entrepriseExterieurs, formData.entrepriseUtilisatrice, allEntreprises]);


    const handleAddEntrepriseExterieure = (entreprise: EntrepriseDTO | null) => {
        if (entreprise && entreprise.id) {
            const currentExterieures = formData.entrepriseExterieurs || [];
            if (!currentExterieures.includes(entreprise.id)) {
                onInputChange('entrepriseExterieurs', [...currentExterieures, entreprise.id]);
            }
        }
    };

    const handleRemoveEntrepriseExterieure = (entrepriseId: number) => {
        const updatedExterieures = (formData.entrepriseExterieurs || []).filter(id => id !== entrepriseId);
        onInputChange('entrepriseExterieurs', updatedExterieures);
    };


    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <SectionTitle variant="h6">Gestion des Entreprises</SectionTitle>
            </Grid>

            <Grid item xs={12}>
                <Autocomplete
                    options={allEntreprises}
                    getOptionLabel={(option) => option.nom || `ID: ${option.id}`}
                    value={selectedEntrepriseUtilisatrice}
                    onChange={(_, newValue) => {
                        onInputChange('entrepriseUtilisatrice', newValue ? newValue.id : undefined);
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Entreprise Utilisatrice (EU)"
                            required
                            variant="outlined"
                            error={!!errors.entrepriseUtilisatrice}
                            helperText={errors.entrepriseUtilisatrice || "L'entreprise principale responsable du chantier."}
                        />
                    )}
                    renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.id}>
                             <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            {option.nom} ({option.raisonSociale || 'N/A'})
                        </Box>
                    )}
                />
            </Grid>

            <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                    <Chip label="Entreprises Extérieures (EE)" />
                </Divider>
            </Grid>

            <Grid item xs={12}>
                 <Typography variant="subtitle1" gutterBottom>
                    Ajouter une Entreprise Extérieure:
                </Typography>
                <Autocomplete
                    options={availableEntreprisesExterieures}
                    getOptionLabel={(option) => option.nom || `ID: ${option.id}`}
                    onChange={(_, newValue) => {
                        handleAddEntrepriseExterieure(newValue);
                    }}
                    // The 'value' prop for Autocomplete should be null when used as an "add" mechanism
                    // to prevent it from trying to display a selected item in the input itself.
                    value={null} 
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Rechercher et ajouter une EE"
                            variant="outlined"
                            placeholder="Sélectionnez pour ajouter..."
                            helperText="Entreprises qui interviennent sur le chantier mais ne sont pas l'EU."
                        />
                    )}
                     renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.id}>
                            <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            {option.nom} ({option.raisonSociale || 'N/A'})
                        </Box>
                    )}
                />
                 {errors.entrepriseExterieurs && (
                    <FormHelperText error sx={{ mt: 1 }}>{errors.entrepriseExterieurs}</FormHelperText>
                )}
            </Grid>

            {selectedEntreprisesExterieures.length > 0 && (
                <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                        Entreprises Extérieures Sélectionnées:
                    </Typography>
                    <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto', p:1}}>
                        <List dense>
                            {selectedEntreprisesExterieures.map((ee) => (
                                <ListItemCard key={ee.id} sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <BusinessIcon color="primary" sx={{ mr: 1.5 }} />
                                        <Box>
                                        <Typography variant="body1" component="div">{ee.nom}</Typography>
                                        <Typography variant="caption" color="text.secondary">{ee.raisonSociale || 'N/A'} - {ee.numTel || 'N/A'}</Typography>
                                        </Box>
                                    </Box>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => ee.id && handleRemoveEntrepriseExterieure(ee.id)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemCard>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            )}
             {selectedEntreprisesExterieures.length === 0 && (
                <Grid item xs={12}>
                    <Typography color="text.secondary" sx={{ my: 2, textAlign: 'center' }}>
                        Aucune entreprise extérieure ajoutée pour le moment.
                    </Typography>
                </Grid>
            )}

        </Grid>
    );
};

export default ChantierEnterprisesForm;