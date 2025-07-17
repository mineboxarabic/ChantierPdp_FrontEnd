// src/pages/BDT/tabs/BdtTabRisques.tsx
import React from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Alert,
    Card,
    CardContent,
    Avatar,
    FormControlLabel,
    Switch,
    IconButton
} from '@mui/material';
import {
    Add as AddIcon,
    Warning as WarningIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { BdtDTO } from '../../../utils/entitiesDTO/BdtDTO';
import RisqueDTO from '../../../utils/entitiesDTO/RisqueDTO';
import { ObjectAnsweredDTO } from '../../../utils/entitiesDTO/ObjectAnsweredDTO';
import ObjectAnsweredObjects from '../../../utils/ObjectAnsweredObjects';

interface BdtTabRisquesProps {
    formData: BdtDTO;
    errors: Record<string, string>;
    risquesMap: Map<number, RisqueDTO>;
    onOpenDialog: (type: 'risques') => void;
    onRemoveRisque: (risqueId: number) => void;
    onToggleRisqueAnswer: (risqueId: number) => void;
}

const BdtTabRisques: React.FC<BdtTabRisquesProps> = ({
    formData,
    errors,
    risquesMap,
    onOpenDialog,
    onRemoveRisque,
    onToggleRisqueAnswer
}) => {
    // Get risques from relations
    const getRisquesFromRelations = (): { relation: ObjectAnsweredDTO; risque: RisqueDTO }[] => {
        if (!formData.relations) return [];
        
        return formData.relations
            .filter(rel => rel.objectType === ObjectAnsweredObjects.RISQUE)
            .map(rel => {
                const existingRisque = Array.from(risquesMap.values()).find(r => r.id === rel.objectId);
                // If risque not found in local map, create a temporary one for display
                const risque = existingRisque || {
                    id: rel.objectId,
                    title: `Risque #${rel.objectId}`,
                    description: "Risque récemment créé"
                } as RisqueDTO;
                
                return {
                    relation: rel,
                    risque: risque
                };
            })
            .filter(item => item.risque); // Filter out any undefined risques
    };

    const risquesFromRelations = getRisquesFromRelations();

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Risques identifiés</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => onOpenDialog('risques')}
                >
                    Ajouter un risque
                </Button>
            </Box>

            {errors.relations && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.relations}
                </Alert>
            )}

            {risquesFromRelations.length > 0 ? (
                <Grid container spacing={2}>
                    {risquesFromRelations.map((item, index) => {
                        const { relation, risque } = item;
                        return (
                            <Grid item xs={12} md={6} key={`risque-${relation.objectId}`}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{
                                                    bgcolor: relation.answer ? 'success.main' : 'grey.500',
                                                    mr: 2
                                                }}>
                                                    <WarningIcon />
                                                </Avatar>
                                                <Typography variant="subtitle1">
                                                    {risque?.title || `Risque #${index + 1}`}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={relation.answer || false}
                                                            onChange={() => onToggleRisqueAnswer(relation.objectId)}
                                                            color="primary"
                                                        />
                                                    }
                                                    label="Applicable"
                                                />
                                                <IconButton
                                                    color="error"
                                                    onClick={() => onRemoveRisque(relation.objectId)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                        {risque?.description && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                                {risque.description}
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            ) : (
                <Alert severity="info">
                    Aucun risque n'a été ajouté. Utilisez le bouton "Ajouter un risque" pour en ajouter.
                </Alert>
            )}
        </Box>
    );
};

export default BdtTabRisques;
