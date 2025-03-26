import {
    Box,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography,
    Button,
    Modal,
    Divider,
    FormControlLabel,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { DatePicker } from "@mui/x-date-pickers";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import TitleHeading from "../../components/TitleHeading.tsx";
import AddButtonComponent from "../../components/AddButtonComponent.tsx";
import SelectEntreprise from "../../components/Entreprise/SelectEntreprise.tsx";
import SelectOrCreateEntreprise from "../../components/Pdp/SelectOrCreateEntreprise.tsx";
import { Entreprise } from "../../utils/entreprise/Entreprise.ts";
import useEntreprise from "../../hooks/useEntreprise.ts";
import { Pdp } from "../../utils/pdp/Pdp.ts";
import MiseEnDisposition from "../../utils/pdp/MiseEnDisposition.ts";
import defaultImage from "../../assets/default_entreprise_image.png";

interface StepsProps {
    currentPdp: Pdp | null;
    saveCurrentPdp: (pdp: Pdp) => void;
    save?: (pdp: Pdp) => void;
    setIsChanged: (isChanged: boolean) => void;
}

const Step2 = ({ currentPdp, save, saveCurrentPdp, setIsChanged }: StepsProps) => {
    const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
    const { getAllEntreprises } = useEntreprise();
    const [openCreateEntreprise, setOpenCreateEntreprise] = useState(false);

    useEffect(() => {
        getAllEntreprises().then((response: Entreprise[]) => {
            setEntreprises(response);
        });
    }, []);

    return (
        <Box sx={{ padding: 3, width:'100%' }}>
            {/* Section 1: Inspection Commune Préalable */}
            <TitleHeading title="Inspection Commune Préalable" severity="indecation" />
            <Grid container sx={{p:1}} spacing={2} alignItems="center">
                <Typography sx={{marginBottom:2}}>Effectuée le</Typography>

                <Grid size={{xs:12, md:3}}  >
                    <DatePicker
                        label="Date de l'inspection"
                        value={dayjs(currentPdp?.dateInspection)}
                        onChange={(date) => {
                            if (date) saveCurrentPdp({ ...currentPdp, dateInspection: date.toDate() });
                            setIsChanged(true);
                        }}
                        sx={{ width: "100%" }}
                    />
                </Grid>
                <Typography>Par</Typography>

                <Grid size={{xs:12, md:3}}>
                    <SelectEntreprise
                        entreprises={entreprises}
                        selectedEntrepriseId={currentPdp?.entrepriseDInspection?.id as number}
                        onSelectEntreprise={(entreprise) => {
                            if (entreprise) {
                                saveCurrentPdp({ ...currentPdp, entrepriseDInspection: entreprise });
                                setIsChanged(true);
                            }
                        }}
                        label=""
                    />
                </Grid>
            </Grid>

            {/* Section 2: Mises à Disposition */}
            <TitleHeading title="Mises à Disposition par Danone" severity="indecation" />
            <Grid container spacing={2}>
                {[
                    { label: "Vestiaires et douche", key: "vestiaires" },
                    { label: "Sanitaires", key: "sanitaires" },
                    { label: "Restaurant d'entreprise et cafétéria", key: "restaurant" },
                    { label: "Énergie", key: "energie" },
                ].map((item) => (
                    <Grid key={item.key} size={{xs:12, md:3}}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={currentPdp?.misesEnDisposition?.[item.key] || false}
                                    onChange={(e) => {
                                        if (currentPdp) {
                                            saveCurrentPdp({
                                                ...currentPdp,
                                                misesEnDisposition: {
                                                    ...currentPdp.misesEnDisposition,
                                                    [item.key]: e.target.checked,
                                                } as MiseEnDisposition,
                                            });
                                            setIsChanged(true);
                                        }
                                    }}
                                />
                            }
                            label={item.label}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Section 3: Médecin du Travail */}
            <TitleHeading title="Médecin du Travail Entreprise Utilisatrice" severity="indecation" />
            <Box sx={{ mb: 2 }}>
                <Typography variant="body1"><strong>Nom:</strong> Dr Jeremy GAUDEL</Typography>
                <Typography variant="body2">Impasse du pan perdu - ZI les verchères, 38540 St Just Chaleyssin</Typography>
            </Box>

            <TitleHeading title="Médecin du Travail Entreprise Extérieure" severity="indecation" />
            <Grid container spacing={2} p={2}>
                <Grid size={{xs:12, md:6}}>
                    <TextField
                        label="Nom du Médecin"
                        fullWidth
                        value={currentPdp?.medecinDuTravailleEE?.nom || ""}
                        onChange={(e) => {
                            if (currentPdp) {
                                saveCurrentPdp({ ...currentPdp, medecinDuTravailleEE: { ...currentPdp.medecinDuTravailleEE, nom: e.target.value } });
                                setIsChanged(true);
                            }
                        }}
                    />
                </Grid>
                <Grid size={{xs:12, md:6}}>
                    <TextField
                        label="Tel"
                        fullWidth
                        value={currentPdp?.medecinDuTravailleEE?.noTel || ""}
                        onChange={(e) => {
                            if (currentPdp) {
                                saveCurrentPdp({ ...currentPdp, medecinDuTravailleEE: { ...currentPdp.medecinDuTravailleEE, noTel: e.target.value } });
                                setIsChanged(true);
                            }
                        }}
                    />
                </Grid>
            </Grid>

            {/* Section 4: Sous-Traitants */}
            <TitleHeading title="Information sur les Sous-Traitants" severity="indecation" />
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Raison Sociale</TableCell>
                            <TableCell>Fonction</TableCell>
                            <TableCell>Téléphone</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentPdp?.sousTraitants && currentPdp?.sousTraitants.length > 0 ? currentPdp?.sousTraitants?.map((sousTraitant, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Avatar
                                        src={sousTraitant?.image
                                            ? `data:${sousTraitant.image.mimeType};base64,${sousTraitant.image.imageData}`
                                            : defaultImage
                                        }
                                        alt="Sous Traitant"
                                        sx={{ width: 60, height: 60 }}
                                    />
                                </TableCell>
                                <TableCell>{sousTraitant.raisonSociale}</TableCell>
                                <TableCell>{sousTraitant.fonction}</TableCell>
                                <TableCell>{sousTraitant.numTel}</TableCell>
                            </TableRow>
                        ))
                            :
                            <TableRow>
                                <TableCell colSpan={4} align="center">Pas de Sous-Traitants</TableCell>
                            </TableRow>


                        }
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Sous-Traitant */}

            <AddButtonComponent openModal={setOpenCreateEntreprise} text={"+ Ajouter Sous-Traitant"} style={{
                borderRadius: 2,
            }}/>
            <SelectOrCreateEntreprise open={openCreateEntreprise} setIsChanged={setIsChanged} setOpen={setOpenCreateEntreprise} savePdp={saveCurrentPdp} currentPdp={currentPdp as Pdp} where="sousTraitants" />
        </Box>
    );
};

export default Step2;
