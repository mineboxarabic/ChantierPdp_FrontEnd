// src/pages/BDT/tabs/BdtTabSignatures.tsx
import React from 'react';
import {
    Box,
    Typography,
    Alert,
    Button,
    Grid,
    Card,
    CardContent,
    Avatar,
    IconButton
} from '@mui/material';
import {
    Add as AddIcon,
    AccountCircle as AccountCircleIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { BdtDTO } from '../../../utils/entitiesDTO/BdtDTO';

interface BdtTabSignaturesProps {
    formData: BdtDTO;
    errors: Record<string, string>;
    onOpenDialog: (type: 'chargeDeTravail' | 'donneurDOrdre') => void;
}

const BdtTabSignatures: React.FC<BdtTabSignaturesProps> = ({
    formData,
    errors,
    onOpenDialog
}) => {
    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
                Signatures du document
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
                Les signatures permettent de valider et d'officialiser le Bon de Travail.
            </Alert>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Chargé de Travail</Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => onOpenDialog('chargeDeTravail')}
                                >
                                    Ajouter
                                </Button>
                            </Box>
                            
                            {formData.signatures && formData.signatures.length > 0 ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar>
                                        <AccountCircleIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body1">
                                            Signature ajoutée
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ID: {formData.signatures[0]}
                                        </Typography>
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                                    <AccountCircleIcon sx={{ fontSize: 48, mb: 1 }} />
                                    <Typography variant="body2">
                                        Aucune signature du chargé de travail
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Donneur d'Ordre</Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => onOpenDialog('donneurDOrdre')}
                                >
                                    Ajouter
                                </Button>
                            </Box>
                            
                            {formData.donneurDOrdre ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar>
                                        <AccountCircleIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body1">
                                            Donneur d'ordre défini
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ID: {formData.donneurDOrdre}
                                        </Typography>
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                                    <AccountCircleIcon sx={{ fontSize: 48, mb: 1 }} />
                                    <Typography variant="body2">
                                        Aucun donneur d'ordre défini
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {errors.signatures && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {errors.signatures}
                </Alert>
            )}

            {errors.donneurDOrdre && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {errors.donneurDOrdre}
                </Alert>
            )}
        </Box>
    );
};

export default BdtTabSignatures;
