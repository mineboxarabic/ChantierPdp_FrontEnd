// src/pages/BDT/tabs/BdtTabGeneralInfo.tsx
import React from 'react';
import {
    Grid,
    TextField,
    Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { BdtDTO } from '../../../utils/entitiesDTO/BdtDTO';
import { EntrepriseDTO } from '../../../utils/entitiesDTO/EntrepriseDTO';
import { ChantierDTO } from '../../../utils/entitiesDTO/ChantierDTO';

interface BdtTabGeneralInfoProps {
    formData: BdtDTO;
    errors: Record<string, string>;
    entreprisesMap: Map<number, EntrepriseDTO>;
    chantiers: ChantierDTO[];
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDateChange: (name: keyof BdtDTO, date: Date | null) => void;
    onAutocompleteChange: (name: keyof BdtDTO, value: any | null) => void;
}

const BdtTabGeneralInfo: React.FC<BdtTabGeneralInfoProps> = ({
    formData,
    errors,
    entreprisesMap,
    chantiers,
    onInputChange,
    onDateChange,
    onAutocompleteChange
}) => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <TextField
                    label="Nom du Bon de Travail"
                    name="nom"
                    value={formData.nom || ''}
                    onChange={onInputChange}
                    variant="outlined"
                    fullWidth
                    required
                    error={!!errors.nom}
                    helperText={errors.nom}
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <Autocomplete
                    options={Array.from(entreprisesMap.values())}
                    getOptionLabel={(option) => option.nom || ''}
                    value={formData.entrepriseExterieure ? entreprisesMap.get(formData.entrepriseExterieure) || null : null}
                    onChange={(_, newValue) => onAutocompleteChange('entrepriseExterieure', newValue ? newValue.id : null)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Entreprise Extérieure"
                            variant="outlined"
                            fullWidth
                            required
                            error={!!errors.entrepriseExterieure}
                            helperText={errors.entrepriseExterieure}
                        />
                    )}
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <Autocomplete
                    options={chantiers}
                    getOptionLabel={(option) => option.nom || `Chantier #${option.id}`}
                    value={formData.chantier ? chantiers.find(c => c.id === formData.chantier) || null : null}
                    onChange={(_, newValue) => onAutocompleteChange('chantier', newValue ? newValue.id : null)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Chantier"
                            variant="outlined"
                            fullWidth
                            required
                            error={!!errors.chantier}
                            helperText={errors.chantier}
                        />
                    )}
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <DatePicker
                    label="Date du BDT"
                    value={formData.date ? dayjs(formData.date) : null}
                    onChange={(newValue) => onDateChange('date', newValue ? newValue.toDate() : null)}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            variant: 'outlined',
                            error: !!errors.date,
                            helperText: errors.date
                        }
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default BdtTabGeneralInfo;
