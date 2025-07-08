// src/components/MultipleSelectionDialog/MultipleRiskSelectionDialog.tsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Checkbox,
    TextField,
    Box,
    Typography,
    Chip,
    IconButton,
    Divider,
    Alert,
    Fab,
} from '@mui/material';
import {
    TransferWithinAStation as TransferIcon,
    Search as SearchIcon,
    Add as AddIcon,
    Clear as ClearIcon,
    CheckBox as CheckBoxIcon,
    CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import RisqueDTO from '../../utils/entitiesDTO/RisqueDTO';
import useRisque from '../../hooks/useRisque';
import RisqueCreationDialog from './RisqueCreationDialog.tsx';

interface MultipleRiskSelectionDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (selectedRisks: RisqueDTO[], risksToUnlink?: RisqueDTO[]) => void;
    availableRisks: Map<number, RisqueDTO>;
    alreadySelectedRiskIds: number[];
    initiallySelectedRiskIds?: number[]; // New prop for pre-selecting risks in the dialog
    title?: string;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    onRiskDataRefresh?: () => Promise<void>; // Callback to refresh parent's risk data
}

const MultipleRiskSelectionDialog: React.FC<MultipleRiskSelectionDialogProps> = ({
    open,
    onClose,
    onConfirm,
    availableRisks,
    alreadySelectedRiskIds,
    initiallySelectedRiskIds = [],
    title = "Sélectionner des Risques",
    maxWidth = "lg",
    onRiskDataRefresh
}) => {
    const [searchLeft, setSearchLeft] = useState("");
    const [searchRight, setSearchRight] = useState("");
    const [selectedRisks, setSelectedRisks] = useState<Set<number>>(new Set());
    const [risksToUnlink, setRisksToUnlink] = useState<Set<number>>(new Set()); // Track risks to unlink
    const [leftChecked, setLeftChecked] = useState<Set<number>>(new Set());
    const [rightChecked, setRightChecked] = useState<Set<number>>(new Set());
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    const { getAllRisques } = useRisque();

    // Initialize selected risks when dialog opens
    useEffect(() => {
        if (open) {
            // Filter initiallySelectedRiskIds to only include those that exist in availableRisks
            // and are not already linked (not in alreadySelectedRiskIds)
            const validInitialIds = initiallySelectedRiskIds.filter(id => 
                availableRisks.has(id) && !alreadySelectedRiskIds.includes(id)
            );
            setSelectedRisks(new Set(validInitialIds));
            setRisksToUnlink(new Set()); // Reset unlink list
            setLeftChecked(new Set());
            setRightChecked(new Set());
        }
    }, [open]);

    // Filter available risks (exclude already linked ones, but include those marked for unlinking)
    const availableRisksList = useMemo(() => {
        return Array.from(availableRisks.values()).filter(risk => {
            const riskId = risk.id as number;
            const isAlreadyLinked = alreadySelectedRiskIds.includes(riskId);
            const isMarkedForUnlinking = risksToUnlink.has(riskId);
            
            // Show risk if it's not already linked OR if it's marked for unlinking
            return !isAlreadyLinked || isMarkedForUnlinking;
        });
    }, [availableRisks, alreadySelectedRiskIds, risksToUnlink]);

    // Filter risks based on search
    const filteredAvailableRisks = useMemo(() => {
        if (!searchLeft.trim()) return availableRisksList;
        const searchTerm = searchLeft.toLowerCase();
        return availableRisksList.filter(risk =>
            risk.title?.toLowerCase().includes(searchTerm) ||
            risk.description?.toLowerCase().includes(searchTerm)
        );
    }, [availableRisksList, searchLeft]);

    // Get combined list for the right side: already linked risks (not marked for unlinking) + newly selected risks
    const rightSideRisks = useMemo(() => {
        const alreadyLinkedRisks = alreadySelectedRiskIds
            .filter(id => !risksToUnlink.has(id)) // Exclude risks marked for unlinking
            .map(id => availableRisks.get(id))
            .filter(Boolean) as RisqueDTO[];
        
        const newlySelectedRisks = Array.from(selectedRisks)
            .map(id => availableRisks.get(id))
            .filter(Boolean) as RisqueDTO[];
        
        return [...alreadyLinkedRisks, ...newlySelectedRisks];
    }, [alreadySelectedRiskIds, selectedRisks, availableRisks, risksToUnlink]);

    const filteredSelectedRisks = useMemo(() => {
        if (!searchRight.trim()) return rightSideRisks;
        const searchTerm = searchRight.toLowerCase();
        return rightSideRisks.filter(risk =>
            risk.title?.toLowerCase().includes(searchTerm) ||
            risk.description?.toLowerCase().includes(searchTerm)
        );
    }, [rightSideRisks, searchRight]);

    const handleToggle = (riskId: number, isSelected: boolean) => {
        if (isSelected) {
            // For right side: toggle rightChecked for bulk operations
            setRightChecked(prev => {
                const newSet = new Set(prev);
                if (newSet.has(riskId)) {
                    newSet.delete(riskId);
                } else {
                    newSet.add(riskId);
                }
                return newSet;
            });
        } else {
            // For left side: toggle leftChecked for bulk operations
            setLeftChecked(prev => {
                const newSet = new Set(prev);
                if (newSet.has(riskId)) {
                    newSet.delete(riskId);
                } else {
                    newSet.add(riskId);
                }
                return newSet;
            });
        }
    };

    const handleMoveToSelected = () => {
        setSelectedRisks(prev => new Set([...prev, ...leftChecked]));
        // Remove any risks from unlink list if they're being moved back to selected
        setRisksToUnlink(prev => {
            const newSet = new Set(prev);
            leftChecked.forEach(id => newSet.delete(id));
            return newSet;
        });
        setLeftChecked(new Set());
    };

    const handleMoveToAvailable = () => {
        // For already linked risks, mark them for unlinking instead of adding to selectedRisks
        const alreadyLinkedInChecked = Array.from(rightChecked).filter(id => 
            alreadySelectedRiskIds.includes(id)
        );
        const newlySelectedInChecked = Array.from(rightChecked).filter(id => 
            !alreadySelectedRiskIds.includes(id)
        );

        // Remove newly selected risks from selectedRisks
        setSelectedRisks(prev => {
            const newSet = new Set(prev);
            newlySelectedInChecked.forEach(id => newSet.delete(id));
            return newSet;
        });

        // Mark already linked risks for unlinking
        setRisksToUnlink(prev => new Set([...prev, ...alreadyLinkedInChecked]));
        
        setRightChecked(new Set());
    };

    const handleSelectAllLeft = () => {
        const allIds = filteredAvailableRisks.map(risk => risk.id as number);
        setLeftChecked(new Set(allIds));
    };

    const handleSelectAllRight = () => {
        // Select all filtered risks on the right side
        const allIds = filteredSelectedRisks.map(risk => risk.id as number);
        setRightChecked(new Set(allIds));
    };

    const handleClearLeft = () => setLeftChecked(new Set());
    const handleClearRight = () => setRightChecked(new Set());

    const handleConfirm = async () => {
        setIsConfirming(true);
        try {
            const risksToReturn = Array.from(selectedRisks).map(id => availableRisks.get(id)).filter(Boolean) as RisqueDTO[];
            const risksToUnlinkReturn = Array.from(risksToUnlink).map(id => availableRisks.get(id)).filter(Boolean) as RisqueDTO[];
            await onConfirm(risksToReturn, risksToUnlinkReturn);
            onClose();
        } finally {
            setIsConfirming(false);
        }
    };

    const handleRiskCreated = async (newRisk: RisqueDTO) => {
        if (newRisk.id) {
            // Refresh the parent's risks data if callback is provided
            if (onRiskDataRefresh) {
                await onRiskDataRefresh();
            } else {
                // Fallback to refreshing our own hook's data
                await getAllRisques();
            }
            // Auto-select the newly created risk
            setSelectedRisks(prev => new Set([...prev, newRisk.id as number]));
        }
        setShowCreateDialog(false);
    };

    const renderRiskList = (risks: RisqueDTO[], isSelected: boolean, checkedSet: Set<number>) => (
        <List dense sx={{ height: 300, overflow: 'auto' }}>
            {risks.map((risk) => {
                const riskId = risk.id as number;
                const isChecked = checkedSet.has(riskId);
                const isAlreadyLinked = alreadySelectedRiskIds.includes(riskId);
                const isInSelectedRisks = selectedRisks.has(riskId);
                const isMarkedForUnlinking = risksToUnlink.has(riskId);
                
                // Calculate checkbox state - show checked if it's in the checkedSet
                const checkboxChecked = isChecked;
                
                return (
                    <ListItem key={riskId} disablePadding>
                        <ListItemButton 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleToggle(riskId, isSelected);
                            }} 
                            dense
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checkboxChecked}
                                    tabIndex={-1}
                                    disableRipple
                                    size="small"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Box>
                                        <Typography 
                                            variant="subtitle2"
                                            color={
                                                isMarkedForUnlinking ? "error.main" :
                                                isAlreadyLinked ? "text.secondary" : 
                                                (isInSelectedRisks ? "primary.main" : "text.primary")
                                            }
                                        >
                                            {risk.title}
                                            {isAlreadyLinked && !isMarkedForUnlinking && " (déjà lié)"}
                                            {isMarkedForUnlinking && " (sera délié)"}
                                            {!isSelected && isInSelectedRisks && " (ajouté)"}
                                        </Typography>
                                        {risk.permitType && (
                                            <Chip 
                                                label={risk.permitType} 
                                                size="small" 
                                                color="warning" 
                                                sx={{ mt: 0.5 }} 
                                            />
                                        )}
                                    </Box>
                                }
                                secondary={
                                    <Typography variant="caption" color="text.secondary" noWrap>
                                        {risk.description}
                                    </Typography>
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                );
            })}
            {risks.length === 0 && (
                <ListItem>
                    <ListItemText
                        primary={
                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                {isSelected ? "Aucun risque sélectionné" : "Aucun risque disponible"}
                            </Typography>
                        }
                    />
                </ListItem>
            )}
        </List>
    );

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
                <DialogTitle>
                    <Box display="flex" alignItems="center" gap={1}>
                        <TransferIcon color="primary" />
                        {title}
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {/* Available Risks */}
                        <Grid item xs={12} md={5}>
                            <Paper variant="outlined" sx={{ p: 2 }}>
                                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                    <Typography variant="h6">Risques Disponibles</Typography>
                                    <Box>
                                        <IconButton size="small" onClick={handleSelectAllLeft} title="Tout sélectionner">
                                            <CheckBoxIcon />
                                        </IconButton>
                                        <IconButton size="small" onClick={handleClearLeft} title="Tout désélectionner">
                                            <CheckBoxOutlineBlankIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                                
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Rechercher des risques..."
                                    value={searchLeft}
                                    onChange={(e) => setSearchLeft(e.target.value)}
                                    InputProps={{
                                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    }}
                                    sx={{ mb: 2 }}
                                />
                                
                                <Typography variant="caption" color="text.secondary">
                                    {filteredAvailableRisks.length} risque(s) • {leftChecked.size} sélectionné(s)
                                </Typography>
                                
                                {renderRiskList(filteredAvailableRisks, false, leftChecked)}
                                
                                <Box mt={2}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={() => setShowCreateDialog(true)}
                                        fullWidth
                                        size="small"
                                    >
                                        Créer un nouveau risque
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Transfer Controls */}
                        <Grid item xs={12} md={2}>
                            <Box 
                                display="flex" 
                                flexDirection="column" 
                                alignItems="center" 
                                justifyContent="center"
                                height="100%"
                                gap={2}
                            >
                                <Button
                                    variant="contained"
                                    onClick={handleMoveToSelected}
                                    disabled={leftChecked.size === 0}
                                    sx={{ minWidth: 120 }}
                                >
                                    Ajouter →
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleMoveToAvailable}
                                    disabled={rightChecked.size === 0}
                                    sx={{ minWidth: 120 }}
                                >
                                    ← Retirer
                                </Button>
                            </Box>
                        </Grid>

                        {/* Selected Risks */}
                        <Grid item xs={12} md={5}>
                            <Paper variant="outlined" sx={{ p: 2 }}>
                                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                    <Typography variant="h6">Risques du Document</Typography>
                                    <Box>
                                        <IconButton size="small" onClick={handleSelectAllRight} title="Tout sélectionner">
                                            <CheckBoxIcon />
                                        </IconButton>
                                        <IconButton size="small" onClick={handleClearRight} title="Tout désélectionner">
                                            <CheckBoxOutlineBlankIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                                
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Rechercher dans les sélectionnés..."
                                    value={searchRight}
                                    onChange={(e) => setSearchRight(e.target.value)}
                                    InputProps={{
                                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    }}
                                    sx={{ mb: 2 }}
                                />
                                
                                <Typography variant="caption" color="text.secondary">
                                    {filteredSelectedRisks.length} risque(s) • {alreadySelectedRiskIds.length - risksToUnlink.size} déjà liés • {selectedRisks.size} nouveaux • {risksToUnlink.size} à délier
                                </Typography>
                                
                                {renderRiskList(filteredSelectedRisks, true, rightChecked)}
                            </Paper>
                        </Grid>
                    </Grid>

                    {(selectedRisks.size > 0 || risksToUnlink.size > 0) && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            {selectedRisks.size > 0 && `${selectedRisks.size} nouveau(x) risque(s) seront ajoutés au document.`}
                            {selectedRisks.size > 0 && risksToUnlink.size > 0 && " "}
                            {risksToUnlink.size > 0 && `${risksToUnlink.size} risque(s) seront déliés du document.`}
                        </Alert>
                    )}
                </DialogContent>
                
                <DialogActions>
                    <Button onClick={onClose}>Annuler</Button>
                    <LoadingButton
                        variant="contained"
                        onClick={handleConfirm}
                        loading={isConfirming}
                        disabled={selectedRisks.size === 0 && risksToUnlink.size === 0}
                    >
                        Confirmer les modifications
                    </LoadingButton>
                </DialogActions>
            </Dialog>

            <RisqueCreationDialog
                open={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
                onRiskCreated={handleRiskCreated}
            />
        </>
    );
};

export default MultipleRiskSelectionDialog;
