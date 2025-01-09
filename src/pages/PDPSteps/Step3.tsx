import Section from "../../components/Section.tsx";
import Typography from "@mui/material/Typography";
import TitleHeading from "../../components/TitleHeading.tsx";
import {Box, Checkbox, Divider, FormControlLabel} from "@mui/material";
import Grid from '@mui/material/Grid2';
import {TextField} from "@mui/material";
import EntrepriseAddButton from "../../components/EntrepriseAddButton.tsx";
import {DatePicker} from "@mui/x-date-pickers";
import {HorizontalBox, VerticalBox} from "../../components/Layout/Layouts.tsx";
import BottomToolBar from "../../components/Steps/BottomToolBar.tsx";
import Cas from "../../components/static/Cas.tsx";
import Button from "@mui/material/Button";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Risque from "../../components/Steps/Risque.tsx";
import Dispositive from "../../components/Steps/Dispositive.tsx";
const Step3 = () => {
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

            <Grid justifyContent={'space-between'} container spacing={2} size={{xs:6,md:12}}>
                <VerticalBox gap={1} width={"49%"}>
                    <Risque/>
                    <Risque/>
                    <Risque/>
                    <Risque/>
                    <Risque/>
                    <Risque/>
                    <Risque/>
                    <Risque/>
                    <Risque/>
                    <Risque/>
                    <Risque/>
                </VerticalBox>
                <VerticalBox gap={1} width={"49%"}>
                    <Risque/>
                    <Risque/>
                    <Risque/>
                    <Risque/>
                    <Risque/>
                    <Risque/>
                    <Risque/>
                    <Risque/>
                    <Risque/>
                    <Risque/>
                    <Risque/>
                </VerticalBox>

            </Grid>

            <Divider/>
            <TitleHeading title={"DISPOSITIFS DE SÉCURITÉ A FOURNIR PAR L'EE"} severity={"indecation"} />


            <Grid justifyContent={'space-between'} container spacing={2} size={{xs:6,md:12}}>
                <VerticalBox gap={1} width={"49%"}>
                    <Dispositive/>
                    <Dispositive/>
                    <Dispositive/>
                    <Dispositive/>

                </VerticalBox>

                <VerticalBox gap={1} width={"49%"}>
                    <Dispositive/>
                    <Dispositive/>
                    <Dispositive/>
                    <Dispositive/>
                </VerticalBox>
            </Grid>
        </Box>
    )
}
export default Step3;