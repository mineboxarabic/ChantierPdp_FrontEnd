import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    FormControlLabel,
    Switch,
    Divider,
    CircularProgress,
    Autocomplete,
    Stack,
    Alert,
    Tab,
    Tabs,
    IconButton,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stepper, Chip, Avatar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// Instead of importing directly from AdapterDateFns
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import usePdp from '../../hooks/usePdp';
import useEntreprise from '../../hooks/useEntreprise';
import useRisque from '../../hooks/useRisque';
import usePermit from '../../hooks/usePermit';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';
import WarningIcon from '@mui/icons-material/Warning';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ShieldIcon from '@mui/icons-material/Shield';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedIcon from '@mui/icons-material/Verified';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Pdp } from '../../utils/entities/Pdp.ts';
import HoraireDeTravaille from '../../utils/pdp/HoraireDeTravaille';
import MiseEnDisposition from '../../utils/pdp/MiseEnDisposition';
import ObjectAnswered from '../../utils/pdp/ObjectAnswered';
import ObjectAnsweredEntreprises from '../../utils/pdp/ObjectAnsweredEntreprises';
import { Entreprise } from '../../utils/entities/Entreprise.ts';
import Risque from '../../utils/entities/Risque.ts';
import Permit from '../../utils/entities/Permit.ts';
import AnalyseDeRisque from '../../utils/entities/AnalyseDeRisque.ts';
import Worker from '../../utils/entities/Worker.ts';
import ObjectAnsweredObjects from '../../utils/ObjectAnsweredObjects';
import {frFR} from "@mui/material/locale";
import useChantier from "../../hooks/useChantier.ts";
import Chantier from "../../utils/entities/Chantier.ts";
import {parse} from "ts-jest";
import {EntityRef} from "../../utils/EntityRef.ts";
import {getRoute} from "../../Routes.tsx";
import RisqueComponent from "../../components/Steps/RisqueComponent.tsx";
import SelectOrCreateRisque from "../../components/Pdp/SelectOrCreateRisque.tsx";
import DispositifComponent from "../../components/Steps/DispositifComponent.tsx";
import SelectOrCreateDispositif from "../../components/Pdp/SelectOrCreateDispositif.tsx";
import SelectOrCreateAnalyseRisque from "../../components/Pdp/SelectOrCreateAnalyseRisque.tsx";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import {Visibility} from "@mui/icons-material";
import EditAnalyseRisque from "../../components/AnalyseDeRisque/EditAnalyseRisque.tsx";
import analyseDeRisque from "../../utils/entities/AnalyseDeRisque.ts";
import {useNotifications} from "@toolpad/core/useNotifications";
import RisqueDTO from '../../utils/entitiesDTO/RisqueDTO.ts';
import PermitDTO from '../../utils/entitiesDTO/PermitDTO.ts';
import { PdpDTO } from '../../utils/entitiesDTO/PdpDTO.ts';
import ChantierDTO from '../../utils/entitiesDTO/ChantierDTO.ts';

// Define the interface for URL params
interface ParamTypes {
    id?: string;
}

// Define the TabPanel props interface
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

// TabPanel component for tab navigation
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`pdps-tabpanel-${index}`}
            aria-labelledby={`pdps-tab-${index}`}
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
        id: `pdps-tab-${index}`,
        'aria-controls': `pdps-tabpanel-${index}`,
    };
}

// Define dialog data types
type DialogTypes = 'risques' | 'dispositifs' | 'permits' | 'analyseDeRisques' | 'editAnalyseDeRisque'

const EditCreatePdp: React.FC = () => {
    const { id, chantierId } = useParams<{id:string, chantierId?:string}>();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    // Tab state
    const [tabValue, setTabValue] = useState<number>(0);

    // Stepper state
    const [activeStep, setActiveStep] = useState<number>(0);
    const steps = ['Informations générales', 'Horaires et mise à disposition', 'Risques et dispositifs', 'Permis', 'Analyse des risques'];

    // Dialog state
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [dialogType, setDialogType] = useState<DialogTypes | ''>('');
    const [dialogData, setDialogData] = useState<Risque | Permit | AnalyseDeRisque | null>(null);

    // Form state
    const [formData, setFormData] = useState<PdpDTO>({
        id: undefined,
        chantier: undefined,
        entrepriseExterieure: undefined,
        dateInspection: undefined,
        icpdate: undefined,
        datePrevenirCSSCT: undefined,
        datePrev: undefined,
        horairesDetails: '',
        entrepriseDInspection: undefined,
        horaireDeTravail: {
            enJournee: false,
            enNuit: false,
            samedi: false
        },
        misesEnDisposition: {
            vestiaires: false,
            sanitaires: false,
            restaurant: false,
            energie: false
        },
        risques: [],
        dispositifs: [],
        permits: [],
        analyseDeRisques: [],
        signatures: [],

    });

    // Loading state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Hooks
    const {
        getPlanDePrevention,
        createPdp,
        savePdp,
        linkRisqueToPdp,
        unlinkObjectFromPdp,
        linkObjectToPdp,
        linkPermitToPdp,
        linkAnalyseToPdp,
        unlinkAnalyseToPdp
    } = usePdp();
    const notifications = useNotifications();

    const { getAllEntreprises, entreprises} = useEntreprise();
    const { getAllRisques } = useRisque();
    const { getAllPermits } = usePermit();
    const { saveChantier } = useChantier();
    // Data states
    //const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
    const [risques, setRisques] = useState<RisqueDTO[]>([]);
    const [permits, setPermits] = useState<PermitDTO[]>([]);
    const [selectedAnalyseDeRisque, setSelectedAnalyseDeRisque] = useState<AnalyseDeRisque | null>(null);

    //Error states
    const [errors, setErrors] = useState<Record<string, string | number>>({});

    // Load data on component mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Load dropdown data
                const entreprisesList = await getAllEntreprises();
                const risquesList = await getAllRisques();
                const permitsList = await getAllPermits();

              //  setEntreprises(entreprisesList || []);
                setRisques(risquesList || []);
                setPermits(permitsList || []);

                // If editing, load PDP data
                if (isEditMode && id) {
                    const pdpData = await getPlanDePrevention(Number(id));
                    if (pdpData) {
                        setFormData({
                            ...pdpData,
                            // Ensure all required objects are present
                            horaireDeTravail: pdpData.horaireDeTravail || {
                                enJournee: false,
                                enNuit: false,
                                samedi: false
                            },
                            misesEnDisposition: pdpData.misesEnDisposition || {
                                vestiaires: false,
                                sanitaires: false,
                                restaurant: false,
                                energie: false
                            },
                            risques: pdpData.risques || [],
                            dispositifs: pdpData.dispositifs || [],
                            permits: pdpData.permits || [],
                            analyseDeRisques: pdpData.analyseDeRisques || [],
                            signatures: pdpData.signatures || []
                        });
                    }
                }
            } catch (error) {
                console.error("Error loading data:", error);
                setSaveError("Erreur lors du chargement des données");
            } finally {
                setIsLoading(false);
            }
        };

        if(!isEditMode){
            handleDefaultValues();
        }

        fetchData();
    }, [id, isEditMode]);



    useEffect(() => {
        console.log(formData)
    }, [formData]);


    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;
        if (name.includes('.')) {
            // Handle nested properties like horaireDeTravail.enJournee
            const [parent, child] = name.split('.');

            setFormData((prev:PdpDTO) => ({
                ...prev,
                [parent]: {
                    ...prev[parent as keyof PdpDTO] as Record<string, any> ?? {},
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    // Handle date changes
    const handleDateChange = (name: keyof Pdp, date: Date | null) => {
       console.log(formData);
        setFormData(prev => ({
            ...prev,
            [name]: date
        }));
    };

    // Handle dropdown changes
    const handleAutocompleteChange = (name: keyof Pdp, value:any | null) => {
        console.log('formdata', formData)
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle tab changes
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveStep(newValue);
        setTabValue(newValue);
    };

    // Handle stepper navigation
    const handleNext = () => {
        if(validateForm()){
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setTabValue(activeStep + 1);
        }

    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        setTabValue(activeStep - 1);
    };

    // Dialog handlers
    const handleOpenDialog = (type: DialogTypes, data: null = null) => {
        setDialogType(type);
        setDialogData(data);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDialogData(null);
    };

    // Handle adding a new item to a list
    const handleAddItem = async (type: DialogTypes, item: any) => {
        if (!formData.id) {
            // If PDP doesn't exist yet, add to local state only
            setFormData(prev => ({
                ...prev,
                [type]: [...(prev[type as keyof Pdp] as any[] || []), item]
            }));
        } else {
            // If PDP exists, add to backend first
            try {
                let response;
                switch(type) {
                    case 'risques':
                        response = await linkRisqueToPdp(item.id, formData.id);
                        break;
                    case 'permits':
                        response = await linkPermitToPdp(item.id, formData.id);
                        break;
                    case 'analyseDeRisques':
                        response = await linkAnalyseToPdp(item.id, formData.id);
                        break;
                    default:
                        response = await linkObjectToPdp(item.id, formData.id, type as ObjectAnsweredObjects);
                }

                if (response) {
                    // Update local state
                    setFormData(prev => ({
                        ...prev,
                        [type]: [...(prev[type as keyof Pdp] as any[] || []), response]
                    }));
                }
            } catch (error) {
                console.error(`Error adding ${type}:`, error);
                setSaveError(`Erreur lors de l'ajout de l'élément`);
            }
        }
        handleCloseDialog();
    };

    // Handle removing an item from a list
    const handleRemoveItem = async (type: string, itemId: number) => {
        if (!formData.id) {
            // If PDP doesn't exist yet, remove from local state only
            setFormData(prev => ({
                ...prev,
                [type]: (prev[type as keyof Pdp] as any[]).filter(item => item.id !== itemId)
            }));
        } else {
            // If PDP exists, remove from backend first
            try {
                let response;
                switch(type) {
                    case 'analyseDeRisques':
                        response = await unlinkAnalyseToPdp(itemId, formData.id);
                        break;
                    default:
                        response = await unlinkObjectFromPdp(itemId, formData.id, type as ObjectAnsweredObjects);
                }

                if (response || response === null) {
                    // Update local state
                    setFormData(prev => ({
                        ...prev,
                        [type]: (prev[type as keyof Pdp] as any[]).filter(item => item.id !== itemId)
                    }));
                }
            } catch (error) {
                console.error(`Error removing ${type}:`, error);
                setSaveError(`Erreur lors de la suppression de l'élément`);
            }
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();



        setIsLoading(true);
        setSaveSuccess(false);
        setSaveError(null);

        try {
            let savedPdp;

            if (isEditMode && formData.id) {
                // Update existing PDP
                savedPdp = await savePdp(formData, formData.id);

                if(chantierId){
                    saveChantier({pdps: savedPdp} as ChantierDTO, parseInt(chantierId));
                }

            } else {
                // Create new PDP
                if(chantierId){
                    setFormData(prev => ({
                        ...prev,
                        chantier: parseInt(chantierId)
                    }));
                }
                savedPdp = await createPdp(formData);

                // If we have local state items, link them to the new PDP
                if (savedPdp && savedPdp.id) {
                    // Link risques
                    for (const risque of formData.risques || []) {
                        await linkRisqueToPdp(risque.id as number, savedPdp.id);
                    }

                    // Link permits
                    for (const permit of formData.permits || []) {
                        await linkPermitToPdp(permit.id as number, savedPdp.id);
                    }

                    // Link analyses
                    for (const analyse of formData.analyseDeRisques || []) {
                        await linkAnalyseToPdp(analyse.id as number, savedPdp.id);
                    }
                }
            }

            if (savedPdp) {
                setSaveSuccess(true);
                notifications.show("Le Plan de Prévention a été enregistré avec succès", { severity: "success" , autoHideDuration: 2000});
                if (!isEditMode) {
                    // Redirect to edit mode with the new ID
                   // navigate(`/pdps/edit/${savedPdp.id}`, { replace: true });
                    navigate(getRoute('EDIT_PDP', {id: savedPdp.id}), {replace: true});
                }
            }
        } catch (error) {
            console.error("Error saving PDP:", error);
            setSaveError("Erreur lors de l'enregistrement du PDP");
            notifications.show("Erreur lors de l'enregistrement du PDP", {severity:'error', autoHideDuration: 2000});
        } finally {
            setIsLoading(false);
        }
    };


    //Handl setting default values
    const handleDefaultValues = () => {
        if(chantierId){
            setFormData(prev => ({
                ...prev,
                chantier: parseInt(chantierId)
            }));
        }

        //Set dates
        const date = new Date();
        handleDateChange('dateInspection', date);
        handleDateChange('icpdate', date);
        handleDateChange('datePrevenirCSSCT', date);
        handleDateChange('datePrev', date);

    }



    //Handle Errors
    const validateForm = (): boolean=> {
        const errors: Record<string, string | number> = {};

        // Validate required fields
            if (!formData.entrepriseExterieure) {
                errors.entrepriseExterieure = "L'entreprise extérieure est requise";
            }

            if (!formData.entrepriseDInspection) {
                errors.entrepriseDInspection = "L'entreprise d'inspection est requise";

            }

            // Date validations
            if (!formData.dateInspection) {
                errors.dateInspection = "La date d'inspection est requise";

            }

            if (!formData.icpdate) {
                errors.icpdate = "La date ICP est requise";

            }

            if (!formData.datePrevenirCSSCT) {
                errors.datePrevenirCSSCT = "La date de prévenir CSSCT est requise";

            }

            if (!formData.datePrev) {
                errors.datePrev = "La date prévisionnelle est requise";

            }

            // Validate date logic
            if (formData.dateInspection && formData.datePrev) {
                const inspectionDate = new Date(formData.dateInspection);
                const prevDate = new Date(formData.datePrev);

                if (prevDate < inspectionDate) {
                    errors.datePrev = "La date prévisionnelle ne peut pas être antérieure à la date d'inspection";

                }
            }

            // Validate horaires details if any schedule options are selected
          /*  if (formData.horaireDeTravail &&
                (formData.horaireDeTravail.enJournee ||
                    formData.horaireDeTravail.enNuit ||
                    formData.horaireDeTravail.samedi) &&
                !formData.horairesDetails) {
                errors.horairesDetails = "Veuillez fournir des détails sur les horaires";
            }
*/

            // Validate if at least one risk is selected
            if (!formData.risques || formData.risques.length === 0) {
                errors.risques = "Au moins un risque doit être ajouté";
            }




            if(!formData.dispositifs || formData.dispositifs?.length === 0 ){
                errors.dispositifs =  "Au moins un dispositif doit être ajouté";
            }







        if(Object.keys(errors).length !== 0){
            if('entrepriseExterieure' in errors || 'entrepriseDInspection' in errors || 'dateInspection' in errors || 'icpdate' in errors || 'datePrevenirCSSCT' in errors || 'datePrev' in errors){
                setActiveStep(0);
                setTabValue(0)
            }
            else if('horairesDetails' in errors){
                setActiveStep(1);
                setTabValue(1)
            }
            else if('risques' in errors || 'dispositifs' in errors){
                setActiveStep(2);
                setTabValue(2);
            }
        }

        setErrors(errors);
        console.log(errors)

        return Object.keys(errors).length === 0;
    };




    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ width: '100%', p: 3 }}>
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h4">
                            {isEditMode ? "Modifier le Plan de Prévention" : "Créer un Plan de Prévention"}
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate(-1)}
                        >
                            Retour
                        </Button>
                    </Box>

                    {saveSuccess && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Le Plan de Prévention a été enregistré avec succès.
                        </Alert>
                    )}

                    {saveError && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {saveError}
                        </Alert>
                    )}

                    {/* Optional: Show stepper for multi-step form */}
                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                      {/*  {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}*/}
                    </Stepper>

                    {isLoading && !formData.id ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <div >
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                                <Tabs
                                    value={tabValue}
                                    onChange={handleTabChange}
                                    aria-label="pdps tabs"
                                    variant="scrollable"
                                    scrollButtons="auto"
                                >
                                    <Tab icon={<BusinessIcon />} label="Informations générales" {...a11yProps(0)} />
                                    <Tab icon={<AccessTimeIcon />} label="Horaires et mise à disposition" {...a11yProps(1)} />
                                    <Tab icon={<WarningIcon />} label="Risques et dispositifs" {...a11yProps(2)} />
                                    <Tab icon={<VerifiedIcon />} label="Permis" {...a11yProps(3)} />
                                    <Tab icon={<ShieldIcon />} label="Analyse des risques" {...a11yProps(4)} />
                                </Tabs>
                            </Box>

                            {/* Tab 1: Informations générales */}
                            <TabPanel value={tabValue} index={0}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Autocomplete
                                            options={Array.from(entreprises.values())}
                                            getOptionLabel={(option) => option.nom || option.nom || ''}
                                            value={formData.entrepriseExterieure && entreprises.get(formData.entrepriseExterieure) || null}
                                            onChange={(_, newValue) => handleAutocompleteChange('entrepriseExterieure', new EntityRef(newValue?.id as number))}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Entreprise Extérieure"
                                                    variant="outlined"
                                                    fullWidth
                                                    required
                                                    error={!!errors.entrepriseExterieure}
                                                    helperText={errors.entrepriseExterieure}
                                                />
                                            )}

                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Autocomplete
                                            options={Array.from(entreprises.values())}
                                            getOptionLabel={(option) => option.nom || option.nom || ''}
                                            value={formData.entrepriseDInspection && entreprises.get(formData.entrepriseDInspection) || null}
                                            onChange={(_, newValue) => handleAutocompleteChange('entrepriseDInspection', new EntityRef(newValue?.id as number))}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Entreprise d'Inspection"
                                                    variant="outlined"
                                                    fullWidth
                                                    required
                                                    error={!!errors.entrepriseDInspection}
                                                    helperText={errors.entrepriseDInspection}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      {/*  <TextField
                                            label="Chantier"
                                            name="chantier"
                                            value={formData.chantier || ''}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            fullWidth
                                            required
                                        />*/}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DatePicker
                                            label="Date d'inspection"
                                            value={dayjs(formData.dateInspection)}
                                            onChange={(date) => handleDateChange('dateInspection', date?.toDate() as Date)}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    required: true,
                                                    error: !!errors.dateInspection,
                                                    helperText: errors.dateInspection,
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DatePicker
                                            label="Date ICP"
                                            value={dayjs(formData.icpdate) || null}
                                            onChange={(date) => handleDateChange('icpdate', date?.toDate() as Date)}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    required: true,
                                                    error: !!errors.icpdate,
                                                    helperText: errors.icpdate,
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DatePicker
                                            label="Date prévenir CSSCT"
                                            value={dayjs(formData.datePrevenirCSSCT) || null}
                                            onChange={(date) => handleDateChange('datePrevenirCSSCT', date?.toDate() as Date)}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    required: true,
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DatePicker
                                            label="Date prévisionnelle"
                                            value={dayjs(formData.datePrev) || null}
                                            onChange={(date) => handleDateChange('datePrev', date?.toDate() as Date)}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    required: true,
                                                    error: !!errors.datePrev,
                                                    helperText: errors.datePrev,
                                                },
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                    >
                                        Suivant
                                    </Button>
                                </Box>
                            </TabPanel>

                            {/* Tab 2: Horaires et mise à disposition */}
                            <TabPanel value={tabValue} index={1}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Détails des horaires"
                                            name="horairesDetails"
                                            value={formData.horairesDetails || ''}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            rows={3}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>
                                            Horaires de travail
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={4}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={formData.horaireDeTravail?.enJournee || false}
                                                            onChange={handleInputChange}
                                                            name="horaireDeTravail.enJournee"
                                                            color="primary"
                                                        />
                                                    }
                                                    label="En journée"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={formData.horaireDeTravail?.enNuit || false}
                                                            onChange={handleInputChange}
                                                            name="horaireDeTravail.enNuit"
                                                            color="primary"
                                                        />
                                                    }
                                                    label="En nuit"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={formData.horaireDeTravail?.samedi || false}
                                                            onChange={handleInputChange}
                                                            name="horaireDeTravail.samedi"
                                                            color="primary"
                                                        />
                                                    }
                                                    label="Samedi"
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="h6" gutterBottom>
                                            Mise à disposition
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={3}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={formData.misesEnDisposition?.vestiaires || false}
                                                            onChange={handleInputChange}
                                                            name="misesEnDisposition.vestiaires"
                                                            color="primary"
                                                        />
                                                    }
                                                    label="Vestiaires"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={formData.misesEnDisposition?.sanitaires || false}
                                                            onChange={handleInputChange}
                                                            name="misesEnDisposition.sanitaires"
                                                            color="primary"
                                                        />
                                                    }
                                                    label="Sanitaires"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={formData.misesEnDisposition?.restaurant || false}
                                                            onChange={handleInputChange}
                                                            name="misesEnDisposition.restaurant"
                                                            color="primary"
                                                        />
                                                    }
                                                    label="Restaurant"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={formData.misesEnDisposition?.energie || false}
                                                            onChange={handleInputChange}
                                                            name="misesEnDisposition.energie"
                                                            color="primary"
                                                        />
                                                    }
                                                    label="Énergie"
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleBack}
                                    >
                                        Précédent
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                    >
                                        Suivant
                                    </Button>
                                </Box>
                            </TabPanel>


                            {/*Tab 3*/}
                            {/* Tab 3: Risques et dispositifs */}
                            <TabPanel value={tabValue} index={2}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} >
                                        <Paper elevation={2} sx={{ p: 2 }}>
                                            {(
                                                errors.risques &&
                                                <Alert severity="error" sx={{ mb: 2 }}>
                                                    {errors.risques}
                                                </Alert>
                                            )}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="h6">Risques</Typography>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    startIcon={<AddIcon />}
                                                    onClick={() => handleOpenDialog('risques')}
                                                >
                                                    Ajouter
                                                </Button>
                                            </Box>

                                            {formData.risques && formData.risques.length > 0 ? (
                                                <Box sx={{ display: 'flex', gap: 2 }}>



                                                    {/* First Stack - Left side */}
                                                    <Stack spacing={1} sx={{ flex: 1 }}>
                                                        {formData.risques
                                                            .filter((_, index) => index % 2 === 0) // Get even indexed items (0, 2, 4...)
                                                            .map((risque) => (
                                                                <RisqueComponent
                                                                    key={risque.id}
                                                                    object={risque}
                                                                    currentPdp={formData}
                                                                    saveCurrentPdp={setFormData}
                                                                    setIsChanged={() => {}}
                                                                    typeOfObject={"pdp"}
                                                                />
                                                            ))}
                                                    </Stack>

                                                    {/* Second Stack - Right side */}
                                                    <Stack spacing={1} sx={{ flex: 1 }}>
                                                        {formData.risques
                                                            .filter((_, index) => index % 2 !== 0) // Get odd indexed items (1, 3, 5...)
                                                            .map((risque) => (
                                                                <RisqueComponent
                                                                    key={risque.id}
                                                                    object={risque}
                                                                    currentPdp={formData}
                                                                    saveCurrentPdp={setFormData}
                                                                    setIsChanged={() => {}}
                                                                    typeOfObject={"pdp"}
                                                                />
                                                            ))}
                                                    </Stack>
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color="textSecondary">
                                                    Aucun risque ajouté
                                                </Typography>
                                            )}
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Paper elevation={2} sx={{ p: 2 }}>
                                            {(
                                                errors.dispositifs &&
                                                <Alert severity="error" sx={{ mb: 2 }}>
                                                    {errors.dispositifs}
                                                </Alert>
                                            )}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="h6">Dispositifs</Typography>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    startIcon={<AddIcon />}
                                                    onClick={() => handleOpenDialog('dispositifs')}
                                                >
                                                    Ajouter
                                                </Button>
                                            </Box>

                                            {formData.dispositifs && formData.dispositifs.length > 0 ? (
                                            /*    <Stack spacing={1}>
                                                    {formData.dispositifs.map((dispositif) => (
                                                        <DispositifComponent dispositif={dispositif} currentPdp={formData} saveCurrentPdp={setFormData} setIsChanged={()=>{}}/>
                                                    ))}
                                                </Stack>*/

                                                <Box sx={{ display: 'flex', gap: 2 }}>
                                                    {/* First Stack - Left side */}
                                                    <Stack spacing={1} sx={{ flex: 1 }}>
                                                        {formData.dispositifs
                                                            .filter((_, index) => index % 2 === 0) // Get even indexed items (0, 2, 4...)
                                                            .map((dispositif) => (
                                                                <DispositifComponent
                                                                    key={dispositif.id}
                                                                    dispositif={dispositif}
                                                                    currentPdp={formData}
                                                                    saveCurrentPdp={setFormData}
                                                                    setIsChanged={() => {}}
                                                                />
                                                            ))}
                                                    </Stack>

                                                    {/* Second Stack - Right side */}
                                                    <Stack spacing={1} sx={{ flex: 1 }}>
                                                        {formData.dispositifs
                                                            .filter((_, index) => index % 2 !== 0) // Get odd indexed items (1, 3, 5...)
                                                            .map((dispositif) => (
                                                                <DispositifComponent
                                                                    key={dispositif.id}
                                                                    dispositif={dispositif}
                                                                    currentPdp={formData}
                                                                    saveCurrentPdp={setFormData}
                                                                    setIsChanged={() => {}}
                                                                />
                                                            ))}
                                                    </Stack>
                                                </Box>


                                            ) : (
                                                <Typography variant="body2" color="textSecondary">
                                                    Aucun dispositif ajouté
                                                </Typography>
                                            )}
                                        </Paper>
                                    </Grid>
                                </Grid>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleBack}
                                    >
                                        Précédent
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                    >
                                        Suivant
                                    </Button>
                                </Box>
                            </TabPanel>


                            {/*Tab 4 permit*/}
                            {/* Tab 4: Permis */}
                            <TabPanel value={tabValue} index={3}>
                                <Paper elevation={2} sx={{ p: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6">Permis</Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            startIcon={<AddIcon />}
                                            onClick={() => handleOpenDialog('permits')}
                                        >
                                            Ajouter
                                        </Button>
                                    </Box>

                                    {formData.permits && formData.permits.length > 0 ? (
                                        <Stack spacing={1}>
                                            {formData.permits.map((permit) => (
                                                <Box
                                                    key={permit.id}
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        p: 1,
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        borderRadius: 1
                                                    }}
                                                >
                                                    <Typography>{permit.permit_id?.title || `Permis #${permit.id}`}</Typography>
                                                    <Box>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={permit.answer}
                                                                    onChange={(e) => {
                                                                        // Update answer value
                                                                        const updatedPermits = formData.permits?.map(p =>
                                                                            p.id === permit.id ? { ...p, answer: e.target.checked } : p
                                                                        ) || [];
                                                                        setFormData(prev => ({ ...prev, permits: updatedPermits }));
                                                                    }}
                                                                    color="primary"
                                                                />
                                                            }
                                                            label="Applicable"
                                                        />
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleRemoveItem('permits', permit.id as number)}
                                                            color="error"
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Typography variant="body2" color="textSecondary">
                                            Aucun permis ajouté
                                        </Typography>
                                    )}
                                </Paper>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleBack}
                                    >
                                        Précédent
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                    >
                                        Suivant
                                    </Button>
                                </Box>
                            </TabPanel>

                            {/* Tab 5: Analyse des risques */}
                            <TabPanel value={tabValue} index={4}>
                                <Paper elevation={2} sx={{ p: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6">Analyse des risques</Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            startIcon={<AddIcon />}
                                            onClick={() => handleOpenDialog('analyseDeRisques')}
                                        >
                                            Ajouter
                                        </Button>
                                    </Box>

                                    {formData.analyseDeRisques && formData.analyseDeRisques.length > 0 ? (
                                        <Stack spacing={2}>
                                            {formData.analyseDeRisques.map((analyse) => (
                                                <Paper
                                                    key={analyse.id}
                                                    variant="outlined"
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 1,
                                                        borderLeft: 4,
                                                        borderLeftColor: 'primary.main'
                                                    }}
                                                >



                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            {analyse.analyseDeRisque?.risque?.logo && (
                                                                <Avatar
                                                                    src={`data:${analyse.analyseDeRisque.risque.logo.mimeType};base64,${analyse.analyseDeRisque.risque.logo.imageData}`}
                                                                    alt={analyse.analyseDeRisque.risque.title}
                                                                    sx={{ width: 32, height: 32 }}
                                                                />
                                                            )}
                                                            <Typography variant="subtitle1" fontWeight="bold">
                                                                {analyse.analyseDeRisque?.risque?.title || `Analyse #${analyse.id}`}
                                                            </Typography>
                                                        </Box>
                                                        <Box>
                                                            <Tooltip title="Entreprise Extérieure">
                                                                <FormControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            checked={analyse.ee}
                                                                            onChange={(e) => {
                                                                                const updatedAnalyses = formData.analyseDeRisques?.map(a =>
                                                                                    a.id === analyse.id ? { ...a, ee: e.target.checked } : a
                                                                                ) || [];
                                                                                setFormData(prev => ({ ...prev, analyseDeRisques: updatedAnalyses }));
                                                                            }}
                                                                            color="primary"
                                                                            size="small"
                                                                        />
                                                                    }
                                                                    label="EE"
                                                                />
                                                            </Tooltip>
                                                            <Tooltip title="Entreprise Utilisatrice">
                                                                <FormControlLabel
                                                                    control={
                                                                        <Checkbox
                                                                            checked={analyse.eu}
                                                                            onChange={(e) => {
                                                                                const updatedAnalyses = formData.analyseDeRisques?.map(a =>
                                                                                    a.id === analyse.id ? { ...a, eu: e.target.checked } : a
                                                                                ) || [];
                                                                                setFormData(prev => ({ ...prev, analyseDeRisques: updatedAnalyses }));
                                                                            }}
                                                                            color="primary"
                                                                            size="small"
                                                                        />
                                                                    }
                                                                    label="EU"
                                                                />
                                                            </Tooltip>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleRemoveItem('analyseDeRisques', analyse.id)}
                                                                color="error"
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>

                                                    {analyse.analyseDeRisque?.risque?.description && (
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                            {analyse.analyseDeRisque.risque.description}
                                                        </Typography>
                                                    )}

                                                    <Divider sx={{ my: 1 }} />

                                                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                                                        <Grid item xs={12} md={6}>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Déroulement des tâches
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                {analyse.analyseDeRisque?.deroulementDesTaches || "Non spécifié"}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Moyens utilisés
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                {analyse.analyseDeRisque?.moyensUtilises || "Non spécifié"}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Mesures de prévention
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                {analyse.analyseDeRisque?.mesuresDePrevention || "Non spécifié"}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>

                                                    {analyse.analyseDeRisque?.risque && (
                                                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                                            {analyse.analyseDeRisque.risque.travailleDangereux && (
                                                                <Chip
                                                                    size="small"
                                                                    color="error"
                                                                    label="Travail dangereux"
                                                                    icon={<WarningIcon />}
                                                                />
                                                            )}
                                                            {analyse.analyseDeRisque.risque.travaillePermit && (
                                                                <Chip
                                                                    size="small"
                                                                    color="warning"
                                                                    label="Travail avec permis"

                                                                />
                                                            )}
                                                        </Box>
                                                    )}

                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                                        <Button
                                                            size="small"
                                                            startIcon={<EditIcon />}
                                                            onClick={() => {
                                                                setSelectedAnalyseDeRisque(analyse?.analyseDeRisque || null);
                                                                handleOpenDialog('editAnalyseDeRisque');
                                                                setOpenDialog(true);

                                                            }}
                                                        >
                                                            Modifier
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            startIcon={<Visibility />}
                                                            //onClick={() => handleViewDetails(analyse.id)}
                                                            sx={{ ml: 1 }}
                                                        >
                                                            Détails
                                                        </Button>
                                                    </Box>
                                                </Paper>
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Typography variant="body2" color="textSecondary" sx={{ py: 2, textAlign: 'center' }}>
                                            Aucune analyse de risque ajoutée
                                        </Typography>
                                    )}
                                </Paper>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleBack}
                                    >
                                        Précédent
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        onClick={handleSubmit}
                                    >
                                        Enregistrer
                                    </Button>
                                </Box>
                            </TabPanel>


            {/* Dialog for adding items */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {dialogType === 'risques' && 'Ajouter un risque'}
                    {dialogType === 'dispositifs' && 'Ajouter un dispositif'}
                    {dialogType === 'permits' && 'Ajouter un permis'}
                    {dialogType === 'analyseDeRisques' && 'Ajouter une analyse de risque'}
                </DialogTitle>
                <DialogContent>
                    {dialogType === 'risques' && (
                       /* <Autocomplete
                            options={risques.filter(r =>
                                !formData.risques?.some(fr => fr.risque?.id === r.id || fr.id === r.id) || []
                            )}
                            getOptionLabel={(option) => option.title || `Risque #${option.id}`}
                            onChange={(_, newValue) => setDialogData(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Sélectionner un risque"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />*/

                        <SelectOrCreateRisque open={
                            openDialog
                        } setOpen={setOpenDialog} currentObject={formData} saveObject={setFormData} targetType={'pdp'} setIsChanged={()=>{}}/>
                    )}

                    {
                        dialogType ==='dispositifs' && (
                            <SelectOrCreateDispositif open={openDialog} setOpen={setOpenDialog} currentPdp={formData} savePdp={setFormData} setIsChanged={()=>{}}/>
                        )
                    }
                    {
                        dialogType ==='analyseDeRisques' && (
                            <SelectOrCreateAnalyseRisque open={openDialog} setOpen={setOpenDialog} currentPdp={formData} savePdp={setFormData} setIsChanged={()=>{}}/>
                        )
                    }
                    {
                        dialogType === 'editAnalyseDeRisque' && (
                            <EditAnalyseRisque analyse={
                                selectedAnalyseDeRisque
                            }
                                               setAnalyse={setSelectedAnalyseDeRisque} open={openDialog} setOpen={setOpenDialog} savePdp={setFormData} currentPdp={formData} isEdit={true} setIsChanged={()=>{}}/>
                        )
                    }

                    {dialogType === 'permits' && (
                        <Autocomplete
                            options={permits.filter(p =>
                                !formData.permits?.some(fp => fp.permit?.id === p.id || fp.id === p.id) || []
                            )}
                            getOptionLabel={(option) => option.title || `Permis #${option.id}`}
                            onChange={(_, newValue) => setDialogData(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Sélectionner un permis"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />

                    )}

                    {/* Add more autocomplete fields for other dialog types */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Annuler
                    </Button>
                    <Button
                        onClick={() => dialogData && handleAddItem(dialogType as DialogTypes, dialogData)}
                        color="primary"
                        disabled={!dialogData}
                    >
                        Ajouter
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Footer with save button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                {isLoading && (
                    <CircularProgress size={24} sx={{ mr: 2 }} />
                )}
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    startIcon={<SaveIcon />}
                    disabled={isLoading}
                    onClick={(e)=>{
                        console.log(formData)
                        if(!validateForm()){
                            return;
                        }
                        handleSubmit(e)
                    }}
                >
                    {isEditMode ? "Mettre à jour" : "Créer"}
                </Button>
            </Box>
        </div>
    )}
</Paper>
</Box>
</LocalizationProvider>
);
};

export default EditCreatePdp;




