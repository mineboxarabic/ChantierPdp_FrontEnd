import Section from "../../components/Section.tsx";
import Typography from "@mui/material/Typography";
import TitleHeading from "../../components/TitleHeading.tsx";
import {Box, Checkbox, FormControlLabel} from "@mui/material";
import Grid from '@mui/material/Grid2';
import {TextField} from "@mui/material";
import EntrepriseAddButton from "../../components/EntrepriseAddButton.tsx";
import {DatePicker} from "@mui/x-date-pickers";
import {HorizontalBox, VerticalBox} from "../../components/Layout/Layouts.tsx";
import BottomToolBar from "../../components/Steps/BottomToolBar.tsx";
import Cas from "../../components/static/Cas.tsx";
import Button from "@mui/material/Button";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
const Step2 = () => {
    return (
        <>

            <Box sx={{ padding: 3 }}>
                {/* Section 1: Inspection */}

                <TitleHeading title={"Inspection Commune Préalable"} severity={"indecation"} />
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{xs:12, md:1.5}}>
                            <Typography>Effectuée le</Typography>
                    </Grid>
                    <Grid size={{xs:12, md:3}}>
                        <DatePicker />
                    </Grid>
                    <Grid size={{xs:12, md:0.5}}>
                        <Typography>Par</Typography>
                    </Grid>
                    <Grid size={{xs:12, md:3}}>
                        <TextField label="l'entreprise extérieure" fullWidth />
                    </Grid>
                </Grid>



                {/* Section 2: Mises à Disposition */}

                <TitleHeading title={"MISES A DISPOSITION PAR DANONE"} severity={"indecation"} />

                <Grid container spacing={2}>
                    <Grid>
                        <FormControlLabel control={<Checkbox />} label="Vestiaires et douche" />
                    </Grid>
                    <Grid>
                        <FormControlLabel control={<Checkbox />} label="Sanitaires" />
                    </Grid>
                    <Grid>
                        <FormControlLabel control={<Checkbox />} label="Restaurant d'entreprise et cafétéria" />
                    </Grid>
                    <Grid>
                        <FormControlLabel control={<Checkbox />} label="Energie" />
                    </Grid>
                </Grid>

                {/* Section 3: Médecin du Travail */}

                <TitleHeading title={"MEDECIN DU TRAVAIL ENTREPRISE UTILISATRICE"} severity={"indecation"} />

                <Box sx={{ mb: 2 }}>
                    <Typography>NOM : Dr Jeremy GAUDEL</Typography>
                    <Typography>
                        Impasse du pan perdu - ZI les verchères <br /> 38540 St Just Chaleyssin
                    </Typography>
                </Box>


                <TitleHeading title={"MEDECIN DU TRAVAIL ENTREPRISE EXTERIEURE"} severity={"indecation"} />

                <Grid container spacing={2}>
                    <Grid size={{xs:12, md:6}}>
                        <TextField label="Nom du Médecin" fullWidth />
                    </Grid>
                    <Grid size={{xs:12, md:6}}>
                        <TextField label="Tel" fullWidth />
                    </Grid>
                </Grid>

                {/* Section 4: Prévenir */}
                <Grid container spacing={2} sx={{ mt: 4 }}>
                    <Grid size={{xs:12, md:4}}>

                        <TitleHeading title={"PREVENIR CSSCT"}  severity={"indecation"} />


                        <DatePicker label={"Date de la réunion CSSCT"}  sx={{width:"100%", mt:1}} />

                    </Grid>
                    <Grid size={{xs:12, md:8}}>

                        <TitleHeading title={"PREVENIR SERVICE OU A LIEU D’INTERVENTION"} severity={"indecation"} />



                        <DatePicker label={"Date de la réunion CSSCT"} sx={{width:"100%", mt:1}} />
                    </Grid>
                </Grid>

                {/* Section 5: Information sur Sous-Traitants */}

                <TitleHeading title={"INFORMATION SUR LES SOUS TRAITANTS DES EE SIGNATURES DU PDP"} severity={"indecation"} />

                <Grid container spacing={2} alignItems={"center"}>
                    <Grid size={{xs:12, md:1}}>
                        <AccountCircleIcon sx={{ fontSize: 60 }}/>
                    </Grid>
                    <Grid size={{xs:12, md:2}}>
                        <TextField label="Raison Sociale" fullWidth />
                    </Grid>
                    <Grid size={{xs:12, md:3}}>
                        <TextField label="Adresse" fullWidth />
                    </Grid>
                    <Grid size={{xs:12, md:3}}>
                        <TextField label="Téléphone" fullWidth />
                    </Grid>
                    <Grid size={{xs:12, md:3}}>
                        <TextField label="Travaux Sous Traités" fullWidth />
                    </Grid>
                </Grid>

                {/* Add Button */}
                <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{ mt: 4, textTransform: "none" }}
                >
                    +
                </Button>
            </Box>
        </>
    )
}
export default Step2;