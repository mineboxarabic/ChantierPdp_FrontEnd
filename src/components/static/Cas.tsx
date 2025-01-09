import {Box, Card, Grid, Typography} from "@mui/material";
import CardContent from '@mui/material/CardContent';
import {HorizontalBox} from "../Layout/Layouts.tsx";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PhoneIcon from "@mui/icons-material/Phone";
import FireExtinguisherIcon from "@mui/icons-material/FireExtinguisher";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
const Cas = () => {
    return (
        <Box sx={{ padding: 2 }}>
            <Grid container spacing={3}>
                {/* In Case of Accident */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: "bold" }}>
                                EN CAS D'ACCIDENT
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                                <LocalHospitalIcon color="error" sx={{ fontSize: 40 }} />
                                <Typography variant="body1" sx={{ ml: 2 }}>
                                    INFIRMERIE <br />
                                    <strong>en interne:</strong> 1100 <br />
                                    <strong>en externe:</strong> 04.72.70.11.00
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                                <PhoneIcon color="success" sx={{ fontSize: 40 }} />
                                <Typography variant="body1" sx={{ ml: 2 }}>
                                    Poste de garde <br />
                                    <strong>en interne:</strong> 1420 <br />
                                    Pour tout problème.
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* In Case of Fire */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: "#d32f2f", fontWeight: "bold" }}>
                                EN CAS D'INCENDIE
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                                <FireExtinguisherIcon color="error" sx={{ fontSize: 40 }} />
                                <Typography variant="body1" sx={{ ml: 2 }}>
                                    Poste de garde <br />
                                    <strong>en interne:</strong> 1420 <br />
                                    <strong>en externe:</strong> 04.72.70.12.12
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Alarms */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: "#388e3c", fontWeight: "bold" }}>
                                ALARMES
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                                <NotificationsActiveIcon color="warning" sx={{ fontSize: 40 }} />
                                <Typography variant="body1" sx={{ ml: 2 }}>
                                    <strong>Incendie:</strong> Sirène et message vocal <br />
                                    <strong>Évacuation:</strong> Regroupement sur la pelouse en face de la réception lait.
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                                <Typography variant="body1" sx={{ ml: 2 }}>
                                    <strong>Ammoniac:</strong> Sirène et texte. <br />
                                    Regroupement en salle danette (au-dessus du restaurant). <br />
                                    <strong>Appel équipe de deuxième intervention:</strong> Sirène et texte. Se rendre à l’atelier de maintenance condi et attendre les consignes.
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Typography
                variant="body2"
                sx={{
                    textAlign: "center",
                    color: "gray",
                    mt: 3,
                }}
            >
                LE CODE DU TRAVAIL ET LE CODE DE LA ROUTE SONT APPLICABLES DANS L'ENCEINTE DU SITE
            </Typography>
        </Box>
    );
}

export default Cas;