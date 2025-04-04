/*
import { Box, Card, CardContent, Typography, Button, Modal } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useEffect, useState } from "react";
import AnalyseDeRisque from "../../utils/AnalyseDeRisque/AnalyseDeRisque.ts";
import useAnalyseRisque from "../../hooks/useAnalyseRisque";

import defaultImage from "../../assets/default_entreprise_image.png";
import ObjectAnswered from "../../utils/pdps/ObjectAnswered";
import { Pdp } from "../../utils/pdps/Pdp";
import usePdp from "../../hooks/usePdp";
import ObjectAnsweredEntreprises from "../../utils/pdps/ObjectAnsweredEntreprises.ts";
import EditAnalyseRisque from "../AnalyseDeRisque/EditAnalyseRisque.tsx";

interface SelectOrCreateAnalyseRisqueProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    currentPdp: Pdp;
    savePdp: (pdps: Pdp) => void;
    where: string;
}

const SelectOrCreateAnalyseRisque = ({ open, setOpen, currentPdp, savePdp, where }: SelectOrCreateAnalyseRisqueProps) => {
    const [openCreateAnalyse, setOpenCreateAnalyse] = useState(false);
    const [analyses, setAnalyses] = useState<AnalyseDeRisque[]>([]);
    const [currentAnalyse, setCurrentAnalyse] = useState<AnalyseDeRisque | null>(null);
    const { getAllAnalyses } = useAnalyseRisque();
    const { linkAnalyseToPdp } = usePdp();

    useEffect(() => {
        console.log("currentPdp", currentPdp.id);
        if (open) {
            getAllAnalyses().then((response) => {
                setAnalyses(response);
            });
        }
    }, [open]);

    const handleSelectAnalyse = (analyse: AnalyseDeRisque) => {
        setCurrentAnalyse(analyse);
    };

    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "60%",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    maxHeight: "80vh",
                    overflowY: "auto",
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Select or Create Analyse de Risque
                </Typography>

                {analyses.map((analyse) => (
                    <Card
                        key={analyse.id}
                        sx={{
                            width: "100%",
                            margin: "10px auto",
                            cursor: "pointer",
                            border: currentAnalyse?.id === analyse.id ? "2px solid blue" : "1px solid gray",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                        onClick={() => handleSelectAnalyse(analyse)}
                    >
                        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <img
                                src={defaultImage}
                                alt={analyse.risque?.title || "none"}
                                style={{ width: 50, height: 50, borderRadius: 4 }}
                            />
                            <Typography variant="h6">{analyse?.risque?.title || 'no desc'}</Typography>
                            <Typography variant="body2">{analyse?.risque?.description || 'no desc'}</Typography>
                        </CardContent>
                    </Card>
                ))}

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => {
                        linkAnalyseToPdp(currentAnalyse?.id as number, currentPdp?.id as number).then((response: ObjectAnsweredEntreprises) => {
                            currentPdp.analyseDeRisques = currentPdp.analyseDeRisques || [];
                            currentPdp.analyseDeRisques.push(response);
                            savePdp({
                                ...currentPdp,
                                analyseDeRisques: currentPdp.analyseDeRisques,
                            });
                            setOpen(false);
                        });
                    }}
                    disabled={!currentAnalyse}
                >
                    Save Selected Analyse
                </Button>

                <Card
                    sx={{
                        width: 200,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        border: "2px dashed gray",
                        margin: "10px auto",
                    }}
                    onClick={() => setOpenCreateAnalyse(true)}
                >
                    <AddCircleIcon fontSize="large" />
                    <Typography>Save New Analyse</Typography>
                </Card>

                <EditAnalyseRisque
                    savePdp={savePdp}
                    analyse={null}
                    setAnalyse={(newAnalyse) => {
                        setAnalyses([...analyses, newAnalyse]);
                        setCurrentAnalyse(newAnalyse);
                        setOpenCreateAnalyse(false);
                    }}
                    open={openCreateAnalyse}
                    setOpen={setOpenCreateAnalyse}
                    isEdit={false}
                    currentPdp={currentPdp}
                />
            </Box>
        </Modal>
    );
};

export default SelectOrCreateAnalyseRisque;
*/


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
    savePdp: (pdps: any) => void;
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



import useAnalyseRisque from "../../hooks/useAnalyseRisque.ts";
import usePdp from "../../hooks/usePdp.ts";
import {useState} from "react";
import SelectOrCreate from "./SelectOrCreate.tsx";
import AnalyseDeRisque from "../../utils/entities/AnalyseDeRisque.ts";
import defaultImage from "../../assets/default_entreprise_image.png";
import EditAnalyseRisque from "../AnalyseDeRisque/EditAnalyseRisque.tsx";
import {Pdp} from "../../utils/entities/Pdp.ts";
import ObjectAnsweredEntreprises from "../../utils/pdp/ObjectAnsweredEntreprises.ts";

interface SelectOrCreateAnalyseRisqueProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    currentPdp: Pdp;
    savePdp: (pdp: any) => void;
    setIsChanged: (isChanged: boolean) => void;
}

const SelectOrCreateAnalyseRisque = (props: SelectOrCreateAnalyseRisqueProps) => {
    const { getAllAnalyses, linkRisqueToAnalyse } = useAnalyseRisque();
    const { linkAnalyseToPdp } = usePdp();

    const [openCreateAnalyseDeRisque, setOpenCreateAnalyseDeRisque] = useState(false);
    return (
        <SelectOrCreate<AnalyseDeRisque>
            {...props}
            where="analyseDeRisques"
            fetchItems={getAllAnalyses}
            linkItem={linkAnalyseToPdp}
            alreadySelected={(analyseDerisque:AnalyseDeRisque) => props.currentPdp?.analyseDeRisques?.some((r:ObjectAnsweredEntreprises) => r?.analyseDeRisque?.id === analyseDerisque?.id)}
            getItemId={(analyseDerisque:AnalyseDeRisque) => analyseDerisque?.id}
            getItemTitle={(analyseDerisque) => analyseDerisque?.deroulementDesTaches}
            getItemDescription={(analyseDerisque) => analyseDerisque.risque?.title}
            //`data:${analyseDerisque?.risque?.logo.mimeType};base64,${analyseDerisque?.risque?.logo.imageData}` : defaultImage}
            getItemImage={(analyseDerisque:AnalyseDeRisque) => analyseDerisque?.risque ? `data:${analyseDerisque.risque.logo?.mimeType};base64,${analyseDerisque.risque.logo?.imageData}` : defaultImage}

            openCreate={openCreateAnalyseDeRisque}
            setOpenCreate={setOpenCreateAnalyseDeRisque}

            createComponent={
                <EditAnalyseRisque
                    analyse={null}
                    setAnalyse={(newRisque: AnalyseDeRisque) => props.setIsChanged(true)}
                    open={openCreateAnalyseDeRisque}
                    setOpen={setOpenCreateAnalyseDeRisque}
                    isEdit={false}
                    savePdp={props.savePdp}
                    currentPdp={props.currentPdp}
                    setIsChanged={props.setIsChanged}
                />
            }
        />
    );
};

export default SelectOrCreateAnalyseRisque;

