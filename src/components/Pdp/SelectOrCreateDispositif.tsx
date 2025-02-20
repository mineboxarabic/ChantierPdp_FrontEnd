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
import EditDispositif from "../Dispositif/EditDispositif.tsx";
import useDispositif from "../../hooks/useDispositif.ts";
import Dispositif from "../../utils/dispositif/Dispositif.ts";
import defaultImage from "../../assets/default_entreprise_image.png";
import usePdp from "../../hooks/usePdp.ts";

interface SelectOrCreateDispositifProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    currentPdp: any;
    savePdp: (pdp: any) => void;
    where: string;
    setIsChanged: (isChanged: boolean) => void;
}

const SelectOrCreateDispositif = ({ open, setOpen,setIsChanged, currentPdp, savePdp, where }: SelectOrCreateDispositifProps) => {
    const [openCreateDispositif, setOpenCreateDispositif] = useState(false);
    const [dispositifs, setDispositifs] = useState<Dispositif[]>([]);
    const [selectedDispositif, setSelectedDispositif] = useState<Dispositif | null>(null);
    const { getAllDispositifs } = useDispositif();
    const { linkDispositifToPdp } = usePdp();

    useEffect(() => {
        getAllDispositifs().then((response) => {
            setDispositifs(response);
        });
    }, [openCreateDispositif]);

    const alreadySelected = (dispositif: Dispositif) => {
        return currentPdp?.dispositifs?.some((r: any) => r.dispositif.id === dispositif.id);
    };

    const handleSelectDispositif = (dispositif: Dispositif) => {
        console.log('dispositif', dispositif);
        if (!alreadySelected(dispositif)) {
            setSelectedDispositif(selectedDispositif?.id === dispositif.id ? null : dispositif);
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
                    {dispositifs && dispositifs.map((dispositif, index) => {
                        const isAlreadySelected = alreadySelected(dispositif);

                        return (
                            <ListItem
                                key={index}
                                onClick={() => handleSelectDispositif(dispositif)}
                                sx={{
                                    borderRadius: 2,
                                    border: "1px solid gray",
                                    mb: 1,
                                    cursor: isAlreadySelected ? "not-allowed" : "pointer",
                                    transition: "0.3s",
                                    backgroundColor: isAlreadySelected
                                        ? "lightgray"
                                        : selectedDispositif?.id === dispositif.id
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
                                        src={dispositif?.logo ? `data:${dispositif.logo.mimeType};base64,${dispositif.logo.imageData}` : defaultImage}
                                        alt={dispositif.title}
                                    />
                                </ListItemAvatar>
                                <ListItemText primary={dispositif.title} secondary={dispositif.description} />
                            </ListItem>
                        );
                    })}
                </List>

                <Divider sx={{ my: 2 }} />

                <Button
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    onClick={() => setOpenCreateDispositif(true)}
                    sx={{ mb: 2 }}
                >
                    Create New Dispositif
                </Button>

                <Box sx={{ position: "sticky", bottom: -20, bgcolor: "background.paper", p: 2, display: "flex", justifyContent: "space-between" }}>
                    <Button onClick={() => setOpen(false)} color={"error"}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            if (currentPdp && selectedDispositif) {


                            linkDispositifToPdp(selectedDispositif.id, currentPdp.id).then(() => {
                                // savePdp({ ...currentPdp, dispositifs: [...currentPdp.dispositifs, { dispositif: selectedDispositif }] });
                                currentPdp.dispositifs.push({ dispositif: selectedDispositif });
                                savePdp(currentPdp);
                                setIsChanged(true);
                            });
                        }

                            setOpen(false);
                        }}
                        disabled={!selectedDispositif}
                    >
                        Validate
                    </Button>
                </Box>

                <EditDispositif
                    dispositif={null}
                    setDispositif={(newDispositif) => {
                        setDispositifs([...dispositifs, newDispositif]);
                      //  setSelectedDispositif(newDispositif);
                        setOpenCreateDispositif(false);
                    }}
                    open={openCreateDispositif}
                    setOpen={setOpenCreateDispositif}
                    isEdit={false}
                />
            </Box>
        </Modal>
    );
};

export default SelectOrCreateDispositif;*/


import useDispositif from "../../hooks/useDispositif.ts";
import usePdp from "../../hooks/usePdp.ts";
import {useState} from "react";
import SelectOrCreate from "./SelectOrCreate.tsx";
import Dispositif from "../../utils/dispositif/Dispositif.ts";
import defaultImage from "../../assets/default_entreprise_image.png";
import EditDispositif from "../Dispositif/EditDispositif.tsx";
interface SelectOrCreateDispositifProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    currentPdp: any;
    savePdp: (pdp: any) => void;
    setIsChanged: (isChanged: boolean) => void;
}
const SelectOrCreateDispositif = (props: SelectOrCreateDispositifProps) => {
    const { getAllDispositifs } = useDispositif();
    const { linkDispositifToPdp } = usePdp();

    const [openCreateDispositif, setOpenCreateDispositif] = useState(false);
    return (
        <SelectOrCreate<Dispositif>
            {...props}
            where="dispositifs"
            fetchItems={getAllDispositifs}
            linkItem={linkDispositifToPdp}
            alreadySelected={(dispositif) => props.currentPdp?.dispositifs?.some((r: any) => r.dispositif.id === dispositif.id)}
            getItemId={(dispositif) => dispositif.id}
            getItemTitle={(dispositif) => dispositif.title}
            getItemDescription={(dispositif) => dispositif.description}
            getItemImage={(dispositif) => dispositif?.logo ? `data:${dispositif.logo.mimeType};base64,${dispositif.logo.imageData}` : defaultImage}

            openCreate={openCreateDispositif}
            setOpenCreate={setOpenCreateDispositif}

            createComponent={
                <EditDispositif
                    dispositif={null}
                    setDispositif={(newDispositif: Dispositif) => props.setIsChanged(true)}
                    open={openCreateDispositif}
                    setOpen={setOpenCreateDispositif}
                    isEdit={false}
                />
            }
        />
    );
};

export default SelectOrCreateDispositif;