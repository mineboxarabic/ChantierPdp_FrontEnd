// src/pages/PDP/tabs/PdpTabHorairesDispo.tsx
import React, { FC } from 'react';
import {
    Grid,
    TextField,
    Typography,
    FormControlLabel,
    Switch,
    Box,
    Button,
    Paper,
    Divider,
} from '@mui/material';
import { PdpDTO } from '../../../utils/entitiesDTO/PdpDTO';
import { SectionTitle } from '../../../pages/Home/styles'; // Your shared SectionTitle
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // For Horaires
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'; // For Mise à disposition

interface PdpTabHorairesDispoProps {
    formData: PdpDTO;
    errors: Record<string, string>;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onNavigateBack: () => void;
    onNavigateNext: () => void;
}

const PdpTabHorairesDispo: FC<PdpTabHorairesDispoProps> = ({
    formData,
    errors,
    onInputChange,
    onNavigateBack,
    onNavigateNext,
}) => {
    return (
        <>
            <Grid container spacing={3}>
                {/* Section for Horaires de travail */}
                <Grid item xs={12}>
                    <Paper elevation={2} sx={{ p: {xs: 1.5, md:2.5}, borderRadius: 2 }}>
                        <SectionTitle variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                            Horaires de Travail
                        </SectionTitle>
                        <TextField
                            label="Détails complémentaires sur les horaires"
                            name="horairesDetails" // Make sure this matches PdpDTO field
                            value={formData.horairesDetails || ''}
                            onChange={onInputChange}
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            error={!!errors.horairesDetails}
                            helperText={errors.horairesDetails || "Précisez les plages horaires spécifiques, jours de repos, etc."}
                            sx={{ mb: 2.5 }}
                        />
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={4}>
                                <FormControlLabel
                                    control={<Switch
                                        checked={formData.horaireDeTravail?.enJournee || false}
                                        onChange={onInputChange}
                                        name="horaireDeTravail.enJournee" // Nested path for handler
                                        color="primary"
                                    />}
                                    label="En journée"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControlLabel
                                    control={<Switch
                                        checked={formData.horaireDeTravail?.enNuit || false}
                                        onChange={onInputChange}
                                        name="horaireDeTravail.enNuit"
                                        color="primary"
                                    />}
                                    label="En nuit"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControlLabel
                                    control={<Switch
                                        checked={formData.horaireDeTravail?.samedi || false}
                                        onChange={onInputChange}
                                        name="horaireDeTravail.samedi"
                                        color="primary"
                                    />}
                                    label="Samedi inclus"
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Section for Mise à disposition */}
                <Grid item xs={12}>
                    <Paper elevation={2} sx={{ p: {xs: 1.5, md:2.5}, borderRadius: 2 }}>
                        <SectionTitle variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <MeetingRoomIcon color="primary" sx={{ mr: 1 }} />
                            Mise à Disposition des Locaux et Équipements
                        </SectionTitle>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControlLabel
                                    control={<Switch
                                        checked={formData.misesEnDisposition?.vestiaires || false}
                                        onChange={onInputChange}
                                        name="misesEnDisposition.vestiaires"
                                        color="primary"
                                    />}
                                    label="Vestiaires"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControlLabel
                                    control={<Switch
                                        checked={formData.misesEnDisposition?.sanitaires || false}
                                        onChange={onInputChange}
                                        name="misesEnDisposition.sanitaires"
                                        color="primary"
                                    />}
                                    label="Sanitaires / WC"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControlLabel
                                    control={<Switch
                                        checked={formData.misesEnDisposition?.restaurant || false}
                                        onChange={onInputChange}
                                        name="misesEnDisposition.restaurant"
                                        color="primary"
                                    />}
                                    label="Restaurant / Salle de repas"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControlLabel
                                    control={<Switch
                                        checked={formData.misesEnDisposition?.energie || false}
                                        onChange={onInputChange}
                                        name="misesEnDisposition.energie"
                                        color="primary"
                                    />}
                                    label="Énergie (électricité, eau, etc.)"
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt:2, borderTop: theme => `1px solid ${theme.palette.divider}` }}>
                <Button variant="outlined" onClick={onNavigateBack}>
                    Précédent
                </Button>
                <Button variant="contained" color="primary" onClick={onNavigateNext}>
                    Suivant
                </Button>
            </Box>
        </>
    );
};

export default PdpTabHorairesDispo;