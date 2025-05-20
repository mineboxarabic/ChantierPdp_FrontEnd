// src/components/ChantierForm/ChantierGeneralInfoForm.tsx
import React, { FC } from 'react';
import {
    Grid,
    TextField,
    FormControlLabel,
    Switch,
    Typography,
    FormHelperText
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import { ChantierDTO } from '../../utils/entitiesDTO/ChantierDTO'; // Adjust path as needed
import { SectionTitle } from '../../pages/Home/styles.js'; // Or your common styled components

interface ChantierGeneralInfoFormProps {
    formData: ChantierDTO;
    onInputChange: (field: keyof ChantierDTO, value: any) => void;
    onDateChange: (field: 'dateDebut' | 'dateFin', value: Date | null) => void;
    errors: Record<string, string>;
}

const ChantierGeneralInfoForm: FC<ChantierGeneralInfoFormProps> = ({
    formData,
    onInputChange,
    onDateChange,
    errors,
}) => {

    const handleNumericInputChange = (field: keyof ChantierDTO, value: string) => {
        const num = value === '' ? null : Number(value); // Allow empty string to clear, otherwise convert to number
        if (num === null || !isNaN(num)) {
            onInputChange(field, num);
        }
    };


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <SectionTitle variant="h6">Informations Générales du Chantier</SectionTitle>
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        label="Nom du chantier"
                        fullWidth
                        required
                        value={formData.nom || ''}
                        onChange={(e) => onInputChange('nom', e.target.value)}
                        error={!!errors.nom}
                        helperText={errors.nom || "Le nom officiel ou descriptif du chantier."}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        label="Opération"
                        fullWidth
                        required
                        multiline
                        rows={1} // Start with 1 row, it can expand if needed or make it fixed
                        value={formData.operation || ''}
                        onChange={(e) => onInputChange('operation', e.target.value)}
                        error={!!errors.operation}
                        helperText={errors.operation || "Description courte de l'opération principale."}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <DatePicker
                        label="Date de début"
                        value={formData.dateDebut ? dayjs(formData.dateDebut) : null}
                        onChange={(date) => onDateChange('dateDebut', date ? date.toDate() : null)}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                required: true,
                                error: !!errors.dateDebut,
                                helperText: errors.dateDebut || "Quand les travaux commencent-ils?"
                            },
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <DatePicker
                        label="Date de fin"
                        value={formData.dateFin ? dayjs(formData.dateFin) : null}
                        onChange={(date) => onDateChange('dateFin', date ? date.toDate() : null)}
                        minDate={formData.dateDebut ? dayjs(formData.dateDebut) : undefined}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                error: !!errors.dateFin,
                                helperText: errors.dateFin || "Quand les travaux sont-ils prévus de finir?"
                            },
                        }}
                    />
                </Grid>
                
                <Grid item xs={12} md={4}>
                    <TextField
                        label="Nombre d'heures (Total estimé)"
                        type="number"
                        fullWidth
                        value={formData.nbHeurs === null || formData.nbHeurs === undefined ? '' : formData.nbHeurs}
                        onChange={(e) => handleNumericInputChange('nbHeurs', e.target.value)}
                        InputProps={{ inputProps: { min: 0 } }}
                        error={!!errors.nbHeurs}
                        helperText={errors.nbHeurs || "Estimation du total d'heures de travail."}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        label="Effectif maximal sur chantier"
                        type="number"
                        fullWidth
                        value={formData.effectifMaxiSurChantier === null || formData.effectifMaxiSurChantier === undefined ? '' : formData.effectifMaxiSurChantier}
                        onChange={(e) => handleNumericInputChange('effectifMaxiSurChantier', e.target.value)}
                        InputProps={{ inputProps: { min: 0 } }}
                        error={!!errors.effectifMaxiSurChantier}
                        helperText={errors.effectifMaxiSurChantier || "Nombre max. de personnes en même temps."}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        label="Nombre d'intérimaires"
                        type="number"
                        fullWidth
                        value={formData.nombreInterimaires === null || formData.nombreInterimaires === undefined ? '' : formData.nombreInterimaires}
                        onChange={(e) => handleNumericInputChange('nombreInterimaires', e.target.value)}
                        InputProps={{ inputProps: { min: 0 } }}
                        error={!!errors.nombreInterimaires}
                        helperText={errors.nombreInterimaires || "Combien de travailleurs temporaires?"}
                    />
                </Grid>

                <Grid item xs={12} sx={{mt: 1}}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.isAnnuelle || false}
                                onChange={(e) => onInputChange('isAnnuelle', e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Chantier Annuel / PDP requis?"
                    />
                     <FormHelperText sx={{ml:0}}>
                        Cochez si c'est un chantier de type annuel ou si un Plan de Prévention (PDP) est d'office requis.
                     </FormHelperText>
                </Grid>

                 <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.travauxDangereux || false}
                                onChange={(e) => onInputChange('travauxDangereux', e.target.checked)}
                                color="error" // Use error color for emphasis on danger
                            />
                        }
                        label="Implique des travaux dangereux?"
                    />
                     <FormHelperText error={formData.travauxDangereux} sx={{ml:0}}>
                        Cochez si le chantier implique des travaux listés comme dangereux (Art. R4512-7 du Code du travail).
                     </FormHelperText>
                </Grid>


            </Grid>
        </LocalizationProvider>
    );
};

export default ChantierGeneralInfoForm;