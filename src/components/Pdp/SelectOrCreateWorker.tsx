import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Autocomplete,
    Box,
    Typography,
    Divider,
    Stack,
    Chip,
    IconButton,
    CircularProgress,
    Alert,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useWorker from "../../hooks/useWoker.ts";
import useEntreprise from "../../hooks/useEntreprise.ts";
import useWorkerSelection from "../../hooks/useWorkerSelection.ts";
import { EntrepriseDTO } from '../../utils/entitiesDTO/EntrepriseDTO.ts';
import { WorkerDTO } from '../../utils/entitiesDTO/WorkerDTO.ts';

interface SelectOrCreateWorkerProps {
    open: boolean;
    onClose: () => void;
    onSelectWorkers: (workers: WorkerDTO[]) => void;
    initialSelectedWorkers?: WorkerDTO[];
    title?: string;
    multiple?: boolean;
    entrepriseId?: number;
    pdpId?: number;
    chantierId?: number;
    groupByEntreprise?: boolean;
    entreprisesGroupes?: EntrepriseDTO[];
}

const SelectOrCreateWorker: React.FC<SelectOrCreateWorkerProps> = ({
                                                                       open,
                                                                       onClose,
                                                                       onSelectWorkers,
                                                                       initialSelectedWorkers = [],
                                                                       title = 'Select Workers',
                                                                       multiple = true,
                                                                       entrepriseId,
                                                                       pdpId,
                                                                       chantierId,
                                                                       groupByEntreprise = true,
                                                                       entreprisesGroupes
                                                                   }) => {
    const [selectedWorkers, setSelectedWorkers] = useState<WorkerDTO[]>(Array.isArray(initialSelectedWorkers) ? initialSelectedWorkers : []);
    const [availableWorkers, setAvailableWorkers] = useState<WorkerDTO[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newWorker, setNewWorker] = useState<Partial<WorkerDTO>>({
        nom: '',
        prenom: '',
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEntreprise, setSelectedEntreprise] = useState<number | null>(entrepriseId || null);
    const [workersByEntreprise, setWorkersByEntreprise] = useState<Map<number, WorkerDTO[]>>(new Map());
    const [expandedEntreprise, setExpandedEntreprise] = useState<number | null>(null);
    const [availableEntreprises, setAvailableEntreprises] = useState<Map<number, EntrepriseDTO>>(new Map());

    // Pour gérer l'état de sélection/désélection
    const [pendingSelections, setPendingSelections] = useState<Map<number, boolean>>(new Map());

    const {
        loading: workerLoading,
        error: workerError,
        getAllWorkers,
        getWorkersByEntreprise,
        getWorkersByPdp,
        getWorkersByChantier,
        createWorker,
        selectWorkerForChantier,
        deselectWorkerFromChantier,
        getSelectedWorkersForChantier
    } = useWorker();

    const {
        loading: entrepriseLoading,
        error: entrepriseError,
        getAllEntreprises,
        entreprises
    } = useEntreprise();

    // Utiliser directement le hook de sélection des travailleurs
    const workerSelection = useWorkerSelection();

    useEffect(() => {

        console.log("Initial selected workers:", initialSelectedWorkers);
        const fetchData = async () => {
            try {
                // Initialize available entreprises
                const entreprisesMap = new Map<number, EntrepriseDTO>();

                // If entreprisesGroupes is provided, use those
                if (entreprisesGroupes && entreprisesGroupes.length > 0) {
                    entreprisesGroupes.forEach(entreprise => {
                        if (entreprise.id) {
                            entreprisesMap.set(entreprise.id, entreprise);
                        }
                    });
                    setAvailableEntreprises(entreprisesMap);
                }
                // Otherwise fetch all entreprises if grouping is enabled
                else if (groupByEntreprise) {
                    const fetchedEntreprises = await getAllEntreprises();

                    // If we have entreprises from the hook, use those
                    if (fetchedEntreprises && fetchedEntreprises.length > 0) {
                        fetchedEntreprises.forEach(entreprise => {
                            if (entreprise.id) {
                                entreprisesMap.set(entreprise.id, entreprise);
                            }
                        });
                        setAvailableEntreprises(entreprisesMap);
                    }
                }

                // Fetch workers
                let workersFetched: WorkerDTO[] = [];

                if (entrepriseId) {
                    workersFetched = await getWorkersByEntreprise(entrepriseId);
                    setSelectedEntreprise(entrepriseId);
                } else if (pdpId) {
                    workersFetched = await getWorkersByPdp(pdpId);
                } else {
                    // Charger tous les travailleurs disponibles
                    workersFetched = await getAllWorkers();
                }

                console.log("Fetched workers:", workersFetched);

                setAvailableWorkers(workersFetched);

                // Si nous avons un chantierId, récupérons les travailleurs déjà sélectionnés
                if (chantierId) {
                    try {
                        console.log("Fetching selected workers for chantier:", chantierId);
                        const selectedWorkersData = await getSelectedWorkersForChantier(chantierId);

                        // Vérifier et logger la réponse
                        console.log("Selected workers response:", selectedWorkersData);

                        // Vérifier que nous avons bien reçu un tableau
                        if (Array.isArray(selectedWorkersData)) {
                            setSelectedWorkers(selectedWorkersData);

                            // Initialiser la map des sélections en attente
                            const selectionMap = new Map<number, boolean>();
                            selectedWorkersData.forEach(worker => {
                                if (worker && worker.id) {
                                    console.log("Marking worker as selected:", worker.id, worker.nom);
                                    selectionMap.set(worker.id, true);
                                }
                            });
                            console.log("Initial selection map:", Object.fromEntries(selectionMap));
                            setPendingSelections(selectionMap);
                        } else {
                            console.error("Les travailleurs sélectionnés ne sont pas un tableau:", selectedWorkersData);
                            setSelectedWorkers([]);
                            setPendingSelections(new Map());
                        }
                    } catch (error) {
                        console.error("Erreur lors de la récupération des travailleurs sélectionnés:", error);
                        setSelectedWorkers([]);
                        setPendingSelections(new Map());
                    }
                }

                // Group workers by entreprise if needed
                if (groupByEntreprise) {
                    const groupedWorkers = new Map<number, WorkerDTO[]>();
                    // Initialize empty arrays for all available entreprises
                    Array.from(entreprisesMap.keys()).forEach(id => {
                        groupedWorkers.set(id, []);
                    });

                    // Add workers to their respective entreprises
                    for (const worker of workersFetched) {
                        if (worker.entreprise) {
                            const entrepriseId = worker.entreprise as number;

                            if (!groupedWorkers.has(entrepriseId)) {
                                groupedWorkers.set(entrepriseId, []);
                            }
                            groupedWorkers.get(entrepriseId)?.push(worker);
                        }
                    }
                    console.log("Grouped workers by entreprise:", groupedWorkers);
                    setWorkersByEntreprise(groupedWorkers);

                    // Auto-expand the first entreprise or the selected one
                    if (entrepriseId) {
                        setExpandedEntreprise(entrepriseId);
                    } else if (groupedWorkers.size > 0) {
                        setExpandedEntreprise(Array.from(groupedWorkers.keys())[0]);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (open) {
            // Reset state when opening the dialog
            setSelectedWorkers([]);
            setPendingSelections(new Map());
            fetchData();
        }
    }, [open, entrepriseId, pdpId, chantierId, groupByEntreprise]);


    useEffect(() => {
        console.log("Selected workers updated:", selectedWorkers);
    }, [open]);

    const handleSelectWorker = (event: React.SyntheticEvent, value: WorkerDTO | WorkerDTO[] | null) => {
        if (multiple) {
            // S'assurer que value est un tableau
            const workers = Array.isArray(value) ? value : [];
            setSelectedWorkers(workers);

            // Mettre à jour les sélections en attente
            const selectionMap = new Map<number, boolean>();
            workers.forEach(worker => {
                if (worker && worker.id) {
                    selectionMap.set(worker.id, true);
                }
            });
            setPendingSelections(selectionMap);
        } else {
            // Vérifier que value est bien un objet Worker
            const singleWorker = value as WorkerDTO;
            const workers = singleWorker ? [singleWorker] : [];
            setSelectedWorkers(workers);

            // Mettre à jour les sélections en attente
            const selectionMap = new Map<number, boolean>();
            if (singleWorker && singleWorker.id) {
                selectionMap.set(singleWorker.id, true);
            }
            setPendingSelections(selectionMap);
        }
    };

    const handleCreateWorker = async () => {
        if (!newWorker.nom || !newWorker.prenom) {
            return;
        }

        try {
            // Use either the selected entreprise or the provided entrepriseId
            const workerEntrepriseId = selectedEntreprise || entrepriseId;

            // Prepare the worker object with the required fields
            const workerToCreate: WorkerDTO = {
                ...newWorker,
                entreprise: workerEntrepriseId ?  workerEntrepriseId : undefined,
            } as WorkerDTO;
            console.log("Creating worker with data:", workerToCreate);
            const createdWorker = await createWorker(workerToCreate);

            setAvailableWorkers([...availableWorkers, createdWorker]);

            // Si nous avons un chantierId, sélectionner automatiquement le nouveau travailleur
            if (chantierId && createdWorker.id) {
            //  await selectWorkerForChantier(createdWorker.id, chantierId);

                // S'assurer que selectedWorkers est un tableau
                const currentSelected = Array.isArray(selectedWorkers) ? selectedWorkers : [];

                // Mettre à jour la liste des travailleurs sélectionnés
                selectWorkerForChantier({worker: createdWorker.id, chantier: chantierId});
                setSelectedWorkers([...currentSelected, createdWorker]);

                // Mettre à jour les sélections en attente
                const updatedSelections = new Map(pendingSelections);
                updatedSelections.set(createdWorker.id, true);
                setPendingSelections(updatedSelections);
            } else {
                // Comportement standard si pas de chantierId
                // S'assurer que selectedWorkers est un tableau
                const currentSelected = Array.isArray(selectedWorkers) ? selectedWorkers : [];

                //Select the newly created worker
                setSelectedWorkers([...currentSelected, createdWorker]);
            }

            // Update workers by entreprise map if grouping is enabled
            if (groupByEntreprise && workerEntrepriseId) {
                const updatedMap = new Map(workersByEntreprise);
                if (!updatedMap.has(workerEntrepriseId)) {
                    updatedMap.set(workerEntrepriseId, []);
                }
                updatedMap.get(workerEntrepriseId)?.push(createdWorker);
                setWorkersByEntreprise(updatedMap);
            }

            setNewWorker({ nom: '', prenom: '' });
            setShowCreateForm(false);
        } catch (err) {
            console.error('Error creating worker:', err);
        }
    };

    const handleConfirm = async () => {
        if (chantierId) {
            // Iterate through all available workers
            for (const worker of availableWorkers) {
                if (!worker.id) continue;

                // Check if this worker is in our selected workers
                const isSelectedLocally = selectedWorkers.some(w => w.id === worker.id);

                // Check if the worker is marked as selected in our pendingSelections
                const isPendingSelected = pendingSelections.get(worker.id) === true;

                if (isSelectedLocally || isPendingSelected) {
                    // This worker should be selected
                    await selectWorkerForChantier({worker: worker.id, chantier: chantierId});
                }  else if (pendingSelections.get(worker.id) === false) {
                    // This worker should be deselected
                    await deselectWorkerFromChantier({worker: worker.id, chantier: chantierId});
                }
            }

            // After all operations are done, refresh the list of selected workers
            const updatedSelectedWorkers = await getSelectedWorkersForChantier(chantierId);
            if (Array.isArray(updatedSelectedWorkers)) {
                onSelectWorkers(updatedSelectedWorkers);
            } else {
                // Fallback to our local state if API fails
                onSelectWorkers(selectedWorkers);
            }
        } else {
            // If no chantierId, just pass the selected workers directly
            onSelectWorkers(selectedWorkers);
        }

        // Close the dialog
        onClose();
    }

    const handleToggleWorkerSelection = async (worker: WorkerDTO) => {
        if (!worker.id || !chantierId) return;

        try {
            // Vérifier si le travailleur est actuellement sélectionné
            const isSelected = pendingSelections.get(worker.id) === true;

            // Mettre à jour l'état local de sélection
            const updatedSelections = new Map(pendingSelections);

            if (isSelected) {
                // Désélectionner le travailleur dans l'API
                console.log("Désélection du travailleur:", worker.id);
                const success = await deselectWorkerFromChantier({worker: worker.id, chantier: chantierId});


                    // Mettre à jour l'état local seulement si l'API a réussi
                    updatedSelections.delete(worker.id);
                    setPendingSelections(updatedSelections);

                    // Mettre à jour la liste des travailleurs sélectionnés
                    setSelectedWorkers(prev => prev.filter(w => w.id !== worker.id));

            } else {
                // Sélectionner le travailleur dans l'API
                console.log("Sélection du travailleur:", worker.id);
                const result = await selectWorkerForChantier({worker: worker.id, chantier: chantierId});


                    // Mettre à jour l'état local seulement si l'API a réussi
                    updatedSelections.set(worker.id, true);
                    setPendingSelections(updatedSelections);

                    // Mettre à jour la liste des travailleurs sélectionnés
                    if (!selectedWorkers.some(w => w.id === worker.id)) {
                        setSelectedWorkers(prev => [...prev, worker]);
                    }
                    console.log("Travailleur sélectionné avec succès");

            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la sélection:", error);
        }
    };

    const handleRemoveSelected = (worker: WorkerDTO) => {
        if (!worker.id) return;

        // Mettre à jour l'état local
        const updatedSelections = new Map(pendingSelections);
        updatedSelections.delete(worker.id);
        setPendingSelections(updatedSelections);

        // Mettre à jour la liste des travailleurs sélectionnés
        setSelectedWorkers(prev => prev.filter(w => w.id !== worker.id));
    };

    const filteredWorkers = availableWorkers.filter(worker => {
        const fullName = `${worker.nom || ''} ${worker.prenom || ''}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
    });

    const handleEntrepriseChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedEntreprise(event.target.value as number);
    };

    const handleAccordionChange = (entrepriseId: number) => {
        setExpandedEntreprise(expandedEntreprise === entrepriseId ? null : entrepriseId);
    };

    // Vérifier si un travailleur est sélectionné dans notre état local
    const isWorkerSelected = (workerId?: number): boolean => {
        if (!workerId) return false;
        return pendingSelections.get(workerId) === true;
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{title}</Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                {(workerError || entrepriseError) && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {workerError || entrepriseError}
                    </Alert>
                )}

                {!groupByEntreprise && (
                    <Box sx={{ mb: 2 }}>
                        <Autocomplete
                            multiple={multiple}
                            options={filteredWorkers}
                            value={multiple ? selectedWorkers : selectedWorkers[0] || null}
                            onChange={handleSelectWorker}
                            getOptionLabel={(option) => `${option.nom || ''} ${option.prenom || ''}`}
                            loading={workerLoading}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search workers"
                                    placeholder="Type to search..."
                                    variant="outlined"
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {workerLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">
                        {multiple ? `Selected Workers (${selectedWorkers.length})` : 'Selected Worker'}
                    </Typography>
                    <Button
                        startIcon={<AddIcon />}
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        color="primary"
                        variant="outlined"
                        size="small"
                    >
                        {showCreateForm ? 'Cancel' : 'Create New Worker'}
                    </Button>
                </Box>

                {showCreateForm && (
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>Create New Worker</Typography>

                        {groupByEntreprise && (
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="entreprise-select-label">Entreprise</InputLabel>
                                <Select
                                    labelId="entreprise-select-label"
                                    value={selectedEntreprise || ''}
                                    onChange={(e) => setSelectedEntreprise(e.target.value as number)}
                                    label="Entreprise"
                                >
                                    {entreprisesGroupes ? entreprisesGroupes.map((entreprise) => (
                                        <MenuItem key={entreprise.id} value={entreprise.id}>
                                            {entreprise.nom}
                                        </MenuItem>
                                    )) : (
                                        Array.from(availableEntreprises.values()).map((entreprise) => (
                                            <MenuItem key={entreprise.id} value={entreprise.id}>
                                                {entreprise.nom}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>
                        )}

                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                            <TextField
                                label="Last Name"
                                value={newWorker.nom || ''}
                                onChange={(e) => setNewWorker({ ...newWorker, nom: e.target.value })}
                                fullWidth
                                required
                            />
                            <TextField
                                label="First Name"
                                value={newWorker.prenom || ''}
                                onChange={(e) => setNewWorker({ ...newWorker, prenom: e.target.value })}
                                fullWidth
                                required
                            />
                        </Stack>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateWorker}
                            disabled={!newWorker.nom || !newWorker.prenom || (groupByEntreprise && !selectedEntreprise)}
                        >
                            Create Worker
                        </Button>
                    </Box>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Workers grouped by Entreprise */}
                {groupByEntreprise && (
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Search workers"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        {entrepriseLoading || workerLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                <CircularProgress />
                            </Box>
                        ) : availableEntreprises.size === 0 && workersByEntreprise.size === 0 ? (
                            <Typography color="text.secondary" align="center">
                                No entreprises available
                            </Typography>
                        ) : (
                            // Get entreprises from either the provided list or the fetched workers
                            Array.from(availableEntreprises.size > 0 ? availableEntreprises.keys() : workersByEntreprise.keys()).map((entrepriseId) => {
                                const workers = workersByEntreprise.get(entrepriseId) || [];
                                const filteredEntrepriseWorkers = workers.filter(worker => {
                                    const fullName = `${worker.nom || ''} ${worker.prenom || ''}`.toLowerCase();
                                    return fullName.includes(searchQuery.toLowerCase());
                                });

                                // If there's a search and no workers match, but we still want to show empty entreprises
                                const shouldShow = entreprisesGroupes || filteredEntrepriseWorkers.length > 0 || !searchQuery;

                                if (!shouldShow) {
                                    return null;
                                }

                                const entreprise = availableEntreprises.get(entrepriseId) || entreprises.get(entrepriseId);

                                return (
                                    <Accordion
                                        key={entrepriseId}
                                        expanded={expandedEntreprise === entrepriseId}
                                        onChange={() => handleAccordionChange(entrepriseId)}
                                        sx={{ mb: 1 }}
                                    >
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                                <Typography fontWeight="medium">
                                                    {entreprise?.nom || `Entreprise ${entrepriseId}`}
                                                    <Typography component="span" color="text.secondary">
                                                        {` (${filteredEntrepriseWorkers.length} workers)`}
                                                    </Typography>
                                                </Typography>
                                                <Button
                                                    size="small"
                                                    startIcon={<AddIcon />}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent accordion from toggling
                                                        setSelectedEntreprise(entrepriseId);
                                                        setShowCreateForm(true);
                                                    }}
                                                    sx={{ mr: 2 }}
                                                >
                                                    Add Worker
                                                </Button>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {filteredEntrepriseWorkers.length > 0 ? (
                                                <Stack spacing={1}>
                                                    {filteredEntrepriseWorkers.map((worker) => (
                                                        <Box
                                                            key={worker.id}
                                                            sx={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                p: 1,
                                                                borderRadius: 1,
                                                                bgcolor: isWorkerSelected(worker.id)
                                                                    ? 'primary.50'
                                                                    : 'background.paper',
                                                                '&:hover': {
                                                                    bgcolor: 'action.hover',
                                                                }
                                                            }}
                                                        >
                                                            <Typography>
                                                                {`${worker.prenom || ''} ${worker.nom || ''}`}
                                                            </Typography>
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                color={isWorkerSelected(worker.id) ? "success" : "error"}
                                                                onClick={() => handleToggleWorkerSelection(worker)}
                                                            >
                                                                {isWorkerSelected(worker.id) ? "Selected" : "Unselected"}
                                                            </Button>
                                                        </Box>
                                                    ))}
                                                </Stack>
                                            ) : (
                                                <Box sx={{ textAlign: 'center', py: 2 }}>
                                                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                                                        {searchQuery ? "No workers match your search" : "No workers in this entreprise"}
                                                    </Typography>
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<AddIcon />}
                                                        onClick={() => {
                                                            setSelectedEntreprise(entrepriseId);
                                                            setShowCreateForm(true);
                                                        }}
                                                    >
                                                        Add Worker to {entreprise?.nom || `Entreprise ${entrepriseId}`}
                                                    </Button>
                                                </Box>
                                            )}
                                        </AccordionDetails>
                                    </Accordion>
                                );
                            })
                        )}
                    </Box>
                )}

                <Box sx={{ maxHeight: '200px', overflow: 'auto' }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Selected Workers ({selectedWorkers.length})
                    </Typography>
                    {selectedWorkers.length > 0 ? (
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {selectedWorkers.map((worker) => (
                                <Chip
                                    key={worker.id}
                                    label={`${worker.prenom || ''} ${worker.nom || ''}`}
                                    onDelete={() => handleRemoveSelected(worker)}
                                    color="primary"
                                    sx={{ m: 0.5 }}
                                />
                            ))}
                        </Stack>
                    ) : (
                        <Typography color="text.secondary" align="center">
                            No workers selected
                        </Typography>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="primary"
                >
                    Confirm Selection
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SelectOrCreateWorker;