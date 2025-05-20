// src/pages/PDP/tabs/PdpTabPermits.tsx
import React, { FC, useMemo } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Button,
    Box,
    Alert,
    Stack,
    Checkbox,
    FormControlLabel,
    IconButton,
    Tooltip,
    Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'; // Icon for Permits

import { PdpDTO } from '../../../utils/entitiesDTO/PdpDTO';
import { PermitDTO } from '../../../utils/entitiesDTO/PermitDTO';
import ObjectAnsweredDTO from '../../../utils/pdp/ObjectAnswered';
import ObjectAnsweredObjects from '../../../utils/ObjectAnsweredObjects';
import { SectionTitle } from '../../../pages/Home/styles';
import { ListItemCard } from '../../../pages/Home/styles'; // Using ListItemCard for consistency

type DialogTypes = 'risques' | 'dispositifs' | 'permits' | 'analyseDeRisques' | 'editAnalyseDeRisque' | '';

interface PdpTabPermitsProps {
    formData: PdpDTO;
    errors: Record<string, string>;
    allPermitsMap: Map<number, PermitDTO>; // Map of all available PermitDTOs
    onOpenDialog: (type: DialogTypes) => void;
    onDeleteRelation: (objectId: number, objectType: ObjectAnsweredObjects) => void;
    onUpdateRelationField: (relationUniqueKey: string | number, field: keyof ObjectAnsweredDTO, value: any) => void;
    onNavigateBack: () => void;
    onNavigateNext: () => void;
}

const PdpTabPermits: FC<PdpTabPermitsProps> = ({
    formData,
    errors,
    allPermitsMap,
    onOpenDialog,
    onDeleteRelation,
    onUpdateRelationField,
    onNavigateBack,
    onNavigateNext,
}) => {
    const permitsRelations = useMemo(() => {
        return formData.relations?.filter(r => r.objectType === ObjectAnsweredObjects.PERMIT && r.answer !== null) ?? [];
    }, [formData.relations]);

    const handleApplicableChange = (relation: ObjectAnsweredDTO, isChecked: boolean) => {
        const uniqueKey = relation.id ?? `${relation.objectId}_${relation.objectType}`;
        onUpdateRelationField(uniqueKey, 'answer', isChecked);
    };

    return (
        <>
            <Paper elevation={2} sx={{ p: {xs:1.5, md:2.5}, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <SectionTitle variant="h6" sx={{ display: 'flex', alignItems: 'center', mb:0, pb:0, '&:after': {display:'none'} }}>
                        <VerifiedUserIcon color="primary" sx={{ mr: 1 }} />
                        Permis de Travail Requis
                    </SectionTitle>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => onOpenDialog('permits')}
                    >
                        Ajouter un Permis
                    </Button>
                </Box>

                {errors.permits && <Alert severity="error" sx={{ mb: 2 }}>{errors.permits}</Alert>}

                {permitsRelations.length > 0 ? (
                    <Stack spacing={1.5}>
                        {permitsRelations.map((relation) => {
                            const permitData = allPermitsMap.get(relation.objectId as number);
                            const relationKey = relation.id ?? `${relation.objectId}_${relation.objectType}`;

                            if (!permitData) {
                                return (
                                    <ListItemCard key={relationKey} sx={{p:1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.7}}>
                                        <Typography variant="body2" color="error">
                                            Permis (ID: {relation.objectId}) non trouvé dans la liste de référence.
                                        </Typography>
                                        <Tooltip title="Retirer ce permis non valide">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => onDeleteRelation(relation.objectId as number, ObjectAnsweredObjects.PERMIT)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </ListItemCard>
                                );
                            }

                            return (
                                <ListItemCard key={relationKey} sx={{p:1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
                                    <Typography variant="subtitle1" sx={{ flexGrow: 1, mr: 1 }}>
                                        {permitData.title || `Permis ID: ${permitData.id}`}
                                        {permitData.description && (
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                {permitData.description}
                                            </Typography>
                                        )}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={relation.answer || false}
                                                    onChange={(e) => handleApplicableChange(relation, e.target.checked)}
                                                    color="primary"
                                                    size="small"
                                                />
                                            }
                                            label="Applicable?"
                                            sx={{mr:1}}
                                        />
                                        <Tooltip title="Retirer ce permis de la liste">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => onDeleteRelation(relation.objectId as number, ObjectAnsweredObjects.PERMIT)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </ListItemCard>
                            );
                        })}
                    </Stack>
                ) : (
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
                        Aucun permis spécifique ajouté pour ce Plan de Prévention. Cliquez sur "Ajouter un Permis" pour en sélectionner.
                    </Typography>
                )}
            </Paper>

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

export default PdpTabPermits;