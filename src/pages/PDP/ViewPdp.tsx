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
    Warning,
    AccessTime,
    Edit,
    Print,
    ArrowBack,
    Info,
    Build,
    Description,
    FactCheck,
    ErrorOutline,
    CheckCircle,
    Pending
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import usePdp from "../../hooks/usePdp";
import { PdpDTO } from "../../utils/entitiesDTO/PdpDTO.ts";
import ObjectAnsweredObjects from "../../utils/ObjectAnsweredObjects.ts";
import useRisque from "../../hooks/useRisque.ts";
import RisqueDTO from "../../utils/entitiesDTO/RisqueDTO.ts";
import { EntrepriseDTO } from "../../utils/entitiesDTO/EntrepriseDTO.ts";
import useEntreprise from "../../hooks/useEntreprise.ts";
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
    padding: theme.spacing(3, 4),
    marginBottom: theme.spacing(3),
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: theme.palette.primary.contrastText,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
    '&::before': {
        content: '""',
        position: 'absolute',
        top: -50,
        right: -50,
        width: '200px',
        height: '200px',
        background: `radial-gradient(circle, ${theme.palette.common.white}15 0%, transparent 60%)`,
        borderRadius: '50%',
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -30,
        left: -30,
        width: '150px',
        height: '150px',
        background: `radial-gradient(circle, ${theme.palette.common.white}08 0%, transparent 60%)`,
        borderRadius: '50%',
    },
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
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    border: `1px solid ${theme.palette.divider}`,
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.12)",
        borderColor: theme.palette.primary.main,
    },
}));

const CompactItemCard = styled(Card)(({ theme }) => ({
    borderRadius: "8px",
    marginBottom: theme.spacing(1.5),
    transition: "all 0.2s ease-in-out",
    border: `1px solid ${theme.palette.divider}`,
    "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        borderColor: theme.palette.primary.light,
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    width: 64,
    height: 64,
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
    border: '2px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(8px)',
}));

const ViewPdp: FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [pdpData, setPdpData] = useState<PdpDTO | null>(null);
    const [tabValue, setTabValue] = useState(0);


    //Hooks
    const {getPlanDePrevention, loading} = usePdp();
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
        <Box sx={{p: {xs: 2, md: 4}, width: '100%', margin: '0 auto'}}>
            {/* Header with main PDP info */}
            <HeaderCard elevation={0}>
                <Grid container spacing={3} alignItems="center">
                    <Grid xs={12} md={1}>
                        <StyledAvatar>
                            <Warning fontSize="large"/>
                        </StyledAvatar>
                    </Grid>
                    <Grid xs={12} md={7}>
                        <Box sx={{ position: 'relative', zIndex: 2 }}>
                            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                                Plan de Prévention #{pdpData.id}
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                                {pdpData.entrepriseExterieure ?
                                    `Entreprise extérieure: ${entreprises.get(pdpData?.entrepriseExterieure)?.nom || `ID: ${pdpData.entrepriseExterieure}`}` :
                                    "Aucune entreprise extérieure spécifiée"}
                            </Typography>
                            
                            {/* Status Chips - Better visibility */}
                            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 2 }}>
                                <Chip
                                    label={getStatusChip().label}
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                        color: getStatusChip().color === 'success' ? 'success.main' : 
                                               getStatusChip().color === 'error' ? 'error.main' :
                                               getStatusChip().color === 'warning' ? 'warning.main' : 'primary.main',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        '& .MuiChip-icon': {
                                            color: 'inherit'
                                        }
                                    }}
                                    size="medium"
                                />
                                {pdpData?.actionType && pdpData.actionType !== 'NONE' && (
                                    <Chip
                                        label={getActionTypeChip().label}
                                        sx={{
                                            bgcolor: 'rgba(255, 255, 255, 0.15)',
                                            color: 'white',
                                            fontWeight: 500,
                                            fontSize: '0.875rem',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            backdropFilter: 'blur(4px)',
                                        }}
                                        variant="outlined"
                                        size="medium"
                                    />
                                )}
                            </Box>

                            {/* Date Info Chips */}
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                <Chip
                                    icon={<CalendarMonth sx={{ color: 'rgba(255,255,255,0.9) !important' }} />}
                                    label={`Inspection: ${formatDate(pdpData.dateInspection)}`}
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.15)',
                                        color: 'white',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        backdropFilter: 'blur(4px)',
                                        '& .MuiChip-icon': {
                                            color: 'rgba(255,255,255,0.9) !important'
                                        }
                                    }}
                                    size="small"
                                />
                                <Chip
                                    icon={<CalendarMonth sx={{ color: 'rgba(255,255,255,0.9) !important' }} />}
                                    label={`Prévisionnel: ${formatDate(pdpData.datePrev)}`}
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.15)',
                                        color: 'white',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        backdropFilter: 'blur(4px)',
                                        '& .MuiChip-icon': {
                                            color: 'rgba(255,255,255,0.9) !important'
                                        }
                                    }}
                                    size="small"
                                />
                                <Chip
                                    icon={<Info sx={{ color: 'rgba(255,255,255,0.9) !important' }} />}
                                    label={`ICP: ${formatDate(pdpData.icpdate)}`}
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.15)',
                                        color: 'white',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        backdropFilter: 'blur(4px)',
                                        '& .MuiChip-icon': {
                                            color: 'rgba(255,255,255,0.9) !important'
                                        }
                                    }}
                                    size="small"
                                />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid xs={12} md={4} sx={{ textAlign: { xs: "left", md: "right" }, position: 'relative', zIndex: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<Edit />}
                                onClick={() => navigate(`/edit/pdps/${pdpData.id}`)}
                                sx={{
                                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                                    color: 'white',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1.2,
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Modifier
                            </Button>
                            <Button
                                variant="outlined"
                                size="medium"
                                startIcon={<Print />}
                                sx={{
                                    color: 'white',
                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                    fontWeight: 500,
                                    '&:hover': {
                                        borderColor: 'white',
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    }
                                }}
                            >
                                Imprimer
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
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
                    <Tab icon={<ErrorOutline/>} label="Risques" iconPosition="start"/>
                    <Tab icon={<Build/>} label="Dispositifs" iconPosition="start"/>
                    <Tab icon={<Description/>} label="Permis" iconPosition="start"/>
                    <Tab icon={<FactCheck/>} label="Analyses" iconPosition="start"/>
                </Tabs>

                {/* Risques Tab */}
                <TabPanel value={tabValue} index={0}>
                    <SectionTitle variant="h6">Risques identifiés</SectionTitle>
                    <Grid container spacing={2}>
                        {getRisquesRelations().length > 0 ? (
                            getRisquesRelations().map((relation, index) => {
                                const risque = risques.get(relation.objectId as number);
                                return (
                                    <Grid xs={12} md={6} lg={4} key={relation.objectId || index}>
                                        <CompactItemCard elevation={1}>
                                            <CardContent sx={{ p: 2 }}>
                                                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 36,
                                                            height: 36,
                                                            bgcolor: relation.answer ? "error.main" : "grey.400",
                                                            flexShrink: 0
                                                        }}
                                                        src={risque?.logo ?
                                                            `data:${risque.logo.mimeType};base64,${risque.logo.imageData}` :
                                                            undefined}
                                                    >
                                                        <ErrorOutline fontSize="small"/>
                                                    </Avatar>
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Typography variant="subtitle2" fontWeight={600} noWrap>
                                                            {risque?.title || `Risque #${relation.objectId}`}
                                                        </Typography>
                                                        <Chip
                                                            size="small"
                                                            label={relation.answer ? "Applicable" : "Non applicable"}
                                                            color={relation.answer ? "error" : "default"}
                                                            variant="outlined"
                                                            sx={{ mt: 0.5, fontSize: '0.75rem' }}
                                                        />
                                                        {risque?.description && (
                                                            <Typography 
                                                                variant="body2" 
                                                                color="text.secondary" 
                                                                sx={{ 
                                                                    mt: 1,
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: 'vertical',
                                                                    overflow: 'hidden'
                                                                }}
                                                            >
                                                                {risque.description}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </CompactItemCard>
                                    </Grid>
                                );
                            })
                        ) : (
                            <Grid xs={12}>
                                <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                                    Aucun risque associé à ce plan de prévention
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </TabPanel>

                {/* Dispositifs Tab */}
                <TabPanel value={tabValue} index={1}>
                    <SectionTitle variant="h6">Dispositifs de prévention</SectionTitle>
                    <Grid container spacing={2}>
                        {getDispositifsRelations().length > 0 ? (
                            getDispositifsRelations().map((relation, index) => {
                                const dispositif = dispositifs.get(relation.objectId as number);
                                return (
                                    <Grid xs={12} md={6} lg={4} key={relation.objectId || index}>
                                        <ItemCard elevation={1}>
                                            <CardContent sx={{ p: 2.5 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 48,
                                                            height: 48,
                                                            bgcolor: relation.answer ? "success.main" : "grey.400",
                                                            mr: 2,
                                                            border: relation.answer ? '2px solid' : 'none',
                                                            borderColor: 'success.light'
                                                        }}
                                                        src={dispositif?.logo ?
                                                            `data:${dispositif.logo.mimeType};base64,${dispositif.logo.imageData}` :
                                                            undefined}
                                                    >
                                                        <Build/>
                                                    </Avatar>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="h6" fontWeight={600}>
                                                            {dispositif?.title || `Dispositif #${relation.objectId}`}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                            {relation.answer ? <CheckCircle color="success" fontSize="small"/> : <Pending color="disabled" fontSize="small"/>}
                                                            <Typography variant="body2" color={relation.answer ? "success.main" : "text.secondary"}>
                                                                {relation.answer ? "Mis en place" : "Non applicable"}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                {dispositif?.description && (
                                                    <Box sx={{ 
                                                        bgcolor: 'grey.50', 
                                                        p: 1.5, 
                                                        borderRadius: 1,
                                                        border: '1px solid',
                                                        borderColor: 'grey.200'
                                                    }}>
                                                        <Typography variant="body2" color="text.secondary">
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
                                <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                                    Aucun dispositif associé à ce plan de prévention
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </TabPanel>

                {/* Permis Tab */}
                <TabPanel value={tabValue} index={2}>
                    <SectionTitle variant="h6">Permis requis</SectionTitle>
                    <Grid container spacing={2}>
                        {getPermitsRelations().length > 0 ? (
                            getPermitsRelations().map((relation, index) => {
                                const permit = permits.get(relation.objectId as number);
                                return (
                                    <Grid xs={12} md={6} key={relation.objectId || index}>
                                        <ItemCard elevation={1}>
                                            <CardContent sx={{ p: 2.5 }}>
                                                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                                                    <Box sx={{
                                                        width: 48,
                                                        height: 60,
                                                        bgcolor: relation.answer ? "info.light" : "grey.300",
                                                        borderRadius: 1,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0,
                                                        position: 'relative',
                                                        border: '2px solid',
                                                        borderColor: relation.answer ? "info.main" : "grey.400",
                                                        '&::before': {
                                                            content: '""',
                                                            position: 'absolute',
                                                            top: 4,
                                                            right: 4,
                                                            width: 8,
                                                            height: 8,
                                                            bgcolor: relation.answer ? "info.main" : "grey.500",
                                                            borderRadius: '50%'
                                                        }
                                                    }}>
                                                        <Description 
                                                            sx={{ 
                                                                color: relation.answer ? "info.main" : "grey.600",
                                                                fontSize: 24 
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                                                            {permit?.title || `Permis #${relation.objectId}`}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                            <Box sx={{
                                                                width: 8,
                                                                height: 8,
                                                                borderRadius: '50%',
                                                                bgcolor: relation.answer ? "warning.main" : "grey.400"
                                                            }}/>
                                                            <Typography variant="body2" fontWeight={500} color={relation.answer ? "warning.main" : "text.secondary"}>
                                                                {relation.answer ? "Requis" : "Non requis"}
                                                            </Typography>
                                                        </Box>
                                                        {permit?.description && (
                                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                                                                {permit.description}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </ItemCard>
                                    </Grid>
                                );
                            })
                        ) : (
                            <Grid xs={12}>
                                <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                                    Aucun permis associé à ce plan de prévention
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </TabPanel>

                {/* Analyse des Risques Tab */}
                <TabPanel value={tabValue} index={3}>
                    <SectionTitle variant="h6">Analyses de Risques</SectionTitle>
                    <Grid container spacing={2}>
                        {getAnalysesRelations().length > 0 ? (
                            getAnalysesRelations().map((relation, index) => (
                                <Grid xs={12} key={relation.id || index}>
                                    <ItemCard elevation={1}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: "secondary.main",
                                                        width: 56,
                                                        height: 56,
                                                        mr: 3,
                                                        boxShadow: 2
                                                    }}
                                                >
                                                    <FactCheck fontSize="large"/>
                                                </Avatar>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                                                        Analyse de Risque #{relation.objectId}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Chip
                                                            icon={relation.answer ? <CheckCircle /> : <ErrorOutline />}
                                                            label={relation.answer ? "Applicable" : "Non applicable"}
                                                            color={relation.answer ? "success" : "default"}
                                                            variant="filled"
                                                        />
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<Info/>}
                                                            sx={{ ml: 'auto' }}
                                                        >
                                                            Voir détails
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Box>

                                            <Divider sx={{ my: 2 }}/>

                                            <Grid container spacing={3}>
                                                <Grid xs={12} md={4}>
                                                    <Box sx={{ 
                                                        p: 2, 
                                                        bgcolor: relation.answer ? 'success.light' : 'grey.100', 
                                                        borderRadius: 2,
                                                        textAlign: 'center'
                                                    }}>
                                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                            Statut d'application
                                                        </Typography>
                                                        <Typography variant="h6" fontWeight={600}>
                                                            {relation.answer ? "Applicable" : "Non applicable"}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid xs={12} md={4}>
                                                    <Box sx={{ 
                                                        p: 2, 
                                                        bgcolor: 'info.light', 
                                                        borderRadius: 2,
                                                        textAlign: 'center'
                                                    }}>
                                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                            Type d'analyse
                                                        </Typography>
                                                        <Typography variant="h6" fontWeight={600}>
                                                            Évaluation
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid xs={12} md={4}>
                                                    <Box sx={{ 
                                                        p: 2, 
                                                        bgcolor: 'warning.light', 
                                                        borderRadius: 2,
                                                        textAlign: 'center'
                                                    }}>
                                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                            Priorité
                                                        </Typography>
                                                        <Typography variant="h6" fontWeight={600}>
                                                            {relation.answer ? "Élevée" : "Faible"}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </ItemCard>
                                </Grid>
                            ))
                        ) : (
                            <Grid xs={12}>
                                <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
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
