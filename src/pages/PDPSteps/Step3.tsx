import Section from "../../components/Section.tsx";
import Typography from "@mui/material/Typography";
import TitleHeading from "../../components/TitleHeading.tsx";
import {Box, Checkbox, Divider, FormControlLabel} from "@mui/material";
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
import useRisque from "../../hooks/useRisque.ts";
import Risque from "../../utils/entities/Risque.ts";
import {useEffect, useState} from "react";
import {Pdp} from "../../utils/entities/Pdp.ts";
import ObjectAnswered from "../../utils/pdp/ObjectAnswered.ts";
import SelectOrCreateRisque from "../../components/Pdp/SelectOrCreateRisque.tsx";
import useDispositif from "../../hooks/useDispositif.ts";
import DispositifComponent from "../../components/Steps/DispositifComponent.tsx";
import Dispositif from "../../utils/entities/Dispositif.ts";
import SelectOrCreateDispositif from "../../components/Pdp/SelectOrCreateDispositif.tsx";

interface StepsProps {
    currentPdp: Pdp | null
    saveCurrentPdp: (pdp: Pdp) => void
    save?: (pdp: Pdp) => void
    setIsChanged: (isChanged: boolean) => void
}
const Step3=({currentPdp, save,saveCurrentPdp, setIsChanged}:StepsProps) => {

const {getAllDispositifs} = useDispositif();


    useEffect(() => {
       console.log("dispo", currentPdp);
    }, []);

const [openSelectOrCreateRisque, setOpenSelectOrCreateRisque] = useState(false);
    const [openSelectOrCreateDispositif, setOpenSelectOrCreateDispositif] = useState(false);

    return (
        <Box>
            <TitleHeading title={"RISQUES PARTICULIERS DE L'OPÉRATION (référence au guide d'aide des donneurs d'ordre)"} severity={"error"} />
            <Typography variant={"h6"} color={"#b3b3b3"}>PRESENCE DE RISQUE</Typography>
            <Grid container spacing={2}>
                <Grid size={{sm:12, md:12}} display={"flex"}>
                    <Box  sx={{
                        backgroundColor: '#E9B9B9',
                    }} width={20} height={20} >
                        <Typography></Typography>
                    </Box>
                    <Typography pl={2}>Travaux appartenant à la liste des travaux dangereux de l'arrêté du 19 Mars 1993</Typography>
                </Grid>
                <Grid size={{sm:12,md:12}} display={"flex"}>
                    <Box  sx={{
                        backgroundColor: '#B9B4FF',
                    }} width={20} height={20} > </Box>
                    <Typography pl={2}>Travaux nécessitant l'établissement des permis.</Typography>
                </Grid>
            </Grid>

            <Grid p={2} justifyContent={'space-between'} container spacing={2} size={{xs:6,md:12}}>
                <Grid container spacing={2}>
                    {currentPdp?.risques && currentPdp?.risques.length > 0 ? currentPdp?.risques?.map((risque: ObjectAnswered, index) => (
                        <Grid key={index} size={{sm:6,md:6}}>


                            <RisqueComponent
                                risque={risque}
                                currentPdp={currentPdp as Pdp}
                                saveCurrentPdp={saveCurrentPdp}
                                setIsChanged={setIsChanged}
                            />
                        </Grid>
                    )) :

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 100,
                            width: '55rem',
                            border: 1,
                            borderColor: 'grey.500',
                            borderRadius: 1,
                        }
                        }>
                            <Typography>Aucun risque ajouté</Typography>
                        </Box>



                    }
                </Grid>

            </Grid>


            <AddButtonComponent openModal={setOpenSelectOrCreateRisque} text={"Ajouter un risque"} style={{
                borderRadius: 2,
            }}/>

            <Divider/>
            <SelectOrCreateRisque open={openSelectOrCreateRisque} setOpen={setOpenSelectOrCreateRisque} currentPdp={currentPdp as Pdp}
                                  setIsChanged={setIsChanged}
                                  savePdp={saveCurrentPdp} />


            <TitleHeading title={"DISPOSITIFS DE SÉCURITÉ A FOURNIR PAR L'EE"} severity={"indecation"} />


            <Grid p={2} justifyContent={'space-between'} container spacing={2} size={{xs:6,md:12}}>
                {
                    currentPdp?.dispositifs && currentPdp?.dispositifs.length > 0 ? currentPdp?.dispositifs?.map((dispo, index) => (
                        <Grid key={index} size={{sm:6,md:6}}>
                            <DispositifComponent dispositif={dispo}
                                                saveCurrentPdp={saveCurrentPdp}
                                                setIsChanged={setIsChanged}
                                                currentPdp={currentPdp as Pdp}
                            />
                        </Grid>
                    )) :  <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 100,
                        width: '55rem',
                        border: 1,
                        borderColor: 'grey.500',
                        borderRadius: 1,
                    }
                    }>
                        <Typography>Aucun dispositif ajouté</Typography>
                    </Box>



                }


                <AddButtonComponent openModal={setOpenSelectOrCreateDispositif} text={"Ajouter un dispositif"} style={{
                    borderRadius: 2,
                }}/>
                <Divider/>
                <SelectOrCreateDispositif setIsChanged={setIsChanged} open={openSelectOrCreateDispositif} setOpen={setOpenSelectOrCreateDispositif} currentPdp={currentPdp as Pdp} savePdp={(pdp)=>{
                    saveCurrentPdp(pdp);
                    setIsChanged(true);
                }}/>

            </Grid>
        </Box>
    )
}
export default Step3;