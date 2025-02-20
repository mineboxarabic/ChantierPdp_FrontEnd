/*
import { Box, Card, CardContent, Typography, Button, Modal } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useEffect, useState } from "react";
import Permit from "../../utils/permit/Permit";
import usePermit from "../../hooks/usePermit.ts";
import EditPermit from "../Permit/EditPermit.tsx";
import defaultImage from "../../assets/default_entreprise_image.png";
import ObjectAnswered from "../../utils/pdp/ObjectAnswered.ts";
import { Pdp } from "../../utils/pdp/Pdp.ts";
import usePdp from "../../hooks/usePdp.ts";

interface SelectOrCreatePermitProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    currentPdp: Pdp;
    savePdp: (pdp: Pdp) => void;
    where: string;
}

const SelectOrCreatePermit = ({ open, setOpen, currentPdp, savePdp, where }: SelectOrCreatePermitProps) => {
    const [openCreatePermit, setOpenCreatePermit] = useState(false);
    const [permits, setPermits] = useState<Permit[]>([]);
    const [currentPermit, setCurrentPermit] = useState<Permit | null>(null);
    const { getAllPermits } = usePermit();
    const { linkPermitToPdp } = usePdp();

    useEffect(() => {
        if (open) {
            getAllPermits().then((response) => {
                setPermits(response);
            });
        }
    }, [open]);

    const handleSelectPermit = (permit: Permit) => {
        setCurrentPermit(permit);
    };

    const handleSavePermit = () => {
        if (currentPermit) {
            linkPermitToPdp(currentPermit.id, currentPdp.id).then((response: ObjectAnswered) => {
                currentPdp.permits = currentPdp.permits || [];
                currentPdp.permits.push(response);
                savePdp({ ...currentPdp, permits: currentPdp.permits });
                setOpen(false);
            });
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
                    width: "60%",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    maxHeight: "80vh",
                    overflowY: "auto",
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Select or Create Permit
                </Typography>

                {permits.map((permit) => (
                    <Card
                        key={permit.id}
                        sx={{
                            width: "100%",
                            margin: "10px auto",
                            cursor: "pointer",
                            border: currentPermit?.id === permit.id ? "2px solid blue" : "1px solid gray",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                        onClick={() => handleSelectPermit(permit)}
                    >
                        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <img
                                src={permit.logo?.imageData ? `data:${permit.logo.mimeType};base64,${permit.logo.imageData}` : defaultImage}
                                alt={permit.title}
                                style={{ width: 50, height: 50, borderRadius: 4 }}
                            />
                            <Typography variant="h6">{permit.title}</Typography>
                            <Typography variant="body2">{permit.description}</Typography>
                        </CardContent>
                    </Card>
                ))}

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleSavePermit}
                    disabled={!currentPermit}
                >
                    Save Selected Permit
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
                    onClick={() => setOpenCreatePermit(true)}
                >
                    <AddCircleIcon fontSize="large" />
                    <Typography>Create New Permit</Typography>
                </Card>

                <EditPermit
                    permit={null}
                    setPermit={(newPermit) => {
                        setPermits([...permits, newPermit]);
                        setCurrentPermit(newPermit);
                        setOpenCreatePermit(false);
                    }}
                    open={openCreatePermit}
                    setOpen={setOpenCreatePermit}
                    isEdit={false}
                />
            </Box>
        </Modal>
    );
};

export default SelectOrCreatePermit;
*/


import usePermit from "../../hooks/usePermit.ts";
import usePdp from "../../hooks/usePdp.ts";
import {useState} from "react";
import SelectOrCreate from "./SelectOrCreate.tsx";
import Permit from "../../utils/permit/Permit.ts";
import defaultImage from "../../assets/default_entreprise_image.png";
import EditPermit from "../Permit/EditPermit.tsx";
interface SelectOrCreatePermitProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    currentPdp: any;
    savePdp: (pdp: any) => void;
    setIsChanged: (isChanged: boolean) => void;
}
const SelectOrCreatePermit = (props: SelectOrCreatePermitProps) => {
    const { getAllPermits } = usePermit();
    const { linkPermitToPdp } = usePdp();

    const [openCreatePermit, setOpenCreatePermit] = useState(false);
    return (
        <SelectOrCreate<Permit>
            {...props}
            where="permits"
            fetchItems={getAllPermits}
            linkItem={linkPermitToPdp}
            alreadySelected={(permit) => props.currentPdp?.permits?.some((r: Permit) => r?.id === permit?.id)}
            getItemId={(permit) => permit?.id}
            getItemTitle={(permit) => permit?.title}
            getItemDescription={(permit) => permit?.description}
            getItemImage={(permit) => permit?.logo ? `data:${permit.logo.mimeType};base64,${permit.logo.imageData}` : defaultImage}

            openCreate={openCreatePermit}
            setOpenCreate={setOpenCreatePermit}

            createComponent={
                <EditPermit
                    permit={null}
                    setPermit={(newPermit: Permit) => props.setIsChanged(true)}
                    open={openCreatePermit}
                    setOpen={setOpenCreatePermit}
                    isEdit={false}
                />
            }
        />
    );
};

export default SelectOrCreatePermit;