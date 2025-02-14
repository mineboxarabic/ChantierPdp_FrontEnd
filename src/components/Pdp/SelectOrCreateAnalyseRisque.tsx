import { Box, Card, CardContent, Typography, Button, Modal } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useEffect, useState } from "react";
import AnalyseDeRisque from "../../utils/AnalyseDeRisque/AnalyseDeRisque.ts";
import useAnalyseRisque from "../../hooks/useAnalyseRisque";

import defaultImage from "../../assets/default_entreprise_image.png";
import ObjectAnswered from "../../utils/pdp/ObjectAnswered";
import { Pdp } from "../../utils/pdp/Pdp";
import usePdp from "../../hooks/usePdp";
import ObjectAnsweredEntreprises from "../../utils/pdp/ObjectAnsweredEntreprises.ts";
import EditAnalyseRisque from "../AnalyseDeRisque/EditAnalyseRisque.tsx";

interface SelectOrCreateAnalyseRisqueProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    currentPdp: Pdp;
    savePdp: (pdp: Pdp) => void;
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
