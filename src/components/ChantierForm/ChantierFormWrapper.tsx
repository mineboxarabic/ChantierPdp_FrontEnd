// src/components/ChantierForm/ChantierFormWrapper.tsx
import React, { FC, useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Tabs,
    Tab,
    Button,
    Alert,
    Snackbar,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

// Hooks
import useChantier from '../../hooks/useChantier';
import useEntreprise from '../../hooks/useEntreprise';
import useUser from '../../hooks/useUser';
import useLocalisation from '../../hooks/useLocalisation';
import usePdp from '../../hooks/usePdp';
import useBdt from '../../hooks/useBdt';
import useWoker from '../../hooks/useWoker'; // Corrected typo from useWoker to useWorker if applicable

// DTOs
import { ChantierDTO } from '../../utils/entitiesDTO/ChantierDTO';
import { EntrepriseDTO } from '../../utils/entitiesDTO/EntrepriseDTO';
import { UserDTO } from '../../utils/entitiesDTO/UserDTO'; // Assuming UserDTO, adjust if it's User
import { LocalisationDTO } from '../../utils/entitiesDTO/LocalisationDTO';
import { PdpDTO } from '../../utils/entitiesDTO/PdpDTO';
import { BdtDTO } from '../../utils/entitiesDTO/BdtDTO';
import { WorkerDTO } from '../../utils/entitiesDTO/WorkerDTO';


// Sub-Form Components (We'll create these next)
import ChantierGeneralInfoForm from './ChantierGeneralInfoForm.tsx';
import ChantierEnterprisesForm from './ChantierEnterprisesForm.tsx';
import ChantierTeamForm from './ChantierTeamForm.tsx';
import ChantierLocationForm from './ChantierLocationForm.tsx';
import ChantierDocumentsManager from './ChantierDocumentsManager.tsx';

// Styles from Home
import { DashboardCard, CardHeader, CardTitle } from '../../pages/Home/styles.js'; // Adjust path as needed

// Routes
import { getRoute } from '../../Routes'; // Adjust path as needed

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
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `chantier-tab-${index}`,
        'aria-controls': `chantier-tabpanel-${index}`,
    };
}

const FormContainer = styled(DashboardCard)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2, // Consistent with Theme.tsx
    marginBottom: theme.spacing(3),
}));

const initialChantierData: ChantierDTO = {
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
    workerSelections: [], // Ensure this is part of your DTO if used
    status: undefined, // Or some default status
    travauxDangereux: false,
};


const ChantierFormWrapper: FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState<ChantierDTO>(initialChantierData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
    const [showDocumentsTab, setShowDocumentsTab] = useState<boolean>(false);

    // Data states for dropdowns, etc.
    const [entreprises, setEntreprises] = useState<Map<number, EntrepriseDTO>>(new Map());
    const [users, setUsers] = useState<UserDTO[]>([]); // Assuming UserDTO
    const [localisations, setLocalisations] = useState<Map<number,LocalisationDTO>>(new Map());
    const [allPdps, setAllPdps] = useState<Map<number,PdpDTO>>(new Map());
    const [allBdts, setAllBdts] = useState<Map<number,BdtDTO>>(new Map());
    const [allWorkers, setAllWorkers] = useState<Map<number, WorkerDTO>>(new Map());
    const [workersOfChantier, setWorkersOfChantier] = useState<WorkerDTO[]>([]);


    // Hooks for API calls
    const { getChantier, createChantier, saveChantier, loading: loadingChantierHook } = useChantier();
    const { getAllEntreprises: fetchAllEntreprises, entreprises: fetchedEntreprisesMap } = useEntreprise();
    const { getUsers: fetchUsers, users: fetchedUsersArray } = useUser();
    const { getAllLocalisations: fetchAllLocalisations, localisations: fetchedLocalisationsMap } = useLocalisation();
    const { getAllPDPs: fetchAllPDPs, pdps: fetchedPdpsMap } = usePdp();
    const { getAllBDTs: fetchAllBDTs, bdts: fetchedBdtsMap } = useBdt();
    const { getAllWorkers: fetchAllWorkersHook, getSelectedWorkersForChantier, deselectWorkerFromChantier, workers: fetchedWorkersMap } = useWoker(); // Corrected typo

    const loadInitialData = useCallback(async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                fetchAllEntreprises(),
                fetchUsers().then(data => setUsers(data || [])),
                fetchAllLocalisations(),
                fetchAllPDPs(),
                fetchAllBDTs(),
                fetchAllWorkersHook(),
            ]);

            if (isEditMode && id) {
                const chantierId = parseInt(id);
                const chantierData = await getChantier(chantierId);
                if (chantierData) {
                    setFormData({
                        ...initialChantierData, // Default values
                        ...chantierData,        // Loaded values
                        dateDebut: chantierData.dateDebut ? dayjs(chantierData.dateDebut).toDate() : new Date(),
                        dateFin: chantierData.dateFin ? dayjs(chantierData.dateFin).toDate() : new Date(),
                        entrepriseExterieurs: chantierData.entrepriseExterieurs || [],
                        pdps: chantierData.pdps || [],
                        bdts: chantierData.bdts || [],
                    });
                    const selectedWorkers = await getSelectedWorkersForChantier(chantierId);
                    setWorkersOfChantier(selectedWorkers || []);
                } else {
                    // Handle chantier not found
                    console.error("Chantier not found");
                    navigate(getRoute('HOME')); // Or a 404 page
                }
            } else {
                setFormData(initialChantierData);
            }
        } catch (error) {
            console.error("Error fetching initial data:", error);
            setErrors(prev => ({ ...prev, load: "Failed to load initial data." }));
        } finally {
            setIsLoading(false);
        }
    }, [id, isEditMode, navigate]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    // Update local state maps when fetched data from hooks changes
    useEffect(() => setEntreprises(fetchedEntreprisesMap), [fetchedEntreprisesMap]);
    useEffect(() => setLocalisations(fetchedLocalisationsMap), [fetchedLocalisationsMap]);
    useEffect(() => setAllPdps(fetchedPdpsMap), [fetchedPdpsMap]);
    useEffect(() => setAllBdts(fetchedBdtsMap), [fetchedBdtsMap]);
    useEffect(() => setAllWorkers(fetchedWorkersMap), [fetchedWorkersMap]);


    useEffect(() => {
        if (formData.nbHeurs && formData.nbHeurs >= 400 || formData.isAnnuelle) {
            setShowDocumentsTab(true);
        } else {
            setShowDocumentsTab(false);
        }
    }, [formData.nbHeurs, formData.isAnnuelle]);

    const handleInputChange = (field: keyof ChantierDTO, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };
    
    const handleDateChange = (field: 'dateDebut' | 'dateFin', date: Date | null) => {
        setFormData(prev => ({ ...prev, [field]: date }));
         if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };


    const validateTab = (tabIndex: number): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;
        // Basic validation example, expand as needed
        if (tabIndex === 0) { // General Info
            if (!formData.nom?.trim()) {
                newErrors.nom = "Le nom du chantier est requis.";
                isValid = false;
            }
            if (!formData.operation?.trim()) {
                newErrors.operation = "L'opération est requise.";
                isValid = false;
            }
            if (!formData.dateDebut) {
                newErrors.dateDebut = "La date de début est requise.";
                isValid = false;
            }
            if (formData.dateFin && formData.dateDebut && dayjs(formData.dateFin).isBefore(dayjs(formData.dateDebut))) {
                newErrors.dateFin = "La date de fin ne peut pas être avant la date de début.";
                isValid = false;
            }
        }
        // Add validation for other tabs
        setErrors(prev => ({ ...prev, ...newErrors }));
        return isValid;
    };

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        // if (validateTab(activeTab)) { // Optionally validate before switching
            setActiveTab(newValue);
        // }
    };

    const handleSubmit = async () => {
        let allTabsValid = true;
        const totalTabs = showDocumentsTab ? 5 : 4;
        for (let i = 0; i < totalTabs; i++) {
            if (!validateTab(i)) {
                allTabsValid = false;
                setActiveTab(i); // Focus the tab with the first error
                break;
            }
        }

        if (!allTabsValid) {
            console.error("Validation errors:", errors);
            return;
        }

        setIsSubmitting(true);
        try {
            let result;
            const payload = {
                ...formData,
                // Ensure IDs are correctly mapped if objects are stored in formData for selection
                entrepriseUtilisatrice: formData.entrepriseUtilisatrice,
                localisation: formData.localisation,
                donneurDOrdre: formData.donneurDOrdre,
                entrepriseExterieurs: formData.entrepriseExterieurs || [],
                pdps: formData.pdps || [],
                bdts: formData.bdts || [],
            };

            if (isEditMode && id) {
                result = await saveChantier(payload, parseInt(id));
            } else {
                result = await createChantier(payload);
            }

            if (result) {
                setSaveSuccess(true);
            }
        } catch (error: any) {
            console.error("Error saving chantier:", error);
            setErrors(prev => ({ ...prev, submit: error.message || "Failed to save chantier." }));
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const tabLabels = ['Informations générales', 'Entreprises', 'Équipe', 'Localisation'];
    if (showDocumentsTab) {
        tabLabels.push('Documents');
    }


    if (isLoading || loadingChantierHook) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, mx: "auto", maxWidth: '1200px' }}>
            <FormContainer>
                <CardHeader>
                    <CardTitle variant="h4" gutterBottom>
                        {isEditMode ? "Modifier le chantier" : "Créer un nouveau chantier"}
                    </CardTitle>
                </CardHeader>

                {formData.isAnnuelle && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Ce chantier est annuel. Un Plan de Prévention (PDP) est requis.
                    </Alert>
                )}
                 {formData.nbHeurs && formData.nbHeurs >= 400 && !formData.isAnnuelle && (
                     <Alert severity="warning" sx={{ mb: 2 }}>
                        Attention: Les chantiers de plus de 400 heures nécessitent généralement un Plan de Prévention (PDP).
                    </Alert>
                 )}


                <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3, mb: 2 }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleChangeTab}
                        aria-label="chantier form tabs"
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        {tabLabels.map((label, index) => (
                            <Tab label={label} {...a11yProps(index)} key={label}/>
                        ))}
                    </Tabs>
                </Box>

                <TabPanel value={activeTab} index={0}>
                    <ChantierGeneralInfoForm
                        formData={formData}
                        onInputChange={handleInputChange}
                        onDateChange={handleDateChange}
                        errors={errors}
                    />
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                    <ChantierEnterprisesForm
                        formData={formData}
                        onInputChange={handleInputChange}
                        errors={errors}
                        allEntreprises={Array.from(entreprises.values())} // Pass as array
                    />
                </TabPanel>
                 <TabPanel value={activeTab} index={2}>
                    <ChantierTeamForm
                        formData={formData}
                        onInputChange={handleInputChange}
                        errors={errors}
                        allUsers={users}
                        allEntreprisesOfChantier={Array.from(entreprises.values()).filter(e => formData.entrepriseExterieurs?.includes(e.id as number))}
                        allWorkers={Array.from(allWorkers.values())}
                        workersOfChantier={workersOfChantier}
                        setWorkersOfChantier={setWorkersOfChantier}
                        chantierId={formData.id}
                    />
                </TabPanel>
                <TabPanel value={activeTab} index={3}>
                    <ChantierLocationForm
                        formData={formData}
                        onInputChange={handleInputChange}
                        errors={errors}
                        allLocalisations={Array.from(localisations.values())} // Pass as array
                    />
                </TabPanel>
                {showDocumentsTab && (
                    <TabPanel value={activeTab} index={4}>
                        <ChantierDocumentsManager
                            chantierId={formData.id}
                            currentPdpIds={formData.pdps || []}
                            currentBdtIds={formData.bdts || []}
                            onPdpIdsChange={(pdpIds) => handleInputChange('pdps', pdpIds)}
                            onBdtIdsChange={(bdtIds) => handleInputChange('bdts', bdtIds)}
                            allPdpsMap={allPdps}
                            allBdtsMap={allBdts}
                            allEntreprisesMap={entreprises}
                            navigate={navigate}
                            onTriggerSave={handleSubmit} // Allow document manager to trigger save if needed before navigation
                        />
                    </TabPanel>
                )}


                {errors.submit && <Alert severity="error" sx={{ mt: 2 }}>{errors.submit}</Alert>}
                {errors.load && <Alert severity="error" sx={{ mt: 2 }}>{errors.load}</Alert>}


                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, pt:2, borderTop: '1px solid divider' }}>
                    <Button
                        color="inherit"
                        onClick={() => navigate(isEditMode && id ? getRoute('VIEW_CHANTIER', {id}) : getRoute('HOME'))}
                        startIcon={<ArrowBack />}
                        disabled={isSubmitting}
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        startIcon={<Save />}
                        disabled={isSubmitting || isLoading}
                    >
                        {isSubmitting ? "Enregistrement..." : "Enregistrer le chantier"}
                    </Button>
                </Box>
            </FormContainer>

            <Snackbar
                open={saveSuccess}
                autoHideDuration={3000}
                onClose={() => setSaveSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSaveSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Chantier {isEditMode ? 'modifié' : 'créé'} avec succès! Redirection...
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ChantierFormWrapper;