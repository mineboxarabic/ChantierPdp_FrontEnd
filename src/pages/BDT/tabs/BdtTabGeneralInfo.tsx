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

            <Grid item xs={12} md={6}>
                <TextField
                    label="Horaires de travail"
                    name="horaireDeTravaille"
                    value={formData.horaireDeTravaille || ''}
                    onChange={onInputChange}
                    variant="outlined"
                    fullWidth
                    placeholder="Ex: 8h00 - 17h00"
                    helperText="Précisez les horaires de travail prévus"
                />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    label="Tâches autorisées"
                    name="tachesAuthoriser"
                    value={formData.tachesAuthoriser || ''}
                    onChange={onInputChange}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Décrivez les tâches autorisées pour ce BDT..."
                    helperText="Détaillez les tâches et restrictions spécifiques"
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <Autocomplete
                    options={[
                        { value: true, label: 'Oui' },
                        { value: false, label: 'Non' }
                    ]}
                    getOptionLabel={(option) => option.label}
                    value={formData.personnelDansZone !== undefined ? 
                        (formData.personnelDansZone ? { value: true, label: 'Oui' } : { value: false, label: 'Non' }) : 
                        null}
                    onChange={(_, newValue) => onAutocompleteChange('personnelDansZone', newValue ? newValue.value : null)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Personnel présent dans la zone"
                            variant="outlined"
                            fullWidth
                            helperText="Le personnel de cette zone a-t-il été informé ?"
                        />
                    )}
                />
            </Grid>
        </Grid>
    );
};

export default BdtTabGeneralInfo;
