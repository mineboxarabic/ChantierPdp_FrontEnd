import { Box, Card, CardContent, Typography, Button, Modal } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useEffect, useState } from "react";
import Dispositif from "../../utils/dispositif/Dispositif";
import useDispositif from "../../hooks/useDispositif.ts";
import EditDispositif from "../Dispositif/EditDispositif.tsx";
import defaultImage from "../../assets/default_entreprise_image.png";
import ObjectAnswered from "../../utils/pdp/ObjectAnswered.ts";
import {Pdp} from "../../utils/pdp/Pdp.ts";
import usePdp from "../../hooks/usePdp.ts"; // Default image for dispositifs

interface SelectOrCreateDispositifProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    currentPdp: Pdp; // Replace `any` with your `Pdp` type
    savePdp: (pdp: Pdp) => void; // Replace `any` with your `Pdp` type
    where: string; // To specify where to add the dispositif (e.g., "dispositifs" or "sousTraitants")
}

const SelectOrCreateDispositif = ({ open, setOpen, currentPdp, savePdp, where }: SelectOrCreateDispositifProps) => {
    const [openCreateDispositif, setOpenCreateDispositif] = useState(false);
    const [dispositifs, setDispositifs] = useState<Dispositif[]>([]);
    const [currentDispositif, setCurrentDispositif] = useState<Dispositif | null>(null); // Track the selected dispositif
    const { getAllDispositifs } = useDispositif(); // Hook to fetch all dispositifs
    const { linkDispositifToPdp } = usePdp(); // Hook to link a dispositif to a Pdp

    // Fetch all dispositifs when the modal opens
    useEffect(() => {
        if (open) {
            getAllDispositifs().then((response) => {
                setDispositifs(response);
            });
        }
    }, [open]);

    // Handle selecting a dispositif
    const handleSelectDispositif = (dispositif: Dispositif) => {
        setCurrentDispositif(dispositif); // Set the selected dispositif
    };

    // Save the selected dispositif to the currentPdp


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
                    Select or Create Dispositif
                </Typography>

                {/* List of existing dispositifs */}
                {dispositifs.map((dispositif) => (
                    <Card
                        key={dispositif.id}
                        sx={{
                            width: "100%",
                            margin: "10px auto",
                            cursor: "pointer",
                            border: currentDispositif?.id === dispositif.id ? "2px solid blue" : "1px solid gray", // Highlight selected dispositif
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                        onClick={() => handleSelectDispositif(dispositif)}
                    >
                        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <img
                                src={dispositif.logo?.imageData ? `data:${dispositif.logo.mimeType};base64,${dispositif.logo.imageData}` : defaultImage}
                                alt={dispositif.title}
                                style={{ width: 50, height: 50, borderRadius: 4 }}
                            />
                            <Typography variant="h6">{dispositif.title}</Typography>
                            <Typography variant="body2">{dispositif.description}</Typography>
                        </CardContent>
                    </Card>
                ))}

                {/* Button to save selected dispositif */}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={()=>{
                        linkDispositifToPdp(currentDispositif?.id as number, currentPdp?.id as number).then((response:ObjectAnswered) => {
                            //const dispositifAnswered:DispositifAnswered = {dispositif: currentDispositif, answer: false } as DispositifAnswered;

                            currentPdp.dispositifs = currentPdp.dispositifs || [];
                            currentPdp.dispositifs.push(response); // Add the new dispositif to the Pdp
                            console.log('res',response);
                            savePdp({
                                ...currentPdp,
                                dispositifs: currentPdp.dispositifs,
                            }); // Save the updated Pdp
                            setOpen(false); // Close the modal
                        });


                        setOpen(false);

                    }}
                    disabled={!currentDispositif} // Disable button if no dispositif is selected
                >
                    Save Selected Dispositif
                </Button>

                {/* Button to create a new dispositif */}
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
                    onClick={() => setOpenCreateDispositif(true)}
                >
                    <AddCircleIcon fontSize="large" />
                    <Typography>Save New Dispositif</Typography>
                </Card>

                {/* Modal for creating a new dispositif */}
                <EditDispositif
                    dispositif={null}
                    setDispositif={(newDispositif) => {
                        setDispositifs([...dispositifs, newDispositif]); // Add the new dispositif to the list
                        setCurrentDispositif(newDispositif); // Set the new dispositif as the selected dispositif
                        setOpenCreateDispositif(false); // Close the create modal
                    }}
                    open={openCreateDispositif}
                    setOpen={setOpenCreateDispositif}
                    isEdit={false}
                />
            </Box>
        </Modal>
    );
};

export default SelectOrCreateDispositif;
