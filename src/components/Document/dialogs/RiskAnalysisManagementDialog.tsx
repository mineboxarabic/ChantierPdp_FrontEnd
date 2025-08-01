import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Stack,
    Divider,
    Alert,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    ListItemSecondaryAction,
    Chip
} from '@mui/material';
import {
    Add as AddIcon,
    Description as DescriptionIcon,
    CheckCircle as CheckCircleIcon,
    Link as LinkIcon
} from '@mui/icons-material';
import RisqueDTO from '../../../utils/entitiesDTO/RisqueDTO';
import { AnalyseDeRisqueDTO } from '../../../utils/entitiesDTO/AnalyseDeRisqueDTO';

interface RiskAnalysisManagementDialogProps {
    open: boolean;
    onClose: () => void;
    risk: RisqueDTO | null;
    allAnalyses: Map<number, AnalyseDeRisqueDTO>;
    linkedAnalysisIds: Set<number>;
    onLinkAnalysis: (analysisId: number) => void;
    onCreateAnalysis: (risk: RisqueDTO) => void;
}

const RiskAnalysisManagementDialog: React.FC<RiskAnalysisManagementDialogProps> = ({
    open,
    onClose,
    risk,
    allAnalyses,
    linkedAnalysisIds,
    onLinkAnalysis,
    onCreateAnalysis,
}) => {
    if (!risk) return null;

    const analysesForThisRisk = Array.from(allAnalyses.values()).filter(
        (analyse) => analyse.risque?.id === risk.id
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ pb: 1 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <DescriptionIcon color="primary" />
                    <Box>
                        <Typography variant="h6" component="div">
                            Gestion des Analyses pour le Risque
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {risk.title}
                        </Typography>
                    </Box>
                </Stack>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0 }}>
                <Box sx={{ p: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => onCreateAnalysis(risk)}
                    >
                        Créer une nouvelle analyse pour ce risque
                    </Button>
                </Box>

                {analysesForThisRisk.length > 0 ? (
                    <List sx={{ py: 0 }}>
                        <Divider />
                        {analysesForThisRisk.map((analysis, index) => {
                            const isLinked = analysis.id !== undefined && linkedAnalysisIds.has(analysis.id);
                            return (
                                <React.Fragment key={analysis.id}>
                                    <ListItem sx={{ py: 1.5 }}>
                                        <ListItemIcon>
                                            <DescriptionIcon color={isLinked ? "success" : "action"} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={analysis.deroulementDesTaches || 'Analyse sans nom'}
                                            secondary={`Mesures: ${analysis.mesuresDePrevention || 'Non spécifiées'}`}
                                        />
                                        <ListItemSecondaryAction>
                                            {isLinked ? (
                                                <Chip
                                                    icon={<CheckCircleIcon />}
                                                    label="Liée"
                                                    color="success"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            ) : (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<LinkIcon />}
                                                    onClick={() => onLinkAnalysis(analysis.id!)}
                                                >
                                                    Lier
                                                </Button>
                                            )}
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    {index < analysesForThisRisk.length - 1 && <Divider component="li" />}
                                </React.Fragment>
                            );
                        })}
                    </List>
                ) : (
                    <Box sx={{ p: 2 }}>
                        <Alert severity="info" variant="outlined" icon={<DescriptionIcon />}>
                            Aucune analyse de risque n'a encore été créée pour ce risque spécifique.
                            Cliquez sur le bouton ci-dessus pour en créer une.
                        </Alert>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fermer</Button>
            </DialogActions>
        </Dialog>
    );
};

export default React.memo(RiskAnalysisManagementDialog);