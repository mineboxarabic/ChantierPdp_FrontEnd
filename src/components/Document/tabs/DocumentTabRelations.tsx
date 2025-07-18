// src/components/Document/tabs/DocumentTabRelations.tsx
// Generic tab for managing RISQUE and DISPOSITIF relations (formerly PdpTabRisquesDispositifs)
import React, { FC, useMemo, useState } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Button,
    Box,
    Alert,
    Stack,
    Divider,
    CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import WarningIcon from '@mui/icons-material/Warning'; // For Risques
import SecurityIcon from '@mui/icons-material/Security'; // For Dispositifs
import AssignmentIcon from '@mui/icons-material/Assignment'; // For Audits

import { DocumentDTO } from '../../../utils/entitiesDTO/DocumentDTO';
import RisqueDTO from '../../../utils/entitiesDTO/RisqueDTO';
import DispositifDTO from '../../../utils/entitiesDTO/DispositifDTO';
import { AuditSecu } from '../../../utils/entities/AuditSecu';
import ObjectAnsweredDTO from '../../../utils/pdp/ObjectAnswered';
import ObjectAnsweredObjects from '../../../utils/ObjectAnsweredObjects';
import { SectionTitle } from '../../../pages/Home/styles';

// Import your custom components for rendering individual items
import RisqueComponent from '../../../components/Steps/RisqueComponent';
import ObjectAnsweredComponent from '../../../components/Steps/ObjectAnsweredComponent';

// Import the multiple selection dialog
import MultipleRiskSelectionDialog from '../../../components/MultipleSelectionDialog/MultipleRiskSelectionDialog';

type DialogTypes = 'risques' | 'dispositifs' | 'permits' | 'analyseDeRisques' | 'editAnalyseDeRisque' | 'audits' | '';

interface DocumentTabRelationsProps<T extends DocumentDTO> {
    formData: T;
    errors: Record<string, string>;
    allRisquesMap: Map<number, RisqueDTO>;
    allDispositifsMap: Map<number, DispositifDTO>;
    allAuditsMap?: Map<number, AuditSecu>; // Optional for documents that don't use audits
    onOpenDialog: (type: DialogTypes) => void;
    onDeleteRelation: (objectId: number, objectType: ObjectAnsweredObjects) => void;
    onUpdateRelationField: (relationUniqueKey: string | number, field: keyof ObjectAnsweredDTO, value: any) => void;
    saveParent: (updatedDocumentData: T) => void;
    onAddMultipleRisks: (risks: RisqueDTO[], risksToUnlink?: RisqueDTO[]) => Promise<void>;
    onRefreshRisks: () => Promise<void>;
    showAudits?: boolean; // Flag to show/hide audits section
}

const DocumentTabRelations = <T extends DocumentDTO>({
    formData,
    errors,
    allRisquesMap,
    allDispositifsMap,
    allAuditsMap = new Map(),
    onOpenDialog,
    onDeleteRelation,
    onUpdateRelationField,
    saveParent,
    onAddMultipleRisks,
    onRefreshRisks,
    showAudits = false,
}: DocumentTabRelationsProps<T>) => {
    const [showRiskSelectionDialog, setShowRiskSelectionDialog] = useState(false);

    const getActiveRelations = (type: ObjectAnsweredObjects): ObjectAnsweredDTO[] => {
        if (!formData.relations || formData.relations.length === 0) {
            return [];
        }
        
        return formData.relations.filter(r => {
            const typeMatches = r.objectType === type || String(r.objectType) === String(type);
            const hasValidAnswer = r.answer === true || r.answer === null;
            return typeMatches && hasValidAnswer;
        });
    };

    const risquesRelations = getActiveRelations(ObjectAnsweredObjects.RISQUE);
    const dispositifsRelations = useMemo(() => getActiveRelations(ObjectAnsweredObjects.DISPOSITIF), [formData.relations]);
    const auditsRelations = useMemo(() => getActiveRelations(ObjectAnsweredObjects.AUDIT), [formData.relations]);

    // Helper to render items in two columns
    const renderItemsInColumns = (
        relations: ObjectAnsweredDTO[],
        ItemComponent: any,
        itemMap: Map<number, any>,
        objectType: ObjectAnsweredObjects
    ) => {
        if (!relations || relations.length === 0) return null;

        const col1Items: React.ReactNode[] = [];
        const col2Items: React.ReactNode[] = [];
        relations.forEach((relation, index) => {
            const itemData = itemMap.get(relation.objectId as number);

            if (relation.answer !== null) {
                const displayItemData = itemData || {
                    id: relation.objectId,
                    title: objectType === ObjectAnsweredObjects.RISQUE ? `Risque #${relation.objectId}` : `Dispositif #${relation.objectId}`,
                    description: "Élément récemment créé, rechargez la page pour voir les détails complets"
                };

                const component = (
                    <ItemComponent
                        key={`${objectType}-${relation.objectId}`}
                        object={relation}
                        parent={formData}
                        itemData={displayItemData}
                        saveParent={saveParent}
                        setIsChanged={() => {}}
                        objectType={objectType}
                        onDeleteRelationFromItem={() => onDeleteRelation(relation.objectId as number, objectType)}
                        onUpdateRelationFieldFromItem={onUpdateRelationField}
                    />
                );

                if (index % 2 === 0) {
                    col1Items.push(component);
                } else {
                    col2Items.push(component);
                }
            }
        });

        return (
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Stack spacing={2}>{col1Items}</Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Stack spacing={2}>{col2Items}</Stack>
                </Grid>
            </Grid>
        );
    };

    return (
        <Grid container spacing={3}>
            {/* Section for Risques */}
            <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: {xs: 1.5, md:2.5}, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <SectionTitle variant="h6" sx={{ display: 'flex', alignItems: 'center', mb:0, pb:0, '&:after': {display:'none'} }}>
                            <WarningIcon color="primary" sx={{ mr: 1 }} />
                            Risques Identifiés
                        </SectionTitle>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<AddIcon />}
                                onClick={() => setShowRiskSelectionDialog(true)}
                            >
                                Sélection Multiple
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<AddIcon />}
                                onClick={() => onOpenDialog('risques')}
                            >
                                Ajouter / Créer
                            </Button>
                        </Box>
                    </Box>

                    {errors.risques && <Alert severity="error" sx={{ mb: 2 }}>{errors.risques}</Alert>}

                    {risquesRelations.length > 0 ? (
                        renderItemsInColumns(risquesRelations, RisqueComponent, allRisquesMap, ObjectAnsweredObjects.RISQUE)
                    ) : (
                        <Alert severity="info">
                            Aucun risque ajouté. Cliquez sur "Ajouter / Créer" pour commencer.
                        </Alert>
                    )}
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Section for Dispositifs */}
            <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: {xs: 1.5, md:2.5}, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <SectionTitle variant="h6" sx={{ display: 'flex', alignItems: 'center', mb:0, pb:0, '&:after': {display:'none'} }}>
                            <SecurityIcon color="primary" sx={{ mr: 1 }} />
                            Dispositifs de Sécurité
                        </SectionTitle>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => onOpenDialog('dispositifs')}
                        >
                            Ajouter / Créer
                        </Button>
                    </Box>

                    {errors.dispositifs && <Alert severity="error" sx={{ mb: 2 }}>{errors.dispositifs}</Alert>}

                    {dispositifsRelations.length > 0 ? (
                        renderItemsInColumns(dispositifsRelations, ObjectAnsweredComponent, allDispositifsMap, ObjectAnsweredObjects.DISPOSITIF)
                    ) : (
                        <Alert severity="info">
                            Aucun dispositif ajouté. Cliquez sur "Ajouter / Créer" pour commencer.
                        </Alert>
                    )}
                </Paper>
            </Grid>

            {/* Section for Audits - Only show if showAudits is true */}
            {showAudits && (
                <>
                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ p: {xs: 1.5, md:2.5}, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <SectionTitle variant="h6" sx={{ display: 'flex', alignItems: 'center', mb:0, pb:0, '&:after': {display:'none'} }}>
                                    <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                                    Audits de Sécurité
                                </SectionTitle>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => onOpenDialog('audits')}
                                >
                                    Ajouter / Créer
                                </Button>
                            </Box>

                            {errors.audits && <Alert severity="error" sx={{ mb: 2 }}>{errors.audits}</Alert>}

                            {auditsRelations.length > 0 ? (
                                renderItemsInColumns(auditsRelations, ObjectAnsweredComponent, allAuditsMap, ObjectAnsweredObjects.AUDIT)
                            ) : (
                                <Alert severity="info">
                                    Aucun audit ajouté. Cliquez sur "Ajouter / Créer" pour commencer.
                                </Alert>
                            )}
                        </Paper>
                    </Grid>
                </>
            )}

            {/* Multiple Risk Selection Dialog */}
            <MultipleRiskSelectionDialog
                open={showRiskSelectionDialog}
                onClose={() => setShowRiskSelectionDialog(false)}
                availableRisks={allRisquesMap}
                alreadySelectedRiskIds={risquesRelations
                    .filter(rel => rel.answer === true)
                    .map(rel => rel.objectId)
                    .filter((id): id is number => id !== undefined)
                }
                onConfirm={onAddMultipleRisks}
                onRiskDataRefresh={onRefreshRisks}
            />
        </Grid>
    );
};

export default DocumentTabRelations;
