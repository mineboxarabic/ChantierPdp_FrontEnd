import React, { useState, useEffect, useCallback } from 'react';
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
import useAuditSecu from '../../hooks/useAuditSecu';
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
import type { BdtDTO } from '../../utils/entitiesDTO/BdtDTO';
import type { ChantierDTO } from '../../utils/entitiesDTO/ChantierDTO';
import type { UserDTO } from '../../utils/entitiesDTO/UserDTO';
import type { ObjectAnsweredDTO } from '../../utils/entitiesDTO/ObjectAnsweredDTO';
import RisqueDTO from '../../utils/entitiesDTO/RisqueDTO';
import { DocumentStatus } from '../../utils/enums/DocumentStatus';
import { ActionType } from '../../utils/enums/ActionType';

import { BDT } from '../../utils/entities/BDT.ts';
import { Entreprise } from '../../utils/entities/Entreprise.ts';
import Risque from '../../utils/entities/Risque.ts';
import Chantier from '../../utils/entities/Chantier.ts';
import { EntityRef } from '../../utils/EntityRef.ts';
import { getRoute } from '../../Routes.tsx';
import { useNotifications } from '@toolpad/core/useNotifications';
import { AuditSecu } from '../../utils/entities/AuditSecu.ts';
import ObjectAnsweredObjects from '../../utils/ObjectAnsweredObjects';
import Worker from '../../utils/entities/Worker.ts';
import Signature from '../../utils/entities/Signature.ts';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RisqueComponent from "../../components/Steps/RisqueComponent.tsx";
import { WorkerDTO } from '../../utils/entitiesDTO/WorkerDTO.ts';
import SelectOrCreateObjectAnswered from "../../components/Pdp/SelectOrCreateObjectAnswered";

// Define the interface for URL params
interface ParamTypes extends Record<string, string | undefined> {
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
    const [workers, setWorkers] = useState<WorkerDTO[]>([]);

    // Error states
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Utility functions for handling risques via relations
    const handleAddRisque = (risqueId: number) => {
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
    };

    const handleRemoveRisque = (risqueId: number) => {
        setFormData(prev => ({
            ...prev,
            relations: prev.relations?.filter(rel => 
                !(rel.objectId === risqueId && rel.objectType === ObjectAnsweredObjects.RISQUE)
            ) || []
        }));
        notifications.show("Risque supprimé.", { severity: "info" });
    };

    const handleToggleRisqueAnswer = (risqueId: number) => {
        setFormData(prev => ({
            ...prev,
            relations: prev.relations?.map(rel => 
                (rel.objectId === risqueId && rel.objectType === ObjectAnsweredObjects.RISQUE)
                    ? { ...rel, answer: !rel.answer }
                    : rel
            ) || []
        }));
    };

    const getRisquesFromRelations = useCallback((): { relation: ObjectAnsweredDTO; risque: RisqueDTO }[] => {
        if (!formData.relations) return [];
        
        return formData.relations
            .filter(rel => rel.objectType === ObjectAnsweredObjects.RISQUE)
            .map(rel => {
                const existingRisque = Array.from(risques.values()).find(r => r.id === rel.objectId);
                // If risque not found in local map, create a temporary one for display
                const risque = existingRisque || {
                    id: rel.objectId,
                    title: `Risque #${rel.objectId}`,
                    description: "Risque récemment créé"
                } as RisqueDTO;
                
                return {
                    relation: rel,
                    risque: risque
                };
            })
            .filter(item => item.risque); // Filter out any undefined risques
    }, [formData.relations, risques]);

    // Utility functions for handling audit secus via relations
    const handleAddAuditSecu = (auditSecuId: number) => {
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
    };

    const handleRemoveAuditSecu = (auditSecuId: number) => {
        setFormData(prev => ({
            ...prev,
            relations: prev.relations?.filter(rel => 
                !(rel.objectId === auditSecuId && rel.objectType === ObjectAnsweredObjects.AUDIT)
            ) || []
        }));
        notifications.show("Audit de sécurité supprimé.", { severity: "info" });
    };

    const handleToggleAuditSecuAnswer = (auditSecuId: number) => {
        setFormData(prev => ({
            ...prev,
            relations: prev.relations?.map(rel => 
                (rel.objectId === auditSecuId && rel.objectType === ObjectAnsweredObjects.AUDIT)
                    ? { ...rel, answer: !rel.answer }
                    : rel
            ) || []
        }));
    };

    const getAuditSecusFromRelations = useCallback((): { relation: ObjectAnsweredDTO; auditSecu: AuditSecu }[] => {
        if (!formData.relations) return [];
        
        return formData.relations
            .filter(rel => rel.objectType === ObjectAnsweredObjects.AUDIT)
            .map(rel => {
                const existingAuditSecu = Array.from(auditSecus.values()).find(a => a.id === rel.objectId);
                // If audit secu not found in local map, create a temporary one for display
                const auditSecu = existingAuditSecu || {
                    id: rel.objectId,
                    title: `Audit de sécurité #${rel.objectId}`,
                    description: "Audit de sécurité récemment créé"
                } as AuditSecu;
                
                return {
                    relation: rel,
                    auditSecu: auditSecu
                };
            })
            .filter(item => item.auditSecu); // Filter out any undefined audit secus
    }, [formData.relations, auditSecus]);

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
            handleCloseDialog(); // Close dialog even if item already exists
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
            } else if (objectType === ObjectAnsweredObjects.AUDIT) {
                await getAllAuditSecus();
            }
        } catch (error) {
            console.error(`Error refreshing ${objectType} data after adding relation:`, error);
        }

        notifications.show("Élément ajouté au BDT.", { severity: "success", autoHideDuration: 1500 });
        handleCloseDialog(); // Close dialog after successful addition
    }, [formData.relations, notifications, getAllRisques, getAllAuditSecus]);

    useEffect(() => {
        console.log('formdifjas', formData);
    }, [formData]);

    // Force re-render when risques map changes to show newly created risques
    useEffect(() => {
        console.log('Risques map updated, size:', risques.size);
    }, [risques]);

    // Force re-render when audit secus map changes to show newly created audit secus
    useEffect(() => {
        console.log('Audit secus map updated, size:', auditSecus.size);
    }, [auditSecus]);

    // Load data on component mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Load dropdown data
                await getAllEntreprises();
                const risquesList = await getAllRisques();
                const auditsList = await getAllAuditSecus();
                const chantiersList = await getAllChantiers();
                const workersList = await getAllWorkers();

               // setRisques(risquesList || []);
                // setAudits(auditsList || []);
                setChantiers(chantiersList.map(dto => ({
                    ...dto,
                    localisation: dto.localisation, // No transformation needed, keep as number
                    entrepriseUtilisatrice: dto.entrepriseUtilisatrice, // No transformation needed, keep as number
                    entrepriseExterieurs: dto.entrepriseExterieurs // No transformation needed, keep as numbers
                })));
                setWorkers(workersList);


                // If editing, load BDT data
                if (isEditMode && id) {
                    const bdtData = await getBDT(Number(id));
                    if (bdtData) {
                        setFormData({
                            ...bdtData,
                            // Only set properties that exist in BdtDTO
                            complementOuRappels: bdtData.complementOuRappels || [],
                            entrepriseExterieure: bdtData.entrepriseExterieure,
                            relations: bdtData.relations || [] // Set relations for risques
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
                            chantier: chantier.id as number
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
    const handleAutocompleteChange = (name: keyof BdtDTO, value: any | null) => {
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
        if (type === 'risques') {
            if (item && item.id) {
                handleAddRisque(item.id);
            }
        } else if (type === 'audits') {
            if (item && item.id) {
                handleAddAuditSecu(item.id);
            }
        } else if (type === 'complement') {
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
            if (itemId) {
                handleRemoveRisque(itemId);
            }
        } else if (type === 'audits') {
            if (itemId) {
                handleRemoveAuditSecu(itemId);
            }
        } else if (type === 'complementOuRappels') {
            // Remove complement from local state only (no backend endpoint needed)
            setFormData(prev => ({
                ...prev,
                complementOuRappels: prev?.complementOuRappels?.filter((_, i) => i !== index)
            }));
        }
    };

    // Toggle the answer status of an item (applicable/non-applicable)
    const handleToggleAnswer = (type: string, index: number) => {
        /*
        // Commented out since risques and auditSecu don't exist in BdtDTO
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
        } else 
        */
        if (type === 'complementOuRappels') {
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

        if (!formData.chantier) {
            errors.chantier = "Le chantier est requis";
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
            
            // Prepare form data with required fields
            const bdtData = {
                ...formData,
                date: formData.date || new Date(), // Add current date if not set
                status: formData.status || DocumentStatus.DRAFT, // Add default status if not set
                actionType: formData.actionType || ActionType.NONE // Add default action type
            };
            
            // Debug: Log the form data being sent
            console.log('Form data being sent:', JSON.stringify(bdtData, null, 2));

            if (isEditMode && formData.id) {
                // Update existing BDT
                savedBdt = await saveBDT(bdtData, formData.id);
            } else {
                // Create new BDT
                savedBdt = await createBDT(bdtData);

                // If we have local state items, link them to the new BDT
                if (savedBdt && savedBdt.id) {
                    /*
                    // Commented out since risques and auditSecu don't exist in BdtDTO
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
                    */

                    // For complementOuRappels, we need to update the whole BDT
                    savedBdt = await saveBDT({
                        ...savedBdt,
                        complementOuRappels: formData.complementOuRappels
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
            
            // More detailed error logging
            if (error instanceof Error) {
                console.error("Error message:", error.message);
                console.error("Error stack:", error.stack);
            }
            
            // Check if it's an HTTP error with more details
            if (error && typeof error === 'object' && 'response' in error) {
                const httpError = error as any;
                console.error("HTTP Error Status:", httpError.response?.status);
                console.error("HTTP Error Data:", httpError.response?.data);
                console.error("HTTP Error Headers:", httpError.response?.headers);
            }
            
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
                                        value={formData.entrepriseExterieure ? entreprises.get(formData.entrepriseExterieure) || null : null}
                                        onChange={(_, newValue) => handleAutocompleteChange('entrepriseExterieure', newValue ? newValue.id : null)}
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
                                        options={chantiers}
                                        getOptionLabel={(option) => option.nom || `Chantier #${option.id}`}
                                        value={formData.chantier ? chantiers.find(c => c.id === formData.chantier) || null : null}
                                        onChange={(_, newValue) => handleAutocompleteChange('chantier', newValue ? newValue.id : null)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Chantier"
                                                variant="outlined"
                                                fullWidth
                                                required
                                                error={!!errors.chantier}
                                                helperText={errors.chantier}
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

                            {getRisquesFromRelations().length > 0 ? (
                                <Grid container spacing={2}>
                                    {getRisquesFromRelations().map((item, index) => {
                                        const { relation, risque } = item;
                                        return (
                                            <Grid item xs={12} md={6} key={`risque-${relation.objectId}`}>
                                                <Card variant="outlined">
                                                    <CardContent>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                                <Avatar sx={{
                                                                    bgcolor: relation.answer ? 'success.main' : 'grey.500',
                                                                    mr: 2
                                                                }}>
                                                                    <WarningIcon/>
                                                                </Avatar>
                                                                <Typography variant="subtitle1">
                                                                    {risque?.title || `Risque #${index + 1}`}
                                                                </Typography>
                                                            </Box>
                                                            <Box>
                                                                <FormControlLabel
                                                                    control={
                                                                        <Switch
                                                                            checked={relation.answer || false}
                                                                            onChange={() => handleToggleRisqueAnswer(relation.objectId)}
                                                                            color="primary"
                                                                        />
                                                                    }
                                                                    label="Applicable"
                                                                />
                                                                <IconButton
                                                                    color="error"
                                                                    onClick={() => handleRemoveRisque(relation.objectId)}
                                                                >
                                                                    <DeleteIcon/>
                                                                </IconButton>
                                                            </Box>
                                                        </Box>
                                                        {risque?.description && (
                                                            <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                                                                {risque.description}
                                                            </Typography>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            ) : (
                                <Alert severity="info">
                                    Aucun risque n'a été ajouté. Utilisez le bouton "Ajouter un risque" pour en ajouter.
                                </Alert>
                            )}
                        </TabPanel>

                         {/* Tab 3: Audit Sécurité */}
                        <TabPanel value={tabValue} index={2}>
                            <Box sx={{mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Typography variant="h6">Audits de sécurité</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon/>}
                                    onClick={() => handleOpenDialog('audits')}
                                >
                                    Ajouter un audit de sécurité
                                </Button>
                            </Box>

                            {getAuditSecusFromRelations().length > 0 ? (
                                <Grid container spacing={2}>
                                    {getAuditSecusFromRelations().map((item, index) => {
                                        const { relation, auditSecu } = item;
                                        return (
                                            <Grid item xs={12} md={6} key={`audit-${relation.objectId}`}>
                                                <Card variant="outlined">
                                                    <CardContent>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                                <Avatar sx={{
                                                                    bgcolor: relation.answer ? 'success.main' : 'grey.500',
                                                                    mr: 2
                                                                }}>
                                                                    <ShieldIcon/>
                                                                </Avatar>
                                                                <Typography variant="subtitle1">
                                                                    {auditSecu?.title || `Audit #${index + 1}`}
                                                                </Typography>
                                                            </Box>
                                                            <Box>
                                                                <FormControlLabel
                                                                    control={
                                                                        <Switch
                                                                            checked={relation.answer || false}
                                                                            onChange={() => handleToggleAuditSecuAnswer(relation.objectId)}
                                                                            color="primary"
                                                                        />
                                                                    }
                                                                    label="Applicable"
                                                                />
                                                                <IconButton
                                                                    color="error"
                                                                    onClick={() => handleRemoveAuditSecu(relation.objectId)}
                                                                >
                                                                    <DeleteIcon/>
                                                                </IconButton>
                                                            </Box>
                                                        </Box>
                                                        {auditSecu?.description && (
                                                            <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                                                                {auditSecu.description}
                                                            </Typography>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            ) : (
                                <Alert severity="info">
                                    Aucun audit de sécurité n'a été ajouté. Utilisez le bouton "Ajouter un audit de sécurité" pour en ajouter.
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


                         {/* Tab 5: Signatures - Commented out since signatures don't exist in BdtDTO */}
                        <TabPanel value={tabValue} index={4}>
                            <Alert severity="info">
                                Les signatures ne sont pas disponibles dans cette version DTO.
                            </Alert>
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
                            <SelectOrCreateObjectAnswered<RisqueDTO, BdtDTO>
                                open={openDialog}
                                setOpen={setOpenDialog}
                                parent={formData}
                                saveParent={async (updatedBdt) => {
                                    // First update the form data
                                    setFormData(updatedBdt);
                                    // Then refresh risques list to ensure new ones are loaded
                                    try {
                                        await getAllRisques();
                                        console.log('Risques refreshed after saveParent');
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
                                    // First update the form data
                                    setFormData(updatedBdt);
                                    // Then refresh audit secus list to ensure new ones are loaded
                                    try {
                                        await getAllAuditSecus();
                                        console.log('Audit secus refreshed after saveParent');
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
                                    onClick={() => dialogType && handleAddItem(dialogType as DialogTypes, dialogData)}
                                    color="primary"
                                    disabled={!dialogData || !dialogType}
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
            </Box>
        </LocalizationProvider>
    );
}
export default EditCreateBdt;