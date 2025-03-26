import React, { FC, useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CircularProgress,
    Divider,
    IconButton,
    Paper,
    Stepper,
    Step,
    StepLabel,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    Chip,
    FormHelperText,
    Autocomplete,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    MenuItem, TableContainer, Table, TableHead, TableRow, TableCell, TableBody
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
    ArrowForward, Assignment
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import useChantier from "../../hooks/useChantier";
import useEntreprise from "../../hooks/useEntreprise";
import useUser from "../../hooks/useUser";
import useBdt from "../../hooks/useBdt";
import usePdp from "../../hooks/usePdp";
import Chantier from "../../utils/Chantier/Chantier";
import { Entreprise } from "../../utils/entreprise/Entreprise";
import User from "../../utils/user/User";
import Localisation from "../../utils/Localisation/Localisation";
import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
import useLocalisation from "../../hooks/useLocalisation.ts";
import {BDT} from "../../utils/bdt/BDT.ts";
import {Pdp} from "../../utils/pdp/Pdp.ts";
import {getRoute} from "../../Routes.tsx";

const StepContainer = styled(Paper)(({ theme }) => ({
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

// Define the steps for the stepper
const steps = ['Informations générales', 'Entreprises', 'Équipe', 'Localisation'];

// Mock data for localisations
const mockLocalisations: Localisation[] = [
    { id: 1, nom: "Site Principal", code: "SITE01", description: "Site principal de production" },
    { id: 2, nom: "Annexe Nord", code: "SITE02", description: "Annexe nord de stockage" },
    { id: 3, nom: "Bâtiment C", code: "SITE03", description: "Bâtiment C administratif" },
];

//interface EditCreateChantierProps {}

const EditCreateChantier: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // State for form
    const [activeStep, setActiveStep] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Data states
    const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [localisations, setLocalisations] = useState<Localisation[]>(mockLocalisations);
    const [currentPdp, setCurrentPdp] = useState<Pdp>(new Pdp(0, 0, 0, new Date(), new Date(), "", 0, null, null, [], [], [], [], [], null, null));
    const [currentBdt, setCurrentBdt] = useState<BDT>(new BDT());

    // Chantier data state
    const [formData, setFormData] = useState<Chantier>({
        id: undefined,
        isAnnuelle:false,
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
        pdp: [],
        pdpEnts: [],
        workers: []
    });

    // Dialog state
    const [workerDialogOpen, setWorkerDialogOpen] = useState<boolean>(false);
    const [currentWorker, setCurrentWorker] = useState<User>(new User());
    const [isNewWorker, setIsNewWorker] = useState<boolean>(true);
    const [pdpDialogOpen, setPdpDialogOpen] = useState<boolean>(false);
    const [bdtDialogOpen, setBdtDialogOpen] = useState<boolean>(false);

    // Get hooks
    const { getChantier, createChantier, saveChantier, loading: loadingChantier } = useChantier();
    const { getAllEntreprises, loading: loadingEntreprises } = useEntreprise();
    const { getUsers, loading: loadingUsers } = useUser();
    const { getAllLocalisations } = useLocalisation();
    const { createPdp } = usePdp();
    const {createBDT} = useBdt();

    // Load initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);

            try {
                // Fetch enterprises
                const entreprisesData = await getAllEntreprises();
                if (entreprisesData) {
                    setEntreprises(entreprisesData);
                }

                // Fetch users
                const usersData = await getUsers();
                if (usersData) {
                    setUsers(usersData);
                }

                const locations = await getAllLocalisations();
                if(locations){
                    setLocalisations(locations)
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

    useEffect(()=>{
        const checkDoc = ()=>{
            if(formData.nbHeurs && formData?.nbHeurs >= 400 || formData.isAnnuelle){
                if(steps.indexOf("Documents") === -1){
                 steps.push("Documents");
                }
            }else{
                if(steps.indexOf("Documents") !== -1) {
                    steps.splice(steps.indexOf("Documents"), 1);
                }
            }
        }
        checkDoc();
    },[formData]);



 /*   //Check if the chantier is annuelle
    const checkIfAnnuelle => {

    };*/

    // Handle stepper navigation
    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // Form validation for each step
    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        if (step === 0) {
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

        else if (step === 1) {
            // Validate enterprises
            if (!formData.entrepriseUtilisatrice) {
                newErrors.entrepriseUtilisatrice = "L'entreprise utilisatrice est requise";
                isValid = false;
            }
        }

        else if (step === 2) {
            // Validate team (optional validation based on requirements)
            if (!formData.donneurDOrdre) {
                newErrors.donneurDOrdre = "Le donneur d'ordre est requis";
                isValid = false;
            }
        }

        else if (step === 3) {
            // Validate location
            if (!formData.localisation) {
                newErrors.localisation = "La localisation est requise";
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

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
    const handleAddExternalEnterprise = (enterprise: Entreprise) => {
        if (!enterprise) return;

        // Check if enterprise is already added
        if (formData.entrepriseExterieurs?.find(e => e.id === enterprise.id)) {
            return;
        }

        setFormData(prev => ({
            ...prev,
            entrepriseExterieurs: [...(prev.entrepriseExterieurs || []), enterprise]
        }));
    };

    const handleRemoveExternalEnterprise = (id: number | undefined) => {
        if (!id) return;

        setFormData(prev => ({
            ...prev,
            entrepriseExterieurs: prev.entrepriseExterieurs?.filter(e => e.id !== id) || []
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
        if (isNewWorker) {
            // Add new worker
            setFormData(prev => ({
                ...prev,
                workers: [...(prev.workers || []), currentWorker]
            }));
        } else {
            // Update existing worker
            setFormData(prev => ({
                ...prev,
                workers: prev.workers?.map(w => w.id === currentWorker.id ? currentWorker : w) || []
            }));
        }
        setWorkerDialogOpen(false);
    };

    const handleRemoveWorker = (id: number | undefined) => {
        if (!id) return;

        setFormData(prev => ({
            ...prev,
            workers: prev.workers?.filter(w => w.id !== id) || []
        }));
    };

    // Save chantier
    const handleSaveChantier = async () => {
        // Validate all steps
        for (let i = 0; i < steps.length; i++) {
            if (!validateStep(i)) {
                setActiveStep(i);
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
                // Redirect after short delay
                /*setTimeout(() => {
                    //`/view/chantier/${id}`
                    navigate(isEditMode ?  getRoute('VIEW_CHANTIER', {id: id}) : `/`);
                }, 1500);*/
            }
        } catch (error) {
            console.error("Error saving chantier:", error);
        }
        setIsLoading(false);
    };
// Handler functions for PDPs and BDTs
    const handleSavePdp = async () => {
        try {
            // Set chantier ID if in edit mode
            if (isEditMode && id) {
                currentPdp.chantier = parseInt(id);
            }

            // Create new PDP
            const createdPdp = await createPdp(currentPdp);

            // Add to chantier's PDPs
            setFormData(prev => ({
                ...prev,
                pdp: [...(prev.pdp || []), createdPdp]
            }));

            setPdpDialogOpen(false);
        } catch (error) {
            console.error("Error creating PDP:", error);
        }
    };

    const handleRemovePdp = (id: number | undefined) => {
        if (!id) return;

        setFormData(prev => ({
            ...prev,
            pdp: prev.pdp?.filter(p => p.id !== id) || []
        }));
    };

    const handleSaveBdt = async () => {
        try {
            // Create new BDT
            const createdBdt = await createBDT(currentBdt);

            // Add to chantier's BDTs
            setFormData(prev => ({
                ...prev,
                bdts: [...(prev.bdts || []), createdBdt]
            }));

            setBdtDialogOpen(false);
        } catch (error) {
            console.error("Error creating BDT:", error);
        }
    };

    const handleRemoveBdt = (id: number | undefined) => {
        if (!id) return;

        setFormData(prev => ({
            ...prev,
            bdts: prev.bdts?.filter(b => b.id !== id) || []
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

    return (
        <Box sx={{ p: { xs: 2, md: 3 },  mx: "auto" , width:'100%'}}>
            <Paper sx={{ p: 3, borderRadius: "16px", mb: 3 , width:'100%'}}>
                <Typography variant="h4" gutterBottom>
                    {isEditMode ? "Modifier le chantier" : "Créer un nouveau chantier"}
                </Typography>

                {formData?.nbHeurs && formData?.nbHeurs >= 400 && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Les entreprises avec plus de 400 heures de travail nécessitent un Plan de Prévention.
                    </Alert>
                )}

                <Stepper activeStep={activeStep} sx={{ mt: 3, mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {/* Step content */}
                <StepContainer elevation={1}>
                    {/* Step 1: General Information */}
                    {activeStep === 0 && (
                        <Grid container spacing={3}>
                            <Grid size={{xs:12}}>
                                <SectionTitle variant="h5">Informations générales</SectionTitle>
                            </Grid>

                            <Grid size={{xs:12, md:6}}>
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

                            <Grid  size={{xs:12, md:6}} >
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

                            <Grid  size={{xs:12, md:6}}>
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

                            <Grid  size={{xs:12, md:6}}>
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

                            <Grid  size={{xs:12, md:4}}>
                                <TextField
                                    label="Nombre d'heures"
                                    type="number"
                                    fullWidth
                                    value={formData.nbHeurs || 0}
                                    onChange={(e) => handleInputChange('nbHeurs', parseInt(e.target.value))}
                                    InputProps={{ inputProps: { min: 0 } }}
                                />
                            </Grid>

                            <Grid  size={{xs:12, md:4}}>
                                <TextField
                                    label="Effectif maximal sur chantier"
                                    type="number"
                                    fullWidth
                                    value={formData.effectifMaxiSurChantier || 0}
                                    onChange={(e) => handleInputChange('effectifMaxiSurChantier', parseInt(e.target.value))}
                                    InputProps={{ inputProps: { min: 0 } }}
                                />
                            </Grid>

                            <Grid  size={{xs:12, md:4}}>
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
                    )}

                    {/* Step 2: Enterprises */}
                    {activeStep === 1 && (
                        <Grid container spacing={3}>
                            <Grid size={{xs:12}}>
                                <SectionTitle variant="h5">Entreprises</SectionTitle>
                            </Grid>

                            <Grid size={{xs:12}}>
                                <FormControl fullWidth error={!!errors.entrepriseUtilisatrice}>
                                    <Autocomplete
                                        options={entreprises}
                                        getOptionLabel={(option) => option.nom || ""}
                                        value={formData.entrepriseUtilisatrice || null}
                                        onChange={(_, value) => handleInputChange('entrepriseUtilisatrice', value)}
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

                            <Grid size={{xs:12}}>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                    <Typography variant="h6">Entreprises Extérieures</Typography>
                                    <FormControl sx={{ width: 300 }}>
                                        <Autocomplete
                                            options={entreprises}
                                            getOptionLabel={(option) => option.nom || ""}
                                            onChange={(_, value) => value && handleAddExternalEnterprise(value)}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Ajouter une entreprise" size="small" />
                                            )}
                                        />
                                    </FormControl>
                                </Box>

                                {formData.entrepriseExterieurs && formData.entrepriseExterieurs.length > 0 ? (
                                    formData.entrepriseExterieurs.map((entreprise) => (
                                        <ListItem key={entreprise.id} variant="outlined">
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <Business color="primary" sx={{ mr: 2 }} />
                                                <Box>
                                                    <Typography variant="subtitle1">{entreprise.nom}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {entreprise.raisonSociale} • {entreprise.numTel}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleRemoveExternalEnterprise(entreprise.id)}
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
                    )}

                    {/* Step 3: Team */}
                    {activeStep === 2 && (
                        <Grid container spacing={3}>
                            <Grid size={{xs:12}}>
                                <SectionTitle variant="h5">Équipe et responsables</SectionTitle>
                            </Grid>

                            <Grid size={{xs:12}}>
                                <FormControl fullWidth error={!!errors.donneurDOrdre}>
                                    <Autocomplete
                                        options={users}
                                        getOptionLabel={(option) => option.username || "no name"}
                                        value={formData.donneurDOrdre || null}
                                        onChange={(_, value) => handleInputChange('donneurDOrdre', value)}
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

                            <Grid size={{xs:12}}>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                    <Typography variant="h6">Intervenants</Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<Add />}
                                        onClick={() => handleOpenWorkerDialog()}
                                    >
                                        Ajouter un intervenant
                                    </Button>
                                </Box>

                                {formData.workers && formData.workers.length > 0 ? (
                                    formData.workers.map((worker) => (
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
                    )}

                    {/* Step 4: Location */}
                    {activeStep === 3 && (
                        <Grid container spacing={3}>
                            <Grid size={{xs:12}}>
                                <SectionTitle variant="h5">Localisation</SectionTitle>
                            </Grid>

                            <Grid size={{xs:12}}>
                                <FormControl fullWidth error={!!errors.localisation}>
                                    <Autocomplete
                                        options={localisations}
                                        getOptionLabel={(option) => option.nom || ""}
                                        value={formData.localisation || null}
                                        onChange={(_, value) => handleInputChange('localisation', value)}
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
                                <Grid size={{xs:12}}>
                                    <Card variant="outlined" sx={{ p: 2, mt: 2 }}>
                                        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                                            <LocationOn color="primary" sx={{ mr: 2, mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="h6">{formData.localisation.nom}</Typography>
                                                <Chip
                                                    label={formData.localisation.code}
                                                    color="primary"
                                                    size="small"
                                                    sx={{ mt: 1, mb: 2 }}
                                                />
                                                <Typography variant="body2">
                                                    {formData.localisation.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
                    )}
                    {/* Step 5: PDPs and BDTs */}
                    {activeStep === 4 && (
                        <Grid container spacing={3}>
                            <Grid size={{xs:12}}>
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

                            {/*    {formData?.nbHeurs && formData?.nbHeurs >= 400 && (
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        Les entreprises avec plus de 400 heures de travail nécessitent un Plan de Prévention.
                                    </Alert>
                                )}*/}

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
                                            {formData.pdpEnts && formData.pdpEnts.length > 0 ? (
                                                formData.pdpEnts.map((pdp, index) => {
                                                    const entreprise = entreprises.find(e => e.id === pdp.entrepriseExterieure);
                                                    return (
                                                        <TableRow key={pdp?.id+index}>
                                                            <TableCell>#{pdp.id}</TableCell>
                                                            <TableCell>{entreprise?.nom || "N/A"}</TableCell>
                                                            <TableCell>
                                                                {pdp.dateInspection ? dayjs(pdp.dateInspection).format("DD/MM/YYYY") : "Non planifiée"}
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
                                                                    onClick={() => navigate(`/create/pdp/${pdp.id}/1`)}
                                                                >
                                                                    <Assignment />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => handleRemovePdp(pdp.id)}
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
                                                    <TableRow key={bdt.id}>
                                                        <TableCell>#{bdt.id}</TableCell>
                                                        <TableCell>{bdt.nom || "Sans nom"}</TableCell>
                                                        <TableCell>{bdt.risques?.length || 0}</TableCell>
                                                        <TableCell>{bdt.auditSecu?.length || 0}</TableCell>
                                                        <TableCell align="right">
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => navigate(`/create/bdt/${bdt.id}/1`)}
                                                            >
                                                                <Assignment />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleRemoveBdt(bdt.id)}
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
                    )

                    }


                </StepContainer>

                {/* Navigation buttons */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                    <Button
                        color="inherit"
                        onClick={() => navigate("/view/chantier/" + id)}
                        startIcon={<ArrowBack />}
                    >
                        Annuler
                    </Button>

                    <Box>
                        {activeStep > 0 && (
                            <Button
                                color="inherit"
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                                startIcon={<ArrowBack />}
                            >
                                Précédent
                            </Button>
                        )}

                        {activeStep < steps.length - 1 ? (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                endIcon={<ArrowForward />}
                            >
                                Suivant
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveChantier}
                                startIcon={<Save />}
                            >
                                Enregistrer
                            </Button>
                        )}
                    </Box>
                </Box>
            </Paper>

            {/* Worker Dialog */}
            <Dialog open={workerDialogOpen} onClose={() => setWorkerDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {isNewWorker ? "Ajouter un intervenant" : "Modifier l'intervenant"}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid size={{xs:12}}>
                            <TextField
                                label="Nom"
                                fullWidth
                                required
                                value={currentWorker.name || ''}
                                onChange={(e) => setCurrentWorker({...currentWorker, name: e.target.value})}
                            />
                        </Grid>

                        <Grid size={{xs:12, md:6}}>
                            <TextField
                                label="Fonction"
                                fullWidth
                                value={currentWorker.fonction || ''}
                                onChange={(e) => setCurrentWorker({...currentWorker, fonction: e.target.value})}
                            />
                        </Grid>

                        <Grid size={{xs:12, md:6}}>
                            <TextField
                                label="Rôle"
                                fullWidth
                                value={currentWorker.role || ''}
                                onChange={(e) => setCurrentWorker({...currentWorker, role: e.target.value})}
                            />
                        </Grid>

                        <Grid size={{xs:12, md:6}}>
                            <TextField
                                label="Email"
                                fullWidth
                                type="email"
                                value={currentWorker.email || ''}
                                onChange={(e) => setCurrentWorker({...currentWorker, email: e.target.value})}
                            />
                        </Grid>

                        <Grid size={{xs:12, md:6}}>
                            <TextField
                                label="Téléphone"
                                fullWidth
                                value={currentWorker.notel || ''}
                                onChange={(e) => setCurrentWorker({...currentWorker, notel: e.target.value})}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setWorkerDialogOpen(false)}>Annuler</Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveWorker}
                        disabled={!currentWorker.name}
                    >
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>

            {/* PDP Dialog */}
            <Dialog open={pdpDialogOpen} onClose={() => setPdpDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Plan de Prévention</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid size={{xs:12}}>
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
                        onClick={()=>{
                            handleSaveChantier();
                            navigate(getRoute('CREATE_PDP', {chantierId: id}))
                        }}
                    >
                        Oui
                    </Button>
                </DialogActions>
            </Dialog>

            {/* BDT Dialog */}
            <Dialog open={bdtDialogOpen} onClose={() => setBdtDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Nouveau Bon de Travail</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid size={{xs:12}}>
                            <TextField
                                label="Nom du BDT"
                                fullWidth
                                required
                                value={currentBdt.nom || ''}
                                onChange={(e) => setCurrentBdt({...currentBdt, nom: e.target.value})}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setBdtDialogOpen(false)}>Annuler</Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveBdt}
                        disabled={!currentBdt.nom}
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