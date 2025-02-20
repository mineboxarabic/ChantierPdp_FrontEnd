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
import EditEntreprise from "../Entreprise/EditEntreprise.tsx";
import useEntreprise from "../../hooks/useEntreprise.ts";
import { Entreprise } from "../../utils/entreprise/Entreprise.ts";
import defaultImage from "../../assets/default_entreprise_image.png";

interface SelectOrCreateEntrepriseProps {
    open: boolean;
    currentPdp: any;
    setOpen: (open: boolean) => void;
    savePdp: (pdp: any) => void;
    where: string;
    setIsChanged: (isChanged: boolean) => void;
}

const SelectOrCreateEntreprise = ({
                                      open,
                                      currentPdp,
                                      setOpen,
                                      savePdp,
                                      where,
                                      setIsChanged
                                  }: SelectOrCreateEntrepriseProps) => {
    const [openCreateEntreprise, setOpenCreateEntreprise] = useState(false);
    const [enterprises, setEntreprises] = useState<Entreprise[]>([]);
    const [selectedEntreprise, setSelectedEntreprise] = useState<Entreprise | null>(null);
    const { getAllEntreprises } = useEntreprise();

    const [createdEntreprise, setCreatedEntreprise] = useState<Entreprise | null>(null);

    useEffect(() => {
        getAllEntreprises().then((response) => {
            setEntreprises(response);
        });
    }, [openCreateEntreprise]);

    const alreadySelected = (entreprise: Entreprise) => {
        if (where === "sousTraitants") {
            return currentPdp?.sousTraitants?.some((e: Entreprise) => e.id === entreprise.id);
        }
        if (where === "entrepriseExterieure") {
            return currentPdp?.entrepriseexterieure?.some((e: Entreprise) => e.id === entreprise.id);
        }
        return false;
    };

    const handleSelectEntreprise = (entreprise: Entreprise) => {
        if (!alreadySelected(entreprise)) {
            setSelectedEntreprise(selectedEntreprise?.id === entreprise.id ? null : entreprise);
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
                <Typography variant="h6" sx={{ mb: 2 }}>Select an Enterprise</Typography>
                <List>
                    {enterprises.map((entreprise) => {
                        const isAlreadySelected = alreadySelected(entreprise);

                        return (
                            <ListItem
                                key={entreprise.id}
                                onClick={() => handleSelectEntreprise(entreprise)}
                                sx={{
                                    borderRadius: 2,
                                    border: "1px solid gray",
                                    mb: 1,
                                    cursor: isAlreadySelected ? "not-allowed" : "pointer",
                                    transition: "0.3s",
                                    backgroundColor: isAlreadySelected
                                        ? "lightgray"
                                        : selectedEntreprise?.id === entreprise.id
                                            ? "lightblue"
                                            : "white",
                                    opacity: isAlreadySelected ? 0.6 : 1,
                                    "&:hover": {
                                        backgroundColor: isAlreadySelected
                                            ? "lightgray"
                                            : selectedEntreprise?.id === entreprise.id
                                                ? "lightblue"
                                                : "lightgray",
                                    },
                                }}
                                component="button"
                                disabled={isAlreadySelected}
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        src={entreprise?.image ? `data:${entreprise.image.mimeType};base64,${entreprise.image.imageData}` : defaultImage}
                                        alt={entreprise.nom}
                                    />
                                </ListItemAvatar>
                                <ListItemText primary={entreprise.nom} secondary={entreprise.fonction} />
                            </ListItem>
                        );
                    })}
                </List>

                <Divider sx={{ my: 2 }} />

                <Button
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    onClick={() => setOpenCreateEntreprise(true)}
                    sx={{ mb: 2 }}
                >
                    Create New Enterprise
                </Button>

                {/!* Action Buttons Fixed at Bottom *!/}
                <Box sx={{ position: "sticky", bottom: -20, bgcolor: "background.paper", p: 2, display: "flex", justifyContent: "space-between" }}>
                    <Button onClick={() => setOpen(false)} color={"error"}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            if (currentPdp && selectedEntreprise) {
                                if (where === "sousTraitants") currentPdp.sousTraitants?.push(selectedEntreprise);
                                if (where === "entrepriseExterieure") currentPdp.entrepriseexterieure?.push(selectedEntreprise);
                                if (savePdp) savePdp(currentPdp);
                                setIsChanged(true);
                            }
                            setOpen(false);
                        }}
                        disabled={!selectedEntreprise}
                    >
                        Validate
                    </Button>
                </Box>

                <EditEntreprise
                    entreprise={createdEntreprise}
                    setEntreprise={setCreatedEntreprise}
                    open={openCreateEntreprise}
                    setOpen={setOpenCreateEntreprise}
                    isEdit={false}
                />
            </Box>
        </Modal>
    );
};

export default SelectOrCreateEntreprise;
*/

import useEntreprise from "../../hooks/useEntreprise.ts";
import usePdp from "../../hooks/usePdp.ts";
import {useState} from "react";
import SelectOrCreate from "./SelectOrCreate.tsx";
import {Entreprise} from "../../utils/entreprise/Entreprise.ts";
import defaultImage from "../../assets/default_entreprise_image.png";
import EditEntreprise from "../Entreprise/EditEntreprise.tsx";
import {Pdp} from "../../utils/pdp/Pdp.ts";
interface SelectOrCreateEntrepriseProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    currentPdp: Pdp;
    savePdp: (pdp: any) => void;
    setIsChanged: (isChanged: boolean) => void;
    where: keyof Pdp;
}
const SelectOrCreateEntreprise = (props: SelectOrCreateEntrepriseProps) => {
    const { getAllEntreprises } = useEntreprise();




    const [openCreateEntreprise, setOpenCreateEntreprise] = useState(false);


    const alreadySelected = (entreprise: Entreprise):boolean => {
        if (props.where === "sousTraitants") {
            return props.currentPdp?.sousTraitants?.some((e: Entreprise) => e.id === entreprise.id) as boolean;
        }
        if (props.where === "entrepriseutilisatrice") {
            return props.currentPdp?.entrepriseexterieure?.some((e: Entreprise) => e.id === entreprise.id) as boolean;
        }
        if(props.where === "entrepriseexterieure"){
            return props.currentPdp?.entrepriseexterieure?.some((e: Entreprise) => e.id === entreprise.id) as boolean;
        }
        return false;
    }

    return (
        <SelectOrCreate<Entreprise>
            {...props}
            where={props.where ? props.where : "entrepriseexterieure"}
            fetchItems={getAllEntreprises}
            alreadySelected={alreadySelected}
            getItemId={(entreprise:Entreprise) => entreprise?.id as number}
            getItemTitle={(entreprise:Entreprise) => entreprise?.nom as string}
            getItemDescription={(entreprise:Entreprise) => entreprise.fonction as string}
            getItemImage={(entreprise) => entreprise?.image ? `data:${entreprise.image.mimeType};base64,${entreprise.image.imageData}` : defaultImage}

            openCreate={openCreateEntreprise}
            setOpenCreate={setOpenCreateEntreprise}

            createComponent={
                <EditEntreprise
                    entreprise={null}
                    setEntreprise={(newEntreprise: Entreprise) => props.setIsChanged(true)}
                    open={openCreateEntreprise}
                    setOpen={setOpenCreateEntreprise}
                    isEdit={false}
                />
            }
        />
    );
};

export default SelectOrCreateEntreprise