import { Box, Card, CardContent, CardMedia, Typography, Button, Modal } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useEffect, useState } from "react";
import EditEntreprise from "../Entreprise/EditEntreprise.tsx";
import useEntreprise from "../../hooks/useEntreprise.ts";
import {Entreprise} from "../../utils/entreprise/Entreprise.ts";
import defaultImage from "../../assets/default_entreprise_image.png";


interface SelectOrCreateEntrepriseProps {
    open: boolean;
    currentPdp: any;
    setOpen: (open: boolean) => void;
    savePdp: (pdp: any) => void;
    where: string;
}

const SelectOrCreateEntreprise = ({ open, currentPdp, setOpen, savePdp,where }) => {
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

    const handleSelectEntreprise = (entreprise) => {
        setSelectedEntreprise(entreprise);
    };

    const getImage = () => {
        if (selectedEntreprise?.image) {
            return `data:${selectedEntreprise.image.mimeType};base64,${selectedEntreprise.image.imageData}`;
        }
        return "/placeholder.jpg";
    }

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
                    maxHeight: "80vh", // Add this to set a maximum height
                    overflowY: "auto", // Use "auto" for scrolling only when content overflows
                    flexWrap: "wrap", // Allow wrapping for smaller screens
                    flexDirection: "column",
                }}
            >
                {enterprises.map((entreprise:Entreprise) => (
                    <Card
                        key={entreprise.id}
                        sx={{
                            width: "100%", // Adjust width (90% of the parent container or flex container)
                            margin: "10px auto", // Center the card and add spacing
                            height: "140px", // Set a fixed height for all cards
                            cursor: "pointer",
                            border: selectedEntreprise?.id === entreprise.id ? "2px solid blue" : "1px solid gray",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Optional: add a shadow for a better look
                            display: "flex",
                            flexDirection: "row"
                        }}
                        onClick={() => handleSelectEntreprise(entreprise)}
                    >
                        <CardMedia
                            component="img"
                            height="140"
                            sx={{ width: 140, objectFit: "cover" }}
                            image={entreprise?.image ? `data:${entreprise.image.mimeType};base64,${entreprise.image.imageData}` : defaultImage}
                            alt={entreprise.nom}
                        />
                        <CardContent>
                            <Typography variant="h6">{entreprise.nom}</Typography>
                            <Typography variant="body2">{entreprise.fonction}</Typography>
                        </CardContent>
                    </Card>
                ))}

                {/* Create New Enterprise Card */}

                    <Card
                        sx={{
                            width: 200,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            border: "2px dashed gray",
                        }}
                        onClick={() => setOpenCreateEntreprise(true)}
                    >
                        <AddCircleIcon fontSize="large" />
                        <Typography>Create New</Typography>
                    </Card>

                    <Box sx={{ width: "100%", mt: 2, textAlign: "right" }}>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button
                            onClick={() => {
                                if (currentPdp && selectedEntreprise) {
                                    if(where == 'sousTraitants') currentPdp.sousTraitants?.push(selectedEntreprise);
                                    if(where == 'entrepriseExterieure') currentPdp.entrepriseexterieure?.push(selectedEntreprise);

                                    if (savePdp) savePdp(currentPdp);
                                }
                                setOpen(false);
                            }}
                            disabled={!selectedEntreprise}
                            sx={{ ml: 2 }}
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
