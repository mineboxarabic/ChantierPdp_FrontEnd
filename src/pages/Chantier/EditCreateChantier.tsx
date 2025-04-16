import React, { FC, useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CircularProgress,
    Divider,
    IconButton,
    Paper,
    TextField,
    Typography,
    FormControl,
    Chip,
    Autocomplete,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    MenuItem,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Tabs,
    Tab
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
    Add,
    Delete,
    Business,
    Person,
    LocationOn,
    Save,
    ArrowBack,
    Assignment
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import useChantier from "../../hooks/useChantier";
import useEntreprise from "../../hooks/useEntreprise";
import useUser from "../../hooks/useUser";
import useBdt from "../../hooks/useBdt";
import usePdp from "../../hooks/usePdp";
import Chantier from "../../utils/entities/Chantier.ts";
import { Entreprise } from "../../utils/entities/Entreprise.ts";
import User from "../../utils/entities/User.ts";
import Localisation from "../../utils/entities/Localisation.ts";
import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
import useLocalisation from "../../hooks/useLocalisation.ts";
import {BDT} from "../../utils/entities/BDT.ts";
import {Pdp} from "../../utils/entities/Pdp.ts";
import {getRoute} from "../../Routes.tsx";
import SelectOrCreateWorker from "../../components/Pdp/SelectOrCreateWorker.tsx";
import Worker from "../../utils/entities/Worker.ts";
import useWoker from "../../hooks/useWoker.ts";
import chantier from "../../utils/entities/Chantier.ts";
import WorkerModal from "../Worker/WorkerModal.tsx";
import ChantierDTO from "../../utils/entitiesDTO/ChantierDTO.ts";

// Custom TabPanel component
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`chantier-tabpanel-${index}`}
            aria-labelledby={`chantier-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `chantier-tab-${index}`,
        'aria-controls': `chantier-tabpanel-${index}`,
    };
}

const TabContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: "16px",
    marginBottom: theme.spacing(3),
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    position: "relative",
    marginBottom: theme.spacing(3),
    paddingBottom: theme.spacing(1),
    "&:after": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "50px",
        height: "3px",
        backgroundColor: theme.palette.primary.main,
    },
}));

const ListItem = styled(Card)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
}));

// Define the tabs
const tabLabels = ['Informations générales', 'Entreprises', 'Équipe', 'Localisation', 'Documents'];

const EditCreateChantier: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // State for form
    const [activeTab, setActiveTab] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showDocumentsTab, setShowDocumentsTab] = useState<boolean>(false);

    // Data states
    const [users, setUsers] = useState<User[]>([]);
    const [currentBdt, setCurrentBdt] = useState<BDT>(new BDT());
    const [workersOfChantier, setWorkersOfChantier] = useState<Worker[]>([]);

    // Chantier data state
    const [formData, setFormData] = useState<ChantierDTO>({
        id: undefined,
        isAnnuelle: false,
        nom: "",
        operation: "",
        dateDebut: new Date(),
        dateFin: new Date(),
        nbHeurs: 0,
        effectifMaxiSurChantier: 0,
        nombreInterimaires: 0,
        entrepriseExterieurs: [],
        entrepriseUtilisatrice: undefined,
        localisation: undefined,
        donneurDOrdre: undefined,
        bdts: [],
        pdps: [],
        workers: []
    });

    // Dialog state
    const [workerDialogOpen, setWorkerDialogOpen] = useState<boolean>(false);
    const [workerSelectDialogOpen, setWorkerSelectDialogOpen] = useState<boolean>(false);
    const [currentWorker, setCurrentWorker] = useState<User>(new User());
    const [isNewWorker, setIsNewWorker] = useState<boolean>(true);
    const [pdpDialogOpen, setPdpDialogOpen] = useState<boolean>(false);
    const [bdtDialogOpen, setBdtDialogOpen] = useState<boolean>(false);

    // Get hooks
    const { getChantier, createChantier, saveChantier, loading: loadingChantier } = useChantier();
    const { getAllEntreprises, loading: loadingEntreprises, entreprises } = useEntreprise();
    const { getUsers, loading: loadingUsers } = useUser();
    const { getAllLocalisations, localisations } = useLocalisation();
    const { createPdp, getAllPDPs, pdps } = usePdp();
    const { getAllBDTs, bdts , deleteBDT} = useBdt();
    const { getAllWorkers, getSelectedWorkersForChantier, deselectWorkerFromChantier, workers, workersInChantier } = useWoker();

    // Load initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);

            try {
                // Fetch enterprises
                getAllEntreprises();
                // Fetch Pdps
                getAllPDPs();
                //Localisations
                getAllLocalisations();
                //Workers
                getAllWorkers();
                //Bdts
                getAllBDTs();

                // Fetch users
                const usersData = await getUsers();
                if (usersData) {
                    setUsers(usersData);
                }

                // Load chantier data if in edit mode
                if (isEditMode && id) {
                    const chantierData = await getChantier(parseInt(id));
                    if (chantierData) {
                        setFormData(chantierData);
                    }
                }
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }

            setIsLoading(false);
        };

        fetchInitialData();
    }, [id, isEditMode]);

    useEffect(() => {
        console.log(formData);
        // Check if Documents tab should be visible
        if (formData.nbHeurs && formData.nbHeurs >= 400 || formData.isAnnuelle) {
            setShowDocumentsTab(true);
        } else {
            setShowDocumentsTab(false);
        }

        if (isEditMode && id) {
            getSelectedWorkersForChantier(parseInt(id) as number).then(e => {
                setWorkersOfChantier(e);
            });
        }
    }, [formData, id, isEditMode]);

    // Handle tab change
    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        if (validateTab(activeTab)) {
            setActiveTab(newValue);
        }
    };

    // Form validation for each tab
    const validateTab = (tab: number): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        if (tab === 0) {
            // Validate general information
            if (!formData.nom || formData.nom.trim() === "") {
                newErrors.nom = "Le nom est requis";
                isValid = false;
            }

            if (!formData.operation || formData.operation.trim() === "") {
                newErrors.operation = "L'opération est requise";
                isValid = false;
            }

            if (!formData.dateDebut) {
                newErrors.dateDebut = "La date de début est requise";
                isValid = false;
            }

            if (!formData.dateFin) {
                newErrors.dateFin = "La date de fin est requise";
                isValid = false;
            }

            if (formData.dateDebut && formData.dateFin && new Date(formData.dateDebut) > new Date(formData.dateFin)) {
                newErrors.dateFin = "La date de fin doit être postérieure à la date de début";
                isValid = false;
            }
        }

        else if (tab === 1) {
            // Validate enterprises
            if (!formData.entrepriseUtilisatrice) {
                newErrors.entrepriseUtilisatrice = "L'entreprise utilisatrice est requise";
                isValid = false;
            }
        }

        else if (tab === 2) {
            // Validate team (optional validation based on requirements)
            if (!formData.donneurDOrdre) {
                newErrors.donneurDOrdre = "Le donneur d'ordre est requis";
                isValid = false;
            }
        }

        else if (tab === 3) {
            // Validate location
            if (!formData.localisation) {
                newErrors.localisation = "La localisation est requise";
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };


    //Getters

    const getBDT = (id: number): BDT => {
       return bdts.get(id) as BDT;
    }

    // Handle form field changes
    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error for this field if it exists
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Handle external enterprises
    const handleAddExternalEnterprise = (entreprise: number) => {
        // Check if enterprise is already added
        if (formData.entrepriseExterieurs?.find(e => e === entreprise)) {
            return;
        }

        setFormData(

            prev => (
                {
            ...prev,
            entrepriseExterieurs: [...(prev.entrepriseExterieurs || []), entreprise]
        })


        );
    };

    const handleRemoveExternalEnterprise = (id: number | undefined) => {
        if (!id) return;

        setFormData(prev => ({
            ...prev,
            entrepriseExterieurs: prev.entrepriseExterieurs?.filter(e => e !== id) || []
        }));
    };

    // Handle workers
    const handleOpenWorkerDialog = (worker?: User) => {
        if (worker) {
            setCurrentWorker(worker);
            setIsNewWorker(false);
        } else {
            setCurrentWorker(new User());
            setIsNewWorker(true);
        }
        setWorkerDialogOpen(true);
    };

    const handleSaveWorker = () => {
        setWorkerDialogOpen(false);
    };

    const handleRemoveWorker = (id_worker: number | undefined) => {
        if (!id_worker) return;

        setWorkersOfChantier(prev => prev.filter(w => w.id !== id_worker));
        if (isEditMode && id) {
            deselectWorkerFromChantier(id_worker as number, parseInt(id) as number);
        }
    };

    // Save chantier
    const handleSaveChantier = async () => {

        console.log('test', formData);
        // Validate all tabs
        for (let i = 0; i < (showDocumentsTab ? 5 : 4); i++) {
            if (!validateTab(i)) {
                setActiveTab(i);
                return;
            }
        }

        setIsLoading(true);
        try {
            let result;
            if (isEditMode && id) {
                // Update existing chantier
                result = await saveChantier(formData, parseInt(id));
            } else {
                // Create new chantier
                result = await createChantier(formData);
            }

            if (result) {
                setSaveSuccess(true);
            }
        } catch (error) {
            console.error("Error saving chantier:", error);
        }
        setIsLoading(false);
    };

    const handleRemovePdp = (id: number | undefined) => {
        if (!id) return;

        setFormData(prev => ({
            ...prev,
            pdps: prev.pdps?.filter(p => p !== id) || []
        }));
    };

    const handleSaveBdt = async () => {
        try {
            navigate(getRoute('CREATE_BDT', { chantierId: id }));
            setBdtDialogOpen(false);
        } catch (error) {
            console.error("Error creating BDT:", error);
        }
    };

    const handleRemoveBdt =async (id: number | undefined) => {
        if (!id) return;


        // Delete BDT
        await deleteBDT(id);

        setFormData(prev => ({
            ...prev,
            bdts: prev.bdts?.filter(b => b !== id) || []
        }));


    };

    // Main render function
    if (loadingChantier || isLoading || loadingEntreprises || loadingUsers) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    const getEntreprise = (id: number): Entreprise => {
        return entreprises.get(id) as Entreprise;
    }

    const getWorker = (id: number): Worker => {
        return workers.get(id) as Worker;
    }

    const getCurrentAllWorkers = () => {
        //Get all the workers in all the entreprises exterieurs and utilisatrice
        const workers = new Set<Worker>();

        if (formData.entrepriseUtilisatrice) {
            getEntreprise(formData.entrepriseUtilisatrice).workers?.forEach(w => workers.add(w));

            formData.entrepriseExterieurs?.map(ee => {
                getEntreprise(ee).workers?.forEach(w => workers.add(w));
            })
        }

        return Array.from(workers) as Worker[];
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, mx: "auto", width: '100%' }}>
            <Paper sx={{ p: 3, borderRadius: "16px", mb: 3, width: '100%' }}>
                <Typography variant="h4" gutterBottom>
                    {isEditMode ? "Modifier le chantier" : "Créer un nouveau chantier"}
                </Typography>

                {formData?.nbHeurs && formData?.nbHeurs >= 400 && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Les entreprises avec plus de 400 heures de travail nécessitent un Plan de Prévention.
                    </Alert>
                )}

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3, mb: 2 }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleChangeTab}
                        aria-label="chantier tabs"
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab label="Informations générales" {...a11yProps(0)} />
                        <Tab label="Entreprises" {...a11yProps(1)} />
                        <Tab label="Équipe" {...a11yProps(2)} />
                        <Tab label="Localisation" {...a11yProps(3)} />
                        {showDocumentsTab && <Tab label="Documents" {...a11yProps(4)} />}
                    </Tabs>
                </Box>

                <TabContainer elevation={1}>
                    {/* Tab 1: General Information */}
                    <TabPanel value={activeTab} index={0}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12 }}>
                                <SectionTitle variant="h5">Informations générales</SectionTitle>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Nom du chantier"
                                    fullWidth
                                    required
                                    value={formData.nom || ''}
                                    onChange={(e) => handleInputChange('nom', e.target.value)}
                                    error={!!errors.nom}
                                    helperText={errors.nom}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }} >
                                <TextField
                                    label="Opération"
                                    fullWidth
                                    required
                                    value={formData.operation || ''}
                                    onChange={(e) => handleInputChange('operation', e.target.value)}
                                    error={!!errors.operation}
                                    helperText={errors.operation}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Date de début"
                                        value={formData.dateDebut ? dayjs(formData.dateDebut) : null}
                                        onChange={(date) => handleInputChange('dateDebut', date?.toDate())}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                required: true,
                                                error: !!errors.dateDebut,
                                                helperText: errors.dateDebut
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Date de fin"
                                        value={formData.dateFin ? dayjs(formData.dateFin) : null}
                                        onChange={(date) => handleInputChange('dateFin', date?.toDate())}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                required: true,
                                                error: !!errors.dateFin,
                                                helperText: errors.dateFin
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Nombre d'heures"
                                    type="number"
                                    fullWidth
                                    value={formData.nbHeurs || 0}
                                    onChange={(e) => handleInputChange('nbHeurs', parseInt(e.target.value))}
                                    InputProps={{ inputProps: { min: 0 } }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Effectif maximal sur chantier"
                                    type="number"
                                    fullWidth
                                    value={formData.effectifMaxiSurChantier || 0}
                                    onChange={(e) => handleInputChange('effectifMaxiSurChantier', parseInt(e.target.value))}
                                    InputProps={{ inputProps: { min: 0 } }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Nombre d'intérimaires"
                                    type="number"
                                    fullWidth
                                    value={formData.nombreInterimaires || 0}
                                    onChange={(e) => handleInputChange('nombreInterimaires', parseInt(e.target.value))}
                                    InputProps={{ inputProps: { min: 0 } }}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Tab 2: Enterprises */}
                    <TabPanel value={activeTab} index={1}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12 }}>
                                <SectionTitle variant="h5">Entreprises</SectionTitle>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <FormControl fullWidth error={!!errors.entrepriseUtilisatrice}>
                                    <Autocomplete
                                        options={Array.from(entreprises.values())}
                                        getOptionLabel={(option) => option?.nom || ""}
                                        value={entreprises.get(formData?.entrepriseUtilisatrice || 0) || null}
                                        onChange={(_, value) => handleInputChange('entrepriseUtilisatrice', value ? value.id  : undefined)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Entreprise Utilisatrice"
                                                required
                                                error={!!errors.entrepriseUtilisatrice}
                                                helperText={errors.entrepriseUtilisatrice}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                    <Typography variant="h6">Entreprises Extérieures</Typography>
                                    <FormControl sx={{ width: 300 }}>
                                        <Autocomplete
                                            options={Array.from(entreprises.values())}
                                            getOptionLabel={(option) => option.nom || ""}
                                            onChange={(_, value) => value && handleAddExternalEnterprise(value?.id as number)}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Ajouter une entreprise" size="small" />
                                            )}
                                        />
                                    </FormControl>
                                </Box>

                                {formData.entrepriseExterieurs && formData.entrepriseExterieurs.length > 0 ? (
                                    formData.entrepriseExterieurs.map((entrepriseRef) => (
                                        <ListItem key={entreprises.get(entrepriseRef)?.id} variant="outlined">
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <Business color="primary" sx={{ mr: 2 }} />
                                                <Box>
                                                    <Typography variant="subtitle1">{entreprises.get(entrepriseRef)?.nom}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {entreprises.get(entrepriseRef)?.raisonSociale} • {entreprises.get(entrepriseRef)?.numTel}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleRemoveExternalEnterprise(entreprises.get(entrepriseRef)?.id)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography color="text.secondary" sx={{ my: 2 }}>
                                        Aucune entreprise extérieure ajoutée
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Tab 3: Team */}
                    <TabPanel value={activeTab} index={2}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12 }}>
                                <SectionTitle variant="h5">Équipe et responsables</SectionTitle>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <FormControl fullWidth error={!!errors.donneurDOrdre}>
                                    <Autocomplete
                                        options={users}
                                        getOptionLabel={(option) => option.username || "no name"}
                                        value={users.find(u => u.id === formData?.donneurDOrdre) || null}
                                        onChange={(_, value) => handleInputChange('donneurDOrdre', value?.id)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Donneur d'ordre"
                                                required
                                                error={!!errors.donneurDOrdre}
                                                helperText={errors.donneurDOrdre}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                    <Typography variant="h6">Intervenants</Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<Add />}
                                        onClick={() => setWorkerSelectDialogOpen(true)}
                                    >
                                        Select un intervenant
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<Add />}
                                        onClick={() => handleOpenWorkerDialog()}
                                    >
                                        Ajouter un intervenant
                                    </Button>
                                </Box>
                                <SelectOrCreateWorker
                                    open={workerSelectDialogOpen}
                                    onClose={() => setWorkerSelectDialogOpen(false)}
                                    entreprisesGroupes={formData.entrepriseExterieurs?.map((x) => getEntreprise(x))}
                                    onSelectWorkers={(workers) => {
                                        setWorkersOfChantier(workers);
                                    }}
                                    chantierId={formData?.id}
                                    title="Select or Add Workers"
                                    multiple={true}
                                    groupByEntreprise
                                />

                                {workersOfChantier && workersOfChantier.length > 0 ? (
                                    workersOfChantier.map((worker) => (
                                        <ListItem key={worker.id || Math.random()} variant="outlined">
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <Person color="primary" sx={{ mr: 2 }} />
                                                <Box>
                                                    <Typography variant="subtitle1">{worker.nom + " " + worker.prenom}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {worker.prenom} • {worker.nom}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleOpenWorkerDialog(worker)}
                                                    sx={{ mr: 1 }}
                                                >
                                                    <Person />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleRemoveWorker(worker.id)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Box>
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography color="text.secondary" sx={{ my: 2 }}>
                                        Aucun intervenant ajouté
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Tab 4: Location */}
                    <TabPanel value={activeTab} index={3}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12 }}>
                                <SectionTitle variant="h5">Localisation</SectionTitle>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <FormControl fullWidth error={!!errors.localisation}>
                                    <Autocomplete
                                        options={Array.from(localisations.values())}
                                        getOptionLabel={(option) => option.nom || ""}
                                        value={localisations.get(formData?.localisation as number) || null}
                                        onChange={(_, value) => handleInputChange('localisation', value?.id)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Localisation"
                                                required
                                                error={!!errors.localisation}
                                                helperText={errors.localisation}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            {formData.localisation && (
                                <Grid size={{ xs: 12 }}>
                                    <Card variant="outlined" sx={{ p: 2, mt: 2 }}>
                                        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                                            <LocationOn color="primary" sx={{ mr: 2, mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="h6">{localisations.get(formData?.localisation)?.nom}</Typography>
                                                <Chip
                                                    label={localisations.get(formData?.localisation)?.code}
                                                    color="primary"
                                                    size="small"
                                                    sx={{ mt: 1, mb: 2 }}
                                                />
                                                <Typography variant="body2">
                                                    {localisations.get(formData?.localisation)?.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
                    </TabPanel>

                    {/* Tab 5: Documents */}
                    {showDocumentsTab && (
                        <TabPanel value={activeTab} index={4}>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12 }}>
                                    <SectionTitle variant="h5">Plans de Prévention (PDP)</SectionTitle>

                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                        <Typography variant="h6">Plans de Prévention</Typography>
                                        <Box>
                                            <Button
                                                variant="contained"
                                                startIcon={<Add />}
                                                onClick={() => {
                                                    setPdpDialogOpen(true);
                                                }}
                                                sx={{ mr: 1 }}
                                            >
                                                Ajouter un PDP
                                            </Button>
                                        </Box>
                                    </Box>

                                    <TableContainer component={Paper} sx={{ mb: 4 }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>Entreprise</TableCell>
                                                    <TableCell>Date d'inspection</TableCell>
                                                    <TableCell>Statut</TableCell>
                                                    <TableCell align="right">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {formData.pdps && formData.pdps.length > 0 ? (
                                                    formData.pdps.map((pdp, index) => {
                                                        const entreprise = entreprises.get(pdps.get(pdp)?.entrepriseExterieure as number);
                                                        return (
                                                            <TableRow key={pdp + index}>
                                                                <TableCell>#{pdp}</TableCell>
                                                                <TableCell>{entreprise?.nom || "N/A"}</TableCell>
                                                                <TableCell>
                                                                    {pdps.get(pdp)?.dateInspection ? dayjs(pdps.get(pdp)?.dateInspection).format("DD/MM/YYYY") : "Non planifiée"}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Chip
                                                                        size="small"
                                                                        label="En cours"
                                                                        color="primary"
                                                                        variant="outlined"
                                                                    />
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    <IconButton
                                                                        size="small"
                                                                        color="primary"
                                                                        onClick={() => navigate(getRoute('EDIT_PDP', { id: pdp }))}
                                                                    >
                                                                        <Assignment />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        size="small"
                                                                        color="error"
                                                                        onClick={() => handleRemovePdp(pdp)}
                                                                    >
                                                                        <Delete />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={5} align="center">
                                                            Aucun plan de prévention
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    <Divider sx={{ my: 4 }} />

                                    <SectionTitle variant="h5">Bons de Travail (BDT)</SectionTitle>

                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                        <Typography variant="h6">Bons de Travail</Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<Add />}
                                            onClick={() => setBdtDialogOpen(true)}
                                        >
                                            Ajouter un BDT
                                        </Button>
                                    </Box>

                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>Nom</TableCell>
                                                    <TableCell>Risques</TableCell>
                                                    <TableCell>Audits</TableCell>
                                                    <TableCell align="right">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {formData.bdts && formData.bdts.length > 0 ? (
                                                    formData.bdts.map((bdt) => (
                                                        <TableRow key={bdt}>
                                                            <TableCell>#{bdt}</TableCell>
                                                            <TableCell>{getBDT(bdt)?.nom || "Sans nom"}</TableCell>
                                                            <TableCell>{getBDT(bdt)?.risques?.length || 0}</TableCell>
                                                            <TableCell>{getBDT(bdt)?.auditSecu?.length || 0}</TableCell>
                                                            <TableCell align="right">
                                                                <IconButton
                                                                    size="small"
                                                                    color="primary"
                                                                    onClick={() => navigate(getRoute('EDIT_BDT', {id: bdt}))}
                                                                >
                                                                    <Assignment />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => handleRemoveBdt(bdt)}
                                                                >
                                                                    <Delete />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={5} align="center">
                                                            Aucun bon de travail
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </TabPanel>
                    )}
                </TabContainer>

                {/* Navigation buttons */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                    <Button
                        color="inherit"
                        onClick={() => navigate("/view/chantier/" + id)}
                        startIcon={<ArrowBack />}
                    >
                        Annuler
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveChantier}
                        startIcon={<Save />}
                    >
                        Enregistrer
                    </Button>
                </Box>
            </Paper>

            {/* Worker Dialog */}
            <WorkerModal
                workerId={currentWorker?.id as number}
                open={workerDialogOpen}
                onClose={() => setWorkerDialogOpen(false)}
            />

            {/* PDP Dialog */}
            <Dialog open={pdpDialogOpen} onClose={() => setPdpDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Plan de Prévention</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}> Voullez vous enrégistrer ce chantier ?</Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setPdpDialogOpen(false)
                    }}>Annuler</Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            handleSaveChantier();
                            navigate(getRoute('CREATE_PDP', { chantierId: id }))
                        }}
                    >
                        Oui
                    </Button>
                </DialogActions>
            </Dialog>

            {/* BDT Dialog */}
            <Dialog open={bdtDialogOpen} onClose={() => setBdtDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Nouveau Bon de Travail ? </DialogTitle>
                <DialogContent>
                    Est-ce que vous voullez enregistrer ce chantier avant de cree un nouveau bon de travaille ?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setBdtDialogOpen(false)}>Annuler</Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveBdt}
                    >
                        Créer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Snackbar */}
            <Snackbar
                open={saveSuccess}
                autoHideDuration={3000}
                onClose={() => setSaveSuccess(false)}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    Chantier {isEditMode ? 'modifié' : 'créé'} avec succès!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EditCreateChantier;