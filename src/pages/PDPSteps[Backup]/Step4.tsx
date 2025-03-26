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
import AddButtonComponent from "../../components/AddButtonComponent.tsx";
import {DatePicker} from "@mui/x-date-pickers";
import {HorizontalBox, VerticalBox} from "../../components/Layout/Layouts.tsx";
import BottomToolBar from "../../components/Steps/BottomToolBar.tsx";
import Cas from "../../components/static/Cas.tsx";
import Button from "@mui/material/Button";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RisqueComponent from "../../components/Steps/RisqueComponent.tsx";
import useAnalyseRisque from "../../hooks/useAnalyseRisque.ts";
import {Pdp} from "../../utils/pdp/Pdp.ts";
import {useEffect, useState} from "react";
import ObjectAnsweredEntreprises from "../../utils/pdp/ObjectAnsweredEntreprises.ts";
import SelectOrCreateAnalyseRisque from "../../components/Pdp/SelectOrCreateAnalyseRisque.tsx";
import usePdp from "../../hooks/usePdp.ts";

interface StepsProps {
    currentPdp: Pdp | null
    saveCurrentPdp: (pdp: Pdp) => void
    save?: (pdp: Pdp) => void
    setIsChanged: (isChanged: boolean) => void
}
const Step4 = ({currentPdp, save,saveCurrentPdp, setIsChanged}:StepsProps) => {

    const [openSelectOrCreateAnalyse, setOpenSelectOrCreateAnalyse] = useState(false);
    const {unlinkAnalyseToPdp} = usePdp();

    useEffect(() => {
        console.log("analyseDeRisqueEntreprise", currentPdp);
        currentPdp?.analyseDeRisques?.map((analyseDeRisqueEntreprise:ObjectAnsweredEntreprises, index) => (
            console.log("analyseDeRisqueEntreprisess", analyseDeRisqueEntreprise.ee)
        ))
    }, [currentPdp]);


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
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentPdp?.analyseDeRisques && currentPdp?.analyseDeRisques.length > 0 ? currentPdp?.analyseDeRisques?.map((analyseDeRisqueEntreprise:ObjectAnsweredEntreprises, index) => (
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

                                <TableCell align="center" sx={{border: "1px solid #ccc",}}>
                                    <Button
                                        color={"error"}
                                        onClick={() => {
                                            unlinkAnalyseToPdp( analyseDeRisqueEntreprise?.id as number, currentPdp?.id as number ).then(() => {
                                                currentPdp.analyseDeRisques?.splice(index, 1);
                                                saveCurrentPdp({
                                                    ...currentPdp,
                                                    analyseDeRisques: currentPdp.analyseDeRisques,
                                                } as Pdp);
                                                setIsChanged(true);
                                            })

                                        }}
                                        startIcon={<AccountCircleIcon />}
                                        sx={{
                                            height: '5rem',
                                        }}
                                    ></Button>
                                </TableCell>


                            </TableRow>
                        ))
                            :
                            <TableRow>
                                <TableCell colSpan={6} align="center">Pas de Risques</TableCell>
                            </TableRow>
                        }
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
                setIsChanged={setIsChanged}
            />



        </Box>
    )
}
export default Step4;