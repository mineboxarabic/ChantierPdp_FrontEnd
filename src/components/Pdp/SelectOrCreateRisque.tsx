/*
import {
    Box,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography,
    Button,
    Modal,
    Divider,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useEffect, useState } from "react";
import EditRisque from "../Risque/EditRisque.tsx";
import useRisque from "../../hooks/useRisque.ts";
import  Risque  from "../../utils/Risque/Risque.ts";
import defaultImage from "../../assets/default_entreprise_image.png";
import usePdp from "../../hooks/usePdp.ts";
import useAnalyseRisque from "../../hooks/useAnalyseRisque.ts";

interface SelectOrCreateRisqueProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    currentPdp: any;
    savePdp: (pdp: any) => void;
    where: string;
    analyseDeRisque?: any;
    saveAnalyseDeRisque?: (analyseDeRisque: any) => void;
    setIsChanged: (isChanged: boolean) => void;
}

const SelectOrCreateRisque = ({ open, setOpen,setIsChanged, currentPdp, savePdp, where, analyseDeRisque, saveAnalyseDeRisque }: SelectOrCreateRisqueProps) => {
    const [openCreateRisque, setOpenCreateRisque] = useState(false);
    const [risques, setRisques] = useState<Risque[]>([]);
    const [selectedRisque, setSelectedRisque] = useState<Risque | null>(null);
    const { getAllRisques } = useRisque();
    const { linkRisqueToPdp } = usePdp();
    const { linkRisqueToAnalyse } = useAnalyseRisque();

    useEffect(() => {
        getAllRisques().then((response) => {
            setRisques(response);
        });
    }, [openCreateRisque]);

    const alreadySelected = (risque: Risque) => {
        return currentPdp?.risques?.some((r: any) => r.risque.id === risque.id);
    };

    const handleSelectRisque = (risque: Risque) => {
        console.log('risque', risque);
        if (!alreadySelected(risque)) {
            setSelectedRisque(selectedRisque?.id === risque.id ? null : risque);
        }
    };

    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "50%",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "80vh",
                    overflowY: "auto",
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>Select a Risk</Typography>
                <List>
                    {risques && risques.map((risque,index) => {
                        const isAlreadySelected = alreadySelected(risque);

                        return (
                            <ListItem
                                key={index}
                                onClick={() => handleSelectRisque(risque)}
                                sx={{
                                    borderRadius: 2,
                                    border: "1px solid gray",
                                    mb: 1,
                                    cursor: isAlreadySelected ? "not-allowed" : "pointer",
                                    transition: "0.3s",
                                    backgroundColor: isAlreadySelected
                                        ? "lightgray"
                                        : selectedRisque?.id === risque.id
                                            ? "lightblue"
                                            : "white",
                                    opacity: isAlreadySelected ? 0.6 : 1,
                                    "&:hover": {
                                        backgroundColor: isAlreadySelected
                                            ? "lightgray"
                                            : "lightgray",
                                    },
                                }}
                                component="button"
                                disabled={isAlreadySelected}
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        src={risque?.logo ? `data:${risque.logo.mimeType};base64,${risque.logo.imageData}` : defaultImage}
                                        alt={risque.title}
                                    />
                                </ListItemAvatar>
                                <ListItemText primary={risque.title} secondary={risque.description} />
                            </ListItem>
                        );
                    })}
                </List>

                <Divider sx={{ my: 2 }} />

                <Button
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    onClick={() => setOpenCreateRisque(true)}
                    sx={{ mb: 2 }}
                >
                    Create New Risk
                </Button>

                <Box sx={{ position: "sticky", bottom: -20, bgcolor: "background.paper", p: 2, display: "flex", justifyContent: "space-between" }}>
                    <Button onClick={() => setOpen(false)} color={"error"}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            if (currentPdp && selectedRisque) {
                                if (analyseDeRisque) {
                                    saveAnalyseDeRisque?.({ ...analyseDeRisque, risque: selectedRisque });
                                    setIsChanged(true);
                                    linkRisqueToAnalyse(selectedRisque.id, analyseDeRisque.id).then(() => {

                                    });
                                } else {

                                    linkRisqueToPdp(selectedRisque.id, currentPdp.id).then(() => {
                                       // savePdp({ ...currentPdp, risques: [...currentPdp.risques, { risque: selectedRisque }] });
                                        currentPdp.risques.push({ risque: selectedRisque });
                                        savePdp(currentPdp);
                                        setIsChanged(true);
                                    });
                                }
                            }
                            setOpen(false);
                        }}
                        disabled={!selectedRisque}
                    >
                        Validate
                    </Button>
                </Box>

                <EditRisque
                    risque={null}
                    setRisque={(newRisque) => {
                        setRisques([...risques, newRisque]);
                        setSelectedRisque(newRisque);
                        setOpenCreateRisque(false);
                    }}
                    open={openCreateRisque}
                    setOpen={setOpenCreateRisque}
                    isEdit={false}
                />
            </Box>
        </Modal>
    );
};

export default SelectOrCreateRisque;*/

import SelectOrCreate from "./SelectOrCreate";
import useRisque from "../../hooks/useRisque";
import usePdp from "../../hooks/usePdp";
import EditRisque from "../Risque/EditRisque";
import defaultImage from "../../assets/default_entreprise_image.png";
import  Risque  from "../../utils/Risque/Risque";
import {useState} from "react";
import ObjectAnsweredEntreprises from "../../utils/pdp/ObjectAnsweredEntreprises.ts";
import AnalyseDeRisque from "../../utils/AnalyseDeRisque/AnalyseDeRisque.ts";
import ObjectAnswered from "../../utils/pdp/ObjectAnswered.ts";

interface SelectOrCreateRisqueProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    currentPdp: any;
    savePdp: (pdp: any) => void;
    setIsChanged: (isChanged: boolean) => void;
    linkRisqueToAnalyse?: (analyseId: number, risqueId: number) => Promise<ObjectAnsweredEntreprises>;
    analyseDeRisque?: AnalyseDeRisque;
    setAnalyseDeRisque?: (analyseDeRisque: AnalyseDeRisque) => void;
}

const SelectOrCreateRisque = (props: SelectOrCreateRisqueProps) => {
    const { getAllRisques } = useRisque();
    const { linkRisqueToPdp } = usePdp();

    const [openCreateRisque, setOpenCreateRisque] = useState(false);


    const alreadySelected = (risque: Risque) => {
        if(props.analyseDeRisque){
            return props.analyseDeRisque?.risque?.id === risque?.id;
        }
        return props.currentPdp?.risques?.some((r: any) => r.risque.id === risque.id);

    }


    const onValidate = (selectedRisque:Risque) => {
        if (selectedRisque) {
            if (props.linkRisqueToAnalyse && props.analyseDeRisque) {
              //  props.savePdp({ ...props.analyseDeRisque, risque: selectedRisque });

                props.setIsChanged(true);
                console.log('selectedRisque', selectedRisque);
                if(props.setAnalyseDeRisque){
                    props.setAnalyseDeRisque({ ...props.analyseDeRisque, risque: selectedRisque } as AnalyseDeRisque);
                }
            } else {
                linkRisqueToPdp(selectedRisque.id as number, props.currentPdp.id).then((risque:ObjectAnswered) => {
                 //   props.currentPdp.risques.push({risque: selectedRisque});
                    risque.risque = selectedRisque;
                    props.savePdp({
                        ...props.currentPdp,
                        risques: [...props.currentPdp.risques, risque]
                    });
                    props.setIsChanged(true);
                });
            }
        }
        props.setOpen(false);
    }

    return (
        <SelectOrCreate<Risque>
            {...props}
            where="risques"
            fetchItems={getAllRisques}
            linkItem={props.linkRisqueToAnalyse ? props.linkRisqueToAnalyse : linkRisqueToPdp}
            alreadySelected={alreadySelected}
            getItemId={(risque) => risque.id as number}
            getItemTitle={(risque) => risque.title}
            getItemDescription={(risque) => risque.description}
            getItemImage={(risque) => risque?.logo ? `data:${risque.logo.mimeType};base64,${risque.logo.imageData}` : defaultImage}
            onValidate={onValidate}
            openCreate={openCreateRisque}
            setOpenCreate={setOpenCreateRisque}

            createComponent={
                <EditRisque
                    risque={null}
                    setRisque={(newRisque: Risque) => props.setIsChanged(true)}
                    open={openCreateRisque}
                    setOpen={setOpenCreateRisque}
                    isEdit={false}
                />
            }
        />
    );
};

export default SelectOrCreateRisque;

