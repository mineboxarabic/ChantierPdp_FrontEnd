import Section from "../../components/Section.tsx";
import Typography from "@mui/material/Typography";
import TitleHeading from "../../components/TitleHeading.tsx";
import {
    Box,
    Checkbox,
    FormControlLabel,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import {TextField} from "@mui/material";
import EntrepriseAddButton from "../../components/EntrepriseAddButton.tsx";
import {DatePicker} from "@mui/x-date-pickers";
import {HorizontalBox, VerticalBox} from "../../components/Layout/Layouts.tsx";
import BottomToolBar from "../../components/Steps/BottomToolBar.tsx";
import Cas from "../../components/static/Cas.tsx";
import Button from "@mui/material/Button";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {Pdp} from "../../utils/pdp/Pdp.ts";
import {useEffect, useState} from "react";
import {Entreprise} from "../../utils/entreprise/Entreprise.ts";
import useEntreprise from "../../hooks/useEntreprise.ts";
import SelectEntreprise from "../../components/Entreprise/SelectEntreprise.tsx";
import dayjs from "dayjs";
import MiseEnDisposition from "../../utils/pdp/MiseEnDisposition.ts";
import SelectOrCreateEntreprise from "../../components/Pdp/SelectOrCreateEntreprise.tsx";
import defaultImage from "../../assets/default_entreprise_image.png";
interface StepsProps {
    currentPdp: Pdp | null
    saveCurrentPdp: (pdp: Pdp) => void
    save?: (pdp: Pdp) => void
    setIsChanged: (isChanged: boolean) => void
}

const Step2 =({currentPdp, save,saveCurrentPdp, setIsChanged}:StepsProps) => {

    const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
    const {getAllEntreprises} = useEntreprise();

    const [openCreateEntreprise, setOpenCreateEntreprise] = useState(false);


    useEffect(() => {
        getAllEntreprises().then((response: Entreprise[]) => {
            setEntreprises(response);
        });
    }, []);

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
                        <DatePicker
                            label={"Date de l'inspection"}
                            value={dayjs(currentPdp?.dateInspection) }
                            onChange={(date) => {
                                if(date) saveCurrentPdp({...currentPdp, dateInspection: date.toDate()});
                                setIsChanged(true);
                            }}
                        />
                    </Grid>
                    <Grid size={{xs:12, md:0.5}}>
                        <Typography>Par</Typography>
                    </Grid>
                    <Grid size={{xs:12, md:3}}>

                        <SelectEntreprise entreprises={entreprises} selectedEntrepriseId={currentPdp?.entrepriseDInspection?.id as number} onSelectEntreprise={
                            (entreprise: Entreprise | null) => {
                                if(entreprise) {
                                    console.log("Selected Entreprise", entreprise);
                                    saveCurrentPdp({...currentPdp, entrepriseDInspection: entreprise});
                                }
                                setIsChanged(true);
                            }
                        } label={""}/>

                    </Grid>
                </Grid>



                {/* Section 2: Mises à Disposition */}

                <TitleHeading title={"MISES A DISPOSITION PAR DANONE"} severity={"indecation"} />

                <Grid container spacing={2}>
                    <Grid>
                        <FormControlLabel control={<Checkbox
                            checked={currentPdp?.misesEnDisposition?.vestiaires || false}
                            onChange={(e) => {
                                if(currentPdp){
                                    saveCurrentPdp({...currentPdp, misesEnDisposition: {...currentPdp.misesEnDisposition, vestiaires: e.target.checked} as MiseEnDisposition});
                                    setIsChanged(true);
                                }

                            }}
                        />} label="Vestiaires et douche" />
                    </Grid>
                    <Grid>
                        <FormControlLabel control={<Checkbox

                        checked={currentPdp?.misesEnDisposition?.sanitaires || false}
                        onChange={(e) => {
                            if(currentPdp){
                                saveCurrentPdp({...currentPdp, misesEnDisposition: {...currentPdp.misesEnDisposition, sanitaires: e.target.checked} as MiseEnDisposition});
                                setIsChanged(true);
                            }

                        }}

                        />} label="Sanitaires" />
                    </Grid>
                    <Grid>
                        <FormControlLabel control={<Checkbox
                        checked={currentPdp?.misesEnDisposition?.restaurant || false}
                        onChange={(e) => {
                            if(currentPdp){
                                saveCurrentPdp({...currentPdp, misesEnDisposition: {...currentPdp.misesEnDisposition, restaurant: e.target.checked} as MiseEnDisposition});
                                setIsChanged(true);
                            }

                        }}

                        />} label="Restaurant d'entreprise et cafétéria" />
                    </Grid>
                    <Grid>
                        <FormControlLabel control={<Checkbox
                        checked={currentPdp?.misesEnDisposition?.energie || false}
                        onChange={(e) => {
                            if(currentPdp){
                                saveCurrentPdp({...currentPdp, misesEnDisposition: {...currentPdp.misesEnDisposition, energie: e.target.checked} as MiseEnDisposition});
                                setIsChanged(true);
                            }

                        }}
                        />} label="Energie" />
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
                        <TextField
                                value={currentPdp?.medecinDuTravailleEE?.nom || ""}
                                onChange={(e) => {
                                    if(currentPdp){
                                        saveCurrentPdp({...currentPdp, medecinDuTravailleEE: {...currentPdp.medecinDuTravailleEE, nom: e.target.value}});
                                        setIsChanged(true);
                                    }
                                }}

                            label="Nom du Médecin" fullWidth />
                    </Grid>
                    <Grid size={{xs:12, md:6}}>
                        <TextField
                            value={currentPdp?.medecinDuTravailleEE?.noTel || ""}
                            onChange={(e) => {
                                if(currentPdp){
                                    saveCurrentPdp({...currentPdp, medecinDuTravailleEE: {...currentPdp.medecinDuTravailleEE, noTel: e.target.value}});
                                    setIsChanged(true);
                                }
                            }}
                            label="Tel" fullWidth />
                    </Grid>
                </Grid>

                {/* Section 4: Prévenir */}
                <Grid container spacing={2} sx={{ mt: 4 }}>
                    <Grid size={{xs:12, md:4}}>

                        <TitleHeading  title={"PREVENIR CSSCT"}  severity={"indecation"} />


                        <DatePicker

                            value={dayjs(currentPdp?.datePrevenirCSSCT) }
                            onChange={(date) => {
                                if(date) saveCurrentPdp({...currentPdp, datePrevenirCSSCT: date.toDate()});
                                setIsChanged(true);
                            }}

                            label={"Date de la réunion CSSCT"}  sx={{width:"100%", mt:1}} />

                    </Grid>
                    <Grid size={{xs:12, md:8}}>

                        <TitleHeading title={"PREVENIR SERVICE OU A LIEU D’INTERVENTION"} severity={"indecation"} />



                        <DatePicker
                            value={dayjs(currentPdp?.datePrev) }
                            onChange={(date) => {
                                if(date) saveCurrentPdp({...currentPdp, datePrev: date.toDate()});
                                setIsChanged(true);
                            }}
                            label={"Date de la réunion CSSCT"} sx={{width:"100%", mt:1}} />
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

                    {
                        currentPdp?.sousTraitants && (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Image</TableCell>
                                            <TableCell>Raison Sociale</TableCell>
                                            <TableCell>Fonction</TableCell>
                                            <TableCell>Numéro de Téléphone</TableCell>
                                            <TableCell>Raison Sociale</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {currentPdp.sousTraitants.map((sousTraitant: Entreprise, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <img
                                                        src={
                                                            sousTraitant?.image
                                                                ? `data:${sousTraitant.image.mimeType};base64,${sousTraitant.image.imageData}`
                                                                : defaultImage
                                                        }
                                                        alt="Sous Traitant"
                                                        style={{ width: "100px", height: "auto" }}
                                                    />
                                                </TableCell>
                                                <TableCell>{sousTraitant.raisonSociale}</TableCell>
                                                <TableCell>{sousTraitant.fonction}</TableCell>
                                                <TableCell>{sousTraitant.numTel}</TableCell>
                                                <TableCell>{sousTraitant.raisonSociale}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )
                    }

                    <SelectOrCreateEntreprise open={openCreateEntreprise} setOpen={setOpenCreateEntreprise} savePdp={save} currentPdp={currentPdp} where={'sousTraitants'}/>

                </Grid>

                {/* Add Button */}
                <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{ mt: 4, textTransform: "none" }}
                    onClick={() => setOpenCreateEntreprise(true)}
                >
                    +
                </Button>
            </Box>
        </>
    )
}
export default Step2;