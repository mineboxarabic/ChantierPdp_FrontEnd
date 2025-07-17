// src/pages/BDT/tabs/BdtTabComplements.tsx
import React from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Alert,
    Card,
    CardContent,
    FormControlLabel,
    Switch,
    IconButton,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { BdtDTO } from '../../../utils/entitiesDTO/BdtDTO';
import { ComplementOuRappel } from '../../../utils/entitiesDTO/ComplementOuRappel';

interface BdtTabComplementsProps {
    formData: BdtDTO;
    errors: Record<string, string>;
    onOpenDialog: (type: 'complement') => void;
    onRemoveItem: (type: string, index: number) => void;
    onToggleAnswer: (type: string, index: number) => void;
}

const BdtTabComplements: React.FC<BdtTabComplementsProps> = ({
    formData,
    errors,
    onOpenDialog,
    onRemoveItem,
    onToggleAnswer
}) => {
    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Compléments ou rappels</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => onOpenDialog('complement')}
                >
                    Ajouter un complément
                </Button>
            </Box>

            {errors.complementOuRappels && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.complementOuRappels}
                </Alert>
            )}

            {formData.complementOuRappels && formData.complementOuRappels.length > 0 ? (
                <Grid container spacing={2}>
                    {formData.complementOuRappels.map((complement, index) => (
                        <Grid item xs={12} key={`complement-${index}`}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start'
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Typography variant="subtitle1">
                                                Complément #{index + 1}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        onChange={() => onToggleAnswer('complementOuRappels', index)}
                                                        checked={complement.respect || false}
                                                        color="primary"
                                                    />
                                                }
                                                label="Respecté"
                                            />
                                            <IconButton
                                                color="error"
                                                onClick={() => onRemoveItem('complementOuRappels', index)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="body1">
                                        {complement.complement}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Alert severity="info">
                    Aucun complément n'a été ajouté. Utilisez le bouton "Ajouter un complément" pour en ajouter.
                </Alert>
            )}
        </Box>
    );
};

export default BdtTabComplements;
