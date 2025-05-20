// src/pages/PDP/tabs/PdpTabGeneralInfo.tsx
import React, { FC } from 'react';
import { Grid, TextField, Button, Box, Autocomplete, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { PdpDTO } from '../../../utils/entitiesDTO/PdpDTO';
import { EntrepriseDTO } from '../../../utils/entitiesDTO/EntrepriseDTO';
import { SectionTitle } from '../../../pages/Home/styles'; // Your shared SectionTitle

interface PdpTabGeneralInfoProps {
    formData: PdpDTO;
    errors: Record<string, string>;
    entreprisesMap: Map<number, EntrepriseDTO>; // Pass the map for lookups and Autocomplete options
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onDateChange: (name: keyof PdpDTO, date: Date | null) => void;
    onAutocompleteChange: <T>(fieldName: keyof PdpDTO, newValue: T | null) => void;
    onNavigateNext: () => void;
}

const PdpTabGeneralInfo: FC<PdpTabGeneralInfoProps> = ({
    formData,
    errors,
    entreprisesMap,
    onInputChange,
    onDateChange,
    onAutocompleteChange,
    onNavigateNext,
}) => {
    const entreprisesOptions = Array.from(entreprisesMap.values());

    return (
        <>
            <SectionTitle variant="h6" sx={{mb: 2, mt:1}}>Informations Générales et Dates Clés</SectionTitle>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Autocomplete
                        options={entreprisesOptions}
                        getOptionLabel={(option) => option?.nom || ''}
                        value={formData.entrepriseExterieure ? entreprisesMap.get(formData.entrepriseExterieure) : null}
                        onChange={(_, newValue) => onAutocompleteChange('entrepriseExterieure', newValue)}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Entreprise Extérieure *"
                                variant="outlined"
                                fullWidth
                                error={!!errors.entrepriseExterieure}
                                helperText={errors.entrepriseExterieure || ' '}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Autocomplete
                        options={entreprisesOptions}
                        getOptionLabel={(option) => option?.nom || ''}
                        value={formData.entrepriseDInspection ? entreprisesMap.get(formData.entrepriseDInspection) : null}
                        onChange={(_, newValue) => onAutocompleteChange('entrepriseDInspection', newValue)}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Entreprise d'Inspection *"
                                variant="outlined"
                                fullWidth
                                error={!!errors.entrepriseDInspection}
                                helperText={errors.entrepriseDInspection || ' '}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <DatePicker
                        label="Date d'inspection *"
                        value={formData.dateInspection ? dayjs(formData.dateInspection) : null}
                        onChange={(date) => onDateChange('dateInspection', date ? date.toDate() : null)}
                        slotProps={{
                            textField: { fullWidth: true, variant: 'outlined', error: !!errors.dateInspection, helperText: errors.dateInspection || ' ' },
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <DatePicker
                        label="Date ICP *"
                        value={formData.icpdate ? dayjs(formData.icpdate) : null}
                        onChange={(date) => onDateChange('icpdate', date ? date.toDate() : null)}
                        slotProps={{
                            textField: { fullWidth: true, variant: 'outlined', error: !!errors.icpdate, helperText: errors.icpdate || ' ' },
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <DatePicker
                        label="Date prévenir CSSCT *"
                        value={formData.datePrevenirCSSCT ? dayjs(formData.datePrevenirCSSCT) : null}
                        onChange={(date) => onDateChange('datePrevenirCSSCT', date ? date.toDate() : null)}
                        slotProps={{
                            textField: { fullWidth: true, variant: 'outlined', error: !!errors.datePrevenirCSSCT, helperText: errors.datePrevenirCSSCT || ' ' },
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <DatePicker
                        label="Date prévisionnelle d'intervention *"
                        value={formData.datePrev ? dayjs(formData.datePrev) : null}
                        onChange={(date) => onDateChange('datePrev', date ? date.toDate() : null)}
                        slotProps={{
                            textField: { fullWidth: true, variant: 'outlined', error: !!errors.datePrev, helperText: errors.datePrev || ' ' },
                        }}
                    />
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button variant="contained" color="primary" onClick={onNavigateNext}>
                    Suivant
                </Button>
            </Box>
        </>
    );
};

export default PdpTabGeneralInfo;