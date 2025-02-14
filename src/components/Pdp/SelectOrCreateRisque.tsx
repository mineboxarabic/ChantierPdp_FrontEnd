import { Box, Card, CardContent, Typography, Button, Modal } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useEffect, useState } from "react";
import Risque from "../../utils/Risque/Risque";
import useRisque from "../../hooks/useRisque.ts";
import EditRisque from "../Risque/EditRisque.tsx";
import defaultImage from "../../assets/default_entreprise_image.png";
import ObjectAnswered from "../../utils/pdp/ObjectAnswered.ts";
import {Pdp} from "../../utils/pdp/Pdp.ts";
import usePdp from "../../hooks/usePdp.ts";
import useAnalyseRisque from "../../hooks/useAnalyseRisque.ts";
import AnalyseDeRisque from "../../utils/AnalyseDeRisque/AnalyseDeRisque.ts";
import ObjectAnsweredEntreprises from "../../utils/pdp/ObjectAnsweredEntreprises.ts";
import risque from "../../utils/Risque/Risque"; // Default image for risques

interface SelectOrCreateRisqueProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    currentPdp: Pdp; // Replace `any` with your `Pdp` type
    savePdp: (pdp: Pdp) => void; // Replace `any` with your `Pdp` type
    where: string; // To specify where to add the risque (e.g., "risques" or "sousTraitants")
    analyseDeRisque?:AnalyseDeRisque;
    saveAnalyseDeRisque?: (analyseDeRisque: AnalyseDeRisque) => void;
}

const SelectOrCreateRisque = ({ open, setOpen, currentPdp, savePdp, where ,analyseDeRisque, saveAnalyseDeRisque}: SelectOrCreateRisqueProps) => {
    const [openCreateRisque, setOpenCreateRisque] = useState(false);
    const [risques, setRisques] = useState<Risque[]>([]);
    const [currentRisque, setCurrentRisque] = useState<Risque | null>(null); // Track the selected risque
    const { getAllRisques } = useRisque(); // Hook to fetch all risques

    const { linkRisqueToPdp } = usePdp(); // Hook to link a risque to a Pdp
    const {linkRisqueToAnalyse } = useAnalyseRisque();
    // Fetch all risques when the modal opens
    useEffect(() => {
        if (open) {
            getAllRisques().then((response) => {
                setRisques(response);
            });
        }
    }, [open]);

    // Handle selecting a risque
    const handleSelectRisque = (risque: Risque) => {
        setCurrentRisque(risque); // Set the selected risque
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
                    Select or Create Risque
                </Typography>

                {/* List of existing risques */}
                {risques.map((risque) => (
                    <Card
                        key={risque.id}
                        sx={{
                            width: "100%",
                            margin: "10px auto",
                            cursor: "pointer",
                            border: currentRisque?.id === risque.id ? "2px solid blue" : "1px solid gray", // Highlight selected risque
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                        onClick={() => handleSelectRisque(risque)}
                    >
                        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <img
                                src={risque.logo?.imageData ? `data:${risque.logo.mimeType};base64,${risque.logo.imageData}` : defaultImage}
                                alt={risque.title}
                                style={{ width: 50, height: 50, borderRadius: 4 }}
                            />
                            <Typography variant="h6">{risque.title}</Typography>
                            <Typography variant="body2">{risque.description}</Typography>
                        </CardContent>
                    </Card>
                ))}

                {/* Button to save selected risque */}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={()=>{

                        if(analyseDeRisque !== undefined && analyseDeRisque !== null){
                            linkRisqueToAnalyse(currentRisque?.id as number, analyseDeRisque?.id as number).then((response:ObjectAnsweredEntreprises) => {
                                currentPdp.analyseDeRisques = currentPdp.analyseDeRisques || [];
                                currentPdp.analyseDeRisques.push(response); // Add the new risque to the Pdp
                                console.log('res',currentRisque);
                               /* savePdp({
                                    ...currentPdp,
                                    analyseDeRisques: currentPdp.analyseDeRisques,
                                }); // Save the updated Pdp*/
                                if(saveAnalyseDeRisque !== undefined){
                                    console.log('saveAnalyseDeRisque',
                                    {
                                    ...analyseDeRisque,
                                        risque: currentRisque as Risque,
                                    }
                                    );
                                    saveAnalyseDeRisque({
                                        ...analyseDeRisque,
                                        risque: currentRisque as Risque,
                                    });
                                }

                                setOpen(false); // Close the modal
                            }
                            );
                        }else {

                            linkRisqueToPdp(currentRisque?.id as number, currentPdp?.id as number).then((response:ObjectAnswered) => {
                                //const risqueAnswered:RisqueAnswered = {risque: currentRisque, answer: false } as RisqueAnswered;

                                currentPdp.risques = currentPdp.risques || [];
                                currentPdp.risques.push(response); // Add the new risque to the Pdp
                                console.log('res',response);
                                savePdp({
                                    ...currentPdp,
                                    risques: currentPdp.risques,
                                }); // Save the updated Pdp
                                setOpen(false); // Close the modal
                            });
                        }




                        setOpen(false);

                    }}
                    disabled={!currentRisque} // Disable button if no risque is selected
                >
                    Save Selected Risque
                </Button>

                {/* Button to create a new risque */}
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
                    onClick={() => setOpenCreateRisque(true)}
                >
                    <AddCircleIcon fontSize="large" />
                    <Typography>Save New Risque</Typography>
                </Card>

                {/* Modal for creating a new risque */}
                <EditRisque
                    risque={null}
                    setRisque={(newRisque) => {
                        setRisques([...risques, newRisque]); // Add the new risque to the list
                        setCurrentRisque(newRisque); // Set the new risque as the selected risque
                        setOpenCreateRisque(false); // Close the create modal
                    }}
                    open={openCreateRisque}
                    setOpen={setOpenCreateRisque}
                    isEdit={false}
                />
            </Box>
        </Modal>
    );
};

export default SelectOrCreateRisque;
