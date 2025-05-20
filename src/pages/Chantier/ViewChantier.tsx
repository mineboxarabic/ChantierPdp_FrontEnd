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
    IconButton, useTheme
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
    Business,
    CalendarMonth,
    Engineering,
    Group,
    LocationOn,
    Person,
    Phone,
    Email,
    Description,
    MoreVert,
    Warning,
    Build,
    Category,
    Assignment
} from "@mui/icons-material";
import useChantier from "../../hooks/useChantier.ts";
import Chantier from "../../utils/entities/Chantier.ts";
import { useParams, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import {getRoute} from "../../Routes.tsx";
import {mapChantierDTOToChantier} from "../../utils/mappers/ChantierMapper.ts";
import { ChantierDTO } from "../../utils/entitiesDTO/ChantierDTO.ts";
import useEntreprise, { getEntrepriseById } from "../../hooks/useEntreprise.ts";
import { EntrepriseDTO } from "../../utils/entitiesDTO/EntrepriseDTO.ts";
import { UserDTO } from "../../utils/entitiesDTO/UserDTO.ts";
import { getUserById } from "../../hooks/useUser.ts";
import { LocalisationDTO } from "../../utils/entitiesDTO/LocalisationDTO.ts";
import { getLocalisationById } from "../../hooks/useLocalisation.ts";
import { WorkerDTO } from "../../utils/entitiesDTO/WorkerDTO.ts";
import { getWorkersByChantier, getWorkersByEntreprise } from "../../hooks/useWoker.ts";
import { PdpDTO } from "../../utils/entitiesDTO/PdpDTO.ts";
import { BdtDTO } from "../../utils/entitiesDTO/BdtDTO.ts";
import { getPdpById } from "../../hooks/usePdp.ts";
import { getBDTById } from "../../hooks/useBdt.ts";

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
    padding: theme.spacing(3),
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

const RelatedCard = styled(Card)(({ theme }) => ({
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


interface dataToDisplay {
    entrepriseUtilisatrice?: EntrepriseDTO;
    entrepriseExterieurs?: EntrepriseDTO[];
    donneurDOrdre?: UserDTO;
    localisation?:LocalisationDTO;
    workers?: WorkerDTO[];
    pdps?: PdpDTO[];
    bdts?: BdtDTO[];
}

const ViewChantier: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [chantierData, setChantierData] = useState<ChantierDTO>();
    const [tabValue, setTabValue] = useState(0);
    const { loading, getChantier } = useChantier();
    const [dataToDisplay, setDataToDisplay] = useState<dataToDisplay>();
    const theme = useTheme();


    

    useEffect(() => {
        const fetchChantier = async () => {
            if (id) {
                const data:ChantierDTO = await getChantier(parseInt(id));
                console.log('dfiajdifj',data.entrepriseExterieurs)
                setChantierData(data);


                getEntrepriseById(data?.entrepriseUtilisatrice as number).then((res) => {
                    console.log("Entreprise Utilisatrice:", res);
                    setDataToDisplay((prevState) => ({
                        ...prevState,
                        entrepriseUtilisatrice: res.data,
                    }));
                });


                if (data.entrepriseExterieurs) {
                    const entreprisesPromises = data.entrepriseExterieurs.map((entrepriseId) => getEntrepriseById(entrepriseId));
                    const entreprises = await Promise.all(entreprisesPromises) as EntrepriseDTO[];
                    setDataToDisplay((prevState) => ({
                        ...prevState,
                        entrepriseExterieurs: entreprises,
                    }));
                }

                if (data.donneurDOrdre) {
                    const donneurDOrdre = await getUserById(data.donneurDOrdre as number);
                    setDataToDisplay((prevState) => ({
                        ...prevState,
                        donneurDOrdre: donneurDOrdre.data,
                    }));
                }

                if (data.localisation) {
                    const localisation = await getLocalisationById(data.localisation as number);
                    setDataToDisplay((prevState) => ({
                        ...prevState,
                        localisation: localisation.data,
                    }));
                }


                if (data) {
                    getWorkersByChantier(data.id as number).then((res) => {
                        console.log("Workers:", res);
                        setDataToDisplay((prevState) => ({
                            ...prevState,
                            workers: res.data,
                        }));
                    });
                }

                if (data.pdps) {
                    const pdpsPromises = data.pdps.map((pdpId) => getPdpById(pdpId));
                    const pdps = await Promise.all(pdpsPromises) as PdpDTO[];
                    setDataToDisplay((prevState) => ({
                        ...prevState,
                        pdps: pdps,
                    }));
                }

                if (data.bdts) {
                    const bdtsPromises = data.bdts.map((bdtId) => getBDTById(bdtId));
                    const bdts = await Promise.all(bdtsPromises) as BdtDTO[];
                    setDataToDisplay((prevState) => ({
                        ...prevState,
                        bdts: bdts,
                    }));
                }



            }
        };

        fetchChantier();

     
 

    }, [id]);

   
    useEffect(() => {
            console.log("Data to display:", dataToDisplay);

    }, [dataToDisplay]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <CircularProgress size={60} />
            </Box>
        );
    }
    if (!chantierData) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h5" color="error">
                    Chantier non trouvé
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate("/")}
                    sx={{ mt: 2 }}
                >
                    Retour à l'accueil
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: "1400px", mx: "auto" }}>
            {/* Header with main chantier info */}
            <HeaderCard elevation={3}>
                <Grid container spacing={3} alignItems="center">
                    <Grid size={{xs:12, md:1}}>
                        <StyledAvatar>
                            <Engineering fontSize="large" />
                        </StyledAvatar>
                    </Grid>
                    <Grid  size={{xs:12, md:9}}>
                        <Typography variant="h4" fontWeight="bold">
                            {chantierData.nom}
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 1, opacity: 0.9 }}>
                            {chantierData.operation}
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                            <Chip
                                icon={<CalendarMonth      sx={{color: 'white !important',}} />}
                                label={`Début: ${dayjs(chantierData.dateDebut).format("DD/MM/YYYY")}`}
                                sx={{
                                    color: theme.palette.background.paper
                                }}

                                variant="outlined"
                            />
                            <Chip
                                icon={<CalendarMonth
                                    sx={{
                                        color: 'white !important',
                                    }}


                                />}
                                label={`Fin: ${dayjs(chantierData.dateFin).format("DD/MM/YYYY")}`}

                                variant="outlined"
                                sx={{color: theme.palette.background.paper}}
                            />
                            <Chip
                                icon={<Group

                              sx={{
                                  color: 'white !important',
                              }}
                                />}
                                label={`Effectif Max: ${chantierData.effectifMaxiSurChantier || 0}`}
                                sx={{
                                    color: theme.palette.background.paper
                                }}
                                variant="outlined"
                            />
                            <Chip
                                icon={<Engineering      sx={{
                                    color: 'white !important',
                                }} />}
                                label={`Intérimaires: ${chantierData.nombreInterimaires || 0}`}
                                sx={{
                                    color: theme.palette.background.paper
                                }}

                                variant="outlined"
                            />
                        </Box>
                    </Grid>
                    <Grid  size={{xs:12, md:2}} sx={{ textAlign: { xs: "left", md: "right" } }}>
                        <Button variant="contained" color="primary"
                            onClick={()=>{
                                window.location.href = "/edit/chantier/" + id;
                            }}
                        >
                            Modifier
                        </Button>
                        <Button variant="outlined" sx={{ mt: 1 }}>
                            Exporter
                        </Button>
                    </Grid>
                </Grid>
            </HeaderCard>

            {/* General Info Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid  size={{xs:12, md:4}}>
                    <InfoCard elevation={2}>
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <Business color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Entreprise Utilisatrice</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            {dataToDisplay?.entrepriseUtilisatrice ? 
                            
                            (
                                <>
                                    <Typography variant="body1" fontWeight="bold">
                                        {dataToDisplay?.entrepriseUtilisatrice?.nom}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {dataToDisplay.entrepriseUtilisatrice.raisonSociale}
                                    </Typography>
                                    <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                        <Phone fontSize="small" sx={{ mr: 1 }} />
                                        {dataToDisplay.entrepriseUtilisatrice.numTel || "N/A"}
                                    </Typography>
                                </>
                            ) 
                            
                            : (
                                <Typography variant="body2" color="text.secondary">
                                    Aucune entreprise utilisatrice associée
                                </Typography>
                            )}
                        </CardContent>
                    </InfoCard>
                </Grid>

                <Grid  size={{xs:12, md:4}}>
                    <InfoCard elevation={2}>
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <Person color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Donneur d'Ordre</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            {dataToDisplay && dataToDisplay.donneurDOrdre ? (
                                <>
                                    <Typography variant="body1" fontWeight="bold">
                                        {dataToDisplay.donneurDOrdre.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {dataToDisplay.donneurDOrdre.fonction}
                                    </Typography>
                                    <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                        <Phone fontSize="small" sx={{ mr: 1 }} />
                                        {dataToDisplay.donneurDOrdre.notel || "N/A"}
                                    </Typography>
                                    <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                        <Email fontSize="small" sx={{ mr: 1 }} />
                                        {dataToDisplay.donneurDOrdre.email || "N/A"}
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Aucun donneur d'ordre associé
                                </Typography>
                            )}
                        </CardContent>
                    </InfoCard>
                </Grid>

                <Grid  size={{xs:12, md:4}}>
                    <InfoCard elevation={2}>
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <LocationOn color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Localisation</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            {dataToDisplay && dataToDisplay?.localisation ? (
                                <>
                                    <Typography variant="body1" fontWeight="bold">
                                        {dataToDisplay?.localisation?.nom}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Code: {dataToDisplay.localisation.code}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        {dataToDisplay.localisation.description}
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Aucune localisation associée
                                </Typography>
                            )}
                        </CardContent>
                    </InfoCard>
                </Grid>
            </Grid>

            {/* Tabs for detailed information */}
            <Paper sx={{ borderRadius: "16px", overflow: "hidden", mb: 4 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    textColor="primary"
                    indicatorColor="primary"
                    aria-label="chantier tabs"
                >
                    <Tab icon={<Business />} label="Entreprises" />
                    <Tab icon={<Person />} label="Intervenants" />
                    <Tab icon={<Description />} label="Documents" />
                </Tabs>

                {/* Entreprises Tab */}
                <TabPanel value={tabValue} index={0}>
                    <SectionTitle variant="h5">Entreprises externes</SectionTitle>
                    <Grid container spacing={3}>
                        {dataToDisplay && dataToDisplay.entrepriseExterieurs && dataToDisplay.entrepriseExterieurs.length > 0 ? (
                            dataToDisplay.entrepriseExterieurs.map((entreprise, index) => (
                                
                                <Grid  size={{xs:12, md:6, lg:4}} key={entreprise.id || index}>
                                    <RelatedCard elevation={2}>
                                        <CardContent>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                    <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                                                        <Business />
                                                    </Avatar>
                                                    <Typography variant="h6" noWrap sx={{ maxWidth: 200 }}>
                                                        {entreprise?.nom || "Entreprise Externe"}
                                                    </Typography>
                                                </Box>
                                                <IconButton size="small">
                                                    <MoreVert />
                                                </IconButton>
                                            </Box>
                                            <Divider sx={{ my: 1.5 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {entreprise?.raisonSociale || "N/A"}
                                            </Typography>
                                            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                                <Phone fontSize="small" sx={{ mr: 1 }} />
                                                {entreprise?.numTel || "N/A"}
                                            </Typography>
                                            <Box sx={{ mt: 2 }}>
                                                <Chip
                                                    size="small"
                                                    label={ entreprise.type || "EE"}
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </CardContent>
                                    </RelatedCard>
                                </Grid>
                            ))
                        ) : (
                            <Grid size={{xs:12}}>
                                <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center" }}>
                                    Aucune entreprise externe associée à ce chantier
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </TabPanel>

                {/* Intervenants Tab */}
                <TabPanel value={tabValue} index={1}>
                    <SectionTitle variant="h5">Intervenants sur le chantier</SectionTitle>
                    <Grid container spacing={3}>
                        {dataToDisplay && dataToDisplay.workers && dataToDisplay.workers.length > 0 ? (
                            dataToDisplay.workers.map((worker, index) => (
                                <Grid  size={{xs:12, md:6, lg:4}} key={worker.id || index}>
                                    <RelatedCard elevation={2}>
                                        <CardContent>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                    <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
                                                        <Person />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="h6" noWrap sx={{ maxWidth: 200 }}>
                                                            {worker.nom || "Intervenant"}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {worker.prenom || "N/A"}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <IconButton size="small">
                                                    <MoreVert />
                                                </IconButton>
                                            </Box>
                                            <Divider sx={{ my: 1.5 }} />
                                           {/* <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                                <Email fontSize="small" sx={{ mr: 1 }} />
                                                {worker.|| "N/A"}
                                            </Typography>
                                            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                                <Phone fontSize="small" sx={{ mr: 1 }} />
                                                {worker.|| "N/A"}
                                            </Typography>*/}
                                        </CardContent>
                                    </RelatedCard>
                                </Grid>
                            ))
                        ) : (
                            <Grid size={{xs:12}}>
                                <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center" }}>
                                    Aucun intervenant associé à ce chantier
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </TabPanel>

                {/* Documents Tab */}
                <TabPanel value={tabValue} index={2}>
                    <Grid container spacing={4}>
                        {/* PDPs Section */}
                        <Grid size={{xs:12, md:6}}>
                            <SectionTitle variant="h5">Plans de Prévention</SectionTitle>
                            <List sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}>
                                {dataToDisplay && dataToDisplay.pdps && dataToDisplay.pdps.length > 0 ? (
                                    dataToDisplay.pdps.map((pdp, index) => (
                                        <React.Fragment key={pdp.id || index}>
                                            <ListItem
                                                secondaryAction={
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() => navigate(getRoute('VIEW_PDP',{id: pdp.id}))}
                                                    >
                                                        Voir
                                                    </Button>
                                                }
                                            >
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: "error.main" }}>
                                                        <Warning />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={`Plan de Prévention #${pdp.id}`}
                                                    secondary={
                                                        <React.Fragment>
                                                            <Typography variant="body2" component="span">
                                                                {pdp.dateInspection
                                                                    ? `Inspection: ${dayjs(pdp.dateInspection).format("DD/MM/YYYY")}`
                                                                    : "Pas de date d'inspection"}
                                                            </Typography>
                                                        </React.Fragment>
                                                    }
                                                />
                                            </ListItem>
                                            {index < (chantierData.pdps?.length || 0) - 1 && <Divider variant="inset" component="li" />}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <ListItem>
                                        <ListItemText
                                            primary="Aucun PDP"
                                            secondary="Aucun plan de prévention n'est associé à ce chantier"
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </Grid>

                        {/* BDTs Section */}
                        <Grid size={{xs:12, md:6}}>
                            <SectionTitle variant="h5">Bons De Travail</SectionTitle>
                            <List sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}>
                                {dataToDisplay && dataToDisplay.bdts && dataToDisplay.bdts.length > 0 ? (
                                    dataToDisplay.bdts.map((bdt, index) => (
                                        <React.Fragment key={bdt.id || index}>
                                            <ListItem
                                                secondaryAction={
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() => navigate(`/create/bdt/${bdt.id}/1`)}
                                                    >
                                                        Voir
                                                    </Button>
                                                }
                                            >
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: "info.main" }}>
                                                        <Assignment />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={bdt.nom || `Bon de Travail #${bdt.id}`}
                                                    secondary={
                                                        <React.Fragment>
                                                            <Typography variant="body2" component="span">
                                                                {/* {bdt.risques?.length || 0} risques identifiés */}
                                                                risques number todo find it
                                                            </Typography>
                                                        </React.Fragment>
                                                    }
                                                />
                                            </ListItem>
                                            {index < (chantierData.bdts?.length || 0) - 1 && <Divider variant="inset" component="li" />}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <ListItem>
                                        <ListItemText
                                            primary="Aucun BDT"
                                            secondary="Aucun bon de travail n'est associé à ce chantier"
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </Grid>
                    </Grid>
                </TabPanel>
            </Paper>

            {/* Actions Footer */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ mr: 2 }}
                    onClick={() => navigate("/")}
                >
                    Retour
                </Button>
                <Button variant="contained" color="primary">
                    Gérer le chantier
                </Button>
            </Box>
        </Box>
    );
};

export default ViewChantier;