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
    List,
    ListItem,
    ListItemText,
    Card,
    CardContent,
    Avatar,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import useBdt from '../../hooks/useBdt';
import useEntreprise from '../../hooks/useEntreprise';
import useRisque from '../../hooks/useRisque';
import useChantier from '../../hooks/useChantier';
import useWoker from '../../hooks/useWoker';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';
import WarningIcon from '@mui/icons-material/Warning';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ShieldIcon from '@mui/icons-material/Shield';
import BuildIcon from '@mui/icons-material/Build';
import VerifiedIcon from '@mui/icons-material/Verified';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { BDT } from '../../utils/entities/BDT.ts';
import { Entreprise } from '../../utils/entities/Entreprise.ts';
import Risque from '../../utils/entities/Risque.ts';
import Chantier from '../../utils/entities/Chantier.ts';
import { EntityRef } from '../../utils/EntityRef.ts';
import { getRoute } from '../../Routes.tsx';
import { useNotifications } from '@toolpad/core/useNotifications';
import { AuditSecu } from '../../utils/entities/AuditSecu.ts';
import ObjectAnswered from '../../utils/pdp/ObjectAnswered';
import Worker from '../../utils/entities/Worker.ts';
import Signature from '../../utils/entities/Signature.ts';
import SelectOrCreateRisque from "../../components/Pdp/SelectOrCreateRisque.tsx";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RisqueComponent from "../../components/Steps/RisqueComponent.tsx";
import SelectOrCreateAudit from "../../components/Pdp/SelectOrCreateAudit.tsx";
// Define the interface for URL params
interface ParamTypes {
    id?: string;
    chantierId?: string;
}

// Define the TabPanel props interface
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

// Define ComplementOuRappel interface
interface ComplementOuRappel {
    complement: string;
    respect: boolean;
}

// TabPanel component for tab navigation
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`bdt-tabpanel-${index}`}
            aria-labelledby={`bdt-tab-${index}`}
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
        id: `bdt-tab-${index}`,
        'aria-controls': `bdt-tabpanel-${index}`,
    };
}

// Define dialog data types
type DialogTypes = 'risques' | 'audits' | 'complement' | 'chargeDeTravail' | 'donneurDOrdre';

const EditCreateBdt: React.FC = () => {
    const {id, chantierId} = useParams<ParamTypes>();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    // Tab state
    const [tabValue, setTabValue] = useState<number>(0);

    // Dialog state
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [dialogType, setDialogType] = useState<DialogTypes | ''>('');
    const [dialogData, setDialogData] = useState<any | null>(null);

    // New complement form state
    const [newComplement, setNewComplement] = useState<ComplementOuRappel>({
        complement: '',
        respect: false
    });

    // Form state
    const [formData, setFormData] = useState<BDT>({
        id: undefined,
        nom: undefined,
        risques: [],
        auditSecu: [],
        complementOuRappels: [],
        chantier: undefined,
        entrepriseExterieure: undefined,
        signatureChargeDeTravail: undefined,
        signatureDonneurDOrdre: undefined,
    });

    // Loading state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Hooks
    const {getBDT, createBDT, saveBDT, linkRisqueToBDT, linkAuditToBDT, unlinkRisqueToBDT, unlinkAuditToBDT} = useBdt();
    const notifications = useNotifications();
    const {getAllEntreprises, entreprises} = useEntreprise();
    const {getAllRisques, risques} = useRisque();
    const {getChantier, getAllChantiers} = useChantier();
    const {getAllWorkers} = useWoker();

    // Data states
    const [audits, setAudits] = useState<AuditSecu[]>([]);
    const [chantiers, setChantiers] = useState<Chantier[]>([]);
    const [workers, setWorkers] = useState<Worker[]>([]);

    // Error states
    const [errors, setErrors] = useState<Record<string, string>>({});


    useEffect(() => {
        console.log('formdifjas', formData);
    }, [formData]);


    // Load data on component mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Load dropdown data
                await getAllEntreprises();
                const risquesList = await getAllRisques();
                // In a real app, you would have a useAudit hook with getAllAudits
                // const auditsList = await getAllAudits();
                const chantiersList = await getAllChantiers();
                const workersList = await getAllWorkers();

               // setRisques(risquesList || []);
                // setAudits(auditsList || []);
                setChantiers(chantiersList || []);
                setWorkers(workersList || []);

                // If editing, load BDT data
                if (isEditMode && id) {
                    const bdtData = await getBDT(Number(id));
                    if (bdtData) {
                        setFormData({
                            ...bdtData,
                            // Ensure all required objects are present
                            risques: bdtData.risques || [],
                            auditSecu: bdtData.auditSecu || [],
                            complementOuRappels: bdtData.complementOuRappels || [],
                            entrepriseExterieure: bdtData.entrepriseExterieure && {id: bdtData.entrepriseExterieure.id}
                        });
                    }
                }

                // If creating from a chantier, set the chantier
                if (!isEditMode && chantierId) {
                    const chantier = await getChantier(Number(chantierId));
                    console.log('here', chantier);
                    if (chantier) {
                        setFormData(prev => ({
                            ...prev,
                            chantier: { id: chantier.id as number } as EntityRef
                        }));
                    }
                }else{

                }
            } catch (error) {
                console.error("Error loading data:", error);
                setSaveError("Erreur lors du chargement des données");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, isEditMode, chantierId]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, checked, type} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle complement form changes
    const handleComplementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, checked, type} = e.target;

        setNewComplement(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setDialogData(newComplement);
        console.log(newComplement);

    };

    // Handle dropdown changes
    const handleAutocompleteChange = (name: keyof BDT, value: any | null) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle tab changes
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Dialog handlers
    const handleOpenDialog = (type: DialogTypes, data: any = null) => {
        setDialogType(type);
        setDialogData(data);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDialogData(null);
        // Reset the new complement form
        setNewComplement({
            complement: '',
            respect: false
        });
    };

    // Handle adding a new item to a list
    const handleAddItem = async (type: DialogTypes, item: any) => {
  /*      if (type === 'risques') {
      /!*      if (!formData.id) {
                // If BDT doesn't exist yet, add to local state only
                setFormData(prev => ({
                    ...prev,
                    risques: [...(prev.risques || []), {risque: item, answer: false}]
                }));
            } else {
                // Otherwise, link to backend
                try {
                    const response = await linkRisqueToBDT(formData.id, item.id);
                    if (response) {
                        setFormData(prev => ({
                            ...prev,
                            risques: [...(prev.risques || []), response]
                        }));
                    }
                } catch (error) {
                    console.error("Error adding risque:", error);
                    notifications.show("Erreur lors de l'ajout du risque", {severity: "error"});
                }
            }*!/
        } else if (type === 'audits') {
            if (!formData.id) {
                setFormData(prev => ({
                    ...prev,
                    auditSecu: [...(prev.auditSecu || []), {audit: item, answer: false}]
                }));
            } else {
                try {
                    const response = await linkAuditToBDT(formData.id, item.id);
                    if (response) {
                        setFormData(prev => ({
                            ...prev,
                            auditSecu: [...(prev.auditSecu || []), response]
                        }));
                    }
                } catch (error) {
                    console.error("Error adding audit:", error);
                    notifications.show("Erreur lors de l'ajout de l'audit", {severity: "error"});
                }
            }
        } */

    /* else if (type === 'chargeDeTravail' || type === 'donneurDOrdre') {
            // Create a signature with the selected worker
            const signature = {
                worker: item,
                date: new Date()
            };

            setFormData(prev => ({
                ...prev,
                [type === 'chargeDeTravail' ? 'signatureChargeDeTravail' : 'signatureDonneurDOrdre']: signature
            }));
        }

*/

        if (type === 'complement') {
            // Add complement to local state
            setFormData(prev => ({
                ...prev,
                complementOuRappels: [...(prev.complementOuRappels || []), newComplement]
            }));
        }
        handleCloseDialog();
    };

    // Handle removing an item from a list
    const handleRemoveItem = async (type: string, index: number, itemId?: number) => {
        if (type === 'risques') {
            if (!formData.id || !itemId) {
                // If BDT doesn't exist yet, remove from local state only
                setFormData(prev => ({
                    ...prev,
                    risques: prev?.risques?.filter((_, i) => i !== index)
                }));
            } else {
                // Otherwise, unlink from backend
                try {
                    await unlinkRisqueToBDT(formData.id, itemId);
                    setFormData(prev => ({
                        ...prev,
                        risques: prev?.risques?.filter((_, i) => i !== index)
                    }));
                } catch (error) {
                    console.error("Error removing risque:", error);
                    notifications.show("Erreur lors de la suppression du risque", {severity: "error"});
                }
            }
        } else if (type === 'auditSecu') {
            if (!formData.id || !itemId) {
                setFormData(prev => ({
                    ...prev,
                    auditSecu: prev?.auditSecu?.filter((_, i) => i !== index)
                }));
            } else {
                try {
                    await unlinkAuditToBDT(formData.id, itemId);
                    setFormData(prev => ({
                        ...prev,
                        auditSecu: prev?.auditSecu?.filter((_, i) => i !== index)
                    }));
                } catch (error) {
                    console.error("Error removing audit:", error);
                    notifications.show("Erreur lors de la suppression de l'audit", {severity: "error"});
                }
            }
        } else if (type === 'complementOuRappels') {
            // Remove complement from local state only (no backend endpoint needed)

            setFormData(prev => ({
                ...prev,
                complementOuRappels: prev?.complementOuRappels?.filter((_, i) => i !== index)
            }));
        } else if (type === 'signatureChargeDeTravail' || type === 'signatureDonneurDOrdre') {
            // Remove the signature
            setFormData(prev => ({
                ...prev,
                [type]: undefined
            }));
        }
    };

    // Toggle the answer status of an item (applicable/non-applicable)
    const handleToggleAnswer = (type: string, index: number) => {
        if (type === 'risques') {
            const updatedRisques = [ ...formData?.risques || []];
            updatedRisques[index] = {
                ...updatedRisques[index],
                answer: !updatedRisques[index].answer
            };
            setFormData(prev => ({...prev, risques: updatedRisques}));
        } else if (type === 'auditSecu') {
            const updatedAudits = [...formData?.auditSecu || []];
            updatedAudits[index] = {
                ...updatedAudits[index],
                answer: !updatedAudits[index].answer
            };
            setFormData(prev => ({...prev, auditSecu: updatedAudits}));
        } else if (type === 'complementOuRappels') {
            const updatedComplements = [...formData?.complementOuRappels || []];
            updatedComplements[index] = {
                ...updatedComplements[index],
                respect: !updatedComplements[index].respect
            };
            setFormData(prev => ({...prev, complementOuRappels: updatedComplements}));
        }
    };

    // Form validation
    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        // Validate required fields
        if (!formData.nom || formData.nom.trim() === '') {
            errors.nom = "Le nom est requis";
        }

        if (!formData.entrepriseExterieure) {
            errors.entrepriseExterieure = "L'entreprise extérieure est requise";
        }


        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setSaveSuccess(false);
        setSaveError(null);

        try {
            let savedBdt;

            if (isEditMode && formData.id) {
                // Update existing BDT
                savedBdt = await saveBDT(formData, formData.id);
            } else {
                // Create new BDT
                savedBdt = await createBDT(formData);

                // If we have local state items, link them to the new BDT
                if (savedBdt && savedBdt.id) {
                    // Link risques
                   for (const risque of formData.risques || []) {
                        if (risque.risque_id) {
                            await linkRisqueToBDT(savedBdt.id, risque.risque_id);
                        }
                    }

                    // Link audits
                    for (const audit of formData.auditSecu || []) {
                        if (audit.auditSecu?.id) {
                            await linkAuditToBDT(savedBdt.id, audit.auditSecu.id);
                        }
                    }

                    // For complementOuRappels, we need to update the whole BDT
                    savedBdt = await saveBDT({
                        ...savedBdt,
                        complementOuRappels: null
                    }, savedBdt.id);
                }
            }

            if (savedBdt) {
                setSaveSuccess(true);
                notifications.show("Le Bon de Travail a été enregistré avec succès", {
                    severity: "success",
                    autoHideDuration: 2000
                });
                if (!isEditMode) {
                    // Redirect to edit mode with the new ID
                    navigate(getRoute('VIEW_BDT', {id: savedBdt.id}), {replace: true});
                }
            }
        } catch (error) {
            console.error("Error saving BDT:", error);
            setSaveError("Erreur lors de l'enregistrement du Bon de Travail");
            notifications.show("Erreur lors de l'enregistrement du Bon de Travail", {
                severity: "error",
                autoHideDuration: 2000
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Loading indicator
    if (isLoading && !formData.id) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{width: '100%', p: 3}}>
                <Paper elevation={3} sx={{p: 3, mb: 3}}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                        <Typography variant="h4">
                            {isEditMode ? "Modifier le Bon de Travail" : "Créer un Bon de Travail"}
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon/>}
                            onClick={() => navigate(-1)}
                        >
                            Retour
                        </Button>
                    </Box>

                    {saveSuccess && (
                        <Alert severity="success" sx={{mb: 3}}>
                            Le Bon de Travail a été enregistré avec succès.
                        </Alert>
                    )}

                    {saveError && (
                        <Alert severity="error" sx={{mb: 3}}>
                            {saveError}
                        </Alert>
                    )}

                    <div>
                        <Box sx={{borderBottom: 1, borderColor: 'divider', mb: 2}}>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                aria-label="bdt tabs"
                                variant="scrollable"
                                scrollButtons="auto"
                            >
                                <Tab icon={<BusinessIcon/>} label="Informations générales" {...a11yProps(0)} />
                                <Tab icon={<WarningIcon/>} label="Risques" {...a11yProps(1)} />
                                <Tab icon={<ShieldIcon/>} label="Audit Sécurité" {...a11yProps(2)} />
                                <Tab icon={<NoteAddIcon/>} label="Compléments" {...a11yProps(3)} />
                                <Tab icon={<AccountCircleIcon/>} label="Signatures" {...a11yProps(4)} />
                            </Tabs>
                        </Box>

                        {/* Tab 1: Informations générales */}
                        <TabPanel value={tabValue} index={0}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Nom du Bon de Travail"
                                        name="nom"
                                        value={formData.nom || ''}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        fullWidth
                                        required
                                        error={!!errors.nom}
                                        helperText={errors.nom}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Autocomplete
                                        options={Array.from(entreprises.values())}
                                        getOptionLabel={(option) => option.nom || ''}
                                        value={formData.entrepriseExterieure?.id ? entreprises.get(formData.entrepriseExterieure.id) || null : null}
                                        onChange={(_, newValue) => handleAutocompleteChange('entrepriseExterieure', newValue ? {id: newValue.id} as EntityRef : null)}
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
                            </Grid>
                        </TabPanel>

                        {/* Tab 2: Risques */}
                        <TabPanel value={tabValue} index={1}>
                            <Box sx={{mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Typography variant="h6">Risques identifiés</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon/>}
                                    onClick={() => handleOpenDialog('risques')}
                                >
                                    Ajouter un risque
                                </Button>
                            </Box>

                            {formData.risques && formData.risques.length > 0 ? (
                                <Grid container spacing={2}>
                                    {formData.risques.map((risque, index) => (
                                        <Grid item xs={12} md={6} key={`risque-${index}`}>
                                            <RisqueComponent typeOfObject={'bdt'} risque={risque} currentPdp={formData} saveCurrentPdp={setFormData} setIsChanged={()=>{}} />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Alert severity="info">
                                    Aucun risque n'a été ajouté. Utilisez le bouton "Ajouter un risque" pour en ajouter.
                                </Alert>
                            )}
                        </TabPanel>

                         Tab 3: Audit Sécurité
                        <TabPanel value={tabValue} index={2}>
                            <Box sx={{mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Typography variant="h6">Audits de sécurité</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon/>}
                                    onClick={() => handleOpenDialog('audits')}
                                >
                                    Ajouter un audit
                                </Button>
                            </Box>

                            {formData.auditSecu && formData.auditSecu.length > 0 ? (
                                <Grid container spacing={2}>
                                    {formData.auditSecu.map((audit, index) => (
                                        <Grid item xs={12} md={6} key={`audit-${index}`}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}>
                                                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                            <Avatar sx={{
                                                                bgcolor: audit.answer ? 'success.main' : 'grey.500',
                                                                mr: 2
                                                            }}>
                                                                <ShieldIcon/>
                                                            </Avatar>
                                                            <Typography variant="subtitle1">
                                                                {audit.auditSecu?.title || `Audit #${index + 1}`}
                                                            </Typography>
                                                        </Box>
                                                        <Box>
                                                            <FormControlLabel
                                                                control={
                                                                    <Switch
                                                                        checked={audit.answer || false}
                                                                        onChange={() => handleToggleAnswer('auditSecu', index)}
                                                                        color="primary"
                                                                    />
                                                                }
                                                                label="Validé"
                                                            />
                                                            <IconButton
                                                                color="error"
                                                                onClick={() => handleRemoveItem('auditSecu', index, audit.id)}
                                                            >
                                                                <DeleteIcon/>
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                    {audit.auditSecu?.description && (
                                                        <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                                                            {audit.auditSecu.description}
                                                        </Typography>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Alert severity="info">
                                    Aucun audit de sécurité n'a été ajouté. Utilisez le bouton "Ajouter un audit" pour
                                    en ajouter.
                                </Alert>
                            )}
                        </TabPanel>


                        {/*  Tab 4: Compléments */}

                        <TabPanel value={tabValue} index={3}>
                            <Box sx={{mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Typography variant="h6">Compléments ou rappels</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon/>}
                                    onClick={() => handleOpenDialog('complement')}
                                >
                                    Ajouter un complément
                                </Button>
                            </Box>

                            {formData.complementOuRappels && formData.complementOuRappels.length > 0 ? (
                                <Grid container spacing={2}>
                                    {formData.complementOuRappels.map((complement, index) => (
                                        <Grid item xs={12} key={`complement-${index}`}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'flex-start'
                                                    }}>
                                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>

                                                            <Typography variant="subtitle1">
                                                                Complément #{index + 1}
                                                            </Typography>
                                                        </Box>
                                                        <Box>
                                                            <FormControlLabel
                                                                control={
                                                                    <Switch
                                                                        onChange={() => handleToggleAnswer('complementOuRappels', index)}
                                                                        checked={complement.respect || false}
                                                                        color="primary"
                                                                    />
                                                                }
                                                                label="Respecté"
                                                            />
                                                            <IconButton
                                                                color="error"
                                                                onClick={() => handleRemoveItem('complementOuRappels', index)}
                                                            >
                                                                <DeleteIcon/>
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                    <Divider sx={{my: 2}}/>
                                                    <Typography variant="body1">

                                                        {complement.complement}

                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Alert severity="info">
                                    Aucun complément n'a été ajouté. Utilisez le bouton "Ajouter un complément" pour en
                                    ajouter.
                                </Alert>
                            )}
                        </TabPanel>


                         Tab 5: Signatures
                        <TabPanel value={tabValue} index={4}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card variant="outlined" sx={{height: '100%'}}>
                                        <CardContent>
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 2
                                            }}>
                                                <Typography variant="h6">Chargé de travail</Typography>
                                                {!formData.signatureChargeDeTravail && (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<AddIcon/>}
                                                        onClick={() => handleOpenDialog('chargeDeTravail')}
                                                        size="small"
                                                    >
                                                        Ajouter
                                                    </Button>
                                                )}
                                            </Box>
                                            <Divider sx={{mb: 2}}/>

                                            {formData.signatureChargeDeTravail ? (
                                                <Box>
                                                    <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                                        <Avatar sx={{mr: 2, bgcolor: 'primary.main'}}>
                                                            <EngineeringIcon/>
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle1">
                                                                {formData.signatureChargeDeTravail.worker?.prenom} {formData.signatureChargeDeTravail.worker?.nom}
                                                            </Typography>
                                                            {formData.signatureChargeDeTravail.date && (
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Signé
                                                                    le {dayjs(formData.signatureChargeDeTravail.date).format('DD/MM/YYYY HH:mm')}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            startIcon={<DeleteIcon/>}
                                                            onClick={() => handleRemoveItem('signatureChargeDeTravail', 0)}
                                                            size="small"
                                                        >
                                                            Supprimer
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            ) : (
                                                <Typography color="text.secondary" sx={{textAlign: 'center', py: 2}}>
                                                    Aucune signature
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card variant="outlined" sx={{height: '100%'}}>
                                        <CardContent>
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 2
                                            }}>
                                                <Typography variant="h6">Donneur d'ordre</Typography>
                                                {!formData.signatureDonneurDOrdre && (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<AddIcon/>}
                                                        onClick={() => handleOpenDialog('donneurDOrdre')}
                                                        size="small"
                                                    >
                                                        Ajouter
                                                    </Button>
                                                )}
                                            </Box>
                                            <Divider sx={{mb: 2}}/>

                                            {formData.signatureDonneurDOrdre ? (
                                                <Box>
                                                    <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                                        <Avatar sx={{mr: 2, bgcolor: 'secondary.main'}}>
                                                            <BusinessIcon/>
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle1">
                                                                {formData.signatureDonneurDOrdre.worker?.prenom} {formData.signatureDonneurDOrdre.worker?.nom}
                                                            </Typography>
                                                            {formData.signatureDonneurDOrdre.date && (
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Signé
                                                                    le {dayjs(formData.signatureDonneurDOrdre.date).format('DD/MM/YYYY HH:mm')}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            startIcon={<DeleteIcon/>}
                                                            onClick={() => handleRemoveItem('signatureDonneurDOrdre', 0)}
                                                            size="small"
                                                        >
                                                            Supprimer
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            ) : (
                                                <Typography color="text.secondary" sx={{textAlign: 'center', py: 2}}>
                                                    Aucune signature
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </TabPanel>
                    </div>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 3}}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon/>}
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            Enregistrer
                        </Button>
                    </Box>
                </Paper>
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>
                        {dialogType === 'risques' && "Ajouter un risque"}
                        {dialogType === 'audits' && "Ajouter un audit"}
                        {dialogType === 'complement' && "Ajouter un complément"}
                        {dialogType === 'chargeDeTravail' && "Sélectionner le chargé de travail"}
                        {dialogType === 'donneurDOrdre' && "Sélectionner le donneur d'ordre"}
                    </DialogTitle>
                    <DialogContent>
                        {dialogType === 'risques' && (
                            <SelectOrCreateRisque<BDT> open={openDialog}
                                                       setOpen={setOpenDialog}
                                                       currentObject={formData}
                                                       saveObject={setFormData}
                                                       linkRisqueToObject={linkRisqueToBDT}
                                                       setIsChanged={()=>{}}
                                                       getRisques={(p)=>{return p.risques}}
                            />

                        )}
                        {dialogType === 'audits' && (
                            <SelectOrCreateAudit<BDT>
                                open={openDialog}
                                setOpen={setOpenDialog}
                                currentObject={formData}
                                saveObject={setFormData}
                                setIsChanged={()=>{}}
                                linkAuditToObject={linkAuditToBDT}
                                getAudits={(p)=>{return p.auditSecu}}
                                 />
                        )}
                        {dialogType === 'complement' && (
                            <TextField
                                label="Complément ou rappel"
                                name="complement"
/*
                                value={newComplement.complement}
*/
                                onChange={handleComplementChange}
                                variant="outlined"
                                fullWidth
                            />
                        )}
                        {(dialogType === 'chargeDeTravail' || dialogType === 'donneurDOrdre') && (
                            <Autocomplete
                                options={workers}
                                getOptionLabel={(option) => `${option.prenom} ${option.nom}`}
                                onChange={(_, newValue) => setDialogData(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={`Sélectionner le ${dialogType === 'chargeDeTravail' ? "chargé de travail" : "donneur d'ordre"}`}
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Annuler
                        </Button>
                        <Button
                            onClick={() => handleAddItem(dialogType, dialogData)}
                            color="primary"
                            disabled={!dialogData}
                        >
                            Ajouter

                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </LocalizationProvider>
    );
}
export default EditCreateBdt;