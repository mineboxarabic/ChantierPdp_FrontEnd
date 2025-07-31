// src/pages/PDP/EditCreatePdp.tsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Modal,
    Paper,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import { 
    Save as SaveIcon,
    ArrowBack as ArrowBackIcon,
    Business as BusinessIcon,
    AccessTime,
    Warning,
    Verified,
    Shield,
    Draw
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

// --- Custom Hooks ---
import usePdp from '../../hooks/usePdp';
import useEntreprise from '../../hooks/useEntreprise';
import useRisque from '../../hooks/useRisque';
import usePermit from '../../hooks/usePermit';
import useDispositif from '../../hooks/useDispositif';
import useAnalyseRisque from '../../hooks/useAnalyseRisque';
import useWoker from '../../hooks/useWoker';
import { useAuth } from '../../hooks/useAuth';

// --- Types and DTOs ---
import { PdpDTO } from '../../utils/entitiesDTO/PdpDTO';
import  RisqueDTO  from '../../utils/entitiesDTO/RisqueDTO';
import  DispositifDTO  from '../../utils/entitiesDTO/DispositifDTO';
import  PermitDTO  from '../../utils/entitiesDTO/PermitDTO';
import { AnalyseDeRisqueDTO } from '../../utils/entitiesDTO/AnalyseDeRisqueDTO';
import ObjectAnsweredDTO from '../../utils/pdp/ObjectAnswered';
import ObjectAnsweredObjects from '../../utils/ObjectAnsweredObjects';
import { getRoute } from "../../Routes.tsx";
import { useNotifications } from "@toolpad/core/useNotifications";
import PermiTypes from "../../utils/PermiTypes.ts";

// --- PDP Tab Components ---
import PdpTabGeneralInfo from './tabs/PdpTabGeneralInfo.tsx';
import PdpTabHorairesDispo from './tabs/PdpTabHorairesDispo.tsx';
// Import generic document tabs
import { 
    DocumentTabRelations,
    DocumentTabPermits,
    DocumentTabRiskAnalyses,
    DocumentTabSigning
} from '../../components/Document/tabs';

// --- Other Custom Components ---
import SelectOrCreateObjectAnswered from "../../components/Pdp/SelectOrCreateObjectAnswered";
import CreateEditAnalyseDeRisqueForm from "../../components/CreateAnalyseDeRisqueForm";
import RequiredPermitModal from './tabs/RequiredPermitModal.tsx';

dayjs.locale('fr');

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

// Navigation component for tabs - Reusable across all PDP tabs
interface PdpTabNavigationProps {
    tabIndex: number;
    isLastTab: boolean;
    isSaving: boolean;
    isLoading: boolean;
    onBack: () => void;
    onNext: () => void;
    onSave: () => void;
    showSaveButton?: boolean; // Option to hide save button if needed
}

const PdpTabNavigation: React.FC<PdpTabNavigationProps> = ({ 
    tabIndex, 
    isLastTab, 
    isSaving, 
    isLoading, 
    onBack, 
    onNext, 
    onSave,
    showSaveButton = true
}) => (
    <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mt: 3, 
        pt: 2, 
        borderTop: '1px solid',
        borderColor: 'divider'
    }}>
        <Button 
            variant="outlined" 
            onClick={onBack} 
            disabled={tabIndex === 0}
        >
            Précédent
        </Button>
        
        {showSaveButton && (
            <Button
                variant="contained"
                color="primary"
                onClick={onSave}
                startIcon={<SaveIcon />}
                disabled={isSaving || isLoading}
            >
                {isSaving ? <CircularProgress size={24} color="inherit" /> : "Sauvegarder"}
            </Button>
        )}
        
        {!isLastTab && (
            <Button 
                variant="outlined" 
                onClick={onNext}
            >
                Suivant
            </Button>
        )}
    </Box>
);

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
                <Box sx={{ pt: 2, pb: 2 }} key={`tabpanel-${index}`}>
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

type DialogData = RisqueDTO | DispositifDTO | PermitDTO | AnalyseDeRisqueDTO | null;
type DialogTypes = 'risques' | 'dispositifs' | 'permits' | 'analyseDeRisques' | 'editAnalyseDeRisque' | 'audits' | '';

// Signature request interface for API
interface SignatureRequestDTO {
    workerId: number;
    documentId: number;
    userId: number;
    name: string;
    lastName: string;
    signatureImage: string;
}

// New type to represent required permit types and the risks that need them
interface RequiredPermitType {
    permitType: PermiTypes;
    risks: RisqueDTO[];
    isLinked: boolean; // Whether a permit of this type is already linked to the document
    linkedPermit?: PermitDTO; // The actual permit linked, if any
}

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
    const [requiredPermitTypes, setRequiredPermitTypes] = useState<RequiredPermitType[]>([]);

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
    const { getAllPermits, permits: allPermitsMap, createPermit } = usePermit(); // Map of permits
    const { getAllDispositifs, dispositifs: allDispositifsMap } = useDispositif(); // Map of dispositifs
    const { getAllAnalyses, analyses: allAnalysesMap, createAnalyse, updateAnalyse } = useAnalyseRisque(); // Map of analyses
    const { getAllWorkers, workers: allWorkersMap } = useWoker(); // Map of workers
    const { connectedUser } = useAuth(); // Current user

    // --- Data Fetching (Simplified, original logic was good) ---
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setSaveError(null);
            try {
                await Promise.all([
                    getAllEntreprises(), getAllRisques(), getAllDispositifs(),
                    getAllPermits(), getAllAnalyses(), getAllWorkers()
                ]);

                if (isEditMode && currentPdpId) {
                    const pdpData = await getPlanDePrevention(currentPdpId);
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

    // --- Validation Logic with tolerant save option ---
    const validateForm = useCallback((currentData: PdpDTO, allowTolerantSave: boolean = false): { isValid: boolean; hasWarnings: boolean; firstErrorTabIndex: number } => {
        const newErrors: Record<string, string> = {};
        const warnings: Record<string, string> = {};
        let firstErrorTabIndex = -1;
        let firstWarningTabIndex = -1;

        // Critical errors (must be fixed)
        if (!currentData.entrepriseExterieure) {
            newErrors.entrepriseExterieure = "L'entreprise extérieure est requise";
            if (firstErrorTabIndex === -1) firstErrorTabIndex = 0;
        }

        

        if (!currentData.relations || currentData.relations.length === 0) {
            warnings.relations = "Aucun risque ou dispositif ajouté";
            if (firstWarningTabIndex === -1) firstWarningTabIndex = 2;
        }

        setErrors(newErrors);
        
        const hasErrors = Object.keys(newErrors).length > 0;
        const hasWarnings = Object.keys(warnings).length > 0;
        
        // Navigate to first error tab if errors exist
        if (hasErrors && firstErrorTabIndex !== -1) {
            setTabIndex(firstErrorTabIndex);
            notifications.show("Erreurs critiques détectées. Veuillez les corriger.", { severity: 'error' });
        } else if (hasWarnings && firstWarningTabIndex !== -1 && !allowTolerantSave) {
            setTabIndex(firstWarningTabIndex);
            // Show specific warning details
            const warningMessages = Object.values(warnings);
            const detailedMessage = `Avertissements détectés: ${warningMessages.join(', ')}. Vous pouvez sauvegarder quand même.`;
            notifications.show(detailedMessage, { severity: 'warning', autoHideDuration: 8000 });
        }

        return {
            isValid: !hasErrors,
            hasWarnings,
            firstErrorTabIndex: hasErrors ? firstErrorTabIndex : firstWarningTabIndex
        };
    }, [notifications, setTabIndex]);

    // --- Tab Navigation Functions ---
    const handleNavigateNext = useCallback(() => {
        const validation = validateForm(formData, false);
        if ((validation.isValid || validation.hasWarnings) && tabIndex < 5) {
            setTabIndex(prev => prev + 1);
        }
    }, [formData, tabIndex, validateForm]);

    const handleNavigateBack = useCallback(() => {
        if (tabIndex > 0) {
            setTabIndex(prev => prev - 1);
        }
    }, [tabIndex]);

    // --- useEffect for Required Permit Types ---
    useEffect(() => {
        const initRequiredPermitTypes = async () => {
            if (allRisquesMap.size > 0 && formData.relations) {
                try {
                    // Get all risks that are linked to the PDP and need permits
                    const linkedRisqueRelations = formData.relations.filter(
                        rel => rel.objectType === ObjectAnsweredObjects.RISQUE && rel.answer === true
                    );

                    // Group risks by permit type
                    const permitTypeGroups = new Map<PermiTypes, RisqueDTO[]>();
                    
                    for (const rel of linkedRisqueRelations) {
                        const fullRisque = allRisquesMap.get(rel.objectId as number);
                        if (fullRisque && fullRisque.travaillePermit && fullRisque.permitType) {
                            const existing = permitTypeGroups.get(fullRisque.permitType) || [];
                            existing.push(fullRisque);
                            permitTypeGroups.set(fullRisque.permitType, existing);
                        }
                    }

                    // For each permit type, check if it's already linked to the document
                    const requiredPermits: RequiredPermitType[] = [];
                    for (const [permitType, risks] of permitTypeGroups.entries()) {
                        const linkedPermit = Array.from(allPermitsMap.values()).find(permit => 
                            permit.type === permitType &&
                            formData.relations?.some(rel =>
                                rel.objectType === ObjectAnsweredObjects.PERMIT &&
                                rel.answer === true &&
                                rel.objectId === permit.id
                            )
                        );

                        requiredPermits.push({
                            permitType,
                            risks,
                            isLinked: !!linkedPermit,
                            linkedPermit
                        });
                    }

                    setRequiredPermitTypes(requiredPermits);
                } catch (e) {
                    console.error("Error initializing required permit types:", e);
                    notifications.show("Erreur lors de la vérification des permis requis pour les risques.", { severity: "error" });
                }
            }
        };
        initRequiredPermitTypes();
    }, [formData.relations, allRisquesMap, allPermitsMap, notifications]);

    
const handleShowRequiredPermitInfo = useCallback((risque: RisqueDTO) => {
    console.log('=== handleShowRequiredPermitInfo Debug ===');
    console.log('Risk:', risque);
    console.log('Risk permit type:', risque.permitType);
    
    // First, try to find a permit that's actually linked to this PDP
    const linkedPermit = Array.from(allPermitsMap.values()).find(permit => 
        permit.type === risque.permitType &&
        formData.relations?.some(rel =>
            rel.objectType === ObjectAnsweredObjects.PERMIT &&
            rel.answer === true &&
            rel.objectId === permit.id
        )
    );
    
    if (linkedPermit) {
        console.log('Found linked permit for this PDP:', linkedPermit);
        setCurrentRisqueForModal(risque);
        setRequiredPermitDataForModal(linkedPermit);
        setShowRequiredPermitModal(true);
        return;
    }
    
    // If no linked permit, look for a permit template without PDF data (clean template)
    const cleanTemplate = Array.from(allPermitsMap.values()).find(permit => 
        permit.type === risque.permitType &&
        (!permit.pdfData || permit.pdfData.trim().length === 0)
    );
    
    if (cleanTemplate) {
        console.log('Found clean permit template:', cleanTemplate);
        setCurrentRisqueForModal(risque);
        setRequiredPermitDataForModal(cleanTemplate);
        setShowRequiredPermitModal(true);
        return;
    }
    
    // If no clean template found, create a minimal permit object for display
    const minimalPermit: PermitDTO = {
        id: undefined,
        title: `Permis ${risque.permitType}`,
        description: `Permis requis pour le risque: ${risque.title}`,
        type: risque.permitType,
        pdfData: undefined, // No PDF data
        logo: { mimeType: undefined, imageData: undefined } // Empty logo
    };
    
    console.log('No appropriate permit found, using minimal permit:', minimalPermit);
    console.log('==========================================');
    
    setCurrentRisqueForModal(risque);
    setRequiredPermitDataForModal(minimalPermit);
    setShowRequiredPermitModal(true);
}, [allPermitsMap, formData.relations]);

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
        console.log('addRelation called with:', { objectType, selectedItem });
        if (!selectedItem || selectedItem.id === undefined) {
            console.log('addRelation: selectedItem is invalid:', selectedItem);
            return;
        }

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
            } else if (objectType === ObjectAnsweredObjects.ANALYSE_DE_RISQUE) {
                await getAllAnalyses();
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
                    rel.answer === true &&
                    allPermitsMap.get(rel.objectId as number)?.type === risqueDetails.permitType
                );

                if (!isPermitLinked) {
                    const targetPermitInfo = Array.from(allPermitsMap.values()).find(p => p.type === risqueDetails.permitType);
                    notifications.show(
                        `Le risque "${risqueDetails.title}" nécessite un permis de type "${risqueDetails.permitType}" (${targetPermitInfo?.title || 'Permis spécifique'}). Veuillez l'ajouter depuis l'onglet Permis.`,
                        { severity: 'warning', autoHideDuration: 7000 }
                    );
                }
            }
        }
        notifications.show("Élément ajouté au PDP.", { severity: "success", autoHideDuration: 1500 });
        handleCloseDialog();
    }, [formData.relations, allRisquesMap, allPermitsMap, notifications, handleCloseDialog, getAllRisques, getAllDispositifs, getAllPermits, getAllAnalyses]); // Add dependencies

    const handleAddMultipleRisks = useCallback(async (selectedRisks: RisqueDTO[], risksToUnlink?: RisqueDTO[]) => {
        const existingRelations = formData.relations || [];
        const newRelations: ObjectAnsweredDTO[] = [];
        const risksNeedingPermits: RisqueDTO[] = [];
        let addedCount = 0;
        let unlinkedCount = 0;

        // Handle adding new risks
        if (selectedRisks && selectedRisks.length > 0) {
            selectedRisks.forEach(risk => {
                // Skip risks without valid IDs
                if (!risk.id) return;
                
                const alreadyExists = existingRelations.some(
                    rel => rel.objectId === risk.id && rel.objectType === ObjectAnsweredObjects.RISQUE && rel.answer !== null
                );

                if (!alreadyExists) {
                    newRelations.push({
                        objectId: risk.id,
                        objectType: ObjectAnsweredObjects.RISQUE,
                        answer: true,
                    });

                    // Check if this risk requires a permit
                    if ((risk.travailleDangereux || risk.travaillePermit) && risk.permitType) {
                        const isPermitLinked = formData.relations?.some(rel =>
                            rel.objectType === ObjectAnsweredObjects.PERMIT &&
                            allPermitsMap.get(rel.objectId as number)?.type === risk.permitType
                        );

                        if (!isPermitLinked) {
                            risksNeedingPermits.push(risk);
                        }
                    }
                    addedCount++;
                }
            });
        }

        // Handle unlinking risks
        let updatedRelations = [...existingRelations, ...newRelations];
        if (risksToUnlink && risksToUnlink.length > 0) {
            risksToUnlink.forEach(risk => {
                if (!risk.id) return;
                
                const relationIndex = updatedRelations.findIndex(
                    rel => rel.objectId === risk.id && rel.objectType === ObjectAnsweredObjects.RISQUE && rel.answer !== null
                );

                if (relationIndex !== -1) {
                    updatedRelations.splice(relationIndex, 1);
                    unlinkedCount++;
                }
            });
        }

        // Update the form data
        setFormData(prev => ({
            ...prev,
            relations: updatedRelations
        }));

        // Show appropriate notifications
        if (addedCount === 0 && unlinkedCount === 0) {
            notifications.show("Aucune modification n'a été effectuée.", { severity: "info" });
            return;
        }

        let message = "";
        if (addedCount > 0 && unlinkedCount > 0) {
            message = `${addedCount} risque(s) ajouté(s) et ${unlinkedCount} risque(s) délié(s).`;
        } else if (addedCount > 0) {
            message = `${addedCount} risque(s) ajouté(s).`;
        } else if (unlinkedCount > 0) {
            message = `${unlinkedCount} risque(s) délié(s).`;
        }

        // Handle risks requiring permits - now we show permit types needed
        if (risksNeedingPermits.length > 0) {
            const permitTypesList = [...new Set(risksNeedingPermits.map(r => r.permitType))];
            message += ` ${risksNeedingPermits.length} risque(s) nécessitent des permis (${permitTypesList.join(', ')}). Veuillez les ajouter depuis l'onglet Permis.`;
            notifications.show(message, { severity: 'warning', autoHideDuration: 10000 });
        } else {
            notifications.show(message, { severity: "success", autoHideDuration: 3000 });
        }

        // Refresh risks data in background
        try {
            await getAllRisques();
        } catch (error) {
            console.error("Error refreshing risks data after adding multiple relations:", error);
        }
    }, [formData.relations, allPermitsMap, notifications, getAllRisques]);

    // Function to create and link a permit from file upload or new permit creation
    const createAndLinkPermit = useCallback(async (permitType: PermiTypes, file?: File) => {
        try {
            // Convert file to base64 if provided
            let pdfData: string | undefined;
            if (file) {
                pdfData = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const result = reader.result as string;
                        // Remove the data URL prefix to get just the base64 data
                        const base64Data = result.split(',')[1];
                        resolve(base64Data);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            }

            // Create a new permit
            const newPermit = new PermitDTO(
                undefined, // Let the backend assign the ID
                file ? `Permis ${permitType} - ${file.name}` : `Nouveau Permis ${permitType}`,
                `Permis de type ${permitType} ${file ? 'téléchargé' : 'créé'} pour ce PDP`,
                {} // Default empty image object
            );

            

            newPermit.type = permitType;
            if (pdfData) {
                newPermit.pdfData = pdfData;
            }

            // Create the permit using the hook
            const createdPermit = await createPermit(newPermit);
            
            if (createdPermit && createdPermit.id) {
                // Link the permit to the PDP
                await addRelation(ObjectAnsweredObjects.PERMIT, {
                    id: createdPermit.id,
                    title: createdPermit.title,
                    type: permitType
                });

                notifications.show(
                    `Permis de type "${permitType}" ${file ? 'téléchargé' : 'créé'} et lié au PDP avec succès.`,
                    { severity: "success", autoHideDuration: 3000 }
                );
            } else {
                throw new Error('Failed to create permit - no ID returned');
            }
        } catch (error) {
            console.error('Error creating and linking permit:', error);
            notifications.show(
                `Erreur lors de la création du permis: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
                { severity: "error", autoHideDuration: 5000 }
            );
            throw error; // Re-throw to allow the UI to handle loading states
        }
    }, [createPermit, addRelation, notifications]);

    const deleteRelation = useCallback((relationObjectId: number, relationObjectType: ObjectAnsweredObjects) => {
        console.log('Deleting relation:', { relationObjectId, relationObjectType });
        
        setFormData(prev => {
            let hasDeleted = false; // Flag to ensure we only delete one relation
            
            const updatedRelations = prev.relations?.map((rel, index) => {
                // Only delete the first matching relation that is currently active (answer !== null)
                const shouldDelete = !hasDeleted && 
                                   rel.objectId === relationObjectId && 
                                   rel.objectType === relationObjectType && 
                                   rel.answer !== null;
                
                if (shouldDelete) {
                    console.log('Marking relation for deletion:', { rel, index });
                    hasDeleted = true; // Mark that we've deleted one
                    return { ...rel, answer: null }; // Mark as not applicable / for deletion
                }
                return rel;
            }) ?? [];
            
            console.log('Updated relations after deletion:', updatedRelations);
            
            return {
                ...prev,
                relations: updatedRelations
            };
        });
        
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

    // --- Form Submission with tolerant save ---
    const handleSave = useCallback(async (tolerantSave: boolean = false) => {
        const validation = validateForm(formData, tolerantSave);
        
        if (!validation.isValid && !tolerantSave) {
            notifications.show("Erreurs critiques détectées. Impossible de sauvegarder.", { severity: 'error' });
            return;
        }
        
        setIsSaving(true); 
        setSaveError(null);
        const dataToSave: PdpDTO = { ...formData };
        
        try {
            let savedPdp: PdpDTO | null = null;
            if (isEditMode && dataToSave.id) {
                savedPdp = await savePdp(dataToSave, dataToSave.id);
            } else {
                savedPdp = await createPdp(dataToSave);
            }
            
            if (savedPdp) {
                const unlinkedPermitTypes = requiredPermitTypes.filter(pt => !pt.isLinked);
                
                if (unlinkedPermitTypes.length > 0) {
                    const missingTypes = unlinkedPermitTypes.map(pt => pt.permitType).join(', ');
                    notifications.show(
                        `PDP enregistré. Attention: ${unlinkedPermitTypes.length} type(s) de permis restent à ajouter (${missingTypes}).`, 
                        { severity: "warning", autoHideDuration: 5000 }
                    );
                } else {
                    notifications.show("PDP enregistré avec succès.", { severity: "success" });
                }
                
                setFormData(prev => ({ ...prev, ...savedPdp }));
                if (!isEditMode && savedPdp.id) {
                    navigate(getRoute('EDIT_PDP', { id: savedPdp.id.toString() }), { replace: true });
                }
            } else { 
                throw new Error("Sauvegarde PDP échouée."); 
            }
        } catch (error: any) {
            setSaveError(error?.message || "Erreur sauvegarde PDP.");
            notifications.show(error?.message || "Erreur sauvegarde PDP.", { severity: 'error' });
        } finally {
            setIsSaving(false);
        }
    }, [formData, validateForm, isEditMode, savePdp, createPdp, navigate, notifications, requiredPermitTypes]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSave(true); // Allow tolerant save for form submission
    }, [handleSave]);


    if (isLoading) { /* ... same loading indicator ... */
        return <Box sx={{ display: 'flex', justifyContent: 'center', my:5 }}><CircularProgress /></Box>;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
            <Box sx={{ width: '100%', p: { xs: 1, sm: 2 } }} component="form" onSubmit={handleSubmit} noValidate>
                <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, p: { xs: 1, sm: 2, md: 3 } }}>
                    <Box sx={{ display: 'flex', flexDirection: {xs: 'column', md: 'row'}, alignItems: 'center', mb: 2 }}>
                        <Box sx={{ flexGrow: 1, textAlign: {xs: 'center', md: 'left'} }}>
                            <Typography variant="h4" component="h1" gutterBottom>
                                {isEditMode ? "Modifier le Plan de Prévention" : "Créer un Plan de Prévention"}
                            </Typography>
                            {formData.chantier && (
                                <Typography variant="subtitle1" color="text.secondary">
                                    Pour Chantier ID: {formData.chantier}
                                </Typography>
                            )}
                        </Box>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => formData.chantier ? navigate(getRoute('VIEW_CHANTIER', {id: formData.chantier.toString()})) : navigate(-1)}
                            sx={{mb: {xs:1, md:0}}}
                        >
                            Retour {formData.chantier ? "au Chantier" : ""}
                        </Button>
                    </Box>

                    {saveError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSaveError(null)}>{saveError}</Alert>}

                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="PDP form tabs" variant="scrollable" scrollButtons="auto">
                            <Tab icon={<BusinessIcon />} iconPosition="start" label="Infos Générales" {...a11yProps(0)} />
                            <Tab icon={<AccessTime />} iconPosition="start" label="Horaires/Dispo." {...a11yProps(1)} />
                            <Tab icon={<Warning />} iconPosition="start" label="Risques/Dispositifs" {...a11yProps(2)} />
                            <Tab icon={<Verified />} iconPosition="start" label="Permis" {...a11yProps(3)} />
                            <Tab icon={<Shield />} iconPosition="start" label="Analyses Risques" {...a11yProps(4)} />
                            <Tab icon={<Draw />} iconPosition="start" label="Signatures" {...a11yProps(5)} />
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
                        />
                        <PdpTabNavigation
                            tabIndex={tabIndex}
                            isLastTab={tabIndex === 5}
                            isSaving={isSaving}
                            isLoading={isLoading}
                            onBack={handleNavigateBack}
                            onNext={handleNavigateNext}
                            onSave={handleSave}
                        />
                    </TabPanel>
                    
                    <TabPanel value={tabIndex} index={1}>
                        <PdpTabHorairesDispo
                            formData={formData}
                            errors={errors}
                            onInputChange={handleInputChange}
                        />
                        <PdpTabNavigation
                            tabIndex={tabIndex}
                            isLastTab={tabIndex === 5}
                            isSaving={isSaving}
                            isLoading={isLoading}
                            onBack={handleNavigateBack}
                            onNext={handleNavigateNext}
                            onSave={handleSave}
                        />
                    </TabPanel>
                    
                    <TabPanel value={tabIndex} index={2}>
                        <DocumentTabRelations
                            formData={formData}
                            errors={errors}
                            allRisquesMap={allRisquesMap}
                            allDispositifsMap={allDispositifsMap}
                            onOpenDialog={handleOpenDialog}
                            onDeleteRelation={deleteRelation}
                            onUpdateRelationField={updateRelationField}
                            saveParent={setFormData}
                            onAddMultipleRisks={handleAddMultipleRisks}
                            onRefreshRisks={async () => { await getAllRisques(); }}
                        />
                        <PdpTabNavigation
                            tabIndex={tabIndex}
                            isLastTab={tabIndex === 5}
                            isSaving={isSaving}
                            isLoading={isLoading}
                            onBack={handleNavigateBack}
                            onNext={handleNavigateNext}
                            onSave={handleSave}
                        />
                    </TabPanel>
                    
                    <TabPanel value={tabIndex} index={3}>
                        <DocumentTabPermits
                            formData={formData}
                            errors={errors}
                            allPermitsMap={allPermitsMap}
                            requiredPermitTypes={requiredPermitTypes}
                            allRisquesMap={allRisquesMap}
                            onShowRequiredPermitModal={handleShowRequiredPermitInfo}
                            onCreateAndLinkPermit={createAndLinkPermit}
                            onOpenDialog={handleOpenDialog}
                            onDeleteRelation={deleteRelation}
                            onUpdateRelationField={updateRelationField}
                        />
                        <PdpTabNavigation
                            tabIndex={tabIndex}
                            isLastTab={tabIndex === 5}
                            isSaving={isSaving}
                            isLoading={isLoading}
                            onBack={handleNavigateBack}
                            onNext={handleNavigateNext}
                            onSave={handleSave}
                        />
                    </TabPanel>
                    
                    <TabPanel value={tabIndex} index={4}>
                        {(() => {
                            console.log('=== TabPanel 4 Debug ===');
                            console.log('addRelation function:', addRelation);
                            console.log('addRelation type:', typeof addRelation);
                            console.log('addRelation defined:', !!addRelation);
                            console.log('========================');
                            return (
                                <DocumentTabRiskAnalyses
                                    formData={formData}
                                    errors={errors}
                                    allAnalysesMap={allAnalysesMap}
                                    allRisquesMap={allRisquesMap}
                                    onOpenDialog={handleOpenDialog}
                                    onDeleteRelation={deleteRelation}
                                    onUpdateRelationField={updateRelationField}
                                    onAddRelation={addRelation}
                                />
                            );
                        })()}
                        
                        <PdpTabNavigation
                            tabIndex={tabIndex}
                            isLastTab={tabIndex === 5}
                            isSaving={isSaving}
                            isLoading={isLoading}
                            onBack={handleNavigateBack}
                            onNext={handleNavigateNext}
                            onSave={handleSave}
                        />
                    </TabPanel>
                    
                    <TabPanel value={tabIndex} index={5}>
                        <DocumentTabSigning
                            formData={formData}
                            allWorkersMap={allWorkersMap}
                            currentUserId={connectedUser?.id}
                        />
                        <PdpTabNavigation
                            tabIndex={tabIndex}
                            isLastTab={tabIndex === 5}
                            isSaving={isSaving}
                            isLoading={isLoading}
                            onBack={handleNavigateBack}
                            onNext={handleNavigateNext}
                            onSave={handleSave}
                        />
                    </TabPanel>

                    {/* ...existing code... */}

                    {/* ...existing code... */}
                    
                    {/* --- Dialog for Adding/Selecting Items (Risques, Dispositifs, Permits) --- */}
                    <Dialog open={openDialog && (dialogType === 'risques' || dialogType === 'dispositifs' || dialogType === 'permits')} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                        <DialogTitle>
                            Ajouter {
                                dialogType === 'risques' ? 'un Risque' :
                                dialogType === 'dispositifs' ? 'un Dispositif' :
                                dialogType === 'permits' ? 'un Permis' : ''
                            }
                        </DialogTitle>
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
                                sx={{ mb: 3 }}
                                fullWidth
                            >
                                Créer une nouvelle Analyse de Risque
                            </Button>
                            
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Ou sélectionner une analyse existante:
                            </Typography>
                            
                            {allAnalysesMap && allAnalysesMap.size > 0 ? (
                                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                                    {Array.from(allAnalysesMap.values())
                                        .filter(analyse => 
                                            !formData.relations?.some(rel => 
                                                rel.objectType === ObjectAnsweredObjects.ANALYSE_DE_RISQUE && 
                                                rel.objectId === analyse.id
                                            )
                                        )
                                        .map(analyse => {
                                            const risqueAssocie = analyse.risqueId ? allRisquesMap.get(analyse.risqueId) : null;
                                            
                                            return (
                                                <Paper 
                                                    key={analyse.id} 
                                                    variant="outlined" 
                                                    sx={{ 
                                                        p: 2, 
                                                        mb: 1, 
                                                        cursor: 'pointer',
                                                        '&:hover': { 
                                                            backgroundColor: 'action.hover',
                                                            borderColor: 'primary.main' 
                                                        }
                                                    }}
                                                    onClick={() => {
                                                        addRelation(ObjectAnsweredObjects.ANALYSE_DE_RISQUE, {
                                                            id: analyse.id,
                                                            title: analyse.nom || `Analyse #${analyse.id}`
                                                        });
                                                        handleCloseDialog();
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <Box sx={{ flexGrow: 1 }}>
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                                                {analyse.nom || `Analyse #${analyse.id}`}
                                                            </Typography>
                                                            {risqueAssocie && (
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Risque associé: {risqueAssocie.title}
                                                                </Typography>
                                                            )}
                                                            {analyse.deroulementDesTaches && (
                                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                                    {analyse.deroulementDesTaches.length > 100 
                                                                        ? `${analyse.deroulementDesTaches.substring(0, 100)}...` 
                                                                        : analyse.deroulementDesTaches}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                        <Button 
                                                            variant="outlined" 
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addRelation(ObjectAnsweredObjects.ANALYSE_DE_RISQUE, {
                                                                    id: analyse.id,
                                                                    title: analyse.nom || `Analyse #${analyse.id}`
                                                                });
                                                                handleCloseDialog();
                                                            }}
                                                        >
                                                            Ajouter
                                                        </Button>
                                                    </Box>
                                                </Paper>
                                            );
                                        })
                                    }
                                    {Array.from(allAnalysesMap.values())
                                        .filter(analyse => 
                                            !formData.relations?.some(rel => 
                                                rel.objectType === ObjectAnsweredObjects.ANALYSE_DE_RISQUE && 
                                                rel.objectId === analyse.id
                                            )
                                        ).length === 0 && (
                                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                            Toutes les analyses disponibles sont déjà ajoutées à ce PDP.
                                        </Typography>
                                    )}
                                </Box>
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                    Aucune analyse de risque disponible. Créez-en une nouvelle ci-dessus.
                                </Typography>
                            )}
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
                                     await getAllAnalyses();
                                     if (!editItemData && savedAnalyse.id) {
                                         addRelation(ObjectAnsweredObjects.ANALYSE_DE_RISQUE, savedAnalyse);
                                     }
                                     handleCloseNestedModal();
                                  }}
                                 onCancel={handleCloseNestedModal}
                                 currentAnalyse={editItemData || undefined}
                                 isEdit={!!editItemData}
                             />
                         </Box>
                     </Modal>
                </Box>
            </Box>

            <RequiredPermitModal
                open={showRequiredPermitModal}
                onClose={() => setShowRequiredPermitModal(false)}
                permitData={requiredPermitDataForModal}
                risque={currentRisqueForModal}
                showPdfPreview={true}
                onDownload={() => {
                    notifications.show("Téléchargement du permis en cours...", { severity: "info" });
                }}
            />
        </LocalizationProvider>
    );
};

export default EditCreatePdp;