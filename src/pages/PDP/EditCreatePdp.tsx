// src/pages/PDP/EditCreatePdp.tsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog, // Keep Dialogs here if they are complex and shared across tabs
    DialogActions,
    DialogContent,
    DialogTitle, IconButton,
    Modal, // Keep Modal for AnalyseDeRisqueForm here
    Paper,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/fr'; // Import French locale for dayjs

// --- Custom Hooks ---
import usePdp from '../../hooks/usePdp';
import useEntreprise from '../../hooks/useEntreprise';
import useRisque from '../../hooks/useRisque';
import usePermit from '../../hooks/usePermit';
import useDispositif from '../../hooks/useDispositif';
import useAnalyseRisque from '../../hooks/useAnalyseRisque';
// import useChantier from "../../hooks/useChantier.ts"; // Only if chantier details beyond ID are needed directly here

// --- Icons ---
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';


import { PdpDTO } from '../../utils/entitiesDTO/PdpDTO';
import { EntrepriseDTO } from '../../utils/entitiesDTO/EntrepriseDTO';
import  RisqueDTO  from '../../utils/entitiesDTO/RisqueDTO';
import  DispositifDTO  from '../../utils/entitiesDTO/DispositifDTO';
import  PermitDTO  from '../../utils/entitiesDTO/PermitDTO';
import { AnalyseDeRisqueDTO } from '../../utils/entitiesDTO/AnalyseDeRisqueDTO';
import ObjectAnsweredDTO from '../../utils/pdp/ObjectAnswered'; // Assuming this is the correct path
import ObjectAnsweredObjects from '../../utils/ObjectAnsweredObjects'; // Assuming this is the correct path
import { getRoute } from "../../Routes.tsx";
import { useNotifications } from "@toolpad/core/useNotifications"; // Or your preferred notification system

// --- PDP Tab Components (NEW) ---
import PdpTabGeneralInfo from './tabs/PdpTabGeneralInfo.tsx';
import PdpTabHorairesDispo from './tabs/PdpTabHorairesDispo.tsx';
import PdpTabRisquesDispositifs from './tabs/PdpTabRisquesDispositifs.tsx';
import PdpTabPermits from './tabs/PdpTabPermits.tsx.tsx';
import PdpTabAnalysesRisques from './tabs/PdpTabAnalysesRisques.tsx';

// --- Other Custom Components used by tabs or dialogs ---
import SelectOrCreateObjectAnswered from "../../components/Pdp/SelectOrCreateObjectAnswered"; // For dialogs
import CreateEditAnalyseDeRisqueForm from "../../components/CreateAnalyseDeRisqueForm"; // For modal

// Styled components from home (if needed for the wrapper itself)
import { DashboardCard, CardHeader } from '../../pages/Home/styles';
import { AccessTime, Shield, Verified, Warning } from '@mui/icons-material';
import { DocumentStatus } from '../../utils/enums/DocumentStatus.ts';
import CloseIcon from "@mui/icons-material/Close";
import PermiTypes from "../../utils/PermiTypes.ts";
import { set } from 'date-fns';
import RequiredPermitModal from './tabs/RequiredPermitModal.tsx';


dayjs.locale('fr'); // Set dayjs locale globally here or in your main App.tsx

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
            id={`pdps-tabpanel-${index}`}
            aria-labelledby={`pdps-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3, pb:3, px: {xs: 1, md: 0} }} key={`tabpanel-${index}`}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `pdps-tab-${index}`,
        'aria-controls': `pdps-tabpanel-${index}`,
    };
}

type DialogData = RisqueDTO | DispositifDTO | PermitDTO | AnalyseDeRisqueDTO | null;
type DialogTypes = 'risques' | 'dispositifs' | 'permits' | 'analyseDeRisques' | 'editAnalyseDeRisque' | '';

const modalStyle = { /* ... same as your existing modalStyle ... */
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%', // Adjust width as needed
    maxWidth: '800px', // Max width
    bgcolor: 'background.paper',
    border: (theme:any) => `1px solid ${theme.palette.divider}`, // Use theme
    borderRadius: 2, // Rounded corners
    boxShadow: 24,
    p: {xs:2, md:4},
    maxHeight: '90vh', // Limit height
    overflowY: 'auto' // Enable scrolling
};

interface EditCreatePdpProps {
    chantierIdForCreation?: number; // Passed from CreatePdpPage
}

const EditCreatePdp: React.FC<EditCreatePdpProps> = ({ chantierIdForCreation }) => {
    const { id: pdpIdParam } = useParams<{ id?: string }>(); // For edit mode from URL /pdp/edit/:id
    const navigate = useNavigate();
    const notifications = useNotifications();

    const isEditMode = Boolean(pdpIdParam);
    const currentPdpId = pdpIdParam ? parseInt(pdpIdParam, 10) : undefined;

    // --- State ---
    const [tabIndex, setTabIndex] = useState<number>(0);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [dialogType, setDialogType] = useState<DialogTypes>('');
    const [dialogData, setDialogData] = useState<DialogData>(null);
    const [editItemData, setEditItemData] = useState<AnalyseDeRisqueDTO | null>(null);
    const [openNestedModal, setOpenNestedModal] = useState<boolean>(false);

    const [showPermitPdfModal, setShowPermitPdfModal] = useState(false);
    const [permitPdfData, setPermitPdfData] = useState<string | null>(null);
    const [permitTitle, setPermitTitle] = useState<string>('');
   const [risksRequiringPermits, setRisksRequiringPermits] = useState<RisqueDTO[]>([]);

    // Existing state for the modal (we'll reuse this)

    const [showRequiredPermitModal, setShowRequiredPermitModal] = useState(false);
    const [currentRisqueForModal, setCurrentRisqueForModal] = useState<RisqueDTO | null>(null);
    const [requiredPermitDataForModal, setRequiredPermitDataForModal] = useState<PermitDTO | null>(null);

    const initialFormData: PdpDTO = useMemo(() => ({
        // ... same as your existing initialFormData, ensuring `chantier` is set ...
        id: undefined,
        chantier: chantierIdForCreation, // Use prop for creation context
        entrepriseExterieure: undefined,
        dateInspection: dayjs().toDate(),
        icpdate: dayjs().toDate(),
        datePrevenirCSSCT: dayjs().toDate(),
        datePrev: dayjs().toDate(),
        horairesDetails: '',
        entrepriseDInspection: undefined,
        horaireDeTravail: { enJournee: false, enNuit: false, samedi: false },
        misesEnDisposition: { vestiaires: false, sanitaires: false, restaurant: false, energie: false },
        relations: [],
        signatures: [],
    }), [chantierIdForCreation]);

    const [formData, setFormData] = useState<PdpDTO>(initialFormData);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // --- Custom Hooks for Data ---
    const { getPlanDePrevention, createPdp, savePdp,getRisqueswithoutPermits } = usePdp();
    const { getAllEntreprises, entreprises } = useEntreprise(); // Map of entreprises
    const { getAllRisques, risques: allRisquesMap } = useRisque(); // Map of risques
    const { getAllPermits, permits: allPermitsMap } = usePermit(); // Map of permits
    const { getAllDispositifs, dispositifs: allDispositifsMap } = useDispositif(); // Map of dispositifs
    const { getAllAnalyses, analyses: allAnalysesMap, createAnalyse, updateAnalyse } = useAnalyseRisque(); // Map of analyses

    // --- Data Fetching (Simplified, original logic was good) ---
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setSaveError(null);
            try {
                await Promise.all([
                    getAllEntreprises(), getAllRisques(), getAllDispositifs(),
                    getAllPermits(), getAllAnalyses()
                ]);

                if (isEditMode && currentPdpId) {
                    const pdpData = await getPlanDePrevention(currentPdpId);
                    console.log("PDP Data:", pdpData);
                    if (pdpData) {
                        setFormData(prev => ({
                            ...initialFormData, ...pdpData,
                            chantier: pdpData.chantier ?? prev.chantier,
                            horaireDeTravail: pdpData.horaireDeTravail || initialFormData.horaireDeTravail,
                            misesEnDisposition: pdpData.misesEnDisposition || initialFormData.misesEnDisposition,
                            relations: pdpData.relations || [],
                            signatures: pdpData.signatures || [],
                            dateInspection: pdpData.dateInspection ? dayjs(pdpData.dateInspection).toDate() : initialFormData.dateInspection,
                            icpdate: pdpData.icpdate ? dayjs(pdpData.icpdate).toDate() : initialFormData.icpdate,
                            datePrevenirCSSCT: pdpData.datePrevenirCSSCT ? dayjs(pdpData.datePrevenirCSSCT).toDate() : initialFormData.datePrevenirCSSCT,
                            datePrev: pdpData.datePrev ? dayjs(pdpData.datePrev).toDate() : initialFormData.datePrev,
                        }));
                    } else {
                        setSaveError(`PDP ID ${currentPdpId} non trouvé.`);
                        notifications.show(`PDP ID ${currentPdpId} non trouvé.`, { severity: 'error' });
                    }
                } else {
                    // For create mode, chantierIdForCreation is already in initialFormData via useMemo
                    setFormData(initialFormData);
                }
            } catch (error) {
                console.error("Error loading PDP data:", error);
                const errorMsg = "Erreur chargement données PDP.";
                setSaveError(errorMsg);
                notifications.show(errorMsg, { severity: 'error' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [currentPdpId, isEditMode, chantierIdForCreation, initialFormData, /* hook functions if not stable */ notifications
    ]);

    // --- Form Handlers (handleInputChange, handleDateChange, handleAutocompleteChange) ---
    // These remain largely the same as your existing ones.
    // Ensure they are passed down to the new tab components.
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { /* ...your logic... */
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = (e.target as HTMLInputElement).checked;
        const isCheckbox = type === 'checkbox';

        setFormData(prev => {
            if (name.includes('.')) {
                const [parentKey, childKey] = name.split('.');
                const parentObject = prev[parentKey as keyof PdpDTO] as Record<string, any> ?? {};
                return { ...prev, [parentKey]: { ...parentObject, [childKey]: isCheckbox ? checked : value }};
            } else {
                return { ...prev, [name]: isCheckbox ? checked : value };
            }
        });
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    }, [errors]);

    const handleDateChange = useCallback((name: keyof PdpDTO, date: Date | null) => { /* ...your logic... */
        setFormData(prev => ({ ...prev, [name]: date }));
        if (errors[name as string]) setErrors(prev => ({ ...prev, [name as string]: '' }));
    }, [errors]);

    const handleAutocompleteChange = useCallback(<T,>(fieldName: keyof PdpDTO, newValue: T | null) => { /* ...your logic... */
        setFormData(prev => ({ ...prev, [fieldName]: newValue ? (newValue as any).id : null }));
        if (errors[fieldName as string]) setErrors(prev => ({ ...prev, [fieldName as string]: '' }));
    }, [errors]);


    // --- Tab Navigation ---
    const handleTabChange = useCallback((_event: React.SyntheticEvent, newIndex: number) => setTabIndex(newIndex), []);

    // --- Validation Logic (Keep your existing validateForm logic here) ---
    const validateForm = useCallback((currentData: PdpDTO): boolean => { /* ...your existing validation logic... */
        const newErrors: Record<string, string> = {};
        let firstErrorTabIndex = -1;


        if (!currentData.entrepriseExterieure) {
            newErrors.entrepriseExterieure = "L'entreprise extérieure est requise";
            if (firstErrorTabIndex === -1) firstErrorTabIndex = 0;
        }

        setErrors(newErrors);
        if (firstErrorTabIndex !== -1) {
            setTabIndex(firstErrorTabIndex);
            notifications.show("Veuillez corriger les erreurs.", { severity: 'warning' });
        }
        return Object.keys(newErrors).length === 0;
    }, [notifications]);

    // --- Stepper/Tab Navigation Actions (handleNext, handleBack) ---
    // Keep your existing logic, pass them to tab components that need them.
     const handleNext = useCallback(() => {
        if (validateForm(formData)) { // Optional: validate before allowing next
             if (tabIndex < 4) setTabIndex(prev => prev + 1);
        }
    }, [formData, tabIndex, validateForm]);
    const handleBack = useCallback(() => {
         if (tabIndex > 0) setTabIndex(prev => prev - 1);
    }, [tabIndex]);

// In EditCreatePdp.tsx, within the EditCreatePdp component

    useEffect(() => {
        const initRisksRequiringPermits = async () => {
            if (isEditMode && formData.id && allRisquesMap.size > 0 && allPermitsMap.size > 0 && formData.relations) {
                try {
                    // Fetch risks that are linked to the PDP AND are marked as needing a permit
                    const linkedRisqueRelations = formData.relations.filter(
                        rel => rel.objectType === ObjectAnsweredObjects.RISQUE && rel.answer === true
                    );
                    console.log("Linked Risque Relations:",linkedRisqueRelations);
                    const needed: RisqueDTO[] = [];
                    
                    for (const rel of linkedRisqueRelations) {
                        const fullRisque = allRisquesMap.get(rel.objectId as number);
                        if (fullRisque && (fullRisque.travailleDangereux || fullRisque.travaillePermit) && fullRisque.permitType) {
                            const isPermitLinked = formData.relations?.some(pRel =>
                                pRel.objectType === ObjectAnsweredObjects.PERMIT &&
                                pRel.answer === true && // Ensure the linked permit is also marked as applicable
                                allPermitsMap.get(pRel.objectId as number)?.type === fullRisque.permitType
                            );
                            if (!isPermitLinked) {
                                if (!needed.find(r => r.id === fullRisque.id)) { // Avoid duplicates
                                     needed.push(fullRisque);
                                }
                            }
                        }
                    }
                    setRisksRequiringPermits(needed);

                    // Optionally, you can still call getRisqueswithoutPermits if it provides a more direct way
                    // from the backend to identify these, and then merge/reconcile.
                    // For now, client-side check based on current relations.
                } catch (e) {
                    console.error("Error initializing risksRequiringPermits:", e);
                    notifications.show("Erreur lors de la vérification des permis requis pour les risques.", { severity: "error" });
                }
            }
        };
        initRisksRequiringPermits();
    }, [isEditMode, formData.id, formData.relations]);
const handleShowRequiredPermitInfo = useCallback((risque: RisqueDTO) => {
    const targetPermit = Array.from(allPermitsMap.values()).find(p => p.type === risque.permitType);
    setCurrentRisqueForModal(risque);
    setRequiredPermitDataForModal(targetPermit || null); // Pass null if not found, modal should handle
    setShowRequiredPermitModal(true);
}, [allPermitsMap]);

    const handleOpenDialog = useCallback((type: DialogTypes, dataToEdit: DialogData = null) => { /* ... */
        setDialogType(type);
        setDialogData(null);
        setEditItemData(null);
        if (type === 'editAnalyseDeRisque' && dataToEdit) {
             setEditItemData(dataToEdit as AnalyseDeRisqueDTO);
            setOpenNestedModal(true);
        } else {
             setOpenDialog(true);
        }
    }, []);
    const handleCloseDialog = useCallback(() => { /* ... */
        setOpenDialog(false); setDialogType(''); setDialogData(null); setEditItemData(null);
    }, []);

    const handleCloseNestedModal = useCallback(() => { /* ... */
        setOpenNestedModal(false); setEditItemData(null);
    }, []);



    const addRelation = useCallback(async (objectType: ObjectAnsweredObjects, selectedItem: { id?: number; title?: string; travailleDangereux?: boolean; type?: PermiTypes; permitType?: PermiTypes }) => {
        if (!selectedItem || selectedItem.id === undefined) return;

        // --- Existing logic to add the relation to formData.relations ---
        const newRelation: ObjectAnsweredDTO = {
            objectId: selectedItem.id,
            objectType: objectType,
            answer: true,
        }
        const existingRelations = formData.relations || [];


        const alreadyExists = existingRelations.some(
            rel => rel.objectId === newRelation.objectId && rel.objectType === newRelation.objectType
        );

        if (alreadyExists) {
            notifications.show("Cet élément est déjà lié.", { severity: "info" });
            handleCloseDialog();
            return;
        }

        setFormData(prev => ({
            ...prev,
            relations: [...existingRelations, newRelation]
        }));
        
        // Refresh the appropriate data in background to ensure consistency
        try {
            if (objectType === ObjectAnsweredObjects.RISQUE) {
                await getAllRisques();
            } else if (objectType === ObjectAnsweredObjects.DISPOSITIF) {
                await getAllDispositifs();
            } else if (objectType === ObjectAnsweredObjects.PERMIT) {
                await getAllPermits();
            }
        } catch (error) {
            console.error(`Error refreshing ${objectType} data after adding relation:`, error);
        }
        
        // --- End of existing logic snippet ---


        if (objectType === ObjectAnsweredObjects.RISQUE) {
            const risqueDetails = allRisquesMap.get(selectedItem.id);
            if (risqueDetails && (risqueDetails.travailleDangereux || risqueDetails.travaillePermit) && risqueDetails.permitType) {
                const isPermitLinked = formData.relations?.some(rel =>
                    rel.objectType === ObjectAnsweredObjects.PERMIT &&
                    allPermitsMap.get(rel.objectId as number)?.type === risqueDetails.permitType
                );

                if (!isPermitLinked) {
                    setRisksRequiringPermits(prev => {
                        if (!prev.find(r => r.id === risqueDetails.id)) {
                            return [...prev, risqueDetails];
                        }
                        return prev;
                    });
                    const targetPermitInfo = Array.from(allPermitsMap.values()).find(p => p.type === risqueDetails.permitType);
                    notifications.show(
                        `Le risque "${risqueDetails.title}" nécessite un permis de type "${risqueDetails.permitType}" (${targetPermitInfo?.title || 'Permis spécifique'}). Veuillez l'ajouter depuis l'onglet Permis.`,
                        { severity: 'warning', autoHideDuration: 7000 }
                    );
                }
            }
        } else if (objectType === ObjectAnsweredObjects.PERMIT) {
            const addedPermitDetails = allPermitsMap.get(selectedItem.id);
            if (addedPermitDetails && addedPermitDetails.type) {
                setRisksRequiringPermits(prev =>
                    prev.filter(risque => risque.permitType !== addedPermitDetails.type)
                );
            }
        }
        notifications.show("Élément ajouté au PDP.", { severity: "success", autoHideDuration: 1500 });
        handleCloseDialog();
    }, [formData.relations, allRisquesMap, allPermitsMap, notifications, handleCloseDialog, getAllRisques, getAllDispositifs, getAllPermits]); // Add dependencies



    const deleteRelation = useCallback((relationObjectId: number, relationObjectType: ObjectAnsweredObjects) => {
        setFormData(prev => ({
            ...prev,
            relations: prev.relations?.map(rel =>
                (rel.objectId === relationObjectId && rel.objectType === relationObjectType)
                    ? { ...rel, answer: null } // Mark as not applicable / for deletion
                    : rel
            ) ?? []
        }));
        notifications.show("Élément marqué pour suppression.", { severity: "info", autoHideDuration: 1500 });
    }, [notifications]);

    const updateRelationField = useCallback((relationUniqueKey: string | number, field: keyof ObjectAnsweredDTO, value: any) => {
        // relationUniqueKey could be 'objectId_objectType' or the actual 'id' of ObjectAnsweredDTO if available
        setFormData(prev => ({
            ...prev,
            relations: prev.relations?.map(rel => {
                // Construct a key for comparison or use rel.id if it's stable
                const currentRelKey = rel.id || `${rel.objectId}_${rel.objectType}`;
                if (currentRelKey === relationUniqueKey) {
                    return { ...rel, [field]: value };
                }
                return rel;
            }) ?? []
        }));
    }, []);


    // --- Form Submission ---
    const handleSubmit = useCallback(async (e: React.FormEvent) => { /* ...your existing handleSubmit logic... */
        e.preventDefault();
        if (!validateForm(formData)) {
             notifications.show("Validation échouée.", { severity: 'error' }); return;
        }
        setIsSaving(true); setSaveError(null);
        const dataToSave: PdpDTO = { ...formData };
        try {
            let savedPdp: PdpDTO | null = null;
            if (isEditMode && dataToSave.id) {
                savedPdp = await savePdp(dataToSave, dataToSave.id);
            } else {
                savedPdp = await createPdp(dataToSave); // createPdp should use formData.chantier
            }
            if (savedPdp) {
                 notifications.show("PDP enregistré.", { severity: "success" });
                 setFormData(prev => ({ ...prev, ...savedPdp })); // Update with saved data (e.g. new IDs)
                if (!isEditMode && savedPdp.id) {
                    navigate(getRoute('EDIT_PDP', { id: savedPdp.id.toString() }), { replace: true });
                }
            } else { throw new Error("Sauvegarde PDP échouée."); }
        } catch (error: any) {
            setSaveError(error?.message || "Erreur sauvegarde PDP.");
            notifications.show(error?.message || "Erreur sauvegarde PDP.", { severity: 'error' });
        } finally {
            setIsSaving(false);
        }
    }, [formData, validateForm, isEditMode, savePdp, createPdp, navigate, notifications]);


    if (isLoading) { /* ... same loading indicator ... */
        return <Box sx={{ display: 'flex', justifyContent: 'center', my:5 }}><CircularProgress /></Box>;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
            <Box sx={{ width: '100%', p: { xs: 1, sm: 2 } }} component="form" onSubmit={handleSubmit} noValidate>
                <DashboardCard component={Paper} elevation={3} sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
                    <CardHeader sx={{ flexDirection: {xs: 'column', md: 'row'} }}> {/* Use CardHeader from home styles */}
                        <Typography variant="h4" component="h1" gutterBottom sx={{ flexGrow: 1, textAlign: {xs: 'center', md: 'left'} }}>
                            {isEditMode ? "Modifier le Plan de Prévention" : "Créer un Plan de Prévention"}
                            {formData.chantier && <Typography variant="subtitle1" color="text.secondary">Pour Chantier ID: {formData.chantier}</Typography>}
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => formData.chantier ? navigate(getRoute('VIEW_CHANTIER', {id: formData.chantier.toString()})) : navigate(-1)}
                            sx={{mb: {xs:1, md:0}}}
                        >
                            Retour {formData.chantier ? "au Chantier" : ""}
                        </Button>
                    </CardHeader>

                    {saveError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSaveError(null)}>{saveError}</Alert>}

                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 0 }}>
                        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="PDP form tabs" variant="scrollable" scrollButtons="auto">
                            <Tab icon={<BusinessIcon />} iconPosition="start" label="Infos Générales" {...a11yProps(0)} />
                            <Tab icon={<AccessTime />} iconPosition="start" label="Horaires/Dispo." {...a11yProps(1)} />
                            <Tab icon={<Warning />} iconPosition="start" label="Risques/Dispositifs" {...a11yProps(2)} />
                            <Tab icon={<Verified />} iconPosition="start" label="Permis" {...a11yProps(3)} />
                            <Tab icon={<Shield />} iconPosition="start" label="Analyses Risques" {...a11yProps(4)} />
                        </Tabs>
                    </Box>

                    <TabPanel value={tabIndex} index={0}>
                        <PdpTabGeneralInfo
                            formData={formData}
                            errors={errors}
                            entreprisesMap={entreprises}
                            onInputChange={handleInputChange}
                            onDateChange={handleDateChange}
                            onAutocompleteChange={handleAutocompleteChange}
                            onNavigateNext={handleNext}
                        />
                    </TabPanel>
                    <TabPanel value={tabIndex} index={1}>
                        <PdpTabHorairesDispo
                            formData={formData}
                            errors={errors}
                            onInputChange={handleInputChange}
                            onNavigateBack={handleBack}
                            onNavigateNext={handleNext}
                        />
                    </TabPanel>
                    <TabPanel value={tabIndex} index={2}>
                        <PdpTabRisquesDispositifs
                            formData={formData}
                            errors={errors}
                            allRisquesMap={allRisquesMap}
                            allDispositifsMap={allDispositifsMap}
                            onOpenDialog={handleOpenDialog}
                            onDeleteRelation={deleteRelation} // Pass simplified delete
                            onUpdateRelationField={updateRelationField}
                            onNavigateBack={handleBack}
                            onNavigateNext={handleNext}
                                saveParent={setFormData} // Pass saveParent to update formData
                        />
                    </TabPanel>
                    <TabPanel value={tabIndex} index={3}>
                      <PdpTabPermits
                        formData={formData}
                        errors={errors}
                        allPermitsMap={allPermitsMap}
                        // New props:
                        risksRequiringPermits={risksRequiringPermits}
                        allRisquesMap={allRisquesMap} // Pass this if NeededPermitPlaceholder needs risque details
                        onShowRequiredPermitModal={handleShowRequiredPermitInfo} // Pass the handler

                        onOpenDialog={handleOpenDialog}
                        onDeleteRelation={deleteRelation}
                        onUpdateRelationField={updateRelationField}
                        onNavigateBack={handleBack}
                        onNavigateNext={handleNext}
                    />
                    </TabPanel>
                    <TabPanel value={tabIndex} index={4}>
                        <PdpTabAnalysesRisques
                            formData={formData}
                            errors={errors}
                            allAnalysesMap={allAnalysesMap}
                            allRisquesMap={allRisquesMap} // For context in displaying analyses
                            onOpenDialog={handleOpenDialog} // To add existing or trigger create new (which opens modal)
                            onDeleteRelation={deleteRelation}
                            onUpdateRelationField={updateRelationField}
                            onNavigateBack={handleBack}
                            // This is the last tab, so it will have the main submit button
                        />
                         {/* Final Save Button for the last tab */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pt:2, borderTop: theme => `1px solid ${theme.palette.divider}` }}>
                            <Button variant="outlined" onClick={handleBack} disabled={tabIndex === 0}>Précédent</Button>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon />}
                                disabled={isSaving || isLoading}
                            >
                                {isSaving ? <CircularProgress size={24} color="inherit" /> : (isEditMode ? "Mettre à Jour PDP" : "Enregistrer PDP")}
                            </Button>
                        </Box>
                    </TabPanel>

                    {/* --- Dialog for Adding/Selecting Items (Risques, Dispositifs, Permits) --- */}
                    {/* This uses SelectOrCreateObjectAnswered */}
                    <Dialog open={openDialog && (dialogType === 'risques' || dialogType === 'dispositifs' || dialogType === 'permits')} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                        <DialogTitle>Ajouter {
                            dialogType === 'risques' ? 'un Risque' :
                            dialogType === 'dispositifs' ? 'un Dispositif' :
                            dialogType === 'permits' ? 'un Permis' : ''
                        }</DialogTitle>
                        <DialogContent dividers>
                            {dialogType === 'risques' && (
                                <SelectOrCreateObjectAnswered<RisqueDTO, PdpDTO>
                                    open={openDialog} 
                                    setOpen={setOpenDialog} 
                                    parent={formData} 
                                    saveParent={async(r)=>{
                                        setFormData(r);
                                        await getAllRisques();
                                    }} 
                                    setIsChanged={()=>{}}
                                    objectType={ObjectAnsweredObjects.RISQUE}
                                    addRelation={addRelation}
                                />
                            )}
                            {dialogType === 'dispositifs' && (
                                <SelectOrCreateObjectAnswered<DispositifDTO, PdpDTO>
                                    open={openDialog} 
                                    setOpen={setOpenDialog} 
                                    parent={formData} 
                                    saveParent={async(e)=>{
                                        setFormData(e);
                                        await getAllDispositifs();
                                    }} 
                                    setIsChanged={()=>{}}
                                    objectType={ObjectAnsweredObjects.DISPOSITIF}
                                    addRelation={addRelation}
                                />
                            )}
                            {dialogType === 'permits' && (
                                <SelectOrCreateObjectAnswered<PermitDTO, PdpDTO>
                                    open={openDialog} 
                                    setOpen={setOpenDialog} 
                                    parent={formData} 
                                    saveParent={setFormData} 
                                    setIsChanged={()=>{}}
                                    objectType={ObjectAnsweredObjects.PERMIT}
                                    addRelation={addRelation}
                                />
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Fermer</Button>
                        </DialogActions>
                    </Dialog>

                    {/* --- Dialog for Adding Existing Analyse de Risque --- */}
                    <Dialog open={openDialog && dialogType === 'analyseDeRisques'} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                        <DialogTitle>Ajouter une Analyse de Risque</DialogTitle>
                        <DialogContent dividers>
                            <Button 
                                variant="contained" 
                                onClick={() => {
                                    handleCloseDialog();
                                    setEditItemData(null);
                                    setOpenNestedModal(true);
                                }}
                                sx={{ mb: 2 }}
                            >
                                Créer une nouvelle Analyse de Risque
                            </Button>
                            {/* You can add a list of existing analyses here if needed */}
                        </DialogContent>
                        <DialogActions><Button onClick={handleCloseDialog}>Fermer</Button></DialogActions>
                    </Dialog>

                    {/* --- Modal for Creating/Editing AnalyseDeRisque --- */}
                    <Modal open={openNestedModal} onClose={handleCloseNestedModal} aria-labelledby="modal-analyse-risque-form">
                         <Box sx={modalStyle}>
                             <Typography id="modal-analyse-risque-form" variant="h6" component="h2" sx={{ mb: 2 }}>
                                 {editItemData ? "Modifier l'Analyse de Risque" : "Créer une Nouvelle Analyse de Risque"}
                            </Typography>
                             <CreateEditAnalyseDeRisqueForm
                                 key={editItemData ? `edit-${editItemData.id}` : 'create-analyse'}
                                 parent={formData}
                                 saveParent={setFormData}
                                 setIsChanged={() => {}}
                                 onSave={async (savedAnalyse) => {
                                     await getAllAnalyses(); // Refresh the list
                                     if (!editItemData && savedAnalyse.id) { // If it was a new analyse, add relation
                                         addRelation(ObjectAnsweredObjects.ANALYSE_DE_RISQUE, savedAnalyse);
                                     }
                                     handleCloseNestedModal();
                                  }}
                                 onCancel={handleCloseNestedModal}
                                 currentAnalyse={editItemData || undefined} // Pass data for editing, or undefined for create
                                 isEdit={!!editItemData}
                             />
                         </Box>
                     </Modal>
                </DashboardCard>
            </Box>

                 
        <RequiredPermitModal
            open={showRequiredPermitModal}
            onClose={() => setShowRequiredPermitModal(false)}
            permitData={requiredPermitDataForModal} // The specific permit needed
            risque={currentRisqueForModal}           // The risk that triggered this
            showPdfPreview={true} // Or as configured
            onDownload={() => {
                notifications.show("Téléchargement du permis en cours...", { severity: "info" });
            }}
        />
        </LocalizationProvider>
    );
};

export default EditCreatePdp;