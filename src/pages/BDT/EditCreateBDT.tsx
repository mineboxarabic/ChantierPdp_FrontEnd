import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Alert,
    Modal,
    Box,
    Typography,
} from '@mui/material';
import { 
    Business as BusinessIcon,
    NoteAdd as NoteAddIcon,
    AccountCircle as AccountCircleIcon,
    Warning as WarningIcon,
    VerifiedUser as VerifiedUserIcon,
    Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import useBdt from '../../hooks/useBdt';
import useEntreprise from '../../hooks/useEntreprise';
import useChantier from '../../hooks/useChantier';
import useRisque from '../../hooks/useRisque';
import usePermit from '../../hooks/usePermit';
import useDispositif from '../../hooks/useDispositif';
import useAnalyseRisque from '../../hooks/useAnalyseRisque';
import useAuditSecu from '../../hooks/useAuditSecu';
import useWoker from '../../hooks/useWoker';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '@toolpad/core/useNotifications';

import type { BdtDTO } from '../../utils/entitiesDTO/BdtDTO';
import type { ChantierDTO } from '../../utils/entitiesDTO/ChantierDTO';
import RisqueDTO from '../../utils/entitiesDTO/RisqueDTO';
import DispositifDTO from '../../utils/entitiesDTO/DispositifDTO';
import PermitDTO from '../../utils/entitiesDTO/PermitDTO';
import type { AnalyseDeRisqueDTO } from '../../utils/entitiesDTO/AnalyseDeRisqueDTO';
import { AuditSecuDTO } from '../../utils/entitiesDTO/AuditSecuDTO';
import PermiTypes from '../../utils/PermiTypes';
import { DocumentStatus } from '../../utils/enums/DocumentStatus';
import { ActionType } from '../../utils/enums/ActionType';
import ObjectAnsweredObjects from '../../utils/ObjectAnsweredObjects';
import { getRoute } from '../../Routes.tsx';

// Base component and tab components
import BaseDocumentEditCreate, { TabConfig } from '../../components/common/BaseDocumentEditCreate';
import BdtTabGeneralInfo from './tabs/BdtTabGeneralInfo';
import BdtTabComplements from './tabs/BdtTabComplements';

// Import generic document tabs
import DocumentTabRelations from '../../components/Document/tabs/DocumentTabRelations';
import DocumentTabPermits from '../../components/Document/tabs/DocumentTabPermits';
import DocumentTabRiskAnalyses from '../../components/Document/tabs/DocumentTabRiskAnalyses';
import DocumentTabSigning from '../../components/Document/tabs/DocumentTabSigning';

// Import dialog components
import SelectOrCreateObjectAnswered from '../../components/Pdp/SelectOrCreateObjectAnswered';
import CreateEditAnalyseDeRisqueForm from "../../components/CreateAnalyseDeRisqueForm";
import RiskAnalysisManagementDialog from '../../components/Document/dialogs/RiskAnalysisManagementDialog';


// Define the interface for URL params
interface ParamTypes extends Record<string, string | undefined> {
    id?: string;
    chantierId?: string;
}

// Define ComplementOuRappel interface
interface ComplementOuRappel {
    complement: string;
    respect: boolean;
}

// Define dialog data types
type DialogData = RisqueDTO | DispositifDTO | PermitDTO | AnalyseDeRisqueDTO | AuditSecuDTO | null;
export type DialogTypes = 'complement' | 'chargeDeTravail' | 'donneurDOrdre' | 'risques' | 'dispositifs' | 'permits' | 'analyseDeRisques' | 'audits' | 'editAnalyseDeRisque' | '';

// Type to represent required permit types and the risks that need them (same as PDP)
interface RequiredPermitType {
    permitType: PermiTypes;
    risks: RisqueDTO[];
    isLinked: boolean; // Whether a permit of this type is already linked to the document
    linkedPermit?: PermitDTO; // The actual permit linked, if any
}


const modalStyle = { 
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%', 
    maxWidth: '800px', 
    bgcolor: 'background.paper',
    border: (theme:any) => `1px solid ${theme.palette.divider}`,
    borderRadius: 2,
    boxShadow: 24,
    p: {xs:2, md:4},
    maxHeight: '90vh',
    overflowY: 'auto'
};

dayjs.locale('fr');


const EditCreateBdt: React.FC = () => {
    const {id, chantierId} = useParams<ParamTypes>();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    // Dialog state
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [dialogType, setDialogType] = useState<DialogTypes>('');
    const [dialogData, setDialogData] = useState<DialogData>(null);
    const [editItemData, setEditItemData] = useState<AnalyseDeRisqueDTO | null>(null);
    const [openNestedModal, setOpenNestedModal] = useState<boolean>(false);
    const [selectedRiskForAnalysis, setSelectedRiskForAnalysis] = useState<RisqueDTO | null>(null);

    // New complement form state
    const [newComplement, setNewComplement] = useState<ComplementOuRappel>({
        complement: '',
        respect: false
    });

    // Form state
    const [formData, setFormData] = useState<BdtDTO>({
        id: undefined,
        nom: undefined,
        complementOuRappels: [],
        date: undefined,
        relations: [], // Add relations for handling risques
        status: DocumentStatus.DRAFT,
        actionType: ActionType.NONE
    });

    // Loading and error states
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Hooks
    const {getBDT, createBDT, saveBDT} = useBdt();
    const notifications = useNotifications();
    const {getAllEntreprises, entreprises} = useEntreprise();
    const {getChantier, getAllChantiers} = useChantier();
    const { getAllRisques, risques: allRisquesMap } = useRisque();
    const { getAllPermits, permits: allPermitsMap, createPermit } = usePermit();
    const { getAllDispositifs, dispositifs: allDispositifsMap } = useDispositif();
    const { getAllAnalyses, analyses: allAnalysesMap } = useAnalyseRisque();
    const { getAllAuditSecus, auditSecus: allAuditsMap } = useAuditSecu();
    const { getAllWorkers, workers: allWorkersMap } = useWoker();
    const { connectedUser } = useAuth();
    // Data states
    const [chantiers, setChantiers] = useState<ChantierDTO[]>([]);

    // Required permit types state (similar to PDP)
    const [requiredPermitTypes, setRequiredPermitTypes] = useState<RequiredPermitType[]>([]);


    useEffect(()=>{
        console.log('BdDDTTTTTT',formData);
    },[formData])

    // Load data on component mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Load dropdown data and all related entities
                await Promise.all([
                    getAllEntreprises(),
                    getAllRisques(),
                    getAllDispositifs(),
                    getAllPermits(),
                    getAllAnalyses(),
                    getAllAuditSecus(),
                    getAllWorkers()
                ]);

                const chantiersList = await getAllChantiers();

                setChantiers(chantiersList.map(dto => ({
                    ...dto,
                    localisation: dto.localisation,
                    entrepriseUtilisatrice: dto.entrepriseUtilisatrice,
                    entrepriseExterieurs: dto.entrepriseExterieurs
                })));

                // If editing, load BDT data
                if (isEditMode && id) {
                    const bdtData = await getBDT(Number(id));
                    if (bdtData) {
                        setFormData({
                            ...bdtData,
                            complementOuRappels: bdtData.complementOuRappels || [],
                            relations: bdtData.relations || []
                        });
                    }
                }

                // If creating from a chantier, set the chantier
                if (!isEditMode && chantierId) {
                    const chantier = await getChantier(Number(chantierId));
                    if (chantier) {
                        setFormData(prev => ({
                            ...prev,
                            chantier: chantier.id as number
                        }));
                    }
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

    // --- useEffect for Required Permit Types (similar to PDP) ---
    useEffect(() => {
        const initRequiredPermitTypes = async () => {
            if (allRisquesMap.size > 0 && formData.relations) {
                try {
                    // Get risks that are linked to this BDT and require permits
                    const linkedRisks = formData.relations
                        .filter(rel => rel.objectType === ObjectAnsweredObjects.RISQUE && rel.answer === true)
                        .map(rel => allRisquesMap.get(rel.objectId as number))
                        .filter((risk): risk is RisqueDTO => risk !== undefined && 
                            Boolean(risk.travailleDangereux || risk.travaillePermit) && 
                            risk.permitType !== undefined
                        );

                    // Group risks by permit type
                    const permitTypeGroups = new Map<PermiTypes, RisqueDTO[]>();
                    linkedRisks.forEach(risk => {
                        if (risk.permitType) {
                            const existing = permitTypeGroups.get(risk.permitType) || [];
                            permitTypeGroups.set(risk.permitType, [...existing, risk]);
                        }
                    });

                    // Create RequiredPermitType objects
                    const required: RequiredPermitType[] = Array.from(permitTypeGroups.entries()).map(([permitType, risks]) => {
                        // Check if a permit of this type is already linked
                        const linkedPermit = Array.from(allPermitsMap.values()).find(permit => 
                            permit.type === permitType &&
                            formData.relations?.some(rel =>
                                rel.objectType === ObjectAnsweredObjects.PERMIT &&
                                rel.answer === true &&
                                rel.objectId === permit.id
                            )
                        );

                        return {
                            permitType,
                            risks,
                            isLinked: !!linkedPermit,
                            linkedPermit
                        };
                    });

                    setRequiredPermitTypes(required);
                } catch (error) {
                    console.error("Error calculating required permit types:", error);
                    notifications.show("Erreur lors du calcul des permis requis", { severity: 'error' });
                }
            } else {
                setRequiredPermitTypes([]);
            }
        };
        
        initRequiredPermitTypes();
    }, [formData.relations, allRisquesMap, allPermitsMap, notifications]);

    // Form input handlers
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [errors]);

    const handleDateChange = useCallback((name: keyof BdtDTO, date: Date | null) => {
        setFormData(prev => ({ ...prev, [name]: date }));
        if (errors[name as string]) {
            setErrors(prev => ({ ...prev, [name as string]: '' }));
        }
    }, [errors]);

    const handleAutocompleteChange = useCallback((name: keyof BdtDTO, value: unknown) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name as string]) {
            setErrors(prev => ({ ...prev, [name as string]: '' }));
        }
    }, [errors]);

    // Complement form handlers
    const handleComplementChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;
        setNewComplement(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }, []);

    // --- Dialog handlers (updated for new tab structure) ---
    
    // Enhanced dialog handlers for all dialog types
    const handleOpenDialog = useCallback((type: DialogTypes, data: DialogData = null) => {
        setDialogType(type);
        if (type === 'analyseDeRisques' && data) {
            setSelectedRiskForAnalysis(data as RisqueDTO);
            setOpenDialog(true);
        } else if (type === 'editAnalyseDeRisque' && data) {
            setEditItemData(data as AnalyseDeRisqueDTO);
            setOpenNestedModal(true);
        } else {
            setDialogData(data);
            setOpenDialog(true);
        }
    }, []);

    const handleCloseDialog = useCallback(() => {
        setOpenDialog(false); 
        setDialogType(''); 
        setDialogData(null); 
        setEditItemData(null);
        setNewComplement({
            complement: '',
            respect: false
        });
    }, []);

    const handleCloseNestedModal = useCallback(() => {
        setOpenNestedModal(false); 
        setEditItemData(null);
    }, []);

    // Handle adding complement
    const handleAddComplement = useCallback(() => {
        if (newComplement.complement.trim()) {
            setFormData(prev => ({
                ...prev,
                complementOuRappels: [...(prev.complementOuRappels || []), newComplement]
            }));
            handleCloseDialog();
        }
    }, [newComplement, handleCloseDialog]);

    // Handle removing items
    const handleRemoveItem = useCallback((type: string, index: number) => {
        if (type === 'complementOuRappels') {
            setFormData(prev => ({
                ...prev,
                complementOuRappels: prev?.complementOuRappels?.filter((_, i) => i !== index)
            }));
        }
    }, []);

    // Toggle answer status
    const handleToggleAnswer = useCallback((type: string, index: number) => {
        if (type === 'complementOuRappels') {
            const updatedComplements = [...formData?.complementOuRappels || []];
            updatedComplements[index] = {
                ...updatedComplements[index],
                respect: !updatedComplements[index].respect
            };
            setFormData(prev => ({ ...prev, complementOuRappels: updatedComplements }));
        }
    }, [formData?.complementOuRappels]);

    // --- Relation Management Functions ---
  const addRelation = useCallback(async (objectType: ObjectAnsweredObjects, selectedItem: { id?: number; title?: string; type?: any }) => {
    if (!selectedItem?.id) return;
    
    console.log('=== ADD RELATION DEBUG ===');
    console.log('Trying to add:', { objectType, selectedItem });
    console.log('Current relations:', formData.relations);
    console.log('Existing relations for this type:', formData.relations?.filter(rel => rel.objectType === objectType));

    const newRelation = {
        objectId: selectedItem.id,
        objectType: objectType,
        answer: true,
    };

    console.log('New relation to add:', newRelation);

    const existingRelations = formData.relations || [];
    
    // Check each relation individually for debugging
    const potentialDuplicates = existingRelations.filter(
        rel => rel.objectId === newRelation.objectId && 
               rel.objectType === newRelation.objectType
    );
    
    console.log('Potential duplicates found:', potentialDuplicates);
    
    const alreadyExists = existingRelations.some(
        rel => rel.objectId === newRelation.objectId && 
               rel.objectType === newRelation.objectType && 
               rel.answer !== null
    );
    
    console.log('Already exists check result:', alreadyExists);

    if (alreadyExists) {
        console.log('Element already exists, showing notification and closing dialog');
        notifications.show("Cet élément est déjà lié.", { severity: "info" });
        handleCloseDialog();
        return;
    }

    // Check if there's a deleted relation that we can reactivate
    const deletedRelationIndex = existingRelations.findIndex(
        rel => rel.objectId === newRelation.objectId && 
               rel.objectType === newRelation.objectType && 
               rel.answer === null
    );

    console.log('Deleted relation index:', deletedRelationIndex);

    if (deletedRelationIndex >= 0) {
        console.log('Reactivating deleted relation at index:', deletedRelationIndex);
        // Reactivate the deleted relation
        setFormData(prev => ({
            ...prev,
            relations: prev.relations?.map((rel, index) => 
                index === deletedRelationIndex ? { ...rel, answer: true } : rel
            ) ?? []
        }));
    } else {
        console.log('Adding new relation');
        // Add new relation
        setFormData(prev => ({
            ...prev,
            relations: [...existingRelations, newRelation]
        }));
    }

    console.log('Refreshing data and showing success notification');

    // Refresh the appropriate data in background
    try {
        if (objectType === ObjectAnsweredObjects.RISQUE) {
            await getAllRisques();
        } else if (objectType === ObjectAnsweredObjects.DISPOSITIF) {
            await getAllDispositifs();
        } else if (objectType === ObjectAnsweredObjects.PERMIT) {
            await getAllPermits();
        } else if (objectType === ObjectAnsweredObjects.ANALYSE_DE_RISQUE) {
            await getAllAnalyses();
        } else if (objectType === ObjectAnsweredObjects.AUDIT) {
            await getAllAuditSecus();
        }
    } catch (error) {
        console.error(`Error refreshing ${objectType} data after adding relation:`, error);
    }

    notifications.show("Élément ajouté au BDT.", { severity: "success", autoHideDuration: 1500 });
    handleCloseDialog();
}, [formData.relations, notifications, handleCloseDialog, getAllRisques, getAllDispositifs, getAllPermits, getAllAnalyses, getAllAuditSecus]);
    const deleteRelation = useCallback((relationObjectId: number, relationObjectType: ObjectAnsweredObjects) => {
        setFormData(prev => {
            let hasDeleted = false;
            const updatedRelations = prev.relations?.map((rel) => {
                const shouldDelete = !hasDeleted && 
                                   rel.objectId === relationObjectId && 
                                   rel.objectType === relationObjectType && 
                                   rel.answer !== null;
                
                if (shouldDelete) {
                    hasDeleted = true;
                    return { ...rel, answer: null };
                }
                return rel;
            }) ?? [];
            
            return {
                ...prev,
                relations: updatedRelations
            };
        });
        
        notifications.show("Élément marqué pour suppression.", { severity: "info", autoHideDuration: 1500 });
    }, [notifications]);

    const updateRelationField = useCallback((relationUniqueKey: string | number, field: keyof any, value: any) => {
        setFormData(prev => ({
            ...prev,
            relations: prev.relations?.map(rel => {
                const currentRelKey = rel.id || `${rel.objectId}_${rel.objectType}`;
                if (currentRelKey === relationUniqueKey) {
                    return { ...rel, [field]: value };
                }
                return rel;
            }) ?? []
        }));
    }, []);

    const handleAddMultipleRisks = useCallback(async (selectedRisks: RisqueDTO[], risksToUnlink?: RisqueDTO[]) => {
        const existingRelations = formData.relations || [];
        const newRelations: any[] = [];
        let addedCount = 0;
        let unlinkedCount = 0;

        // Handle adding new risks
        if (selectedRisks && selectedRisks.length > 0) {
            selectedRisks.forEach(risk => {
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
                    updatedRelations[relationIndex] = { ...updatedRelations[relationIndex], answer: null };
                    unlinkedCount++;
                }
            });
        }

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

        notifications.show(message, { severity: "success", autoHideDuration: 3000 });

        try {
            await getAllRisques();
        } catch (error) {
            console.error("Error refreshing risks data after adding multiple relations:", error);
        }
    }, [formData.relations, notifications, getAllRisques]);

    // Function to show required permit information (similar to PDP)
    const handleShowRequiredPermitInfo = useCallback((risque: RisqueDTO) => {
        notifications.show(
            `Le risque "${risque.title}" nécessite un permis. Veuillez créer ou lier un permis approprié.`,
            { severity: "warning", autoHideDuration: 5000 }
        );
    }, [notifications]);

    // Wrapper function to convert getAllRisques to return void
    const handleRefreshRisks = useCallback(async (): Promise<void> => {
        await getAllRisques();
    }, [getAllRisques]);

    // Mock function for permit modal - now properly positioned after handleShowRequiredPermitInfo
    const handleShowRequiredPermitModal = useCallback((risque: RisqueDTO) => {
        handleShowRequiredPermitInfo(risque);
    }, [handleShowRequiredPermitInfo]);

    // Function to create and link a permit from file upload or new permit creation (similar to PDP)
    const handleCreateAndLinkPermit = useCallback(async (permitType: PermiTypes, file?: File) => {
        try {
            // Convert file to base64 if provided
            let pdfData: string | undefined;
            if (file) {
                pdfData = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const result = reader.result as string;
                        // Remove data URL prefix to get just the base64
                        const base64 = result.split(',')[1];
                        resolve(base64);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            }

            // Create a new permit using the PermitDTO class (same as PDP)
            const newPermit = new PermitDTO(
                undefined, // Let the backend assign the ID
                file ? `Permis ${permitType} - ${file.name}` : `Nouveau Permis ${permitType}`,
                `Permis de type ${permitType} ${file ? 'téléchargé' : 'créé'} pour ce BDT`,
                {} // Default empty image object
            );

            newPermit.type = permitType;
            if (pdfData) {
                newPermit.pdfData = pdfData;
            }

            // Create the permit using the hook
            const createdPermit = await createPermit(newPermit);
            
            if (createdPermit?.id) {
                // Link the permit to the BDT
                await addRelation(ObjectAnsweredObjects.PERMIT, {
                    id: createdPermit.id,
                    title: createdPermit.title,
                    type: permitType
                });

                notifications.show(
                    `Permis de type "${permitType}" ${file ? 'téléchargé' : 'créé'} et lié au BDT avec succès.`,
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
            throw error;
        }
    }, [addRelation, notifications, createPermit]);

    // Form validation
    const validateForm = useCallback((currentData: BdtDTO, allowTolerantSave: boolean = false): { 
        isValid: boolean; 
        hasWarnings: boolean; 
        firstErrorTabIndex: number 
    } => {
        const newErrors: Record<string, string> = {};
        const warnings: Record<string, string> = {};
        let firstErrorTabIndex = -1;
        let firstWarningTabIndex = -1;

        // Critical errors (must be fixed)
        if (!currentData.nom || currentData.nom.trim() === '') {
            newErrors.nom = "Le nom est requis";
            if (firstErrorTabIndex === -1) firstErrorTabIndex = 0;
        }

        if (!currentData.entrepriseExterieure) {
            newErrors.entrepriseExterieure = "L'entreprise extérieure est requise";
            if (firstErrorTabIndex === -1) firstErrorTabIndex = 0;
        }

        if (!currentData.chantier) {
            newErrors.chantier = "Le chantier est requis";
            if (firstErrorTabIndex === -1) firstErrorTabIndex = 0;
        }

        // Warnings (optional)
        if (!currentData.relations || currentData.relations.length === 0) {
            warnings.relations = "Aucun risque ou audit ajouté";
            if (firstWarningTabIndex === -1) firstWarningTabIndex = 1;
        }

        setErrors(newErrors);
        
        const hasErrors = Object.keys(newErrors).length > 0;
        const hasWarnings = Object.keys(warnings).length > 0;
        
        // Show notifications
        if (hasErrors) {
            notifications.show("Erreurs critiques détectées. Veuillez les corriger.", { severity: 'error' });
        } else if (hasWarnings && !allowTolerantSave) {
            const warningMessages = Object.values(warnings);
            const detailedMessage = `Avertissements détectés: ${warningMessages.join(', ')}. Vous pouvez sauvegarder quand même.`;
            notifications.show(detailedMessage, { severity: 'warning', autoHideDuration: 8000 });
        }

        return {
            isValid: !hasErrors,
            hasWarnings,
            firstErrorTabIndex: hasErrors ? firstErrorTabIndex : firstWarningTabIndex
        };
    }, [notifications]);

    // Handle form submission
    const handleSave = useCallback(async () => {
        const validation = validateForm(formData, true);
        if (!validation.isValid) {
            return;
        }

        setIsSaving(true);
        setSaveError(null);

        try {
            // Prepare form data with required fields
            const bdtData = {
                ...formData,
                date: formData.date || new Date(),
                status: formData.status || DocumentStatus.DRAFT,
                actionType: formData.actionType || ActionType.NONE
            };

            let savedBdt;
            if (isEditMode && formData.id) {
                savedBdt = await saveBDT(bdtData, formData.id);
            } else {
                savedBdt = await createBDT(bdtData);
            }

            if (savedBdt) {
                notifications.show("Le Bon de Travail a été enregistré avec succès", {
                    severity: "success",
                    autoHideDuration: 2000
                });
                if (!isEditMode) {
                    navigate(getRoute('VIEW_BDT', { id: savedBdt.id }), { replace: true });
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
            setIsSaving(false);
        }
    }, [formData, validateForm, isEditMode, saveBDT, createBDT, notifications, navigate]);

    // Define tabs configuration  
    const tabs: TabConfig[] = [
        {
            icon: <BusinessIcon />,
            label: "Infos Générales",
            component: (
                <BdtTabGeneralInfo
                    formData={formData}
                    errors={errors}
                    entreprisesMap={entreprises}
                    chantiers={chantiers}
                    onInputChange={handleInputChange}
                    onDateChange={handleDateChange}
                    onAutocompleteChange={handleAutocompleteChange}
                />
            )
        },
        {
            icon: <WarningIcon />,
            label: "Risques & Audits",
            component: (
                <DocumentTabRelations
                    formData={formData}
                    errors={errors}
                    allRisquesMap={allRisquesMap}
                    allDispositifsMap={allDispositifsMap}
                    allAuditsMap={allAuditsMap}
                    onOpenDialog={handleOpenDialog}
                    onDeleteRelation={deleteRelation}
                    onUpdateRelationField={updateRelationField}
                    saveParent={setFormData}
                    onAddMultipleRisks={handleAddMultipleRisks}
                    onRefreshRisks={handleRefreshRisks}
                    showAudits={true}
                />
            )
        },
        {
            icon: <VerifiedUserIcon />,
            label: "Permis",
            component: (
                <DocumentTabPermits
                    formData={formData}
                    errors={errors}
                    allPermitsMap={allPermitsMap}
                    allRisquesMap={allRisquesMap}
                    requiredPermitTypes={requiredPermitTypes}
                    onOpenDialog={handleOpenDialog}
                    onDeleteRelation={deleteRelation}
                    onUpdateRelationField={updateRelationField}
                    onCreateAndLinkPermit={handleCreateAndLinkPermit}
                    onShowRequiredPermitModal={handleShowRequiredPermitModal}
                />
            )
        },
        {
            icon: <AssessmentIcon />,
            label: "Analyses de Risque",
            component: (
                <DocumentTabRiskAnalyses
                    formData={formData}
                    errors={errors}
                    allAnalysesMap={allAnalysesMap}
                    allRisquesMap={allRisquesMap}
                    onOpenDialog={handleOpenDialog}
                    onDeleteRelation={deleteRelation}
                    onAddRelation={addRelation}
                />
            )
        },
        {
            icon: <NoteAddIcon />,
            label: "Compléments",
            component: (
                <BdtTabComplements
                    formData={formData}
                    errors={errors}
                    onOpenDialog={handleOpenDialog}
                    onRemoveItem={handleRemoveItem}
                    onToggleAnswer={handleToggleAnswer}
                />
            )
        },
        {
            icon: <AccountCircleIcon />,
            label: "Signatures",
            component: (
                <DocumentTabSigning
                    formData={formData}
                    allWorkersMap={allWorkersMap}
                    currentUserId={connectedUser?.id || 1}
                />
            )
        }
    ];

    const title = isEditMode ? "Modifier le Bon de Travail" : "Créer un Bon de Travail";

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <BaseDocumentEditCreate
                title={title}
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
                isEditMode={isEditMode}
                isLoading={isLoading}
                isSaving={isSaving}
                saveError={saveError}
                setSaveError={setSaveError}
                tabs={tabs}
                onSave={handleSave}
                onValidate={validateForm}
            />

            {/* Dialogs */}
            <Dialog
                open={openDialog && (dialogType === 'complement' || dialogType === 'chargeDeTravail' || dialogType === 'donneurDOrdre')}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    {dialogType === 'complement' && "Ajouter un complément"}
                    {dialogType === 'chargeDeTravail' && "Sélectionner le chargé de travail"}
                    {dialogType === 'donneurDOrdre' && "Sélectionner le donneur d'ordre"}
                </DialogTitle>
                <DialogContent>
                    {dialogType === 'complement' && (
                        <TextField
                            label="Complément ou rappel"
                            name="complement"
                            value={newComplement.complement}
                            onChange={handleComplementChange}
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                        />
                    )}
                    {(dialogType === 'chargeDeTravail' || dialogType === 'donneurDOrdre') && (
                        <Alert severity="info">
                            La sélection de signatures n'est pas disponible dans cette version DTO.
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Annuler
                    </Button>
                    <Button
                        onClick={dialogType === 'complement' ? handleAddComplement : handleCloseDialog}
                        color="primary"
                        disabled={dialogType === 'complement' && !newComplement.complement.trim()}
                    >
                        Ajouter
                    </Button>
                </DialogActions>
            </Dialog>

            {/* --- Dialog for Adding/Selecting Items (Risques, Dispositifs, Permits, Audits) --- */}
            <Dialog 
                open={openDialog && (dialogType === 'risques' || dialogType === 'dispositifs' || dialogType === 'permits' || dialogType === 'audits')} 
                onClose={handleCloseDialog} 
                maxWidth="sm" 
                fullWidth
            >
                <DialogTitle>
                    Ajouter {
                        dialogType === 'risques' ? 'un Risque' :
                        dialogType === 'dispositifs' ? 'un Dispositif' :
                        dialogType === 'permits' ? 'un Permis' :
                        dialogType === 'audits' ? 'un Audit de Sécurité' : ''
                    }
                </DialogTitle>
                <DialogContent dividers>
                    {dialogType === 'risques' && (
                        <SelectOrCreateObjectAnswered<RisqueDTO, BdtDTO>
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
                            renderAsContent={true}
                        />
                    )}
                    {dialogType === 'dispositifs' && (
                        <SelectOrCreateObjectAnswered<DispositifDTO, BdtDTO>
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
                            renderAsContent={true}
                        />
                    )}
                    {dialogType === 'permits' && (
                        <SelectOrCreateObjectAnswered<PermitDTO, BdtDTO>
                            open={openDialog} 
                            setOpen={setOpenDialog} 
                            parent={formData} 
                            saveParent={setFormData} 
                            setIsChanged={()=>{}}
                            objectType={ObjectAnsweredObjects.PERMIT}
                            addRelation={addRelation}
                            renderAsContent={true}
                        />
                    )}
                    {dialogType === 'audits' && (
                        <SelectOrCreateObjectAnswered<AuditSecuDTO, BdtDTO>
                            open={openDialog} 
                            setOpen={setOpenDialog} 
                            parent={formData} 
                            saveParent={async(e)=>{
                                setFormData(e);
                                await getAllAuditSecus();
                            }} 
                            setIsChanged={()=>{}}
                            objectType={ObjectAnsweredObjects.AUDIT}
                            addRelation={addRelation}
                            renderAsContent={true}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Fermer</Button>
                </DialogActions>
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
                         selectedRisqueForCreation={selectedRiskForAnalysis}
                     />
                 </Box>
             </Modal>

            {/* --- Dialog for Managing Analyses for a specific risk --- */}
            <RiskAnalysisManagementDialog
                open={dialogType === 'analyseDeRisques'}
                onClose={handleCloseDialog}
                risk={selectedRiskForAnalysis}
                allAnalyses={allAnalysesMap}
                linkedAnalysisIds={new Set(formData.relations?.filter(r => r.objectType === ObjectAnsweredObjects.ANALYSE_DE_RISQUE).map(r => r.objectId as number))}
                onLinkAnalysis={(analysisId) => {
                    addRelation(ObjectAnsweredObjects.ANALYSE_DE_RISQUE, { id: analysisId });
                }}
                onCreateAnalysis={(risk) => {
                    handleCloseDialog();
                    setEditItemData(null);
                    setSelectedRiskForAnalysis(risk);
                    setOpenNestedModal(true);
                }}
            />
        </LocalizationProvider>
    );
};

export default EditCreateBdt;