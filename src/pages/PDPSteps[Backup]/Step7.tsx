import TitleHeading from "../../components/TitleHeading.tsx";
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import { Pdp } from "../../utils/pdp/Pdp.ts";
import Section from "../../components/Section.tsx";
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

interface StepsProps {
    currentPdp: Pdp | null;
    saveCurrentPdp: (pdp: Pdp) => void;
    save?: (pdp: Pdp) => void;
    setIsChanged: (isChanged: boolean) => void;
}

const Step7 = ({ currentPdp, save, saveCurrentPdp, setIsChanged }: StepsProps) => {
    const sigPadRefs = useRef<(SignatureCanvas | null)[]>([]);
    const [signatures, setSignatures] = useState<string[]>(new Array(tableRows.length).fill(""));

    const clearSignature = (index: number) => {
        if (sigPadRefs.current[index]) {
            sigPadRefs.current[index]?.clear();
            const newSigs = [...signatures];
            newSigs[index] = "";
            setSignatures(newSigs);
        }
    };

    const saveSignature = (index: number) => {
        if (sigPadRefs.current[index]) {
            const newSigs = [...signatures];
            newSigs[index] = sigPadRefs.current[index]?.toDataURL() || "";
            setSignatures(newSigs);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 900, margin: "auto" }}>
            {sections.map((section, index) => (
                <Section
                    key={index}
                    title={section.title}
                    backgroundColor={section.bgColor}
                    padding={2}
                    sx={{ marginBottom: 2 }}
                >
                    <Typography variant="body2" dangerouslySetInnerHTML={{ __html: section.content }} />
                </Section>
            ))}

            <Section
                title="VALIDATION DU PLAN DE PREVENTION"
                backgroundColor="yellow"
                padding={2}
                sx={{
                    textAlign: "center",
                    border: "1px solid gray",
                }}
            >
                <Typography variant="body2">
                    L’EE certifie avoir fait connaître à L’ENSEMBLE DES SALARIÉS sous sa responsabilité TOUTES LES
                    INFORMATIONS du plan de prévention ainsi que les consignes HSE générales applicables sur le site de
                    DANONE.
                </Typography>
            </Section>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={3} align="center" sx={{ fontWeight: "bold", backgroundColor: "#e0e0e0" }}>
                                RESPONSABLE DE L’ENTREPRISE OU SON REPRESENTANT
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                            <TableRow >
                                <TableCell sx={{ fontWeight: "bold", backgroundColor: '#d0f0c0' }}>ENTREPRISE UTILISATRICE</TableCell>
                                <TableCell>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        placeholder="Nom et Visa"
                                        sx={{ bgcolor: "white" }}
                                    />
                                </TableCell>
                                <TableCell align="center" sx={{ border: "1px solid gray", width: "150px", height: "100px", bgcolor: "#f8f9fa", fontWeight: "bold", position: "relative" }}>
                                    <SignatureCanvas
                                        ref={(el) => (sigPadRefs.current[0] = el)}
                                        penColor="black"
                                        canvasProps={{ width: 150, height: 80, className: "sigCanvas" }}
                                    />
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                                        <Button size="small" onClick={() => clearSignature(0)}>Clear</Button>
                                        <Button size="small" onClick={() => saveSignature(0)}>Save</Button>
                                    </Box>
                                </TableCell>
                            </TableRow>


                        {
                            currentPdp?.entrepriseexterieure && currentPdp?.entrepriseexterieure.length > 0 && currentPdp?.entrepriseexterieure?.map((entreprise, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: "bold", backgroundColor: '#f8d7da' }}>{entreprise.nom}</TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="outlined"
                                            fullWidth
                                            placeholder="Nom et Visa" 
                                            sx={{ bgcolor: "white" }}
                                        />
                                    </TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid gray", width: "150px", height: "100px", bgcolor: "#f8f9fa", fontWeight: "bold", position: "relative" }}>
                                        <SignatureCanvas
                                            ref={(el) => (sigPadRefs.current[index + 1] = el)}
                                            penColor="black"
                                            canvasProps={{ width: 150, height: 80, className: "sigCanvas" }}
                                        />
                                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                                            <Button size="small" onClick={() => clearSignature(index + 1)}>Clear</Button>
                                            <Button size="small" onClick={() => saveSignature(index + 1)}>Save</Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))

                        }


                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Button variant="contained" color="primary" onClick={() => save && currentPdp && save(currentPdp)}>
                    Enregistrer
                </Button>
            </Box>
        </Box>
    );
};

const sections = [
    {
        title: "ACCES ET CIRCULATION SUR LE SITE",
        content:
            "<ul><li>VITESSE LIMITÉE À 20KM/H, RESPECT DU CODE DE LA ROUTE</li><li>STATIONNEMENT SUR PARKING</li><li>RESPECTER LES PASSAGES DE PORTES ET LES ALLÉES</li><li>RESPECTER LES VOIES SPÉCIFIQUES ENGINS.</li></ul>",
        bgColor: "#f0f8ff",
    },
    {
        title: "LOCALISATION DU CHANTIER",
        content:
            "L’EU INFORME DE LA PRÉSENCE DES AUTRES ENTREPRISES, DE LEURS ACTIVITÉS ET DES RISQUES QU’ELLES ENCOURENT. RESPECTER LES BALISAGES ET PROTECTIONS MIS EN PLACE.",
        bgColor: "#f8f9fa",
    },
    {
        title: "TRI DES DECHETS ET RISQUE POLLUTION",
        content:
            "<b>ISO 14001</b>. ENSEMBLE DES DÉCHETS SONT TRIÉS. RESPECTER LE TRI DES DÉCHETS ET EVACUER CEUX NON PRIS EN CHARGE.",
        bgColor: "#f0f8ff",
    },
    {
        title: "REGLES D’HYGIENE",
        content:
            "INTERDICTION DE MANGER HORS SALLE DE PAUSE. INTERDICTION DE FUMER EN DEHORS DES ESPACES RÉSERVÉS.",
        bgColor: "#f8f9fa",
    },
];

const tableRows = [
    { label: "ENTREPRISE UTILISATRICE", bgColor: "#d0f0c0" },
    { label: "ENTREPRISE EXTERIEURE", bgColor: "#f8d7da" },
    { label: "", bgColor: "#f8d7da" },
    { label: "", bgColor: "#f8d7da" },
];

export default Step7;