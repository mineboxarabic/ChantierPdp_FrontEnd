import Section from "../../components/Section.tsx";
import Typography from "@mui/material/Typography";
import TitleHeading from "../../components/TitleHeading.tsx";
import {Box, Button, Checkbox, FormControlLabel, MenuItem, Select} from "@mui/material";

import {TextField} from "@mui/material";
import AddButtonComponent from "../../components/AddButtonComponent.tsx";
import {DatePicker} from "@mui/x-date-pickers";
import {HorizontalBox, VerticalBox} from "../../components/Layout/Layouts.tsx";
import BottomToolBar from "../../components/Steps/BottomToolBar.tsx";
import Cas from "../../components/static/Cas.tsx";
import {useCallback, useEffect, useState} from "react";
import {Pdp} from "../../utils/entities/Pdp.ts";
import dayjs, { Dayjs } from 'dayjs';
import useEntreprise from "../../hooks/useEntreprise.ts";
import {Entreprise} from "../../utils/entities/Entreprise.ts";
import EditEntreprise from "../../components/Entreprise/EditEntreprise.tsx";
import SelectOrCreateEntreprise from "../../components/Pdp/SelectOrCreateEntreprise.tsx";
import Grid from "@mui/material/Grid2";
import {debounce} from "lodash";
import SelectEntreprise from "../../components/Entreprise/SelectEntreprise.tsx";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
interface StepsProps {
    currentPdp: Pdp | null
    saveCurrentPdp: (pdp: Pdp) => void
    save?: (pdp: Pdp) => void
    setIsChanged: (isChanged: boolean) => void
}

const Step1 = ({currentPdp, save,saveCurrentPdp, setIsChanged}:StepsProps) => {

    const {getAllEntreprises} = useEntreprise();

    const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
    const [openCreateEntreprise, setOpenCreateEntreprise] = useState(false);


    useEffect(() => {
        getAllEntreprises().then((response: Entreprise[]) => {
            setEntreprises(response);
        });
    }, []);






    return (
        <>
            <Section title="">
                <Typography variant="h6">
                    DANONE Impasse du Pan perdu 38540 ST JUST CHALEYSSIN
                    <Typography color={"#D37070"}>04.72.70.11.11</Typography>
                </Typography>
            </Section>

            <Section title="">
                <Grid container spacing={2}>


                    <Grid size={{xs:12, sm:6, md:4, lg:3}}>
                    <VerticalBox
                        gap={"16px"}
                        width={"100%"}
                        padding={"0 20px 0 20px"}
                        >
                        <TitleHeading severity={"indecation"} title={"Entreprise utilisatrice :"}/>

                        <SelectEntreprise entreprises={entreprises} label={""} selectedEntrepriseId={currentPdp?.entrepriseutilisatrice?.id as number} onSelectEntreprise={(entreprise: Entreprise | null) => {
                            if(entreprise) saveCurrentPdp({...currentPdp, entrepriseutilisatrice: entreprise});
                            setIsChanged(true);
                        }}/>


                    </VerticalBox>
                    </Grid>
                    <SelectOrCreateEntreprise open={openCreateEntreprise} setOpen={setOpenCreateEntreprise} savePdp={saveCurrentPdp} setIsChanged={setIsChanged} currentPdp={currentPdp as Pdp} where={'entrepriseexterieure'}/>


                    {
                        currentPdp?.entrepriseexterieure && currentPdp.entrepriseexterieure.length > 0 ? currentPdp.entrepriseexterieure.map((entreprise: Entreprise, index:number) => (
                            <Grid size={{xs:12, sm:6, md:4, lg:4}} key={index}>
                            <VerticalBox
                                gap={"16px"}
                                width={"100%"}
                                padding={"0 20px 0 20px"}
                            >
                                <TitleHeading severity={"indecation"} title={"Entreprise EXTERIEURE " + (index+1) + " :"}/>
                                <HorizontalBox>
                                <SelectEntreprise label={""} entreprises={entreprises} selectedEntrepriseId={entreprise.id as number} onSelectEntreprise={(entreprise: Entreprise | null) => {
                                    if(entreprise) {
                                       saveCurrentPdp({...currentPdp, entrepriseexterieure: currentPdp?.entrepriseexterieure?.map((entrepriseItem, i) => { return i === index ? entreprise : entrepriseItem })});
                                        setIsChanged(true);
                                    }
                                }}/>

                                <Button
                                    color={"error"}
                                    onClick={() => {
                                    if (currentPdp) {
                                        console.log('index', currentPdp);
                                       currentPdp?.entrepriseexterieure?.splice(index, 1);

                                       saveCurrentPdp({...currentPdp, entrepriseexterieure: currentPdp?.entrepriseexterieure});

                                       setIsChanged(true);

                                    }
                                }}
                                startIcon={<RemoveCircleIcon/>}
                                ></Button>



                                </HorizontalBox>
                                {/**/}

                            </VerticalBox>
                            </Grid>
                        )) :
                            <Grid size={{xs:12, sm:6, md:4, lg:4}}>
                                <VerticalBox
                                    gap={"16px"}
                                    width={"100%"}
                                    padding={"0 20px 0 20px"}
                                    display={"flex"}
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                >
                            <Typography variant={'h6'}>Aucune entreprise exterieure</Typography>
                                </VerticalBox>
                            </Grid>

                    }
                    <Grid size={{xs:12, sm:6, md:4, lg:3}}>
                        <AddButtonComponent openModal={setOpenCreateEntreprise}/>
                    </Grid>

                </Grid>

            </Section>


            <Section title="">
                <VerticalBox
                    gap={"16px"}
                    width={"100%"}
                >

                    <TitleHeading severity={"indecation"} title={"INFORMATION SUR LA PRESTATION"}/>
                    <TextField multiline fullWidth minRows={4} maxRows={4} id="outlined-basic" label="Operation"
                               variant="outlined" value={currentPdp?.operation ?? ''}
                        onChange={(e) => {
                            if (currentPdp) {
                                saveCurrentPdp({...currentPdp, operation: e.target.value});
                                setIsChanged(true);
                            }
                        }}
                    />

                    <TextField label={"Lieu d'intervention"} variant={"outlined"} fullWidth value={currentPdp?.lieuintervention ?? ''}
                        onChange={(e) => {
                            if (currentPdp) {
                              //currentPdp.lieuintervention = e.target.value;
                                saveCurrentPdp({...currentPdp, lieuintervention: e.target.value});
                                setIsChanged(true);
                            }
                        }}
                    />


                    <HorizontalBox
                        gap={"16px"}
                        width={"100%"}
                        alignItems={"center"}
                    >
                        <DatePicker label="Date de debut des travaux" value={currentPdp?.datedebuttravaux ? dayjs(currentPdp.datedebuttravaux) : null}
                        onChange={(date: Dayjs | null) => {
                            if (currentPdp) {
                             // currentPdp.datedebuttravaux = date?.toDate();
                                saveCurrentPdp({...currentPdp, datedebuttravaux: date?.toDate()});
                                setIsChanged(true);
                            }
                        }
                        }
                        />

                        <DatePicker label="Date de fin des travaux"
                                    value={currentPdp?.datefintravaux ? dayjs(currentPdp.datefintravaux) : null}
                                    onChange={(date: Dayjs | null) => {
                                        if (currentPdp) {
                                           // currentPdp.datefintravaux = date?.toDate();
                                            saveCurrentPdp({...currentPdp, datefintravaux: date?.toDate()});
                                            setIsChanged(true);
                                        }
                                    }
                                    }
                        />
                    </HorizontalBox>


                    <HorizontalBox
                        display={"flex"}
                        flexDirection={"row"}
                        gap={"16px"}
                        width={"100%"}
                        alignItems={"center"}
                    >
                        <Typography>Sur le chantier :</Typography>

                        <TextField
                            onChange={(e)=>{
                                if (currentPdp) {
                                    //currentPdp.effectifmaxisurchantier = parseInt(e.target.value);
                                    saveCurrentPdp({...currentPdp, effectifmaxisurchantier: parseInt(e.target.value)});
                                    setIsChanged(true);
                                }
                            }}
                            value={currentPdp?.effectifmaxisurchantier ?? ''}
                            type={"number"}
                            id="outlined-basic"
                            label="Effectif maxi"
                            variant="outlined"
                        />


                        <TextField
                            onChange={(e)=>{
                                if (currentPdp) {
                                    //currentPdp.nombreinterimaires = parseInt(e.target.value);
                                    saveCurrentPdp({...currentPdp, nombreinterimaires: parseInt(e.target.value)});
                                    setIsChanged(true);
                                }
                            }
                            }

                            value={currentPdp?.nombreinterimaires ?? ''}
type={"number"}
                            id="outlined-basic" label="Nombre de interimaires" variant="outlined"/>
                    </HorizontalBox>


                    <HorizontalBox
                        display={"flex"}
                        flexDirection={"row"}
                        gap={"16px"}
                        width={"100%"}
                        justifyContent={"space-between"}
                    >
                        <Typography>Horaire de travail :</Typography>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={(e) => {
                                        if (currentPdp) {
                                            // Safely update horaireDeTravail, creating it if it doesn't exist
                                            const updatedPdp:Pdp = {
                                                ...currentPdp,
                                                horaireDeTravail: {
                                                    ...currentPdp.horaireDeTravail,
                                                    enJournee: e.target.checked
                                                }
                                            };

                                            saveCurrentPdp(updatedPdp);
                                            // Call save function if it exists
                                            setIsChanged(true);

                                        }
                                    }}
                                    checked={currentPdp?.horaireDeTravail?.enJournee || false}
                                />
                            }
                            label="En journee"
                        />


                        <FormControlLabel control={<Checkbox
                            onChange={(e) => {
                                if (currentPdp) {
                                    // Safely update horaireDeTravail, creating it if it doesn't exist
                                    const updatedPdp:Pdp = {
                                        ...currentPdp,
                                        horaireDeTravail: {
                                            ...currentPdp.horaireDeTravail,
                                            enNuit: e.target.checked
                                        }
                                    };

                                    // Call save function if it exists

                                    saveCurrentPdp(updatedPdp);
                                    setIsChanged(true);

                                }
                            }}
                            checked={currentPdp?.horaireDeTravail?.enNuit || false}

                        />} label={"En de nuit"}/>
                        <FormControlLabel control={<Checkbox
                            onChange={(e) => {
                                if (currentPdp) {
                                    // Safely update horaireDeTravail, creating it if it doesn't exist
                                    const updatedPdp = {
                                        ...currentPdp,
                                        horaireDeTravail: {
                                            ...currentPdp.horaireDeTravail,
                                            samedi: e.target.checked
                                        }
                                    };

                                    // Call save function if it exists
                                    saveCurrentPdp(updatedPdp);
                                    setIsChanged(true);

                                }
                            }}
                            checked={currentPdp?.horaireDeTravail?.samedi || false}

                        />} label={"Samedi"}/>

                    </HorizontalBox>

                </VerticalBox>


            </Section>
            <Cas/>
            <FormControlLabel

                control={<Checkbox
                    sx={{
                        alignSelf: "flex-start"
                    }}
                />} label={"J'ai bien pris connaissance des solutions pour réduire les risques d'incidents."}/>

        </>
    )
}
export default Step1;