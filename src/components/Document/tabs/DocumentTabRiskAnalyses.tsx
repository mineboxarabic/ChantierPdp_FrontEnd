
import React, { useMemo, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Stack,
    Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { DocumentDTO } from '../../../utils/entitiesDTO/DocumentDTO';
import RisqueDTO from '../../../utils/entitiesDTO/RisqueDTO';
import ObjectAnsweredObjects from '../../../utils/ObjectAnsweredObjects';
import { SectionTitle } from '../../../pages/Home/styles';
import { AnalyseDeRisqueDTO } from "../../../utils/entitiesDTO/AnalyseDeRisqueDTO.ts";

type DialogTypes = 'risques' | 'dispositifs' | 'permits' | 'analyseDeRisques' | 'editAnalyseDeRisque' | 'audits' | '';

interface DocumentTabRiskAnalysesProps<T extends DocumentDTO> {
    formData: T;
    errors: Record<string, string>;
    allRisquesMap: Map<number, RisqueDTO>;
    allAnalysesMap: Map<number, AnalyseDeRisqueDTO>;
    onOpenDialog: (type: DialogTypes, data?: any) => void;
    onDeleteRelation: (objectId: number, objectType: ObjectAnsweredObjects) => void;
    onAddRelation: (objectType: ObjectAnsweredObjects, selectedItem: any) => void;
}

const DocumentTabRiskAnalyses = <T extends DocumentDTO>({
    formData,
    errors,
    allRisquesMap,
    allAnalysesMap,
    onOpenDialog,
}: DocumentTabRiskAnalysesProps<T>) => {
    const [selectedRiskForAnalysis, setSelectedRiskForAnalysis] = useState<RisqueDTO | null>(null);

    const linkedRisks = useMemo(() => {
        if (!formData.relations) return [];
        return formData.relations
            .filter(rel => rel.objectType === ObjectAnsweredObjects.RISQUE && rel.answer === true)
            .map(rel => allRisquesMap.get(rel.objectId as number))
            .filter((r): r is RisqueDTO => r !== undefined);
    }, [formData.relations, allRisquesMap]);

    const analysesLinkedToDocument = useMemo(() => {
        if (!formData.relations) return new Set<number>();
        return new Set(
            formData.relations
                .filter(rel => rel.objectType === ObjectAnsweredObjects.ANALYSE_DE_RISQUE && rel.answer === true)
                .map(rel => rel.objectId)
        );
    }, [formData.relations]);

    const handleManageAnalyses = (risk: RisqueDTO) => {
        onOpenDialog('analyseDeRisques', risk);
    };

    return (
        <Paper elevation={2} sx={{ p: { xs: 1.5, md: 2.5 }, borderRadius: 2 }}>
            <SectionTitle variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2, pb: 0, '&:after': { display: 'none' } }}>
                Gestion des Analyses de Risques par Risque
            </SectionTitle>

            {errors.analyses && <Alert severity="error" sx={{ mb: 2 }}>{errors.analyses}</Alert>}

            {linkedRisks.length > 0 ? (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Risque</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell align="center">Analyses Liées</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {linkedRisks.map(risk => {
                                const analysesForThisRisk = Array.from(allAnalysesMap.values()).filter(
                                    (analyse) => analyse.risque?.id === risk.id
                                );
                                const linkedAnalysesCount = analysesForThisRisk.filter(a => a.id && analysesLinkedToDocument.has(a.id)).length;

                                return (
                                    <TableRow key={risk.id}>
                                        <TableCell>
                                            <Typography variant="subtitle2">{risk.title}</Typography>
                                        </TableCell>
                                        <TableCell>{risk.description}</TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={`${linkedAnalysesCount} / ${analysesForThisRisk.length}`}
                                                color={linkedAnalysesCount > 0 ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<VisibilityIcon />}
                                                onClick={() => handleManageAnalyses(risk)}
                                            >
                                                Gérer les Analyses
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Alert severity="info">
                    Aucun risque n'a été ajouté à ce document. Veuillez d'abord ajouter des risques dans l'onglet "Risques/Dispositifs".
                </Alert>
            )}
        </Paper>
    );
};

export default DocumentTabRiskAnalyses;
