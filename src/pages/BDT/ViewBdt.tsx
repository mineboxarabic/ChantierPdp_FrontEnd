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
    Edit,
    Print,
    ArrowBack,
    Assignment,
    Note,
    Check,
    Close
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import useBdt from "../../hooks/useBdt";
import { BDT } from "../../utils/entities/BDT.ts";
import { getRoute } from "../../Routes";
import useEntreprise from "../../hooks/useEntreprise.ts";

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
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
    color: theme.palette.primary.contrastText,
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
        backgroundColor: theme.palette.primary.main,
    },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    width: 56,
    height: 56,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
}));

const ViewBdt: FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [bdtData, setBdtData] = useState<BDT | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const {getBDT, loading} = useBdt();
    const {getAllEntreprises, entreprises} = useEntreprise();
    const theme = useTheme();

    useEffect(() => {
        const fetchBdt = async () => {
            if (id) {
                const data = await getBDT(parseInt(id));
                setBdtData(data);
            }
        };

        const fetchEntreprises = async () => {
            getAllEntreprises();
        }

        fetchBdt();
        fetchEntreprises();
    }, [id]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
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
        <Box sx={{p: {xs: 2, md: 3}, mx: "auto"}}>
            {/* Header with main BDT info */}
            <HeaderCard elevation={3}>
                <Grid container spacing={3}>
                    <Grid xs={12} md={1}>
                        <StyledAvatar>
                            <Assignment fontSize="large"/>
                        </StyledAvatar>
                    </Grid>
                    <Grid xs={12} md={9}>
                        <Typography variant="h4" fontWeight="bold">
                            Bon de Travail #{bdtData.id}
                        </Typography>
                        <Typography variant="h6" sx={{mt: 1, opacity: 0.9}}>
                            {bdtData.nom || "Sans titre"}
                        </Typography>
                        <Box sx={{display: "flex", flexWrap: "wrap", gap: 1, mt: 2}}>
                            {bdtData.entrepriseExterieure && (
                                <Chip
                                    icon={<Business sx={{color: 'white !important'}}/>}
                                    label={`Entreprise extérieure: ${bdtData.entrepriseExterieure.nom || "N/A"}`}
                                    sx={{color: theme.palette.background.paper}}
                                    variant="outlined"
                                />
                            )}
                            {bdtData.chantier && (
                                <Chip
                                    icon={<Engineering sx={{color: 'white !important'}}/>}
                                    label={`Chantier: ${bdtData.chantier.nom || "N/A"}`}
                                    variant="outlined"
                                    sx={{color: theme.palette.background.paper}}
                                />
                            )}
                        </Box>
                    </Grid>
                    <Grid xs={12} md={2} sx={{textAlign: {xs: "left", md: "right"}}}>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<Edit/>}
                            onClick={() => navigate(getRoute('EDIT_BDT', {id: bdtData.id}))}
                        >
                            Modifier
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Print/>}
                            sx={{mt: 1, color: 'white', borderColor: 'white'}}
                        >
                            Imprimer
                        </Button>
                    </Grid>
                </Grid>
            </HeaderCard>

            {/* Tabs for detailed information */}
            <Paper sx={{borderRadius: "16px", overflow: "hidden", mb: 4}}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    textColor="primary"
                    indicatorColor="primary"
                    aria-label="bdt tabs"
                >
                    <Tab icon={<Warning/>} label="Risques"/>
                    <Tab icon={<VerifiedUser/>} label="Audit Sécurité"/>
                    <Tab icon={<Note/>} label="Compléments"/>
                    <Tab icon={<Assignment/>} label="Signatures"/>
                </Tabs>

                {/* Risques Tab */}
                <TabPanel value={tabValue} index={0}>
                    <SectionTitle variant="h5">Risques identifiés</SectionTitle>
                    <Grid container spacing={3}>
                        {bdtData.risques && bdtData.risques.length > 0 ? (
                            bdtData.risques.map((risque, index) => (
                                <Grid item xs={12} md={6} key={risque.id || index}>
                                    <ItemCard elevation={2}>
                                        <CardContent>
                                            <Box sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }}>
                                                <Box sx={{display: "flex", alignItems: "center"}}>
                                                    <Avatar
                                                        sx={{bgcolor: risque.answer ? "error.main" : "grey.500", mr: 2}}
                                                        src={risque.risque?.logo ?
                                                            `data:${risque.risque.logo.mimeType};base64,${risque.risque.logo.imageData}` :
                                                            undefined}
                                                    >
                                                        <Warning/>
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="h6">
                                                            {risque.risque?.title || `Risque #${risque.id}`}
                                                        </Typography>
                                                        <Chip
                                                            size="small"
                                                            label={risque.answer ? "Applicable" : "Non applicable"}
                                                            color={risque.answer ? "error" : "default"}
                                                            sx={{mt: 1}}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Box>

                                            {risque.risque_id?.description && (
                                                <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                                                    {risque.risque.description}
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </ItemCard>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Typography variant="body1" color="text.secondary" sx={{textAlign: "center"}}>
                                    Aucun risque associé à ce bon de travail
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </TabPanel>

                {/* Audit Sécurité Tab */}
                <TabPanel value={tabValue} index={1}>
                    <SectionTitle variant="h5">Audits de sécurité</SectionTitle>
                    <Grid container spacing={3}>
                        {bdtData.auditSecu && bdtData.auditSecu.length > 0 ? (
                            bdtData.auditSecu.map((audit, index) => (
                                <Grid item xs={12} md={6} key={audit.id || index}>
                                    <ItemCard elevation={2}>
                                        <CardContent>
                                            <Box sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }}>
                                                <Box sx={{display: "flex", alignItems: "center"}}>
                                                    <Avatar
                                                        sx={{bgcolor: audit.answer ? "success.main" : "grey.500", mr: 2}}
                                                    >
                                                        <VerifiedUser/>
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="h6">
                                                            {audit.auditSecu?.title || `Audit #${audit.id}`}
                                                        </Typography>
                                                        <Chip
                                                            size="small"
                                                            label={audit.answer ? "Validé" : "Non validé"}
                                                            color={audit.answer ? "success" : "default"}
                                                            sx={{mt: 1}}
                                                        />
                                                    </Box>
                                                </Box>
                                            </Box>

                                            {audit.auditSecu?.description && (
                                                <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
                                                    {audit.auditSecu.description}
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </ItemCard>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Typography variant="body1" color="text.secondary" sx={{textAlign: "center"}}>
                                    Aucun audit de sécurité associé à ce bon de travail
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </TabPanel>

                {/* Compléments Tab */}
                <TabPanel value={tabValue} index={2}>
                    <SectionTitle variant="h5">Compléments ou rappels</SectionTitle>
                    <Grid container spacing={3}>
                        {bdtData.complementOuRappels && bdtData.complementOuRappels.length > 0 ? (
                            bdtData.complementOuRappels.map((complement, index) => (
                                <Grid item xs={12} key={index}>
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
                            <Grid item xs={12}>
                                <Typography variant="body1" color="text.secondary" sx={{textAlign: "center"}}>
                                    Aucun complément ou rappel associé à ce bon de travail
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </TabPanel>

                {/* Signatures Tab */}
                <TabPanel value={tabValue} index={3}>
                    <SectionTitle variant="h5">Signatures</SectionTitle>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <InfoCard elevation={2}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Chargé de travail
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    {bdtData.signatureChargeDeTravail ? (
                                        <Box>
                                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                                <Avatar sx={{ mr: 2 }}>
                                                    <Engineering />
                                                </Avatar>
                                                <Typography variant="body1">
                                                    {bdtData.signatureChargeDeTravail.worker?.prenom} {bdtData.signatureChargeDeTravail.worker?.nom}
                                                </Typography>
                                            </Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Date de signature
                                            </Typography>
                                            <Typography variant="body2">
                                                {bdtData.signatureChargeDeTravail.date
                                                    ? dayjs(bdtData.signatureChargeDeTravail.date).format("DD/MM/YYYY HH:mm")
                                                    : "Non signé"}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Typography variant="body1" color="text.secondary">
                                            Non signé
                                        </Typography>
                                    )}
                                </CardContent>
                            </InfoCard>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InfoCard elevation={2}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Donneur d'ordre
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    {bdtData.signatureDonneurDOrdre ? (
                                        <Box>
                                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                                <Avatar sx={{ mr: 2 }}>
                                                    <Business />
                                                </Avatar>
                                                <Typography variant="body1">
                                                    {bdtData.signatureDonneurDOrdre.worker?.prenom} {bdtData.signatureDonneurDOrdre.worker?.nom}
                                                </Typography>
                                            </Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Date de signature
                                            </Typography>
                                            <Typography variant="body2">
                                                {bdtData.signatureDonneurDOrdre.date
                                                    ? dayjs(bdtData.signatureDonneurDOrdre.date).format("DD/MM/YYYY HH:mm")
                                                    : "Non signé"}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Typography variant="body1" color="text.secondary">
                                            Non signé
                                        </Typography>
                                    )}
                                </CardContent>
                            </InfoCard>
                        </Grid>
                    </Grid>
                </TabPanel>
            </Paper>

            {/* Footer with navigation buttons */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        bdtData.chantier?.id
                            ? navigate(getRoute('VIEW_CHANTIER', {id: bdtData.chantier.id}))
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