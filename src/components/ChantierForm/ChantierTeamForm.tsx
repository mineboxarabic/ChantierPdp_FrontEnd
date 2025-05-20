// src/components/ChantierForm/ChantierTeamForm.tsx
import React, { FC, useState, useMemo } from 'react';
import {
    Grid,
    TextField,
    Autocomplete,
    Box,
    Typography,
    IconButton,
    List,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    Chip,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormHelperText,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Person as PersonIcon,
    AddCircleOutline as AddIcon,
    SupervisorAccount as DonneurDOrdreIcon,
    Group as TeamIcon,
} from '@mui/icons-material';

import { ChantierDTO } from '../../utils/entitiesDTO/ChantierDTO';
import { UserDTO } from '../../utils/entitiesDTO/UserDTO'; // Or User if not a DTO
import { WorkerDTO } from '../../utils/entitiesDTO/WorkerDTO';
import { SectionTitle, ListItemCard } from '../../pages/Home/styles.js'; // Adjust path
import SelectOrCreateWorker from '../../components/Pdp/SelectOrCreateWorker'; // Existing component from EditCreateChantier
import WorkerModal from '../../pages/Worker/WorkerModal'; // Existing component
import { EntrepriseDTO } from '../../utils/entitiesDTO/EntrepriseDTO.js';
import { deselectWorkerFromChantier } from '../../hooks/useWorkerSelection.js';

interface ChantierTeamFormProps {
    formData: ChantierDTO;
    onInputChange: (field: keyof ChantierDTO, value: any) => void;
    errors: Record<string, string>;
    allUsers: UserDTO[];
    allWorkers: WorkerDTO[]; // All available workers in the system
    workersOfChantier: WorkerDTO[]; // Workers currently associated with this chantier
    setWorkersOfChantier: (workers: WorkerDTO[]) => void; // To update the list in the parent
    chantierId?: number; // Needed for SelectOrCreateWorker to associate
    allEntreprisesOfChantier?: EntrepriseDTO[]; // Assuming this is needed for SelectOrCreateWorker
}

const ChantierTeamForm: FC<ChantierTeamFormProps> = ({
    formData,
    onInputChange,
    errors,
    allUsers,
    allWorkers, // This prop might be used by SelectOrCreateWorker or for a simpler selection
    workersOfChantier,
    setWorkersOfChantier,
    allEntreprisesOfChantier,
    chantierId,
}) => {
    const [workerSelectDialogOpen, setWorkerSelectDialogOpen] = useState(false);
    const [workerModalOpen, setWorkerModalOpen] = useState(false);
    const [currentWorkerForModal, setCurrentWorkerForModal] = useState<number | undefined>(undefined);

    const selectedDonneurDOrdre = useMemo(() => {
        return allUsers.find(u => u.id === formData.donneurDOrdre) || null;
    }, [formData.donneurDOrdre, allUsers]);

    const selectedWorkerDTOs = useMemo(() => {
        return workersOfChantier;
    }, [workersOfChantier]);


    const handleRemoveWorker = (workerIdToRemove: number | undefined) => {
        if (!workerIdToRemove) return;
        const updatedWorkers = workersOfChantier.filter(w => w.id !== workerIdToRemove);
        setWorkersOfChantier(updatedWorkers);
        // Also update formData.workerSelections if it's the array of IDs
        deselectWorkerFromChantier({worker:workerIdToRemove, chantier: formData.id});
    };

    const handleOpenWorkerModal = (workerId?: number) => {
        setCurrentWorkerForModal(workerId); // if undefined, it's a new worker
        setWorkerModalOpen(true);
    };
    
    // Callback for SelectOrCreateWorker
    const handleWorkersSelected = (selectedWorkers: WorkerDTO[]) => {
        setWorkersOfChantier(selectedWorkers);
        // Update the workerSelections field in formData with just IDs
        onInputChange('workerSelections', selectedWorkers.map(w => w.id));
        setWorkerSelectDialogOpen(false);
    };


    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <SectionTitle variant="h6">Équipe et Responsables</SectionTitle>
            </Grid>

            <Grid item xs={12}>
                <Autocomplete
                    options={allUsers}
                    getOptionLabel={(option) => option.username || option.name || `Utilisateur ID: ${option.id}`}
                    value={selectedDonneurDOrdre}
                    onChange={(_, newValue) => {
                        onInputChange('donneurDOrdre', newValue ? newValue.id : undefined);
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Donneur d'Ordre"
                            required
                            variant="outlined"
                            error={!!errors.donneurDOrdre}
                            helperText={errors.donneurDOrdre || "Qui est le responsable principal (interne)?"}
                        />
                    )}
                    renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.id}>
                            <DonneurDOrdreIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            {option.username || option.name} ({option.email})
                        </Box>
                    )}
                />
            </Grid>

            <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                    <Chip icon={<TeamIcon />} label="Intervenants sur le chantier" />
                </Divider>
            </Grid>

            <Grid item xs={12} container spacing={1} justifyContent="flex-end">
                 <Grid item>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            console.log('Open worker selection dialog' , workerSelectDialogOpen);
                            setWorkerSelectDialogOpen(true);
                        }}
                    >
                        Sélectionner des Intervenants
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenWorkerModal()} // For creating a new worker
                    >
                        Créer Nouvel Intervenant
                    </Button>
                </Grid>
            </Grid>
             {errors.workerSelections && (
                <Grid item xs={12}>
                    <FormHelperText error>{errors.workerSelections}</FormHelperText>
                </Grid>
            )}


            {selectedWorkerDTOs.length > 0 ? (
                <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                        Intervenants Affectés:
                    </Typography>
                    <Paper variant="outlined" sx={{ maxHeight: 350, overflow: 'auto', p: 1 }}>
                        <List dense>
                            {selectedWorkerDTOs.map((worker) => (
                                <ListItemCard key={worker.id} sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PersonIcon color="primary" sx={{ mr: 1.5 }} />
                                        <ListItemText
                                            primary={`${worker.nom || ''} ${worker.prenom || ''}`}
                                            secondary={worker.entreprise?.nom || worker.entrepriseName || 'Entreprise non spécifiée'}
                                        />
                                    </Box>
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="edit" onClick={() => handleOpenWorkerModal(worker.id)} color="primary">
                                            <PersonIcon /> {/* Or EditIcon */}
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveWorker(worker.id)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItemCard>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            ) : (
                 <Grid item xs={12}>
                    <Typography color="text.secondary" sx={{ my: 2, textAlign: 'center' }}>
                        Aucun intervenant affecté pour le moment.
                    </Typography>
                </Grid>
            )}

            {/* Dialog for selecting/creating workers (reusing existing component) */}
            {chantierId && formData.entrepriseUtilisatrice && Array.isArray(formData.entrepriseExterieurs) &&  (
                 <SelectOrCreateWorker
                    open={workerSelectDialogOpen}
                    onClose={() => setWorkerSelectDialogOpen(false)}
                    entreprisesGroupes={allEntreprisesOfChantier}
                    onSelectWorkers={handleWorkersSelected}
                    chantierId={chantierId} // Pass chantierId if it's an edit mode
                    title="Sélectionner ou Ajouter des Intervenants"
                    multiple={true}
                    groupByEntreprise={true} // Assuming this is desired
                    // initialSelection={workersOfChantier.map(w => w.id as number)}
                />
            )}


            {/* Modal for creating/editing a single worker (reusing existing component) */}
            <WorkerModal
                workerId={currentWorkerForModal as number}
                open={workerModalOpen}
                onClose={() => {
                    setWorkerModalOpen(false);
                }}
            />
        </Grid>
    );
};

export default ChantierTeamForm;