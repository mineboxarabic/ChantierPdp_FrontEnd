// src/pages/PDP/tabs/PdpTabPermits.tsx
import React, { FC, useMemo, useState } from 'react';
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
    Card,
    CardContent,
    Chip,
    CardActions,
    alpha,
    CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'; // Icon for Permits
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreateIcon from '@mui/icons-material/Create';

import { PdpDTO } from '../../../utils/entitiesDTO/PdpDTO';
import  PermitDTO  from '../../../utils/entitiesDTO/PermitDTO';
import ObjectAnsweredDTO from '../../../utils/pdp/ObjectAnswered';
import ObjectAnsweredObjects from '../../../utils/ObjectAnsweredObjects';
import { SectionTitle } from '../../../pages/Home/styles';
import { ListItemCard } from '../../../pages/Home/styles'; // Using ListItemCard for consistency
import RisqueDTO from '../../../utils/entitiesDTO/RisqueDTO';
import PermiTypes from '../../../utils/PermiTypes';

type DialogTypes = 'risques' | 'dispositifs' | 'permits' | 'analyseDeRisques' | 'editAnalyseDeRisque' | '';

// Type to represent required permit types and the risks that need them
interface RequiredPermitType {
    permitType: PermiTypes;
    risks: RisqueDTO[];
    isLinked: boolean; // Whether a permit of this type is already linked to the document
    linkedPermit?: PermitDTO; // The actual permit linked, if any
}

interface PdpTabPermitsProps {
    formData: PdpDTO;
    errors: Record<string, string>;
    allPermitsMap: Map<number, PermitDTO>; // Map of all available PermitDTOs
    onOpenDialog: (type: DialogTypes) => void;
    onDeleteRelation: (objectId: number, objectType: ObjectAnsweredObjects) => void;
    onUpdateRelationField: (relationUniqueKey: string | number, field: keyof ObjectAnsweredDTO, value: any) => void;
    onNavigateBack: () => void;
    onNavigateNext: () => void;

    requiredPermitTypes: RequiredPermitType[];
    allRisquesMap: Map<number, RisqueDTO>; // For displaying risk details
    onShowRequiredPermitModal: (risque: RisqueDTO) => void;
    onCreateAndLinkPermit: (permitType: PermiTypes, file?: File) => Promise<void>;
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
    requiredPermitTypes,
    allRisquesMap,
    onShowRequiredPermitModal,
    onCreateAndLinkPermit,
}) => {

    // State to track loading for each permit type
    const [loadingPermitTypes, setLoadingPermitTypes] = useState<Set<PermiTypes>>(new Set());

    // Function to handle file upload and permit creation
    const handleFileUpload = async (permitType: PermiTypes, file: File) => {
        setLoadingPermitTypes(prev => new Set(prev).add(permitType));
        try {
            await onCreateAndLinkPermit(permitType, file);
        } catch (error) {
            console.error('Error uploading file and creating permit:', error);
        } finally {
            setLoadingPermitTypes(prev => {
                const newSet = new Set(prev);
                newSet.delete(permitType);
                return newSet;
            });
        }
    };

    // Function to handle creating a new permit without file
    const handleCreateNewPermit = async (permitType: PermiTypes) => {
        setLoadingPermitTypes(prev => new Set(prev).add(permitType));
        try {
            await onCreateAndLinkPermit(permitType);
        } catch (error) {
            console.error('Error creating new permit:', error);
        } finally {
            setLoadingPermitTypes(prev => {
                const newSet = new Set(prev);
                newSet.delete(permitType);
                return newSet;
            });
        }
    };

    const permitsRelations = useMemo(() => {
        return formData.relations?.filter(r => r.objectType === ObjectAnsweredObjects.PERMIT && r.answer !== null) ?? [];
    }, [formData.relations]);

    const handleApplicableChange = (relation: ObjectAnsweredDTO, isChecked: boolean) => {
        const uniqueKey = relation.id ?? `${relation.objectId}_${relation.objectType}`;
        onUpdateRelationField(uniqueKey, 'answer', isChecked);
    };

    const actualPermitRelations = useMemo(() => {
        return formData.relations?.filter(r => r.objectType === ObjectAnsweredObjects.PERMIT && r.answer !== null) ?? [];
    }, [formData.relations]);

    // Calculate required permit types summary
    const permitTypesSummary = useMemo(() => {
        const total = requiredPermitTypes.length;
        const linked = requiredPermitTypes.filter(pt => pt.isLinked).length;
        return { total, linked, missing: total - linked };
    }, [requiredPermitTypes]);

    return (
    <>
            {/* Required Permit Types Summary Section */}
            {requiredPermitTypes.length > 0 && (
                <Alert 
                    severity={permitTypesSummary.missing === 0 ? 'success' : 'warning'} 
                    sx={{ mb: 3 }}
                >
                    <Typography variant="subtitle2" gutterBottom>
                        Statut des permis requis
                    </Typography>
                    <Typography variant="body2">
                        {permitTypesSummary.linked} sur {permitTypesSummary.total} types de permis fournis
                        {permitTypesSummary.missing > 0 && (
                            <Typography component="span" color="warning.main" fontWeight="bold">
                                {" "}({permitTypesSummary.missing} manquant{permitTypesSummary.missing > 1 ? 's' : ''})
                            </Typography>
                        )}
                    </Typography>
                </Alert>
            )}

            <Paper elevation={2} sx={{ p: { xs: 1.5, md: 2.5 }, borderRadius: 2 }}>
                {/* ... Existing code for adding actual permits ... */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <SectionTitle variant="h6" sx={{ display: 'flex', alignItems: 'center', mb:0, pb:0, '&:after': {display:'none'} }}>
                        <VerifiedUserIcon color="primary" sx={{ mr: 1 }} />
                        Permis de Travail Associés
                    </SectionTitle>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => onOpenDialog('permits')}
                    >
                        Ajouter un Permis Existant
                    </Button>
                </Box>
                 {errors.permits && <Alert severity="error" sx={{ mb: 2 }}>{errors.permits}</Alert>}

                {actualPermitRelations.length > 0 ? (
                    <Stack spacing={1.5}>
                        {actualPermitRelations.map((relation) => {
                            // ... your existing rendering for actual permits ...
                            const permitData = allPermitsMap.get(relation.objectId as number);
                            const relationKey = relation.id ?? `${relation.objectId}_${relation.objectType}`;

                            if (!permitData) {
                                return (
                                    <ListItemCard key={relationKey} sx={{p:1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.7}}>
                                        <Typography variant="body2" color="error">
                                            Permis (ID: {relation.objectId}) non trouvé.
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
                                                    onChange={(e) => {
                                                        const uniqueKey = relation.id ?? `${relation.objectId}_${relation.objectType}`;
                                                        onUpdateRelationField(uniqueKey, 'answer', e.target.checked);
                                                    }}
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
                     <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2, fontStyle: 'italic' }}>
                        Aucun permis de travail directement lié à ce PDP pour le moment.
                    </Typography>
                )}


                {/* Display for Required Permit Types */}
                {requiredPermitTypes.length > 0 && (
                    <Box mt={4}>
                        <Divider sx={{mb:2}}>
                            <Chip label="Types de Permis Requis" color="warning" />
                        </Divider>
                        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                            Les types de permis suivants sont requis pour les risques ajoutés à ce PDP:
                        </Typography>
                        <Grid container spacing={2}>
                            {requiredPermitTypes.map((permitType) => (
                                <Grid item xs={12} md={6} key={`required-permit-type-${permitType.permitType}`}>
                                    <Card 
                                        variant="outlined" 
                                        sx={{ 
                                            borderColor: permitType.isLinked ? 'success.main' : 'warning.main', 
                                            backgroundColor: (theme) => permitType.isLinked 
                                                ? alpha(theme.palette.success.light, 0.1)
                                                : alpha(theme.palette.warning.light, 0.1)
                                        }}
                                    >
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                                <Typography variant="h6" component="div">
                                                    {permitType.permitType}
                                                </Typography>
                                                <Chip
                                                    size="small"
                                                    label={permitType.isLinked ? 'Permis lié' : 'Permis requis'}
                                                    color={permitType.isLinked ? 'success' : 'warning'}
                                                    icon={permitType.isLinked ? <CheckCircleIcon /> : undefined}
                                                />
                                            </Box>
                                            
                                            {permitType.linkedPermit && (
                                                <Typography variant="body2" color="success.main" sx={{ mb: 1, fontWeight: 'bold' }}>
                                                    Permis lié: {permitType.linkedPermit.title}
                                                </Typography>
                                            )}
                                            
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                Requis pour {permitType.risks.length} risque(s): {permitType.risks.map(r => r.title).join(', ')}
                                            </Typography>
                                            
                                            {!permitType.isLinked && (
                                                <Alert severity="warning" variant="outlined" sx={{mb:1.5}}>
                                                    Ce type de permis doit être ajouté au document. Vous pouvez télécharger un fichier permis ou utiliser un permis existant.
                                                </Alert>
                                            )}
                                        </CardContent>
                                        <CardActions sx={{justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1}}>
                                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                {!permitType.isLinked && (
                                                    <>
                                                        <input
                                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                            style={{ display: 'none' }}
                                                            id={`upload-permit-${permitType.permitType}`}
                                                            type="file"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    handleFileUpload(permitType.permitType, file);
                                                                }
                                                            }}
                                                        />
                                                        <label htmlFor={`upload-permit-${permitType.permitType}`}>
                                                            <LoadingButton
                                                                variant="contained"
                                                                color="primary"
                                                                component="span"
                                                                size="small"
                                                                startIcon={<UploadFileIcon />}
                                                                loading={loadingPermitTypes.has(permitType.permitType)}
                                                                disabled={loadingPermitTypes.has(permitType.permitType)}
                                                            >
                                                                Télécharger Permis
                                                            </LoadingButton>
                                                        </label>
                                                        <LoadingButton
                                                            size="small"
                                                            variant="outlined"
                                                            startIcon={<CreateIcon />}
                                                            loading={loadingPermitTypes.has(permitType.permitType)}
                                                            disabled={loadingPermitTypes.has(permitType.permitType)}
                                                            onClick={() => handleCreateNewPermit(permitType.permitType)}
                                                        >
                                                            Créer Nouveau
                                                        </LoadingButton>
                                                    </>
                                                )}
                                            </Box>
                                            <Box>
                                                {permitType.risks.length > 0 && (
                                                    <Button
                                                        size="small"
                                                        variant="text"
                                                        onClick={() => onShowRequiredPermitModal(permitType.risks[0])} // Show details for first risk
                                                    >
                                                        Détails du permis requis
                                                    </Button>
                                                )}
                                            </Box>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* Information when no permit types are required */}
                {requiredPermitTypes.length === 0 && (
                    <Box mt={4}>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Aucun type de permis requis
                            </Typography>
                            <Typography variant="body2">
                                Lorsque vous ajoutez des risques qui nécessitent des permis spécifiques (comme les travaux en hauteur, espaces confinés, etc.), 
                                cette section affichera les types de permis requis et leur statut.
                            </Typography>
                        </Alert>
                    </Box>
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