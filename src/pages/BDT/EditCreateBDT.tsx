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
} from '@mui/material';
import { 
    Business as BusinessIcon,
    Warning as WarningIcon,
    Shield as ShieldIcon,
    NoteAdd as NoteAddIcon,
    AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import useBdt from '../../hooks/useBdt';
import useEntreprise from '../../hooks/useEntreprise';
import useRisque from '../../hooks/useRisque';
import useAuditSecu from '../../hooks/useAuditSecu';
import useChantier from '../../hooks/useChantier';
import { useNotifications } from '@toolpad/core/useNotifications';

import type { BdtDTO } from '../../utils/entitiesDTO/BdtDTO';
import type { ChantierDTO } from '../../utils/entitiesDTO/ChantierDTO';
import type { ObjectAnsweredDTO } from '../../utils/entitiesDTO/ObjectAnsweredDTO';
import RisqueDTO from '../../utils/entitiesDTO/RisqueDTO';
import { DocumentStatus } from '../../utils/enums/DocumentStatus';
import { ActionType } from '../../utils/enums/ActionType';
import { AuditSecu } from '../../utils/entities/AuditSecu.ts';
import ObjectAnsweredObjects from '../../utils/ObjectAnsweredObjects';
import { getRoute } from '../../Routes.tsx';

// Base component and tab components
import BaseDocumentEditCreate, { TabConfig } from '../../components/common/BaseDocumentEditCreate';
import BdtTabGeneralInfo from './tabs/BdtTabGeneralInfo';
import BdtTabRisques from './tabs/BdtTabRisques';
import BdtTabAuditSecu from './tabs/BdtTabAuditSecu';
import BdtTabComplements from './tabs/BdtTabComplements';
import BdtTabSignatures from './tabs/BdtTabSignatures';
import SelectOrCreateObjectAnswered from "../../components/Pdp/SelectOrCreateObjectAnswered";

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
type DialogTypes = 'risques' | 'audits' | 'complement' | 'chargeDeTravail' | 'donneurDOrdre';

dayjs.locale('fr');

const EditCreateBdt: React.FC = () => {
    const { id, chantierId } = useParams<ParamTypes>();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const notifications = useNotifications();

    // Dialog state
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [dialogType, setDialogType] = useState<DialogTypes | ''>('');
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
        relations: [],
        status: DocumentStatus.DRAFT,
        actionType: ActionType.NONE
    });

    // Loading and error states
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Hooks
    const { getBDT, createBDT, saveBDT } = useBdt();
    const { getAllEntreprises, entreprises } = useEntreprise();
    const { getAllRisques, risques } = useRisque();
    const { getAllAuditSecus, auditSecus } = useAuditSecu();
    const { getChantier, getAllChantiers } = useChantier();

    // Data states
    const [chantiers, setChantiers] = useState<ChantierDTO[]>([]);

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
    const [formData, setFormData] = useState<BdtDTO>({
        id: undefined,
        nom: undefined,
        complementOuRappels: [],
        date: undefined,
        relations: [] // Add relations for handling risques
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
    const {getAllAuditSecus, auditSecus} = useAuditSecu();
    const {getChantier, getAllChantiers} = useChantier();
    const {getAllWorkers} = useWoker();

    // Data states
    const [chantiers, setChantiers] = useState<ChantierDTO[]>([]);

    // Utility functions for handling risques via relations
    const handleAddRisque = useCallback((risqueId: number) => {
        const existingRelations = formData.relations || [];
        const alreadyExists = existingRelations.some(
            rel => rel.objectId === risqueId && rel.objectType === ObjectAnsweredObjects.RISQUE
        );

        if (alreadyExists) {
            notifications.show("Ce risque est déjà lié.", { severity: "info" });
            return;
        }

        const newRelation: ObjectAnsweredDTO = {
            objectId: risqueId,
            objectType: ObjectAnsweredObjects.RISQUE,
            answer: true,
        };

        setFormData(prev => ({
            ...prev,
            relations: [...existingRelations, newRelation]
        }));

        notifications.show("Risque ajouté avec succès.", { severity: "success" });
    }, [formData.relations, notifications]);

    const handleRemoveRisque = useCallback((risqueId: number) => {
        setFormData(prev => ({
            ...prev,
            relations: prev.relations?.filter(rel => 
                !(rel.objectId === risqueId && rel.objectType === ObjectAnsweredObjects.RISQUE)
            ) || []
        }));
        notifications.show("Risque supprimé.", { severity: "info" });
    }, [notifications]);

    const handleToggleRisqueAnswer = useCallback((risqueId: number) => {
        setFormData(prev => ({
            ...prev,
            relations: prev.relations?.map(rel => 
                (rel.objectId === risqueId && rel.objectType === ObjectAnsweredObjects.RISQUE)
                    ? { ...rel, answer: !rel.answer }
                    : rel
            ) || []
        }));
    }, []);

    // Utility functions for handling audit secus via relations
    const handleAddAuditSecu = useCallback((auditSecuId: number) => {
        const existingRelations = formData.relations || [];
        const alreadyExists = existingRelations.some(
            rel => rel.objectId === auditSecuId && rel.objectType === ObjectAnsweredObjects.AUDIT
        );

        if (alreadyExists) {
            notifications.show("Cet audit de sécurité est déjà lié.", { severity: "info" });
            return;
        }

        const newRelation: ObjectAnsweredDTO = {
            objectId: auditSecuId,
            objectType: ObjectAnsweredObjects.AUDIT,
            answer: true,
        };

        setFormData(prev => ({
            ...prev,
            relations: [...existingRelations, newRelation]
        }));

        notifications.show("Audit de sécurité ajouté avec succès.", { severity: "success" });
    }, [formData.relations, notifications]);

    const handleRemoveAuditSecu = useCallback((auditSecuId: number) => {
        setFormData(prev => ({
            ...prev,
            relations: prev.relations?.filter(rel => 
                !(rel.objectId === auditSecuId && rel.objectType === ObjectAnsweredObjects.AUDIT)
            ) || []
        }));
        notifications.show("Audit de sécurité supprimé.", { severity: "info" });
    }, [notifications]);

    const handleToggleAuditSecuAnswer = useCallback((auditSecuId: number) => {
        setFormData(prev => ({
            ...prev,
            relations: prev.relations?.map(rel => 
                (rel.objectId === auditSecuId && rel.objectType === ObjectAnsweredObjects.AUDIT)
                    ? { ...rel, answer: !rel.answer }
                    : rel
            ) || []
        }));
    }, []);

    // Add relation function for SelectOrCreateObjectAnswered
    const addRelation = useCallback(async (objectType: ObjectAnsweredObjects, selectedItem: { id?: number; title?: string }) => {
        if (!selectedItem || selectedItem.id === undefined) return;

        const newRelation: ObjectAnsweredDTO = {
            objectId: selectedItem.id,
            objectType: objectType,
            answer: true,
        };
        
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

        // Refresh the appropriate data in background
        try {
            if (objectType === ObjectAnsweredObjects.RISQUE) {
                await getAllRisques();
            } else if (objectType === ObjectAnsweredObjects.AUDIT) {
                await getAllAuditSecus();
            }
        } catch (error) {
            console.error(`Error refreshing ${objectType} data after adding relation:`, error);
        }

        notifications.show("Élément ajouté au BDT.", { severity: "success", autoHideDuration: 1500 });
        handleCloseDialog();
    }, [formData.relations, notifications, getAllRisques, getAllAuditSecus]);

    // Load data on component mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Load dropdown data
                await getAllEntreprises();
                await getAllRisques();
                await getAllAuditSecus();
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
    }, [id, isEditMode, chantierId, getBDT, getAllEntreprises, getAllRisques, getAllAuditSecus, getAllChantiers, getChantier]);

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

    const handleAutocompleteChange = useCallback((name: keyof BdtDTO, value: any | null) => {
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

    // Dialog handlers
    const handleOpenDialog = useCallback((type: DialogTypes) => {
        setDialogType(type);
        setOpenDialog(true);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setOpenDialog(false);
        setDialogType('');
        setNewComplement({
            complement: '',
            respect: false
        });
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
            label: "Risques",
            component: (
                <BdtTabRisques
                    formData={formData}
                    errors={errors}
                    risquesMap={risques}
                    onOpenDialog={handleOpenDialog}
                    onRemoveRisque={handleRemoveRisque}
                    onToggleRisqueAnswer={handleToggleRisqueAnswer}
                />
            )
        },
        {
            icon: <ShieldIcon />,
            label: "Audit Sécurité",
            component: (
                <BdtTabAuditSecu
                    formData={formData}
                    errors={errors}
                    auditSecusMap={auditSecus}
                    onOpenDialog={handleOpenDialog}
                    onRemoveAuditSecu={handleRemoveAuditSecu}
                    onToggleAuditSecuAnswer={handleToggleAuditSecuAnswer}
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
                <BdtTabSignatures
                    formData={formData}
                    errors={errors}
                    onOpenDialog={handleOpenDialog}
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
                        <SelectOrCreateObjectAnswered<RisqueDTO, BdtDTO>
                            open={openDialog}
                            setOpen={setOpenDialog}
                            parent={formData}
                            saveParent={async (updatedBdt) => {
                                setFormData(updatedBdt);
                                try {
                                    await getAllRisques();
                                } catch (error) {
                                    console.error("Error refreshing risques in saveParent:", error);
                                }
                            }}
                            setIsChanged={() => {}}
                            objectType={ObjectAnsweredObjects.RISQUE}
                            addRelation={addRelation}
                        />
                    )}
                    {dialogType === 'audits' && (
                        <SelectOrCreateObjectAnswered<AuditSecu, BdtDTO>
                            open={openDialog}
                            setOpen={setOpenDialog}
                            parent={formData}
                            saveParent={async (updatedBdt) => {
                                setFormData(updatedBdt);
                                try {
                                    await getAllAuditSecus();
                                } catch (error) {
                                    console.error("Error refreshing audit secus in saveParent:", error);
                                }
                            }}
                            setIsChanged={() => {}}
                            objectType={ObjectAnsweredObjects.AUDIT}
                            addRelation={addRelation}
                        />
                    )}
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
                    {dialogType !== 'risques' && dialogType !== 'audits' && (
                        <>
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
                        </>
                    )}
                    {(dialogType === 'risques' || dialogType === 'audits') && (
                        <Button onClick={handleCloseDialog} color="primary">
                            Fermer
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default EditCreateBdt;