// src/components/Document/tabs/DocumentTabPermits.tsx
// Generic tab for managing PERMIT relations (formerly PdpTabPermits)
import React, { useMemo, useState } from 'react';
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
    Card,
    CardContent,
    Chip,
    CardActions,
    alpha,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreateIcon from '@mui/icons-material/Create';

import { DocumentDTO } from '../../../utils/entitiesDTO/DocumentDTO';
import PermitDTO from '../../../utils/entitiesDTO/PermitDTO';
import ObjectAnsweredDTO from '../../../utils/pdp/ObjectAnswered';
import ObjectAnsweredObjects from '../../../utils/ObjectAnsweredObjects';
import { SectionTitle, ListItemCard } from '../../../pages/Home/styles';
import RisqueDTO from '../../../utils/entitiesDTO/RisqueDTO';
import PermiTypes from '../../../utils/PermiTypes';

type DialogTypes = 'risques' | 'dispositifs' | 'permits' | 'analyseDeRisques' | 'editAnalyseDeRisque' | '';

// Type to represent required permit types and the risks that need them
interface RequiredPermitType {
    permitType: PermiTypes;
    risks: RisqueDTO[];
    isLinked: boolean;
    linkedPermit?: PermitDTO;
}

interface DocumentTabPermitsProps<T extends DocumentDTO> {
    formData: T;
    errors: Record<string, string>;
    allPermitsMap: Map<number, PermitDTO>;
    onOpenDialog: (type: DialogTypes) => void;
    onDeleteRelation: (objectId: number, objectType: ObjectAnsweredObjects) => void;
    onUpdateRelationField: (relationUniqueKey: string | number, field: keyof ObjectAnsweredDTO, value: any) => void;
    requiredPermitTypes: RequiredPermitType[];
    allRisquesMap: Map<number, RisqueDTO>;
    onShowRequiredPermitModal: (risque: RisqueDTO) => void;
    onCreateAndLinkPermit: (permitType: PermiTypes, file?: File) => Promise<void>;
}

const DocumentTabPermits = <T extends DocumentDTO>({
    formData,
    errors,
    allPermitsMap,
    onOpenDialog,
    onDeleteRelation,
    onUpdateRelationField,
    requiredPermitTypes,
    allRisquesMap,
    onShowRequiredPermitModal,
    onCreateAndLinkPermit,
}: DocumentTabPermitsProps<T>) => {
    const [loadingPermitTypes, setLoadingPermitTypes] = useState<Set<PermiTypes>>(new Set());

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

    const handleEeEuChange = (relation: ObjectAnsweredDTO, field: 'ee' | 'eu', isChecked: boolean) => {
        const uniqueKey = relation.id ?? `${relation.objectId}_${relation.objectType}`;
        onUpdateRelationField(uniqueKey, field, isChecked);
    };

    return (
        <>
            {/* Required Permits Section */}
            <Paper elevation={2} sx={{ p: {xs:1.5, md:2.5}, borderRadius: 2, mb: 3 }}>
                <SectionTitle variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <VerifiedUserIcon color="primary" sx={{ mr: 1 }} />
                    Permis Requis (Basés sur les Risques)
                </SectionTitle>

                {requiredPermitTypes.length > 0 ? (
                    <Grid container spacing={2}>
                        {requiredPermitTypes.map((requiredPermit) => (
                            <Grid item xs={12} md={6} key={requiredPermit.permitType}>
                                <Card 
                                    variant="outlined" 
                                    sx={{ 
                                        backgroundColor: requiredPermit.isLinked 
                                            ? alpha('#4caf50', 0.1) 
                                            : alpha('#ff9800', 0.1),
                                        borderColor: requiredPermit.isLinked ? 'success.main' : 'warning.main'
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                            <Typography variant="h6" component="h3">
                                                Permis {requiredPermit.permitType}
                                            </Typography>
                                            <Chip
                                                icon={requiredPermit.isLinked ? <CheckCircleIcon /> : <UploadFileIcon />}
                                                label={requiredPermit.isLinked ? "Lié" : "Requis"}
                                                color={requiredPermit.isLinked ? "success" : "warning"}
                                                size="small"
                                            />
                                        </Box>
                                        
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            Requis par {requiredPermit.risks.length} risque(s): {' '}
                                            {requiredPermit.risks.map(risk => risk.title).join(', ')}
                                        </Typography>

                                        {requiredPermit.risks.map(risk => (
                                            <Chip
                                                key={risk.id}
                                                label={risk.title}
                                                size="small"
                                                onClick={() => onShowRequiredPermitModal(risk)}
                                                sx={{ mr: 0.5, mb: 0.5, cursor: 'pointer' }}
                                                color="primary"
                                                variant="outlined"
                                            />
                                        ))}
                                    </CardContent>
                                    
                                    {!requiredPermit.isLinked && (
                                        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                            <input
                                                accept=".pdf"
                                                style={{ display: 'none' }}
                                                id={`upload-${requiredPermit.permitType}`}
                                                type="file"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        handleFileUpload(requiredPermit.permitType, file);
                                                    }
                                                }}
                                            />
                                            <label htmlFor={`upload-${requiredPermit.permitType}`}>
                                                <LoadingButton
                                                    component="span"
                                                    variant="contained"
                                                    startIcon={<UploadFileIcon />}
                                                    loading={loadingPermitTypes.has(requiredPermit.permitType)}
                                                    size="small"
                                                >
                                                    Télécharger
                                                </LoadingButton>
                                            </label>
                                            
                                            <LoadingButton
                                                variant="outlined"
                                                startIcon={<CreateIcon />}
                                                onClick={() => handleCreateNewPermit(requiredPermit.permitType)}
                                                loading={loadingPermitTypes.has(requiredPermit.permitType)}
                                                size="small"
                                            >
                                                Créer Nouveau
                                            </LoadingButton>
                                        </CardActions>
                                    )}
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Alert severity="info">
                        Aucun permis requis détecté. Les permis sont automatiquement requis lorsque des risques dangereux sont ajoutés.
                    </Alert>
                )}
            </Paper>

            {/* Linked Permits Section */}
            <Paper elevation={2} sx={{ p: {xs:1.5, md:2.5}, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <SectionTitle variant="h6" sx={{ display: 'flex', alignItems: 'center', mb:0, pb:0, '&:after': {display:'none'} }}>
                        <VerifiedUserIcon color="primary" sx={{ mr: 1 }} />
                        Permis Liés au Document
                    </SectionTitle>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => onOpenDialog('permits')}
                    >
                        Ajouter Permis
                    </Button>
                </Box>

                {errors.permits && <Alert severity="error" sx={{ mb: 2 }}>{errors.permits}</Alert>}

                {permitsRelations.length > 0 ? (
                    <Stack spacing={2}>
                        {permitsRelations.map((relation) => {
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
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </ListItemCard>
                                );
                            }

                            return (
                                <ListItemCard key={relationKey} sx={{p:2}}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                                                {permitData.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                {permitData.description || 'Aucune description'}
                                            </Typography>
                                            <Chip 
                                                label={`Type: ${permitData.type || 'Non spécifié'}`} 
                                                size="small" 
                                                color="primary" 
                                                variant="outlined"
                                            />
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                                            
                                            <Tooltip title="Retirer ce permis">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => onDeleteRelation(relation.objectId as number, ObjectAnsweredObjects.PERMIT)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                    
                                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
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
                        Aucun permis lié. Ajoutez des risques dangereux pour voir les permis requis automatiquement.
                    </Alert>
                )}
            </Paper>
        </>
    );
};

export default DocumentTabPermits;
