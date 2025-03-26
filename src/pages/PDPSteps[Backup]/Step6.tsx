import TitleHeading from "../../components/TitleHeading.tsx";
import {Box, Button, Divider, MenuItem, Select,} from "@mui/material";
import {HorizontalBox, VerticalBox} from "../../components/Layout/Layouts.tsx";
import Grid from "@mui/material/Grid2";
import PapierDemander from "../../components/Steps/PapierDemander.tsx";
import useLocalisation from "../../hooks/useLocalisation.ts";
import {useEffect, useState} from "react";
import Localisation from "../../utils/Localisation/Localisation.ts";
import {Pdp} from "../../utils/pdp/Pdp.ts";
import SelectOrCreatePermit from "../../components/Pdp/SelectOrCreatePermit.tsx";
import usePdp from "../../hooks/usePdp.ts";
import ObjectAnsweredObjects from "../../utils/ObjectAnsweredObjects.ts";
import ObjectAnswered from "../../utils/pdp/ObjectAnswered.ts";
import Typography from "@mui/material/Typography";

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
                    currentPdp?.permits &&  currentPdp?.permits.length > 0 ? currentPdp?.permits?.map((permit, index:number) => (
                        <Grid key={index} size={{sm:12,md:6}}>
                            <PapierDemander key={index} permit={permit}
                                            saveCurrentPdp={saveCurrentPdp} setIsChanged={setIsChanged}
                                            currentPdp={currentPdp as Pdp}
                            />
                        </Grid>
                            )) : <Box sx={{
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
                        <Typography>Aucun Papier ajouté</Typography>
                    </Box>

                }


            </Grid>



            <Button onClick={() => setOpenSelectOrCreatePermit(true)} variant="contained" color="primary">Ajouter un papier</Button>

            <SelectOrCreatePermit open={openSelectOrCreatePermit} setOpen={setOpenSelectOrCreatePermit} currentPdp={currentPdp as Pdp} savePdp={saveCurrentPdp} setIsChanged={setIsChanged}

            />



        </VerticalBox>
    )
}
export default Step6;