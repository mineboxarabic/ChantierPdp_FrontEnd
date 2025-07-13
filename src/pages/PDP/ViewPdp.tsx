import React, { FC, useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Paper,
    Tab,
    Tabs,
    Typography,
    Avatar,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    IconButton,
    useTheme,
    Grid
} from "@mui/material";
import {
    Business,
    CalendarMonth,
    Engineering,
    Warning,
    VerifiedUser,
    AccessTime,
    LocationOn,
    Edit,
    Print,
    ArrowBack,
    Shield,
    ChevronRight,
    Info,
    Assignment,

    Person
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import usePdp from "../../hooks/usePdp";
import { Pdp } from "../../utils/entities/Pdp.ts";
// Removed circular dependency import
import useEntreprise from "../../hooks/useEntreprise.ts";
import { PdpDTO } from "../../utils/entitiesDTO/PdpDTO.ts";
import Risque from "../../utils/entities/Risque.ts";
import ObjectAnsweredObjects from "../../utils/ObjectAnsweredObjects.ts";
import useRisque from "../../hooks/useRisque.ts";
import RisqueDTO from "../../utils/entitiesDTO/RisqueDTO.ts";
import { Entreprise } from "../../utils/entities/Entreprise.ts";
import { EntrepriseDTO } from "../../utils/entitiesDTO/EntrepriseDTO.ts";
import useDispositif from "../../hooks/useDispositif.ts";
import DispositifDTO from "../../utils/entitiesDTO/DispositifDTO.ts";
import usePermit from "../../hooks/usePermit.ts";

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
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const HeaderCard = styled(Paper)(({ theme }) => ({
    padding: 50,
    marginBottom: theme.spacing(3),
    background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.light} 90%)`,
    color: theme.palette.secondary.contrastText,
    borderRadius: "16px",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
}));

const InfoCard = styled(Card)(({ theme }) => ({
    height: "100%",
    borderRadius: "12px",
    overflow: "visible",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 12px 20px rgba(0, 0, 0, 0.1)",
    },
}));

const ItemCard = styled(Card)(({ theme }) => ({
    borderRadius: "12px",
    marginBottom: theme.spacing(2),
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: theme.shadows[4],
    },
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
        backgroundColor: theme.palette.secondary.main,
    },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    width: 56,
    height: 56,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
}));

const ViewPdp: FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [pdpData, setPdpData] = useState<PdpDTO | null>(null);
    const [tabValue, setTabValue] = useState(0);


    //Hooks
    const {getPlanDePrevention, loading, getObjectAnswered} = usePdp();
    const risquesHook = useRisque();
    const entrepriseHook = useEntreprise();
    const theme = useTheme();
    const dispositifHook = useDispositif();
    const permitHook = usePermit();

    //Maps
    const [risques, setRisques] = useState<Map<number, RisqueDTO>> (new Map<number, RisqueDTO>());

    const [entreprises, setEntreprises] = useState<Map<number, EntrepriseDTO>> (new Map<number, EntrepriseDTO>());

    const [dispositifs, setDispositifs] = useState<Map<number, DispositifDTO>> (new Map<number, DispositifDTO>());

    const [permits, setPermits] = useState<Map<number, any>> (new Map<number, any>());

    // Utility functions to get relations by type
    
    const getRisquesRelations = () => {
        if (!pdpData?.relations) return [];
        return pdpData.relations.filter(rel => rel.objectType === ObjectAnsweredObjects.RISQUE);
    };

    const getDispositifsRelations = () => {
        if (!pdpData?.relations) return [];
        return pdpData.relations.filter(rel => rel.objectType === ObjectAnsweredObjects.DISPOSITIF);
    };

    const getPermitsRelations = () => {
        if (!pdpData?.relations) return [];
        return pdpData.relations.filter(rel => rel.objectType === ObjectAnsweredObjects.PERMIT);
    };

    const getAnalysesRelations = () => {
        if (!pdpData?.relations) return [];
        return pdpData.relations.filter(rel => rel.objectType === ObjectAnsweredObjects.ANALYSE_DE_RISQUE);
    };

    useEffect(() => {
        const fetchPdp = async () => {
            if (id) {
                try {
                    const data = await getPlanDePrevention(parseInt(id));
                    setPdpData(data);
                } catch (error) {
                    console.error('Error fetching PDP:', error);
                    setPdpData(null);
                }
            }
        };

        fetchPdp();
    }, [id]);

    useEffect(() => {
        const fetchEntreprises = async () => {
            if (!pdpData) return;
            
            const entrepriseMap = new Map<number, EntrepriseDTO>();
            
            if (pdpData.entrepriseExterieure) {
                const entrepriseExterieure = await entrepriseHook.getEntreprise(pdpData.entrepriseExterieure);
                if (entrepriseExterieure) {
                    entrepriseMap.set(pdpData.entrepriseExterieure, entrepriseExterieure);
                }
            }
            
            if (pdpData.entrepriseDInspection) {
                const entrepriseDInspection = await entrepriseHook.getEntreprise(pdpData.entrepriseDInspection);
                if (entrepriseDInspection) {
                    entrepriseMap.set(pdpData.entrepriseDInspection, entrepriseDInspection);
                }
            }
            
            setEntreprises(entrepriseMap);
        }

        fetchEntreprises();
    }, [pdpData?.entrepriseExterieure, pdpData?.entrepriseDInspection]);

    useEffect(() => {
        const fetchAllData = async () => {
            if (!pdpData?.relations) return;
            
            try {
                // Extract IDs from relations for each type
                const risqueIds = pdpData.relations
                    .filter(rel => rel.objectType === ObjectAnsweredObjects.RISQUE)
                    .map(rel => rel.objectId as number);
                
                const dispositifIds = pdpData.relations
                    .filter(rel => rel.objectType === ObjectAnsweredObjects.DISPOSITIF)
                    .map(rel => rel.objectId as number);
                
                const permitIds = pdpData.relations
                    .filter(rel => rel.objectType === ObjectAnsweredObjects.PERMIT)
                    .map(rel => rel.objectId as number);

                // Fetch data in parallel with error handling
                const [risquesData, dispositifsData, permitsData] = await Promise.allSettled([
                    risqueIds.length > 0 ? risquesHook.getRisquesByIds(risqueIds) : Promise.resolve([]),
                    dispositifIds.length > 0 ? dispositifHook.getDispositifsByIds(dispositifIds) : Promise.resolve([]),
                    permitIds.length > 0 ? permitHook.getPermitsByIds(permitIds) : Promise.resolve([])
                ]);

                // Create maps with error handling
                const risquesMap = new Map<number, RisqueDTO>();
                if (risquesData.status === 'fulfilled' && risquesData.value) {
                    risquesData.value.forEach(risque => {
                        if (risque) {
                            risquesMap.set(risque.id as number, risque);
                        }
                    });
                }
                
                const dispositifsMap = new Map<number, DispositifDTO>();
                if (dispositifsData.status === 'fulfilled' && dispositifsData.value) {
                    dispositifsData.value.forEach(dispositif => {
                        if (dispositif) {
                            dispositifsMap.set(dispositif.id as number, dispositif);
                        }
                    });
                }
                
                const permitsMap = new Map<number, any>();
                if (permitsData.status === 'fulfilled' && permitsData.value) {
                    permitsData.value.forEach(permit => {
                        if (permit) {
                            permitsMap.set(permit.id as number, permit);
                        }
                    });
                }

                setRisques(risquesMap);
                setDispositifs(dispositifsMap);
                setPermits(permitsMap);
            } catch (error) {
                console.error('Error fetching related data:', error);
                // Set empty maps to avoid display issues
                setRisques(new Map<number, RisqueDTO>());
                setDispositifs(new Map<number, DispositifDTO>());
                setPermits(new Map<number, any>());
            }
        }

        fetchAllData();
    }, [pdpData]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const formatDate = (date: Date | undefined) => {
        return date ? dayjs(date).format("DD/MM/YYYY") : "Non défini";
    };

    // Function to get status tag color and label
    const getStatusChip = () => {
        const status = pdpData?.status;
        
        switch(status) {
            case 'ACTIVE':
                return { label: 'Actif', color: 'success' as const };
            case 'DRAFT':
                return { label: 'Brouillon', color: 'warning' as const };
            case 'COMPLETED':
                return { label: 'Terminé', color: 'primary' as const };
            case 'NEEDS_ACTION':
                return { label: 'Action requise', color: 'error' as const };
            case 'EXPIRED':
                return { label: 'Expiré', color: 'error' as const };
            case 'CANCELED':
                return { label: 'Annulé', color: 'default' as const };
            default:
                return { label: status || 'Indéfini', color: 'default' as const };
        }
    };

    // Function to get action type tag color and label
    const getActionTypeChip = () => {
        const actionType = pdpData?.actionType;
        
        switch(actionType) {
            case 'SIGNATURES_MISSING':
                return { label: 'Signatures manquantes', color: 'warning' as const };
            case 'PERMIT_MISSING':
                return { label: 'Permis manquant', color: 'error' as const };
            case 'NONE':
                return { label: 'Aucune action', color: 'success' as const };
            default:
                return { label: actionType || 'Non défini', color: 'default' as const };
        }
    };

    if (loading) {
        return (
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "80vh"}}>
                <CircularProgress size={60}/>
            </Box>
        );
    }

    if (!pdpData) {
        return (
            <Box sx={{p: 3}}>
                <Typography variant="h5" color="error">
                    Plan de Prévention non trouvé
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate("/")}
                    sx={{mt: 2}}
                >
                    Retour à l'accueil
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{p: {xs: 2, md: 3},  mx: "auto"}}>
            {/* Header with main PDP info */}
            <HeaderCard elevation={3}>
                <Grid container spacing={3}>
                    <Grid xs={12} md={1}>
                        <StyledAvatar>
                            <Warning fontSize="large"/>
                        </StyledAvatar>
                    </Grid>
                    <Grid xs={12} md={9}>
                        <Typography variant="h4" fontWeight="bold">
                            Plan de Prévention #{pdpData.id}
                            <Chip
                                label={getStatusChip().label}
                                color={getStatusChip().color}
                                size="medium"
                                sx={{ ml: 2, fontWeight: 'bold' }}
                            />
                            {pdpData?.actionType && pdpData.actionType !== 'NONE' && (
                                <Chip
                                    label={getActionTypeChip().label}
                                    color={getActionTypeChip().color}
                                    size="medium"
                                    variant="outlined"
                                    sx={{ ml: 1, fontWeight: 'bold' }}
                                />
                            )}
                        </Typography>
                        <Typography variant="h6" sx={{mt: 1, opacity: 0.9}}>
                            {pdpData.entrepriseExterieure ?
                                `Entreprise extérieure: ${entreprises.get(pdpData?.entrepriseExterieure)?.nom || `ID: ${pdpData.entrepriseExterieure}`}` :
                                "Aucune entreprise extérieure spécifiée"}
                        </Typography>
                        <Box sx={{display: "flex", flexWrap: "wrap", gap: 1, mt: 2}}>
                            <Chip
                                icon={<CalendarMonth sx={{color: 'white !important'}}/>}
                                label={`Date d'inspection: ${formatDate(pdpData.dateInspection)}`}
                                sx={{color: theme.palette.background.paper}}
                                variant="outlined"
                            />
                            <Chip
                                icon={<CalendarMonth sx={{color: 'white !important'}}/>}
                                label={`Date prévisionnelle: ${formatDate(pdpData.datePrev)}`}
                                variant="outlined"
                                sx={{color: theme.palette.background.paper}}
                            />
                            <Chip
                                icon={<Info sx={{color: 'white !important'}}/>}
                                label={`Date ICP: ${formatDate(pdpData.icpdate)}`}
                                sx={{color: theme.palette.background.paper}}
                                variant="outlined"
                            />
                            <Chip
                                icon={<Info sx={{color: 'white !important'}}/>}
                                label={`Date CSSCT: ${formatDate(pdpData.datePrevenirCSSCT)}`}
                                sx={{color: theme.palette.background.paper}}
                                variant="outlined"
                            />
                        </Box>
                    </Grid>
                    <Grid xs={12} md={2} sx={{textAlign: {xs: "left", md: "right"}}}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Edit/>}
                            onClick={() => navigate(`/edit/pdps/${pdpData.id}`)}
                        >
                            Modifier
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Print/>}
                            sx={{mt: 1}}
                        >
                            Imprimer
                        </Button>
                    </Grid>
                </Grid>

                {/* Status and Action Type Chips */}
                <Box sx={{mt: 2, display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "flex-start"}}>
                    <Chip
                        label={`Statut: ${getStatusChip().label}`}
                        color={getStatusChip().color}
                        variant="outlined"
                        size="small"
                        sx={{borderRadius: 1, fontWeight: "medium"}}
                    />
                    <Chip
                        label={`Action: ${getActionTypeChip().label}`}
                        color={getActionTypeChip().color}
                        variant="outlined"
                        size="small"
                        sx={{borderRadius: 1, fontWeight: "medium"}}
                    />
                </Box>
            </HeaderCard>

            {/* General Info Cards */}
            <Grid container gap={1} sx={{mb: 2}}>
                <Grid xs={12} md={3.6}>
                    <InfoCard elevation={1}>
                        <CardContent>
                            <Box sx={{display: "flex", alignItems: "center", mb: 2}}>
                                <Business color="secondary" sx={{mr: 1}}/>
                                <Typography variant="h6">Entreprise Extérieure</Typography>
                            </Box>
                            <Divider sx={{mb: 2}}/>
                            {pdpData.entrepriseExterieure ? (
                                <>
                                    <Typography variant="body1" fontWeight="bold">
                                        {entreprises.get(pdpData?.entrepriseExterieure)?.nom || `Entreprise ID: ${pdpData.entrepriseExterieure}`}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>
                                        {entreprises.get(pdpData?.entrepriseExterieure)?.raisonSociale || "Raison sociale non disponible"}
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Aucune entreprise extérieure associée
                                </Typography>
                            )}
                        </CardContent>
                    </InfoCard>
                </Grid>

                <Grid xs={12} md={4}>
                    <InfoCard elevation={2}>
                        <CardContent>
                            <Box sx={{display: "flex", alignItems: "center", mb: 2}}>
                                <Business color="secondary" sx={{mr: 1}}/>
                                <Typography variant="h6">Entreprise d'Inspection</Typography>
                            </Box>
                            <Divider sx={{mb: 2}}/>
                            {pdpData.entrepriseDInspection ? (
                                <>
                                    <Typography variant="body1" fontWeight="bold">
                                        {entreprises.get(pdpData?.entrepriseDInspection)?.nom || `Entreprise ID: ${pdpData.entrepriseDInspection}`}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>
                                        {entreprises.get(pdpData?.entrepriseDInspection)?.raisonSociale || "Raison sociale non disponible"}
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Aucune entreprise d'inspection associée
                                </Typography>
                            )}
                        </CardContent>
                    </InfoCard>
                </Grid>

                <Grid xs={12} md={4}>
                    <InfoCard elevation={2}>
                        <CardContent>
                            <Box sx={{display: "flex", alignItems: "center", mb: 2}}>
                                <AccessTime color="secondary" sx={{mr: 1}}/>
                                <Typography variant="h6">Horaires de Travail</Typography>
                            </Box>
                            <Divider sx={{mb: 2}}/>
                            {pdpData.horaireDeTravail ? (
                                <>
                                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 1}}>
                                        {pdpData.horaireDeTravail.enJournee && (
                                            <Chip size="small" label="En journée" color="primary"/>
                                        )}
                                        {pdpData.horaireDeTravail.enNuit && (
                                            <Chip size="small" label="En nuit" color="primary"/>
                                        )}
                                        {pdpData.horaireDeTravail.samedi && (
                                            <Chip size="small" label="Samedi" color="primary"/>
                                        )}
                                    </Box>
                                    <Typography variant="body2" sx={{mt: 2}}>
                                        {pdpData.horairesDetails || "Aucun détail d'horaire spécifié"}
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Aucun horaire défini
                                </Typography>
                            )}
                        </CardContent>
                    </InfoCard>
                </Grid>
            </Grid>

            {/* Tabs for detailed information */}
            <Paper sx={{borderRadius: "16px", overflow: "hidden", mb: 4}}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="pdps tabs"
                >
                    <Tab icon={<Warning/>} label="Risques"/>
                    <Tab icon={<VerifiedUser/>} label="Dispositifs"/>
                    <Tab icon={<Assignment/>} label="Permis"/>
                    <Tab icon={<Shield/>} label="Analyse des Risques"/>
                </Tabs>

                {/* Risques Tab */}
                <TabPanel value={tabValue} index={0}>
                    <SectionTitle variant="h5">Risques identifiés</SectionTitle>
                    <Grid container spacing={3}>
                        {getRisquesRelations().length > 0 ? (
                            getRisquesRelations().map((relation, index) => {
                                const risque = risques.get(relation.objectId as number);
                                return (
                                    <Grid xs={12} md={6} key={relation.objectId || index}>
                                        <ItemCard elevation={2}>
                                            <CardContent>
                                                <Box sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }}>
                                                    <Box sx={{display: "flex", alignItems: "center"}}>
                                                        <Avatar
                                                            sx={{bgcolor: relation.answer ? "error.main" : "grey.500", mr: 2}}
                                                            src={risque?.logo ?
                                                                `data:${risque.logo.mimeType};base64,${risque.logo.imageData}` :
                                                                undefined}
                                                        >
                                                            <Warning/>
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="h6">
                                                                {risque?.title || `Risque #${relation.objectId}`}
                                                            </Typography>
                                                            <Chip
                                                                size="small"
                                                                label={relation.answer ? "Applicable" : "Non applicable"}
                                                                color={relation.answer ? "error" : "default"}
                                                                sx={{mt: 1}}
                                                            />
                                                        </Box>
                                                    </Box>
                                                    <IconButton size="small">
                                                        <ChevronRight/>
                                                    </IconButton>
                                                </Box>

                                                {risque?.description && (
                                                    <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                                                        {risque.description}
                                                    </Typography>
                                                )}

                                                {risque?.description && (
                                                    <Box sx={{mt: 2, p: 1, bgcolor: 'background.paper', borderRadius: 1}}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Commentaire:
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {risque.description}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </ItemCard>
                                    </Grid>
                                );
                            })
                        ) : (
                            <Grid xs={12}>
                                <Typography variant="body1" color="text.secondary" sx={{textAlign: "center"}}>
                                    Aucun risque associé à ce plan de prévention
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </TabPanel>

                {/* Dispositifs Tab */}
                <TabPanel value={tabValue} index={1}>
                    <SectionTitle variant="h5">Dispositifs de prévention</SectionTitle>
                    <Grid container spacing={3}>
                        {getDispositifsRelations().length > 0 ? (
                            getDispositifsRelations().map((relation, index) => {
                                const dispositif = dispositifs.get(relation.objectId as number);
                                return (
                                    <Grid xs={12} md={6} key={relation.objectId || index}>
                                        <ItemCard elevation={2}>
                                            <CardContent>
                                                <Box sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }}>
                                                    <Box sx={{display: "flex", alignItems: "center"}}>
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: relation.answer ? "success.main" : "grey.500",
                                                                mr: 2
                                                            }}
                                                            src={dispositif?.logo ?
                                                                `data:${dispositif.logo.mimeType};base64,${dispositif.logo.imageData}` :
                                                                undefined}
                                                        >
                                                            <VerifiedUser/>
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="h6">
                                                                {dispositif?.title || `Dispositif #${relation.objectId}`}
                                                            </Typography>
                                                            <Chip
                                                                size="small"
                                                                label={relation.answer ? "Mis en place" : "Non applicable"}
                                                                color={relation.answer ? "success" : "default"}
                                                                sx={{mt: 1}}
                                                            />
                                                        </Box>
                                                    </Box>
                                                    <IconButton size="small">
                                                        <ChevronRight/>
                                                    </IconButton>
                                                </Box>

                                                {dispositif?.description && (
                                                    <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                                                        {dispositif.description}
                                                    </Typography>
                                                )}

                                                {dispositif?.description && (
                                                    <Box sx={{mt: 2, p: 1, bgcolor: 'background.paper', borderRadius: 1}}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Commentaire:
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {dispositif.description}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </ItemCard>
                                    </Grid>
                                );
                            })
                        ) : (
                            <Grid xs={12}>
                                <Typography variant="body1" color="text.secondary" sx={{textAlign: "center"}}>
                                    Aucun dispositif associé à ce plan de prévention
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </TabPanel>

                {/* Permis Tab */}
                <TabPanel value={tabValue} index={2}>
                    <SectionTitle variant="h5">Permis requis</SectionTitle>
                    <Grid container spacing={3}>
                        {getPermitsRelations().length > 0 ? (
                            getPermitsRelations().map((relation, index) => {
                                const permit = permits.get(relation.objectId as number);
                                return (
                                    <Grid xs={12} md={6} key={relation.objectId || index}>
                                        <ItemCard elevation={2}>
                                            <CardContent>
                                                <Box sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }}>
                                                    <Box sx={{display: "flex", alignItems: "center"}}>
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: relation.answer ? "warning.main" : "grey.500",
                                                                mr: 2
                                                            }}
                                                        >
                                                            <Assignment/>
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="h6">
                                                                {permit?.title || `Permis #${relation.objectId}`}
                                                            </Typography>
                                                            <Chip
                                                                size="small"
                                                                label={relation.answer ? "Requis" : "Non requis"}
                                                                color={relation.answer ? "warning" : "default"}
                                                                sx={{mt: 1}}
                                                            />
                                                        </Box>
                                                    </Box>
                                                    <IconButton size="small">
                                                        <ChevronRight/>
                                                    </IconButton>
                                                </Box>

                                                {permit?.description && (
                                                    <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                                                        {permit.description}
                                                    </Typography>
                                                )}
                                            </CardContent>
                                        </ItemCard>
                                    </Grid>
                                );
                            })
                        ) : (
                            <Grid xs={12}>
                                <Typography variant="body1" color="text.secondary" sx={{textAlign: "center"}}>
                                    Aucun permis associé à ce plan de prévention
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </TabPanel>

                {/* Analyse des Risques Tab */}
                <TabPanel value={tabValue} index={3}>
                    <SectionTitle variant="h5">Analyses de Risques</SectionTitle>
                    <Grid container spacing={3}>
                        {getAnalysesRelations().length > 0 ? (
                            getAnalysesRelations().map((relation, index) => (
                                <Grid xs={12} key={relation.id || index}>
                                    <ItemCard elevation={2}>
                                        <CardContent>
                                            <Box sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }}>
                                                <Box sx={{display: "flex", alignItems: "center"}}>
                                                    <Avatar
                                                        sx={{bgcolor: "secondary.main", mr: 2}}
                                                    >
                                                        <Shield/>
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="h6">
                                                            {`Analyse #${relation.objectId}`}
                                                        </Typography>
                                                        <Box sx={{display: 'flex', gap: 1, mt: 1}}>
                                                            <Chip
                                                                size="small"
                                                                label={relation.answer ? "Applicable" : "Non applicable"}
                                                                color={relation.answer ? "success" : "default"}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </Box>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<Info/>}
                                                >
                                                    Détails
                                                </Button>
                                            </Box>

                                            <Divider sx={{my: 2}}/>

                                            <Grid container spacing={2}>
                                                <Grid xs={12}>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        Statut
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {relation.answer ? "Applicable" : "Non applicable"}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </ItemCard>
                                </Grid>
                            ))
                        ) : (
                            <Grid xs={12}>
                                <Typography variant="body1" color="text.secondary" sx={{textAlign: "center"}}>
                                    Aucune analyse de risque associée à ce plan de prévention
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </TabPanel>
            </Paper>

            {/* Mise à disposition section */}
            <Paper sx={{borderRadius: "16px", p: 3, mb: 4}}>
                <SectionTitle variant="h5">Mise à disposition</SectionTitle>
                <Grid container spacing={3}>
                    <Grid xs={12} md={3}>
                        <InfoCard elevation={1}>
                            <CardContent>
                                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                    <Typography variant="subtitle1">Vestiaires</Typography>
                                    <Chip
                                        size="small"
                                        label={pdpData.misesEnDisposition?.vestiaires ? "Oui" : "Non"}
                                        color={pdpData.misesEnDisposition?.vestiaires ? "success" : "default"}
                                    />
                                </Box>
                            </CardContent>
                        </InfoCard>
                    </Grid>
                    <Grid xs={12} md={3}>
                        <InfoCard elevation={1}>
                            <CardContent>
                                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                    <Typography variant="subtitle1">Sanitaires</Typography>
                                    <Chip
                                        size="small"
                                        label={pdpData.misesEnDisposition?.sanitaires ? "Oui" : "Non"}
                                        color={pdpData.misesEnDisposition?.sanitaires ? "success" : "default"}
                                    />
                                </Box>
                            </CardContent>
                        </InfoCard>
                    </Grid>
                    <Grid xs={12} md={3}>
                        <InfoCard elevation={1}>
                            <CardContent>
                                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                    <Typography variant="subtitle1">Restaurant</Typography>
                                    <Chip
                                        size="small"
                                        label={pdpData.misesEnDisposition?.restaurant ? "Oui" : "Non"}
                                        color={pdpData.misesEnDisposition?.restaurant ? "success" : "default"}
                                    />
                                </Box>
                            </CardContent>
                        </InfoCard>
                    </Grid>
                    <Grid xs={12} md={3}>
                        <InfoCard elevation={1}>
                            <CardContent>
                                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                    <Typography variant="subtitle1">Énergie</Typography>
                                    <Chip
                                        size="small"
                                        label={pdpData.misesEnDisposition?.energie ? "Oui" : "Non"}
                                        color={pdpData.misesEnDisposition?.energie ? "success" : "default"}
                                    />
                                </Box>
                            </CardContent>
                        </InfoCard>
                    </Grid>
                </Grid>
            </Paper>

            {/* Footer with navigation buttons */}
            <Box sx={{display: "flex", justifyContent: "space-between", mt: 3}}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack/>}
                    onClick={() =>
                        pdpData.chantier
                            ? navigate(`/view/chantier/${pdpData.chantier}`)
                            : navigate('/')
                    }
                >
                    Retour
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Edit/>}
                    onClick={() => navigate(`/edit/pdps/${pdpData.id}`)}
                >
                    Modifier le PDP
                </Button>
            </Box>
        </Box>
    );
};
export default ViewPdp;
