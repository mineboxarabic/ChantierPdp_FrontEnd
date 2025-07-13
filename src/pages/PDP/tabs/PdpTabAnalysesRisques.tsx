// src/pages/PDP/tabs/PdpTabAnalysesRisques.tsx
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
    Avatar,
    Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ShieldIcon from '@mui/icons-material/Shield'; // Icon for Analyses
import WarningIcon from '@mui/icons-material/Warning'; // For dangerous work flag

import { PdpDTO } from '../../../utils/entitiesDTO/PdpDTO';
import { AnalyseDeRisqueDTO } from '../../../utils/entitiesDTO/AnalyseDeRisqueDTO';
import RisqueDTO from '../../../utils/entitiesDTO/RisqueDTO'; // For displaying related Risque info
import DispositifDTO from '../../../utils/entitiesDTO/DispositifDTO';
import PermitDTO from '../../../utils/entitiesDTO/PermitDTO';
import ObjectAnsweredDTO from '../../../utils/pdp/ObjectAnswered';
import ObjectAnsweredObjects from '../../../utils/ObjectAnsweredObjects';
import { SectionTitle } from '../../../pages/Home/styles';
import { ListItemCard } from '../../../pages/Home/styles'; // Using ListItemCard for consistency

type DialogTypes = 'risques' | 'dispositifs' | 'permits' | 'analyseDeRisques' | 'editAnalyseDeRisque' | '';
type DialogData = RisqueDTO | DispositifDTO | PermitDTO | AnalyseDeRisqueDTO | null;


interface PdpTabAnalysesRisquesProps {
    formData: PdpDTO;
    errors: Record<string, string>;
    allAnalysesMap: Map<number, AnalyseDeRisqueDTO>;
    allRisquesMap: Map<number, RisqueDTO>; // Needed to display info about the linked Risque
    onOpenDialog: (type: DialogTypes, dataToEdit?: DialogData) => void; // Can now pass dataToEdit for the modal
    onDeleteRelation: (objectId: number, objectType: ObjectAnsweredObjects) => void;
    onUpdateRelationField: (relationUniqueKey: string | number, field: keyof ObjectAnsweredDTO, value: any) => void;
    onNavigateBack: () => void;
    onNavigateNext: () => void; // Now we have a next step (signatures)
}

const PdpTabAnalysesRisques: FC<PdpTabAnalysesRisquesProps> = ({
    formData,
    errors,
    allAnalysesMap,
    allRisquesMap,
    onOpenDialog,
    onDeleteRelation,
    onUpdateRelationField,
    onNavigateBack,
    onNavigateNext,
}) => {
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
                        onClick={() => onOpenDialog('analyseDeRisques')} // This will open the dialog in EditCreatePdp
                    >
                        Ajouter / Créer Analyse
                    </Button>
                </Box>

                {errors.analyseDeRisques && <Alert severity="error" sx={{ mb: 2 }}>{errors.analyseDeRisques}</Alert>}

                {analysesRelations.length > 0 ? (
                    <Stack spacing={2.5}> {/* Increased spacing between analysis cards */}
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
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </ListItemCard>
                                );
                            }

                            const risqueAssocieData = analyseData.risque ? allRisquesMap.get(analyseData.risque.id as number) : null;

                            return (
                                <Paper
                                    key={relationKey}
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        borderRadius: 2, // Consistent border radius
                                        borderLeft: (theme) => `5px solid ${theme.palette.primary.light}`,
                                        '&:hover': { boxShadow: (theme) => theme.shadows[3] }
                                    }}
                                >
                                    {/* Header of the Analysis Card */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, flexWrap: 'wrap' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: { xs: 1, sm: 0 } }}>
                                            {risqueAssocieData?.logo && ( // Assuming RisqueDTO might have a logo
                                                <Tooltip title={risqueAssocieData.title || 'Risque associé'}>
                                                    <Avatar
                                                        src={`data:${risqueAssocieData.logo.mimeType};base64,${risqueAssocieData.logo.imageData}`}
                                                        alt={risqueAssocieData.title}
                                                        sx={{ width: 36, height: 36 }}
                                                    />
                                                </Tooltip>
                                            )}
                                            <Typography variant="h6" component="h3" sx={{fontWeight: 500}}>
                                                {analyseData.deroulementDesTaches || risqueAssocieData?.title || `Analyse #${relation.objectId}`}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                                            <Tooltip title="Applicable par l'Entreprise Extérieure (EE)">
                                                <FormControlLabel
                                                    sx={{ mr: 0.5 }}
                                                    control={<Checkbox size="small" checked={relation.ee || false} onChange={(e) => handleEeEuChange(relation, 'ee', e.target.checked)} />}
                                                    label={<Typography variant="caption">EE</Typography>}
                                                />
                                            </Tooltip>
                                            <Tooltip title="Applicable par l'Entreprise Utilisatrice (EU)">
                                                <FormControlLabel
                                                    sx={{ mr: 0.5 }}
                                                    control={<Checkbox size="small" checked={relation.eu || false} onChange={(e) => handleEeEuChange(relation, 'eu', e.target.checked)} />}
                                                    label={<Typography variant="caption">EU</Typography>}
                                                />
                                            </Tooltip>
                                            <Tooltip title="Modifier cette analyse de risque">
                                                <IconButton size="small" color="primary" onClick={() => onOpenDialog('editAnalyseDeRisque', analyseData)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Retirer cette analyse du plan">
                                                <IconButton size="small" color="error" onClick={() => onDeleteRelation(relation.objectId as number, ObjectAnsweredObjects.ANALYSE_DE_RISQUE)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>

                                    {risqueAssocieData?.description && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontStyle: 'italic' }}>
                                            Contexte du risque: {risqueAssocieData.description}
                                        </Typography>
                                    )}
                                    <Divider sx={{ my: 1.5 }} />

                                    {/* Details Grid for Analyse de Risque */}
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="caption" display="block" color="text.secondary" gutterBottom>Déroulement des tâches / Processus:</Typography>
                                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{analyseData.deroulementDesTaches || "Non spécifié"}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="caption" display="block" color="text.secondary" gutterBottom>Moyens humains et matériels utilisés:</Typography>
                                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{analyseData.moyensUtilises || "Non spécifié"}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="caption" display="block" color="text.secondary" gutterBottom>Mesures de prévention spécifiques:</Typography>
                                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{analyseData.mesuresDePrevention || "Non spécifié"}</Typography>
                                        </Grid>
                                    </Grid>

                                    {(risqueAssocieData?.travailleDangereux || risqueAssocieData?.travaillePermit) && (
                                        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            {risqueAssocieData?.travailleDangereux && <Chip size="small" color="error" label="Travail dangereux" icon={<WarningIcon />} />}
                                            {/* Assuming travaillePermit indicates a permit is generally associated with this type of risk */}
                                            {risqueAssocieData?.travaillePermit && <Chip size="small" color="warning" label="Permis généralement requis" />}
                                        </Box>
                                    )}
                                </Paper>
                            );
                        })}
                    </Stack>
                ) : (
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
                        Aucune analyse de risque spécifique ajoutée. Utilisez le bouton ci-dessus pour en sélectionner ou en créer une nouvelle.
                    </Typography>
                )}
            </Paper>

            {/* Navigation Buttons are handled in the parent EditCreatePdp for the last tab */}
            {/* The main submit button is typically placed after the last tab's content in the parent. */}
            {/* However, if a per-tab save is desired or specific final actions, they'd be here. */}
            {/* For now, the parent EditCreatePdp.tsx handles the final save button after this tab. */}
            {/* We still need the "Précédent" button here. */}
             <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt:2, borderTop: theme => `1px solid ${theme.palette.divider}` }}>
                <Button variant="outlined" onClick={onNavigateBack}>
                    Précédent
                </Button>
                <Button variant="contained" onClick={onNavigateNext}>
                    Suivant
                </Button>
                {/* The main "Enregistrer PDP" button is now in the signatures tab (final step) */}
            </Box>
        </>
    );
};

export default PdpTabAnalysesRisques;