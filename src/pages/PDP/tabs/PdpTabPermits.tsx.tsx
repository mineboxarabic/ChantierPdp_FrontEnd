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
    Card,
    CardContent,
    Chip,
    CardActions,
    alpha,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'; // Icon for Permits
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { PdpDTO } from '../../../utils/entitiesDTO/PdpDTO';
import  PermitDTO  from '../../../utils/entitiesDTO/PermitDTO';
import ObjectAnsweredDTO from '../../../utils/pdp/ObjectAnswered';
import ObjectAnsweredObjects from '../../../utils/ObjectAnsweredObjects';
import { SectionTitle } from '../../../pages/Home/styles';
import { ListItemCard } from '../../../pages/Home/styles'; // Using ListItemCard for consistency
import RisqueDTO from '../../../utils/entitiesDTO/RisqueDTO';

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

    risksRequiringPermits: RisqueDTO[];
    allRisquesMap: Map<number, RisqueDTO>; // You might not need this if RisqueDTO in risksRequiringPermits is complete
    onShowRequiredPermitModal: (risque: RisqueDTO) => void;
    
    // New props for permit upload
    onPermitUpload: (risqueId: number, file: File | null) => void;
    getPermitUploadStatus: (risqueId: number) => { file: File | null; status: 'none' | 'uploaded' | 'pending' };
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
    risksRequiringPermits,
    allRisquesMap,
    onShowRequiredPermitModal,
    onPermitUpload,
    getPermitUploadStatus,
}) => {
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

    // Calculate permit upload summary
    const permitUploadSummary = useMemo(() => {
        const total = risksRequiringPermits.length;
        const uploaded = risksRequiringPermits.filter(risque => 
            getPermitUploadStatus(risque.id as number).status === 'uploaded'
        ).length;
        return { total, uploaded, remaining: total - uploaded };
    }, [risksRequiringPermits, getPermitUploadStatus]);

    // Debug logging
    console.log("PdpTabPermits - risksRequiringPermits:", risksRequiringPermits);
    console.log("PdpTabPermits - permitUploadSummary:", permitUploadSummary);

    return (
    <>
            {/* Permit Summary Section */}
            {risksRequiringPermits.length > 0 && (
                <Alert 
                    severity={permitUploadSummary.remaining === 0 ? 'success' : 'warning'} 
                    sx={{ mb: 3 }}
                >
                    <Typography variant="subtitle2" gutterBottom>
                        Statut des permis requis
                    </Typography>
                    <Typography variant="body2">
                        {permitUploadSummary.uploaded} sur {permitUploadSummary.total} permis fournis
                        {permitUploadSummary.remaining > 0 && (
                            <Typography component="span" color="warning.main" fontWeight="bold">
                                {" "}({permitUploadSummary.remaining} restant{permitUploadSummary.remaining > 1 ? 's' : ''})
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


                {/* Display for Risks Requiring Permits */}
                {risksRequiringPermits.length > 0 && (
                    <Box mt={4}>
                        <Divider sx={{mb:2}}>
                            <Chip label="Permis Requis Non Liés" color="warning" />
                        </Divider>
                        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                            Les risques suivants ont été ajoutés et nécessitent des permis spécifiques qui ne sont pas encore liés à ce PDP:
                        </Typography>
                        <Grid container spacing={2}>
                            {risksRequiringPermits.map((risque) => {
                                const targetPermitType = risque.permitType;
                                const targetPermitDetails = targetPermitType ? Array.from(allPermitsMap.values()).find(p => p.type === targetPermitType) : undefined;
                                const uploadStatus = getPermitUploadStatus(risque.id as number);

                                return (
                                    <Grid item xs={12} md={6} key={`needed-permit-for-risque-${risque.id}`}>
                                        <Card variant="outlined" sx={{ borderColor: 'warning.main', backgroundColor: (theme) => alpha(theme.palette.warning.light, 0.1) }}>
                                            <CardContent>
                                                <Typography variant="h6" component="div" gutterBottom>
                                                    Permis requis pour: <Typography component="span" fontWeight="bold">{risque.title}</Typography>
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{mb:1}}>
                                                    Type de permis nécessaire: <strong>{targetPermitType || 'Non spécifié'}</strong>
                                                    {targetPermitDetails && ` (${targetPermitDetails.title})`}
                                                </Typography>
                                                
                                                {/* Upload Status Section */}
                                                <Box sx={{ mb: 2, p: 1.5, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography variant="subtitle2">
                                                            Statut du permis:
                                                        </Typography>
                                                        <Chip
                                                            size="small"
                                                            label={uploadStatus.status === 'uploaded' ? 'Permis fourni' : 'Permis non fourni'}
                                                            color={uploadStatus.status === 'uploaded' ? 'success' : 'error'}
                                                            icon={uploadStatus.status === 'uploaded' ? <CheckCircleIcon /> : undefined}
                                                        />
                                                    </Box>
                                                    
                                                    {uploadStatus.file && (
                                                        <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                                                            Fichier: {uploadStatus.file.name}
                                                        </Typography>
                                                    )}
                                                    
                                                    <Button
                                                        component="label"
                                                        variant={uploadStatus.status === 'uploaded' ? 'outlined' : 'contained'}
                                                        size="small"
                                                        startIcon={<UploadFileIcon />}
                                                        sx={{ mt: 1 }}
                                                    >
                                                        {uploadStatus.status === 'uploaded' ? 'Remplacer le permis' : 'Télécharger le permis'}
                                                        <input
                                                            type="file"
                                                            hidden
                                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0] || null;
                                                                onPermitUpload(risque.id as number, file);
                                                            }}
                                                        />
                                                    </Button>
                                                    
                                                    {uploadStatus.status === 'uploaded' && (
                                                        <Button
                                                            size="small"
                                                            color="error"
                                                            sx={{ ml: 1, mt: 1 }}
                                                            onClick={() => onPermitUpload(risque.id as number, null)}
                                                        >
                                                            Supprimer
                                                        </Button>
                                                    )}
                                                </Box>

                                                {targetPermitDetails?.description &&
                                                    <Typography variant="caption" display="block" sx={{mb:1.5}}>
                                                        Description du permis type: {targetPermitDetails.description}
                                                    </Typography>
                                                }
                                                {!targetPermitDetails && targetPermitType &&
                                                     <Alert severity="warning" variant="outlined" sx={{mb:1.5}}>
                                                        Aucun permis correspondant au type "{targetPermitType}" n'est actuellement défini dans le système. Veuillez en créer un ou vérifier la configuration des risques.
                                                    </Alert>
                                                }
                                            </CardContent>
                                            <CardActions sx={{justifyContent: 'flex-end'}}>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => onOpenDialog('permits')} // Opens the dialog to add *any* permit
                                                >
                                                    Ajouter un permis au PDP
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="text"
                                                    onClick={() => onShowRequiredPermitModal(risque)} // Shows specific info
                                                >
                                                    Détails du permis requis
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
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