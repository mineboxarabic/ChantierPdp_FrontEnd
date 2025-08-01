import React from 'react';
import {
    Box,
    Typography,
    Button,
    Alert,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Chip,
    Stack
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import { BdtDTO } from '../../../utils/entitiesDTO/BdtDTO';

interface BdtTabComplementsProps {
    formData: BdtDTO;
    errors: Record<string, string>;
    onOpenDialog: (type: 'complement') => void;
    onRemoveItem: (type: string, index: number) => void;
    onToggleAnswer: (type: string, index: number) => void;
}

const BdtTabComplements: React.FC<BdtTabComplementsProps> = ({
    formData,
    errors,
    onOpenDialog,
    onRemoveItem,
    onToggleAnswer
}) => {
    return (
        <Paper elevation={2} sx={{ p: { xs: 1.5, md: 2.5 }, borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">Compléments ou Rappels</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => onOpenDialog('complement')}
                >
                    Ajouter
                </Button>
            </Stack>

            {errors.complementOuRappels && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.complementOuRappels}
                </Alert>
            )}

            {formData.complementOuRappels && formData.complementOuRappels.length > 0 ? (
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Complément / Rappel</TableCell>
                                <TableCell align="center">Statut</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {formData.complementOuRappels.map((complement, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        {complement.complement}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            icon={complement.respect ? <CheckCircleIcon /> : <CancelIcon />}
                                            label={complement.respect ? 'Respecté' : 'Non Respecté'}
                                            color={complement.respect ? 'success' : 'default'}
                                            onClick={() => onToggleAnswer('complementOuRappels', index)}
                                            size="small"
                                            sx={{ cursor: 'pointer' }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton color="error" onClick={() => onRemoveItem('complementOuRappels', index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Alert severity="info" variant="outlined">
                    Aucun complément ou rappel n'a été ajouté. Cliquez sur "Ajouter" pour commencer.
                </Alert>
            )}
        </Paper>
    );
};

export default BdtTabComplements;