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
    useTheme,
    Grid
} from "@mui/material";
import {
    Business,
    CalendarMonth,
    Engineering,
    Warning,
    VerifiedUser,
    Edit,
    Print,
    ArrowBack,
    Assignment,
    Note,
    Check,
    Close,
    ErrorOutline,
    Build,
    Description,
    FactCheck,
    Info,
    Assessment
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import useBdt from "../../hooks/useBdt";
import useRisque from "../../hooks/useRisque";
import useDispositif from "../../hooks/useDispositif";
import usePermit from "../../hooks/usePermit";
import useAnalyseRisque from "../../hooks/useAnalyseRisque";
import useAuditSecu from "../../hooks/useAuditSecu";
import useEntreprise from "../../hooks/useEntreprise";
import useChantier from "../../hooks/useChantier";
import type { BdtDTO } from "../../utils/entitiesDTO/BdtDTO";
import type { EntrepriseDTO } from "../../utils/entitiesDTO/EntrepriseDTO";
import type { ChantierDTO } from "../../utils/entitiesDTO/ChantierDTO";
import RisqueDTO from "../../utils/entitiesDTO/RisqueDTO";
import DispositifDTO from "../../utils/entitiesDTO/DispositifDTO";
import PermitDTO from "../../utils/entitiesDTO/PermitDTO";
import type { AnalyseDeRisqueDTO } from "../../utils/entitiesDTO/AnalyseDeRisqueDTO";
import type { AuditSecu } from "../../utils/entities/AuditSecu";
import ObjectAnsweredObjects from "../../utils/ObjectAnsweredObjects";
import { getRoute } from "../../Routes";

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

const ViewBdt: FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [bdtData, setBdtData] = useState<BdtDTO | null>(null);
    const [tabValue, setTabValue] = useState(0);

    // Hooks
    const {getBDT, loading} = useBdt();
    const risquesHook = useRisque();
    const entrepriseHook = useEntreprise();
    const chantierHook = useChantier();
    const dispositifHook = useDispositif();
    const permitHook = usePermit();
    const analyseHook = useAnalyseRisque();
    const auditHook = useAuditSecu();
    const theme = useTheme();

    // Maps for related data
    const [risques, setRisques] = useState<Map<number, RisqueDTO>>(new Map<number, RisqueDTO>());
    const [entreprises, setEntreprises] = useState<Map<number, EntrepriseDTO>>(new Map<number, EntrepriseDTO>());
    const [chantiers, setChantiers] = useState<Map<number, ChantierDTO>>(new Map<number, ChantierDTO>());
    const [dispositifs, setDispositifs] = useState<Map<number, DispositifDTO>>(new Map<number, DispositifDTO>());
    const [permits, setPermits] = useState<Map<number, PermitDTO>>(new Map<number, PermitDTO>());
    const [analyses, setAnalyses] = useState<Map<number, AnalyseDeRisqueDTO>>(new Map<number, AnalyseDeRisqueDTO>());
    const [audits, setAudits] = useState<Map<number, AuditSecu>>(new Map<number, AuditSecu>());

    // Utility functions to get relations by type
    const getRisquesRelations = () => {
        if (!bdtData?.relations) return [];
        return bdtData.relations.filter(rel => rel.objectType === ObjectAnsweredObjects.RISQUE && rel.answer === true);
    };

    const getDispositifsRelations = () => {
        if (!bdtData?.relations) return [];
        return bdtData.relations.filter(rel => rel.objectType === ObjectAnsweredObjects.DISPOSITIF && rel.answer === true);
    };

    const getPermitsRelations = () => {
        if (!bdtData?.relations) return [];
        return bdtData.relations.filter(rel => rel.objectType === ObjectAnsweredObjects.PERMIT && rel.answer === true);
    };

    const getAnalysesRelations = () => {
        if (!bdtData?.relations) return [];
        return bdtData.relations.filter(rel => rel.objectType === ObjectAnsweredObjects.ANALYSE_DE_RISQUE && rel.answer === true);
    };

    const getAuditsRelations = () => {
        if (!bdtData?.relations) return [];
        return bdtData.relations.filter(rel => rel.objectType === ObjectAnsweredObjects.AUDIT && rel.answer === true);
    };

    useEffect(() => {
        const fetchBdt = async () => {
            if (id) {
                try {
                    const data = await getBDT(parseInt(id));
                    setBdtData(data);
                } catch (error) {
                    console.error('Error fetching BDT:', error);
                    setBdtData(null);
                }
            }
        };

        fetchBdt();
    }, [id]);

    useEffect(() => {
        const fetchEntrepriseAndChantier = async () => {
            if (!bdtData) return;
            
            const entrepriseMap = new Map<number, EntrepriseDTO>();
            const chantierMap = new Map<number, ChantierDTO>();
            
            try {
                if (bdtData.entrepriseExterieure) {
                    const entrepriseExterieure = await entrepriseHook.getEntreprise(bdtData.entrepriseExterieure);
                    if (entrepriseExterieure) {
                        entrepriseMap.set(bdtData.entrepriseExterieure, entrepriseExterieure);
                    }
                }
                
                if (bdtData.chantier) {
                    const chantier = await chantierHook.getChantier(bdtData.chantier);
                    if (chantier) {
                        chantierMap.set(bdtData.chantier, chantier);
                    }
                }
                
                setEntreprises(entrepriseMap);
                setChantiers(chantierMap);
            } catch (error) {
                console.error('Error fetching entreprise or chantier:', error);
            }
        };

        fetchEntrepriseAndChantier();
    }, [bdtData?.entrepriseExterieure, bdtData?.chantier]);

    useEffect(() => {
        const fetchAllRelatedData = async () => {
            if (!bdtData?.relations) return;
            
            try {
                // Extract IDs from relations for each type
                const risqueIds = bdtData.relations
                    .filter(rel => rel.objectType === ObjectAnsweredObjects.RISQUE && rel.answer === true)
                    .map(rel => rel.objectId as number);
                
                const dispositifIds = bdtData.relations
                    .filter(rel => rel.objectType === ObjectAnsweredObjects.DISPOSITIF && rel.answer === true)
                    .map(rel => rel.objectId as number);
                
                const permitIds = bdtData.relations
                    .filter(rel => rel.objectType === ObjectAnsweredObjects.PERMIT && rel.answer === true)
                    .map(rel => rel.objectId as number);

                const analyseIds = bdtData.relations
                    .filter(rel => rel.objectType === ObjectAnsweredObjects.ANALYSE_DE_RISQUE && rel.answer === true)
                    .map(rel => rel.objectId as number);

                const auditIds = bdtData.relations
                    .filter(rel => rel.objectType === ObjectAnsweredObjects.AUDIT && rel.answer === true)
                    .map(rel => rel.objectId as number);

                // Fetch data in parallel with error handling
                const [risquesData, dispositifsData, permitsData, analysesData, auditsData] = await Promise.allSettled([
                    risqueIds.length > 0 ? risquesHook.getRisquesByIds(risqueIds) : Promise.resolve([]),
                    dispositifIds.length > 0 ? dispositifHook.getDispositifsByIds(dispositifIds) : Promise.resolve([]),
                    permitIds.length > 0 ? permitHook.getPermitsByIds(permitIds) : Promise.resolve([]),
                    analyseIds.length > 0 ? Promise.all(analyseIds.map(id => analyseHook.getAnalyseRisque(id))) : Promise.resolve([]),
                    auditIds.length > 0 ? Promise.all(auditIds.map(id => auditHook.getAuditSecu(id))) : Promise.resolve([])
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
                
                const permitsMap = new Map<number, PermitDTO>();
                if (permitsData.status === 'fulfilled' && permitsData.value) {
                    permitsData.value.forEach(permit => {
                        if (permit) {
                            permitsMap.set(permit.id as number, permit);
                        }
                    });
                }

                const analysesMap = new Map<number, AnalyseDeRisqueDTO>();
                if (analysesData.status === 'fulfilled' && analysesData.value) {
                    analysesData.value.forEach(analyse => {
                        if (analyse) {
                            analysesMap.set(analyse.id as number, analyse);
                        }
                    });
                }

                const auditsMap = new Map<number, AuditSecu>();
                if (auditsData.status === 'fulfilled' && auditsData.value) {
                    auditsData.value.forEach(audit => {
                        if (audit) {
                            auditsMap.set(audit.id as number, audit);
                        }
                    });
                }

                setRisques(risquesMap);
                setDispositifs(dispositifsMap);
                setPermits(permitsMap);
                setAnalyses(analysesMap);
                setAudits(auditsMap);
            } catch (error) {
                console.error('Error fetching related data:', error);
                // Set empty maps to avoid display issues
                setRisques(new Map<number, RisqueDTO>());
                setDispositifs(new Map<number, DispositifDTO>());
                setPermits(new Map<number, PermitDTO>());
                setAnalyses(new Map<number, AnalyseDeRisqueDTO>());
                setAudits(new Map<number, AuditSecu>());
            }
        };

        fetchAllRelatedData();
    }, [bdtData]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const formatDate = (date: Date | undefined) => {
        return date ? dayjs(date).format("DD/MM/YYYY") : "Non défini";
    };

    // Function to get status tag color and label
    const getStatusChip = () => {
        const status = bdtData?.status;
        
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
        const actionType = bdtData?.actionType;
        
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

    if (!bdtData) {
        return (
            <Box sx={{p: 3}}>
                <Typography variant="h5" color="error">
                    Bon de Travail non trouvé
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
            {/* Header with main BDT info */}
            <HeaderCard elevation={0}>
                <Grid container spacing={3} alignItems="center">
                    <Grid xs={12} md={1}>
                        <StyledAvatar>
                            <Assignment fontSize="large"/>
                        </StyledAvatar>
                    </Grid>
                    <Grid xs={12} md={7}>
                        <Box sx={{ position: 'relative', zIndex: 2 }}>
                            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                                Bon de Travail #{bdtData.id}
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                                {bdtData.nom || "Sans titre"}
                            </Typography>
                            
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
                                
                                <Chip
                                    label={getActionTypeChip().label}
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                        color: getActionTypeChip().color === 'success' ? 'success.main' : 
                                               getActionTypeChip().color === 'error' ? 'error.main' :
                                               getActionTypeChip().color === 'warning' ? 'warning.main' : 'primary.main',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        '& .MuiChip-icon': {
                                            color: 'inherit'
                                        }
                                    }}
                                    size="medium"
                                />
                            </Box>

                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {bdtData.date && (
                                    <Chip
                                        icon={<CalendarMonth sx={{ color: 'rgba(255,255,255,0.9) !important' }} />}
                                        label={`Date: ${formatDate(bdtData.date)}`}
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
                                )}
                                {entreprises.get(bdtData.entrepriseExterieure as number) && (
                                    <Chip
                                        icon={<Business sx={{ color: 'rgba(255,255,255,0.9) !important' }} />}
                                        label={`Entreprise: ${entreprises.get(bdtData.entrepriseExterieure as number)?.nom || "N/A"}`}
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
                                )}
                                {chantiers.get(bdtData.chantier as number) && (
                                    <Chip
                                        icon={<Engineering sx={{ color: 'rgba(255,255,255,0.9) !important' }} />}
                                        label={`Chantier: ${chantiers.get(bdtData.chantier as number)?.nom || "N/A"}`}
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
                                )}
                            </Box>
                        </Box>
                    </Grid>
                    <Grid xs={12} md={4} sx={{ textAlign: { xs: "left", md: "right" }, position: 'relative', zIndex: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<Edit />}
                                onClick={() => navigate(getRoute('EDIT_BDT', {id: bdtData.id}))}
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

            {/* Tabs for detailed information */}
            <Paper sx={{borderRadius: "16px", overflow: "hidden", mb: 4}}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="bdt tabs"
                >
                    <Tab icon={<ErrorOutline/>} label="Risques" iconPosition="start"/>
                    <Tab icon={<Build/>} label="Dispositifs" iconPosition="start"/>
                    <Tab icon={<Description/>} label="Permis" iconPosition="start"/>
                    <Tab icon={<FactCheck/>} label="Analyses" iconPosition="start"/>
                    <Tab icon={<VerifiedUser/>} label="Audits" iconPosition="start"/>
                    <Tab icon={<Note/>} label="Compléments" iconPosition="start"/>
                </Tabs>

                {/* Risques Tab */}
                <TabPanel value={tabValue} index={0}>
                    <SectionTitle variant="h6">Risques identifiés</SectionTitle>
                    <Grid container spacing={2}>
                        {getRisquesRelations().length > 0 ? (
                            getRisquesRelations().map((relation, index) => {
                                const risque = risques.get(relation.objectId as number);
                                return (
                                    <Grid xs={12} md={6} key={relation.id || index}>
                                        <ItemCard elevation={2}>
                                            <CardContent>
                                                <Box sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }}>
                                                    <Box sx={{display: "flex", alignItems: "center"}}>
                                                        <Avatar
                                                            sx={{bgcolor: "error.main", mr: 2}}
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
                                                                label="Applicable"
                                                                color="error"
                                                                sx={{mt: 1}}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                {risque?.description && (
                                                    <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                                                        {risque.description}
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
                                    Aucun risque associé à ce bon de travail
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
                                    <Grid xs={12} md={6} key={relation.id || index}>
                                        <ItemCard elevation={2}>
                                            <CardContent>
                                                <Box sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }}>
                                                    <Box sx={{display: "flex", alignItems: "center"}}>
                                                        <Avatar
                                                            sx={{bgcolor: "success.main", mr: 2}}
                                                            src={dispositif?.logo ?
                                                                `data:${dispositif.logo.mimeType};base64,${dispositif.logo.imageData}` :
                                                                undefined}
                                                        >
                                                            <Build/>
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="h6">
                                                                {dispositif?.title || `Dispositif #${relation.objectId}`}
                                                            </Typography>
                                                            <Chip
                                                                size="small"
                                                                label="Applicable"
                                                                color="success"
                                                                sx={{mt: 1}}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                {dispositif?.description && (
                                                    <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                                                        {dispositif.description}
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
                                    Aucun dispositif de prévention associé à ce bon de travail
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
                                    <Grid xs={12} md={6} key={relation.id || index}>
                                        <ItemCard elevation={2}>
                                            <CardContent>
                                                <Box sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }}>
                                                    <Box sx={{display: "flex", alignItems: "center"}}>
                                                        <Avatar
                                                            sx={{bgcolor: "primary.main", mr: 2}}
                                                            src={permit?.logo ?
                                                                `data:${permit.logo.mimeType};base64,${permit.logo.imageData}` :
                                                                undefined}
                                                        >
                                                            <Description/>
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="h6">
                                                                {permit?.title || `Permis #${relation.objectId}`}
                                                            </Typography>
                                                            <Chip
                                                                size="small"
                                                                label={permit?.type || "Permis"}
                                                                color="primary"
                                                                sx={{mt: 1}}
                                                            />
                                                        </Box>
                                                    </Box>
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
                                    Aucun permis associé à ce bon de travail
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
                            getAnalysesRelations().map((relation, index) => {
                                const analyse = analyses.get(relation.objectId as number);
                                return (
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
                                                            sx={{bgcolor: "info.main", mr: 2}}
                                                        >
                                                            <Assessment/>
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="h6">
                                                                {`Analyse #${relation.objectId}`}
                                                            </Typography>
                                                            <Chip
                                                                size="small"
                                                                label="Analyse de risque"
                                                                color="info"
                                                                sx={{mt: 1}}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                {analyse?.deroulementDesTaches && (
                                                    <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                                                        {analyse.deroulementDesTaches}
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
                                    Aucune analyse de risque associée à ce bon de travail
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </TabPanel>

                {/* Audits Tab */}
                <TabPanel value={tabValue} index={4}>
                    <SectionTitle variant="h6">Audits de sécurité</SectionTitle>
                    <Grid container spacing={2}>
                        {getAuditsRelations().length > 0 ? (
                            getAuditsRelations().map((relation, index) => {
                                const audit = audits.get(relation.objectId as number);
                                return (
                                    <Grid xs={12} md={6} key={relation.id || index}>
                                        <ItemCard elevation={2}>
                                            <CardContent>
                                                <Box sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }}>
                                                    <Box sx={{display: "flex", alignItems: "center"}}>
                                                        <Avatar
                                                            sx={{bgcolor: "success.main", mr: 2}}
                                                        >
                                                            <VerifiedUser/>
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="h6">
                                                                {audit?.title || `Audit #${relation.objectId}`}
                                                            </Typography>
                                                            <Chip
                                                                size="small"
                                                                label="Validé"
                                                                color="success"
                                                                sx={{mt: 1}}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                {audit?.description && (
                                                    <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                                                        {audit.description}
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
                                    Aucun audit de sécurité associé à ce bon de travail
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </TabPanel>

                {/* Compléments Tab */}
                <TabPanel value={tabValue} index={5}>
                    <SectionTitle variant="h6">Compléments ou rappels</SectionTitle>
                    <Grid container spacing={2}>
                        {bdtData.complementOuRappels && bdtData.complementOuRappels.length > 0 ? (
                            bdtData.complementOuRappels.map((complement, index) => (
                                <Grid xs={12} key={index}>
                                    <ItemCard elevation={2}>
                                        <CardContent>
                                            <Box sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start"
                                            }}>
                                                <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                                                    <Avatar sx={{bgcolor: complement.respect ? "success.main" : "error.main"}}>
                                                        {complement.respect ? <Check /> : <Close />}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight="bold">
                                                            Complément #{index + 1}
                                                        </Typography>
                                                        <Chip
                                                            size="small"
                                                            label={complement.respect ? "Respecté" : "Non respecté"}
                                                            color={complement.respect ? "success" : "error"}
                                                            sx={{mt: 1}}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Divider sx={{my: 2}} />
                                            <Typography variant="body1">
                                                {complement.complement}
                                            </Typography>
                                        </CardContent>
                                    </ItemCard>
                                </Grid>
                            ))
                        ) : (
                            <Grid xs={12}>
                                <Typography variant="body1" color="text.secondary" sx={{textAlign: "center"}}>
                                    Aucun complément ou rappel associé à ce bon de travail
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </TabPanel>
            </Paper>

            {/* Footer with navigation buttons */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        bdtData.chantier
                            ? navigate(getRoute('VIEW_CHANTIER', {id: bdtData.chantier}))
                            : navigate('/')
                    }
                >
                    Retour
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Edit />}
                    onClick={() => navigate(getRoute('EDIT_BDT', {id: bdtData.id}))}
                >
                    Modifier le BDT
                </Button>
            </Box>
        </Box>
    );
};

export default ViewBdt;