// src/pages/BDT/tabs/BdtTabAuditSecu.tsx
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
    Shield as ShieldIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { BdtDTO } from '../../../utils/entitiesDTO/BdtDTO';
import { AuditSecu } from '../../../utils/entities/AuditSecu';
import { ObjectAnsweredDTO } from '../../../utils/entitiesDTO/ObjectAnsweredDTO';
import ObjectAnsweredObjects from '../../../utils/ObjectAnsweredObjects';

interface BdtTabAuditSecuProps {
    formData: BdtDTO;
    errors: Record<string, string>;
    auditSecusMap: Map<number, AuditSecu>;
    onOpenDialog: (type: 'audits') => void;
    onRemoveAuditSecu: (auditSecuId: number) => void;
    onToggleAuditSecuAnswer: (auditSecuId: number) => void;
}

const BdtTabAuditSecu: React.FC<BdtTabAuditSecuProps> = ({
    formData,
    errors,
    auditSecusMap,
    onOpenDialog,
    onRemoveAuditSecu,
    onToggleAuditSecuAnswer
}) => {
    // Get audit secus from relations
    const getAuditSecusFromRelations = (): { relation: ObjectAnsweredDTO; auditSecu: AuditSecu }[] => {
        if (!formData.relations) return [];
        
        return formData.relations
            .filter(rel => rel.objectType === ObjectAnsweredObjects.AUDIT)
            .map(rel => {
                const existingAuditSecu = Array.from(auditSecusMap.values()).find(a => a.id === rel.objectId);
                // If audit secu not found in local map, create a temporary one for display
                const auditSecu = existingAuditSecu || {
                    id: rel.objectId,
                    title: `Audit de sécurité #${rel.objectId}`,
                    description: "Audit de sécurité récemment créé"
                } as AuditSecu;
                
                return {
                    relation: rel,
                    auditSecu: auditSecu
                };
            })
            .filter(item => item.auditSecu); // Filter out any undefined audit secus
    };

    const auditSecusFromRelations = getAuditSecusFromRelations();

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Audits de sécurité</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => onOpenDialog('audits')}
                >
                    Ajouter un audit de sécurité
                </Button>
            </Box>

            {errors.relations && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.relations}
                </Alert>
            )}

            {auditSecusFromRelations.length > 0 ? (
                <Grid container spacing={2}>
                    {auditSecusFromRelations.map((item, index) => {
                        const { relation, auditSecu } = item;
                        return (
                            <Grid item xs={12} md={6} key={`audit-${relation.objectId}`}>
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
                                                    <ShieldIcon />
                                                </Avatar>
                                                <Typography variant="subtitle1">
                                                    {auditSecu?.title || `Audit #${index + 1}`}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={relation.answer || false}
                                                            onChange={() => onToggleAuditSecuAnswer(relation.objectId)}
                                                            color="primary"
                                                        />
                                                    }
                                                    label="Applicable"
                                                />
                                                <IconButton
                                                    color="error"
                                                    onClick={() => onRemoveAuditSecu(relation.objectId)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                        {auditSecu?.description && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                                {auditSecu.description}
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
                    Aucun audit de sécurité n'a été ajouté. Utilisez le bouton "Ajouter un audit de sécurité" pour en ajouter.
                </Alert>
            )}
        </Box>
    );
};

export default BdtTabAuditSecu;
