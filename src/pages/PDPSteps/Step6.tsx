import Section from "../../components/Section.tsx";
import Typography from "@mui/material/Typography";
import TitleHeading from "../../components/TitleHeading.tsx";
import {
    Box, Divider, MenuItem, Select,
} from "@mui/material";
import {HorizontalBox, VerticalBox} from "../../components/Layout/Layouts.tsx";
import BottomToolBar from "../../components/Steps/BottomToolBar.tsx";
import siteImage from "../../assets/site.png";
import Grid from "@mui/material/Grid2";
import Dispositive from "../../components/Steps/Dispositive.tsx";
import PapierDemander from "../../components/Steps/PapierDemander.tsx";
import useLocalisation from "../../hooks/useLocalisation.ts";
import {useEffect, useState} from "react";
import Localisation from "../../utils/Localisation/Localisation.ts";
import {Pdp} from "../../utils/pdp/Pdp.ts";

interface StepsProps {
    currentPdp: Pdp | null
    saveCurrentPdp: (pdp: Pdp) => void
    save?: (pdp: Pdp) => void
    setIsChanged: (isChanged: boolean) => void
}
const Step6 = ({currentPdp, save,saveCurrentPdp, setIsChanged}:StepsProps) => {
    const {getAllLocalisations} = useLocalisation();

    const [localisations, setLocalisations] = useState<Localisation[]>([]);


    useEffect(() => {
        getAllLocalisations().then((response) => {
            setLocalisations(response);
        });
    }, []);


    return (
        <VerticalBox>

            <TitleHeading title="LOCALISER LE CHANTIER PAR UNE CERCLE" severity="indecation" />

            <HorizontalBox>
                <Select

                    onChange={(e) => {


                        saveCurrentPdp({
                            ...currentPdp,
                            localisation: localisations.find((localisation) => localisation.id === parseInt(e.target.value as string)),
                        });

                        setIsChanged(true);

                    }}

                    variant="outlined" defaultValue={0}>
                  {/*  <MenuItem value={10}>Location 1</MenuItem>
                    <MenuItem value={20}>Location 2</MenuItem>
                    <MenuItem value={30}>Location 3</MenuItem>*/}

                    {localisations.map((localisation) => (
                        <MenuItem value={localisation.id}>{localisation.nom}</MenuItem>
                    ))}

                </Select>

              {/*  <Box sx={{ width: "100%", height: "100%" }}>
                    <img src={siteImage} alt="site" style={{ width: "100%", height: "100%" }} />
                </Box>*/}
            </HorizontalBox>

            <Divider/>

            <Grid justifyContent={'space-between'} container spacing={2} size={{xs:6,md:12}}>
                <VerticalBox gap={1} width={"49%"}>
                    <PapierDemander/>
                    <PapierDemander/>
                    <PapierDemander/>
                    <PapierDemander/>


                </VerticalBox>

                <VerticalBox gap={1} width={"49%"}>
                    <PapierDemander/>
                    <PapierDemander/>
                    <PapierDemander/>
                    <PapierDemander/>
                    <PapierDemander/>

                </VerticalBox>
            </Grid>

        </VerticalBox>
    )
}
export default Step6;