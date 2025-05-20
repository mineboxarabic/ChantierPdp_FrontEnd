// src/components/ChantierForm/ChantierLocationForm.tsx
import React, { FC, useMemo } from 'react';
import {
    Grid,
    TextField,
    Autocomplete,
    Box,
    Typography,
    Paper,
    Chip,
} from '@mui/material';
import { LocationOn as LocationOnIcon, Map as MapIcon } from '@mui/icons-material';

import { ChantierDTO } from '../../utils/entitiesDTO/ChantierDTO'; // Adjust path
import { LocalisationDTO } from '../../utils/entitiesDTO/LocalisationDTO'; // Adjust path
import { SectionTitle } from '../../pages/Home/styles.js'; // Or your common styled components

interface ChantierLocationFormProps {
    formData: ChantierDTO;
    onInputChange: (field: keyof ChantierDTO, value: any) => void;
    errors: Record<string, string>;
    allLocalisations: LocalisationDTO[];
}

const ChantierLocationForm: FC<ChantierLocationFormProps> = ({
    formData,
    onInputChange,
    errors,
    allLocalisations,
}) => {

    const selectedLocalisation = useMemo(() => {
        return allLocalisations.find(loc => loc.id === formData.localisation) || null;
    }, [formData.localisation, allLocalisations]);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <SectionTitle variant="h6">Localisation du Chantier</SectionTitle>
            </Grid>

            <Grid item xs={12}>
                <Autocomplete
                    options={allLocalisations}
                    getOptionLabel={(option) => option.nom ? `${option.nom} (${option.code || 'N/A'})` : `ID: ${option.id}`}
                    value={selectedLocalisation}
                    onChange={(_, newValue) => {
                        onInputChange('localisation', newValue ? newValue.id : undefined);
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Localisation"
                            required
                            variant="outlined"
                            error={!!errors.localisation}
                            helperText={errors.localisation || "Sélectionnez le lieu où se déroule le chantier."}
                        />
                    )}
                    renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.id}>
                            <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            {option.nom} {option.code && <Chip label={option.code} size="small" sx={{ ml: 1 }} />}
                        </Box>
                    )}
                />
            </Grid>

            {selectedLocalisation && (
                <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ p: 2, mt: 1, backgroundColor: (theme) => theme.palette.grey[50] }}>
                        <Typography variant="subtitle1" gutterBottom component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                            <MapIcon color="primary" sx={{ mr: 1 }} /> Détails de la Localisation Sélectionnée:
                        </Typography>
                        <Typography variant="h6" component="div" sx={{mb:1}}>
                            {selectedLocalisation.nom}
                            {selectedLocalisation.code && <Chip label={selectedLocalisation.code} color="primary" size="small" sx={{ ml: 1.5 }} />}
                        </Typography>
                        
                        {selectedLocalisation.adresse && (
                             <Typography variant="body2" color="text.secondary" sx={{mb: 0.5}}>
                                <strong>Adresse:</strong> {selectedLocalisation.adresse}
                            </Typography>
                        )}
                        {selectedLocalisation.description && (
                            <Typography variant="body2" color="text.secondary">
                                <strong>Description:</strong> {selectedLocalisation.description}
                            </Typography>
                        )}
                         {!selectedLocalisation.adresse && !selectedLocalisation.description && (
                            <Typography variant="body2" color="text.secondary">
                                Aucune description ou adresse supplémentaire fournie pour cette localisation.
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            )}
        </Grid>
    );
};

export default ChantierLocationForm;