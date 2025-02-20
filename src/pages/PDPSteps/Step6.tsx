import Section from "../../components/Section.tsx";
import Typography from "@mui/material/Typography";
import TitleHeading from "../../components/TitleHeading.tsx";
import {
    Box, Button, Divider, MenuItem, Select,
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
import Permit from "../../utils/permit/Permit.ts";
import SelectOrCreatePermit from "../../components/Pdp/SelectOrCreatePermit.tsx";

interface StepsProps {
    currentPdp: Pdp | null
    saveCurrentPdp: (pdp: Pdp) => void
    save?: (pdp: Pdp) => void
    setIsChanged: (isChanged: boolean) => void
}
const Step6 = ({currentPdp, save,saveCurrentPdp, setIsChanged}:StepsProps) => {
    const {getAllLocalisations} = useLocalisation();

    const [localisations, setLocalisations] = useState<Localisation[]>([]);
    const [openSelectOrCreatePermit, setOpenSelectOrCreatePermit] = useState(false);

    useEffect(() => {
        getAllLocalisations().then((response) => {
            setLocalisations(response);
        });



    }, []);


    useEffect(() => {
        console.log("permis", currentPdp);
    }, [currentPdp]);


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

                    {localisations.map((localisation,index) => (
                        <MenuItem key={index} value={localisation.id}>{localisation.nom}</MenuItem>
                    ))}

                </Select>

              {/*  <Box sx={{ width: "100%", height: "100%" }}>
                    <img src={siteImage} alt="site" style={{ width: "100%", height: "100%" }} />
                </Box>*/}
            </HorizontalBox>

            <Divider/>

            <Grid justifyContent={'space-between'} container spacing={2}>
                {
                    currentPdp?.permits?.map((permit, index:number) => (
                        <Grid key={index} size={{sm:12,md:6}}>
                            <PapierDemander key={index} permit={permit} onChangeCheckBox={(value:boolean)=>{
                                saveCurrentPdp({
                                    ...currentPdp,
                                    permits: currentPdp.permits?.map((p) => {
                                        if(p.id === permit.id){
                                            p.answer = value;
                                        }
                                        return p;
                                    }
                                    ),
                                });
                                setIsChanged(true);
                            }}/>
                        </Grid>
                            ))

                }


            </Grid>



            <Button onClick={() => setOpenSelectOrCreatePermit(true)} variant="contained" color="primary">Ajouter un papier</Button>

            <SelectOrCreatePermit open={openSelectOrCreatePermit} setOpen={setOpenSelectOrCreatePermit} currentPdp={currentPdp as Pdp} savePdp={saveCurrentPdp} setIsChanged={setIsChanged}/>



        </VerticalBox>
    )
}
export default Step6;