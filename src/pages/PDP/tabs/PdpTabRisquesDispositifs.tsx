// src/pages/PDP/tabs/PdpTabRisquesDispositifs.tsx
import React, { FC, useMemo, useState, useEffect } from 'react';
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

import { PdpDTO } from '../../../utils/entitiesDTO/PdpDTO';
import RisqueDTO from '../../../utils/entitiesDTO/RisqueDTO';
import DispositifDTO from '../../../utils/entitiesDTO/DispositifDTO';
import ObjectAnsweredDTO from '../../../utils/pdp/ObjectAnswered';
import ObjectAnsweredObjects from '../../../utils/ObjectAnsweredObjects';
import { SectionTitle } from '../../../pages/Home/styles';

// Import your custom components for rendering individual items
import RisqueComponent from '../../../components/Steps/RisqueComponent'; // Adjust path if needed
import ObjectAnsweredComponent from '../../../components/Steps/ObjectAnsweredComponent'; // Adjust path

// Import the new multiple selection dialog
import MultipleRiskSelectionDialog from '../../../components/MultipleSelectionDialog/MultipleRiskSelectionDialog';

type DialogTypes = 'risques' | 'dispositifs' | 'permits' | 'analyseDeRisques' | 'editAnalyseDeRisque' | '';

interface PdpTabRisquesDispositifsProps {
    formData: PdpDTO;
    errors: Record<string, string>;
    allRisquesMap: Map<number, RisqueDTO>;
    allDispositifsMap: Map<number, DispositifDTO>;
    onOpenDialog: (type: DialogTypes) => void; // To trigger the dialog in parent
    onDeleteRelation: (objectId: number, objectType: ObjectAnsweredObjects) => void; // More robust
    onUpdateRelationField: (relationUniqueKey: string | number, field: keyof ObjectAnsweredDTO, value: any) => void;
    onNavigateBack: () => void;
    onNavigateNext: () => void;
    saveParent: (updatedPdpData: PdpDTO) => void; // Function to save parent data
    // New prop for adding multiple risks
    onAddMultipleRisks: (risks: RisqueDTO[], risksToUnlink?: RisqueDTO[]) => Promise<void>;
    // Prop for refreshing risk data after creation
    onRefreshRisks: () => Promise<void>;
}

const PdpTabRisquesDispositifs: FC<PdpTabRisquesDispositifsProps> = ({
    formData,
    saveParent,
    errors,
    allRisquesMap,
    allDispositifsMap,
    onOpenDialog,
    onDeleteRelation,
    onUpdateRelationField,
    onNavigateBack,
    onNavigateNext,
    onAddMultipleRisks,
    onRefreshRisks,
}) => {
    const [showRiskSelectionDialog, setShowRiskSelectionDialog] = useState(false);

    const getActiveRelations = (type: ObjectAnsweredObjects): ObjectAnsweredDTO[] => {
        if (!formData.relations || formData.relations.length === 0) {
            return [];
        }
        
        return formData.relations.filter(r => {
            // Handle both string and enum comparison for objectType
            const typeMatches = r.objectType === type || String(r.objectType) === String(type);
            // Show relations that are true OR null (null means they need to be reviewed/set)
            // Don't show relations that are explicitly false
            const hasValidAnswer = r.answer === true || r.answer === null;
            return typeMatches && hasValidAnswer;
        });
    };

    const risquesRelations = getActiveRelations(ObjectAnsweredObjects.RISQUE);
    const dispositifsRelations = useMemo(() => getActiveRelations(ObjectAnsweredObjects.DISPOSITIF), [formData.relations]);

    // Helper to render items in two columns
    const renderItemsInColumns = (
        relations: ObjectAnsweredDTO[],
        ItemComponent: any, // RisqueComponent or ObjectAnsweredComponent
        itemMap: Map<number, any>, // allRisquesMap or allDispositifsMap
        objectType: ObjectAnsweredObjects
    ) => {
        if (!relations || relations.length === 0) return null;

        const col1Items: React.ReactNode[] = [];
        const col2Items: React.ReactNode[] = [];
        relations.forEach((relation, index) => {
            const itemData = itemMap.get(relation.objectId as number);

            console.log('itemData',relation.objectId)

            if (relation.answer !== null) { // Remove dependency on itemData being found
                // If itemData is not found, create a placeholder for recently created items
                const displayItemData = itemData || {
                    id: relation.objectId,
                    title: objectType === ObjectAnsweredObjects.RISQUE ? `Risque #${relation.objectId}` : `Dispositif #${relation.objectId}`,
                    description: "Élément récemment créé, rechargez la page pour voir les détails complets"
                };

                const component = (
                    <ItemComponent
                        key={`${objectType}-${relation.objectId}`} // Use real ID if available
                        object={relation}
                        parent={formData} // Pass PdpDTO as parent
                        itemData={displayItemData} // Pass actual or placeholder data
                        saveParent={saveParent} // Function to save parent data
                        setIsChanged={() => {}} // Or handle changes if needed
                        objectType={objectType}
                        // Pass onDelete for individual item deletion directly from the component
                        onDeleteRelationFromItem={() => onDeleteRelation(relation.objectId as number, objectType)}
                        // Pass onUpdate for specific field updates from the component
                        onUpdateRelationFieldFromItem={onUpdateRelationField} // This prop needs to be handled by RisqueComponent/ObjectAnsweredComponent
                    />
                );
                if (index % 2 === 0) {
                    col1Items.push(component);
                } else {
                    col2Items.push(component);
                }
            }
        });

        console.log('col1Items',col1Items)
        return (
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Stack spacing={1.5}>{col1Items}</Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Stack spacing={1.5}>{col2Items}</Stack>
                </Grid>
            </Grid>
        );
    };


    return (
        <>
            <Grid container spacing={3}>
                {/* Risques Section */}
                <Grid item xs={12}>
                    <Paper elevation={2} sx={{ p: {xs: 1.5, md:2.5}, borderRadius: 2, borderLeft: theme => `4px solid ${theme.palette.error.main}` }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <SectionTitle variant="h6" sx={{ display: 'flex', alignItems: 'center', mb:0, pb:0, '&:after': {display:'none'} }}>
                                <WarningIcon color="error" sx={{ mr: 1 }} />
                                Risques Identifiés
                            </SectionTitle>
                            <Button 
                                variant="outlined" 
                                size="small" 
                                startIcon={<AddIcon />} 
                                onClick={() => setShowRiskSelectionDialog(true)}
                            >
                                Ajouter des Risques
                            </Button>
                        </Box>
                        {errors.risques && <Alert severity="error" sx={{ mb: 2 }}>{errors.risques}</Alert>}
                        
                        {/* Show loading state if data is not ready */}
                        {(!formData.relations || allRisquesMap.size === 0) ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                                <CircularProgress size={24} sx={{ mr: 2 }} />
                                <Typography color="text.secondary">
                                    Chargement des risques...
                                </Typography>
                            </Box>
                        ) : risquesRelations.length > 0 ? (
                            renderItemsInColumns(risquesRelations, RisqueComponent, allRisquesMap, ObjectAnsweredObjects.RISQUE)
                        ) : (
                            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                                Aucun risque ajouté ou tous les risques ont été marqués comme non applicables.
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Dispositifs Section */}
                <Grid item xs={12}>
                    <Paper elevation={2} sx={{ p: {xs: 1.5, md:2.5}, borderRadius: 2, mt: 2, borderLeft: theme => `4px solid ${theme.palette.secondary.main}` }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                             <SectionTitle variant="h6" sx={{ display: 'flex', alignItems: 'center', mb:0, pb:0, '&:after': {display:'none'} }}>
                                <SecurityIcon color="secondary" sx={{ mr: 1 }} />
                                Dispositifs de Prévention
                            </SectionTitle>
                            <Button variant="outlined" color="secondary" size="small" startIcon={<AddIcon />} onClick={() => onOpenDialog('dispositifs')}>
                                Ajouter un Dispositif
                            </Button>
                        </Box>
                        {errors.dispositifs && <Alert severity="error" sx={{ mb: 2 }}>{errors.dispositifs}</Alert>}
                        {dispositifsRelations.length > 0 ? (
                            renderItemsInColumns(dispositifsRelations, ObjectAnsweredComponent, allDispositifsMap, ObjectAnsweredObjects.DISPOSITIF)
                        ) : (
                            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                                Aucun dispositif ajouté ou tous les dispositifs ont été marqués comme non applicables.
                            </Typography>
                        )}
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

            {/* Multiple Risk Selection Dialog */}
            <MultipleRiskSelectionDialog
                open={showRiskSelectionDialog}
                onClose={() => setShowRiskSelectionDialog(false)}
                onConfirm={onAddMultipleRisks}
                availableRisks={allRisquesMap}
                alreadySelectedRiskIds={risquesRelations.map(r => r.objectId as number)}
                title="Ajouter des Risques au PDP"
                onRiskDataRefresh={onRefreshRisks}
            />
        </>
    );
};

export default PdpTabRisquesDispositifs;