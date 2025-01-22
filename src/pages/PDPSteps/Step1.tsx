import Section from "../../components/Section.tsx";
import Typography from "@mui/material/Typography";
import TitleHeading from "../../components/TitleHeading.tsx";
import {Box, Checkbox, FormControlLabel, MenuItem, Select} from "@mui/material";

import {TextField} from "@mui/material";
import EntrepriseAddButton from "../../components/EntrepriseAddButton.tsx";
import {DatePicker} from "@mui/x-date-pickers";
import {HorizontalBox, VerticalBox} from "../../components/Layout/Layouts.tsx";
import BottomToolBar from "../../components/Steps/BottomToolBar.tsx";
import Cas from "../../components/static/Cas.tsx";
import {useEffect, useState} from "react";
import PdpDTO, {Pdp} from "../../utils/pdp/Pdp.ts";
import dayjs, { Dayjs } from 'dayjs';
import useEntreprise from "../../hooks/useEntreprise.ts";
import {Entreprise} from "../../utils/entreprise/Entreprise.ts";


interface StepsProps {
    currentPdp?: Pdp | null
    save?: (pdp: Pdp) => void
}

const Step1 = ({currentPdp, save}:StepsProps) => {

    const {getAllEntreprises} = useEntreprise();

    const [entreprises, setEntreprises] = useState<Entreprise[]>([]);


    useEffect(() => {
        console.log('response xx',currentPdp);

    }, [currentPdp]);

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

                <HorizontalBox
                    width={"100%"}
                >



                    <VerticalBox
                        gap={"16px"}
                        width={"100%"}
                        padding={"0 20px 0 20px"}
                        >
                        <TitleHeading severity={"indecation"} title={"Entreprise utilisatrice :"}/>
                        <Select
                            fullWidth
                            label="Entreprise utilisatrice"
                            variant="outlined"
                            value={currentPdp?.entrepriseutilisatrice?.id || ""}
                            onChange={(e) => {
                                if (currentPdp) {
                                    const entreprise = entreprises.find(
                                        (entreprise: Entreprise) => entreprise.id?.toString() === e.target.value
                                    );
                                    currentPdp.entrepriseutilisatrice = entreprise;
                                    if (save) save(currentPdp);
                                }
                            }}
                        >
                            {entreprises.map((entreprise: Entreprise) => (
                                <MenuItem value={entreprise.id}>
                                    {`${entreprise.fonction || "No Fonction"} ${entreprise.id}`}
                                </MenuItem>
                            ))}
                        </Select>

                        {/**/}


                    </VerticalBox>
                    <VerticalBox
                        gap={"16px"}
                        width={"100%"}
                        padding={"0 20px 0 20px"}
                    >
                        <TitleHeading severity={"indecation"} title={"Entreprise EXTERIEURE 1 :"}/>
                        <Select
                            fullWidth
                            label="Entreprise EXTERIEURE 1"
                            variant="outlined"
                            value={currentPdp?.entrepriseutilisatrice?.id || ""}
                            onChange={(e) => {
                                if (currentPdp) {
                                    const entreprise = entreprises.find(
                                        (entreprise: Entreprise) => entreprise.id?.toString() === e.target.value
                                    );
                                    currentPdp.entrepriseutilisatrice = entreprise;
                                    if (save) save(currentPdp);
                                }
                            }}
                        >
                            {entreprises.map((entreprise: Entreprise) => (
                                <MenuItem value={entreprise.id}>
                                    {`${entreprise.fonction || "No Fonction"} ${entreprise.id}`}
                                </MenuItem>
                            ))}
                        </Select>

                        {/**/}


                    </VerticalBox>
                    <VerticalBox
                        gap={"16px"}
                        width={"100%"}
                        padding={"0 20px 0 20px"}
                    >
                        <TitleHeading severity={"indecation"} title={"Enterprise EXTERIEURE 1 :"}/>
                        <TextField id="outlined-basic" label="Raison social" variant="outlined"/>
                        <TextField id="outlined-basic" label="Adresse" variant="outlined"/>
                        <TextField id="outlined-basic" label="No de telephone" variant="outlined"/>
                        <TextField id="outlined-basic" label="Responsable chantier" variant="outlined"/>
                        <TextField id="outlined-basic" label="Fonction" variant="outlined"/>
                        <TextField id="outlined-basic" label="No de telephone" variant="outlined"/>

                    </VerticalBox>
                    <EntrepriseAddButton/>
                </HorizontalBox>

            </Section>


            <Section title="">
                <VerticalBox
                    gap={"16px"}
                    width={"100%"}
                >

                    <TitleHeading severity={"indecation"} title={"INFORMATION SUR LA PRESTATION"}/>
                    <TextField multiline fullWidth minRows={4} maxRows={4} id="outlined-basic" label="Operation"
                               variant="outlined" value={currentPdp?.operation}
                        onChange={(e) => {
                            if (currentPdp) {
                              currentPdp.operation = e.target.value;
                                if(save) save(currentPdp);
                            }
                        }}
                    />

                    <TextField label={"Lieu d'intervention"} variant={"outlined"} fullWidth value={currentPdp?.lieuintervention}
                        onChange={(e) => {
                            if (currentPdp) {
                              currentPdp.lieuintervention = e.target.value;
                                if(save) save(currentPdp);
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
                              currentPdp.datedebuttravaux = date?.toDate();
                                if(save) save(currentPdp);
                            }
                        }
                        }
                        />

                        <DatePicker label="Date de fin des travaux"
                                    value={currentPdp?.datefintravaux ? dayjs(currentPdp.datefintravaux) : null}
                                    onChange={(date: Dayjs | null) => {
                                        if (currentPdp) {
                                            currentPdp.datefintravaux = date?.toDate();
                                            if(save) save(currentPdp);
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
                        <TextField id="outlined-basic" label="Effectif maxi" variant="outlined"/>
                        <TextField id="outlined-basic" label="Nombre de interimaires" variant="outlined"/>
                    </HorizontalBox>


                    <HorizontalBox
                        display={"flex"}
                        flexDirection={"row"}
                        gap={"16px"}
                        width={"100%"}
                        justifyContent={"space-between"}
                    >
                        <Typography>Horaire de travail :</Typography>
                        <FormControlLabel control={<Checkbox/>} label={"En journee"}/>
                        <FormControlLabel control={<Checkbox/>} label={"En de nuit"}/>
                        <FormControlLabel control={<Checkbox/>} label={"Samedi"}/>

                    </HorizontalBox>
                    <TextField label={"Horaire de travaille"} variant={"outlined"} fullWidth/>
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