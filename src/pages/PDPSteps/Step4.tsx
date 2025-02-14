import Section from "../../components/Section.tsx";
import Typography from "@mui/material/Typography";
import TitleHeading from "../../components/TitleHeading.tsx";
import {
    Box,
    Checkbox,
    Divider,
    FormControlLabel,
    Table,
    TableBody,
    TableCell,
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
import RisqueComponent from "../../components/Steps/RisqueComponent.tsx";
import Dispositive from "../../components/Steps/Dispositive.tsx";
import useAnalyseRisque from "../../hooks/useAnalyseRisque.ts";
import {Pdp} from "../../utils/pdp/Pdp.ts";
import {useEffect, useState} from "react";
import ObjectAnsweredEntreprises from "../../utils/pdp/ObjectAnsweredEntreprises.ts";
import SelectOrCreateAnalyseRisque from "../../components/Pdp/SelectOrCreateAnalyseRisque.tsx";

interface StepsProps {
    currentPdp: Pdp | null
    saveCurrentPdp: (pdp: Pdp) => void
    save?: (pdp: Pdp) => void
    setIsChanged: (isChanged: boolean) => void
}
const Step4 = ({currentPdp, save,saveCurrentPdp, setIsChanged}:StepsProps) => {

    const [openSelectOrCreateAnalyse, setOpenSelectOrCreateAnalyse] = useState(false);

    useEffect(() => {
        currentPdp?.analyseDeRisques?.map((analyseDeRisqueEntreprise:ObjectAnsweredEntreprises, index) => (
            console.log("analyseDeRisqueEntreprise", analyseDeRisqueEntreprise.ee)
        ))
    }, []);


    return (
        <Box sx={{ padding: 3 }}>
            {/* Title Section */}
            <TitleHeading title="RISQUES RÉSULTANTS DE LA COACTIVITÉ AVEC DES ENTREPRISES EXTÉRIEURES" severity="error" />

            {/* Table Section */}
            <Box sx={{ overflowX: "auto", mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>DEROULE DES TACHES</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>MOYENS UTILISES</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>RISQUES PREVISIBLES</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>MESURES DE PREVENTION</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>EE</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>EU</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentPdp?.analyseDeRisques?.map((analyseDeRisqueEntreprise:ObjectAnsweredEntreprises, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{ border: "1px solid #ccc", height: 50,}}>{
                                    analyseDeRisqueEntreprise.analyseDeRisque?.deroulementDesTaches || "no data"
                                }</TableCell>
                                <TableCell sx={{ border: "1px solid #ccc", height: 50,}}>{
                                    analyseDeRisqueEntreprise.analyseDeRisque?.moyensUtilises || "no data"
                                }</TableCell>
                                <TableCell sx={{ border: "1px solid #ccc", height: 50,}}>
                                    {
                                        analyseDeRisqueEntreprise.analyseDeRisque?.risque?.title || "no data"
                                    }
                                </TableCell>
                                <TableCell sx={{ border: "1px solid #ccc", height: 50,}}>{
                                    analyseDeRisqueEntreprise.analyseDeRisque?.mesuresDePrevention || "no data"
                                }</TableCell>

                                <TableCell align="center" sx={{border: "1px solid #ccc",}}><Checkbox
                                    checked={!!analyseDeRisqueEntreprise?.ee}

                                    onChange={(e) => {
                                        analyseDeRisqueEntreprise.ee = e.target.checked;

                                        saveCurrentPdp({
                                            ...currentPdp,
                                            analyseDeRisques: currentPdp.analyseDeRisques,
                                        } as Pdp);

                                      setIsChanged(true);
                                    }}

                                /></TableCell>
                                <TableCell align="center" sx={{border: "1px solid #ccc",}}>
                                    <Checkbox
                                        checked={!!analyseDeRisqueEntreprise?.eu}
                                        onChange={(e) => {
                                            analyseDeRisqueEntreprise.eu = e.target.checked;

                                            saveCurrentPdp({
                                                ...currentPdp,
                                                analyseDeRisques: currentPdp.analyseDeRisques,
                                            } as Pdp);

                                            setIsChanged(true);
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>



            <Button onClick={() => setOpenSelectOrCreateAnalyse(true)}
                    color="primary"
                    variant="contained"
                    sx={{ mt: 2 }}
                    //center
            >Ajouter une analyse de risque</Button>

            <SelectOrCreateAnalyseRisque
                open={openSelectOrCreateAnalyse}
                setOpen={setOpenSelectOrCreateAnalyse}
                currentPdp={currentPdp as Pdp}
                savePdp={(saveCurrentPdp)}
                where={"analyseDeRisques"}
            />



        </Box>
    )
}
export default Step4;