// src/components/Document/tabs/DocumentTabRiskAnalyses.tsx
// Generic tab for managing ANALYSE_DE_RISQUE relations (formerly PdpTabAnalysesRisques)
import React, { useMemo } from 'react';
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
    Avatar,
    Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ShieldIcon from '@mui/icons-material/Shield';
import WarningIcon from '@mui/icons-material/Warning';

import { DocumentDTO } from '../../../utils/entitiesDTO/DocumentDTO';
import { AnalyseDeRisqueDTO } from '../../../utils/entitiesDTO/AnalyseDeRisqueDTO';
import RisqueDTO from '../../../utils/entitiesDTO/RisqueDTO';
import DispositifDTO from '../../../utils/entitiesDTO/DispositifDTO';
import PermitDTO from '../../../utils/entitiesDTO/PermitDTO';
import ObjectAnsweredDTO from '../../../utils/pdp/ObjectAnswered';
import ObjectAnsweredObjects from '../../../utils/ObjectAnsweredObjects';
import { SectionTitle, ListItemCard } from '../../../pages/Home/styles';

type DialogTypes = 'risques' | 'dispositifs' | 'permits' | 'analyseDeRisques' | 'editAnalyseDeRisque' | '';
type DialogData = RisqueDTO | DispositifDTO | PermitDTO | AnalyseDeRisqueDTO | null;

interface DocumentTabRiskAnalysesProps<T extends DocumentDTO> {
    formData: T;
    errors: Record<string, string>;
    allAnalysesMap: Map<number, AnalyseDeRisqueDTO>;
    allRisquesMap: Map<number, RisqueDTO>;
    onOpenDialog: (type: DialogTypes, dataToEdit?: DialogData) => void;
    onDeleteRelation: (objectId: number, objectType: ObjectAnsweredObjects) => void;
    onUpdateRelationField: (relationUniqueKey: string | number, field: keyof ObjectAnsweredDTO, value: any) => void;
}

const DocumentTabRiskAnalyses = <T extends DocumentDTO>({
    formData,
    errors,
    allAnalysesMap,
    allRisquesMap,
    onOpenDialog,
    onDeleteRelation,
    onUpdateRelationField,
}: DocumentTabRiskAnalysesProps<T>) => {
    const analysesRelations = useMemo(() => {
        return formData.relations?.filter(r => r.objectType === ObjectAnsweredObjects.ANALYSE_DE_RISQUE && r.answer !== null) ?? [];
    }, [formData.relations]);

    const handleEeEuChange = (relation: ObjectAnsweredDTO, field: 'ee' | 'eu', isChecked: boolean) => {
        const uniqueKey = relation.id ?? `${relation.objectId}_${relation.objectType}`;
        onUpdateRelationField(uniqueKey, field, isChecked);
    };

    return (
        <>
            <Paper elevation={2} sx={{ p: {xs:1.5, md:2.5}, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <SectionTitle variant="h6" sx={{ display: 'flex', alignItems: 'center', mb:0, pb:0, '&:after': {display:'none'} }}>
                        <ShieldIcon color="primary" sx={{ mr: 1 }} />
                        Analyses des Risques Spécifiques
                    </SectionTitle>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => onOpenDialog('analyseDeRisques')}
                    >
                        Ajouter / Créer Analyse
                    </Button>
                </Box>

                {errors.analyseDeRisques && <Alert severity="error" sx={{ mb: 2 }}>{errors.analyseDeRisques}</Alert>}

                {analysesRelations.length > 0 ? (
                    <Stack spacing={2.5}>
                        {analysesRelations.map((relation) => {
                            const analyseData = allAnalysesMap.get(relation.objectId as number);
                            const relationKey = relation.id ?? `${relation.objectId}_${relation.objectType}`;

                            if (!analyseData) {
                                return (
                                    <ListItemCard key={relationKey} sx={{p:1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.7}}>
                                        <Typography variant="body2" color="error">
                                            Analyse de Risque (ID: {relation.objectId}) non trouvée.
                                        </Typography>
                                        <Tooltip title="Retirer cette analyse non valide">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => onDeleteRelation(relation.objectId as number, ObjectAnsweredObjects.ANALYSE_DE_RISQUE)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </ListItemCard>
                                );
                            }

                            const risqueAssocie = analyseData.risque ? allRisquesMap.get(analyseData.risque.id || 0) : null;

                            return (
                                <ListItemCard key={relationKey} sx={{ p: 2.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', flexGrow: 1 }}>
                                            <Avatar 
                                                sx={{ 
                                                    bgcolor: 'primary.main', 
                                                    mr: 2, 
                                                    mt: 0.5,
                                                    width: 40, 
                                                    height: 40 
                                                }}
                                            >
                                                <ShieldIcon />
                                            </Avatar>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                                                    {analyseData.id ? `Analyse #${analyseData.id}` : 'Analyse de Risque'}
                                                </Typography>
                                                
                                                {risqueAssocie && (
                                                    <Box sx={{ mb: 1 }}>
                                                        <Chip
                                                            icon={<WarningIcon />}
                                                            label={`Risque: ${risqueAssocie.title}`}
                                                            size="small"
                                                            color="warning"
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                )}
                                                
                                                {analyseData.deroulementDesTaches && (
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                        <strong>Déroulement:</strong> {analyseData.deroulementDesTaches.length > 150 
                                                            ? `${analyseData.deroulementDesTaches.substring(0, 150)}...` 
                                                            : analyseData.deroulementDesTaches}
                                                    </Typography>
                                                )}
                                                
                                                {analyseData.mesuresDePrevention && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        <strong>Mesures de prévention:</strong> {analyseData.mesuresDePrevention.length > 150 
                                                            ? `${analyseData.mesuresDePrevention.substring(0, 150)}...` 
                                                            : analyseData.mesuresDePrevention}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={relation.answer || false}
                                                        onChange={(e) => onUpdateRelationField(relationKey, 'answer', e.target.checked)}
                                                        size="small"
                                                    />
                                                }
                                                label="Applicable"
                                                sx={{ mr: 1 }}
                                            />
                                            
                                            <Tooltip title="Modifier cette analyse">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => onOpenDialog('editAnalyseDeRisque', analyseData)}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            
                                            <Tooltip title="Retirer cette analyse">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => onDeleteRelation(relation.objectId as number, ObjectAnsweredObjects.ANALYSE_DE_RISQUE)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={relation.ee || false}
                                                    onChange={(e) => handleEeEuChange(relation, 'ee', e.target.checked)}
                                                    size="small"
                                                />
                                            }
                                            label="EE (Entreprise Extérieure)"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={relation.eu || false}
                                                    onChange={(e) => handleEeEuChange(relation, 'eu', e.target.checked)}
                                                    size="small"
                                                />
                                            }
                                            label="EU (Entreprise Utilisatrice)"
                                        />
                                    </Box>
                                </ListItemCard>
                            );
                        })}
                    </Stack>
                ) : (
                    <Alert severity="info">
                        Aucune analyse de risque ajoutée. Cliquez sur "Ajouter / Créer Analyse" pour commencer.
                    </Alert>
                )}
            </Paper>
        </>
    );
};

export default DocumentTabRiskAnalyses;
