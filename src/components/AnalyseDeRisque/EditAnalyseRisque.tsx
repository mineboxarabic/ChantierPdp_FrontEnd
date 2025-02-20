import { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import AnalyseDeRisqueDTO from "../../utils/AnalyseDeRisque/AnalyseDeRisqueDTO.ts";
import SelectOrCreateRisque from "../Pdp/SelectOrCreateRisque.tsx";
import Risque from "../../utils/Risque/Risque";
import useAnalyseRisque from "../../hooks/useAnalyseRisque";
import useRisque from "../../hooks/useRisque";
import AnalyseDeRisque from "../../utils/AnalyseDeRisque/AnalyseDeRisque.ts";
import {Pdp} from "../../utils/pdp/Pdp.ts";

interface EditAnalyseRisqueProps {
    analyse: AnalyseDeRisque | null;
    setAnalyse: (analyse: AnalyseDeRisque) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    savePdp: (pdp: Pdp) => void;
    currentPdp: Pdp;
    isEdit: boolean;
    setIsChanged: (isChanged: boolean) => void;
}

const EditAnalyseRisque = ({ analyse, setIsChanged,savePdp,setAnalyse, open, setOpen, isEdit,currentPdp }: EditAnalyseRisqueProps) => {
    const [localAnalyse, setLocalAnalyse] = useState<AnalyseDeRisque | null>(null);
    const [openRisqueSelector, setOpenRisqueSelector] = useState(false);
    const { createAnalyse, updateAnalyse,linkRisqueToAnalyse } = useAnalyseRisque();
    const { getRisque } = useRisque();

    useEffect(() => {
        if (isEdit && analyse) {
            setLocalAnalyse({ ...analyse });
        } else {
            setLocalAnalyse({
                id: 0,
                risque: null as any,
                deroulementDesTaches: "",
                moyensUtilises: "",
                mesuresDePrevention: "",
            });
        }
    }, [open, isEdit, analyse]);




    const handleSave = async () => {
        if (!localAnalyse?.risque) {
            alert("Please select a Risque before saving.");
            return;
        }

        try {
            let savedAnalyse;
            if (isEdit && localAnalyse.id) {
                savedAnalyse = await updateAnalyse(localAnalyse.id, localAnalyse);
            } else {
                savedAnalyse = await createAnalyse(localAnalyse);
                linkRisqueToAnalyse(savedAnalyse.id,localAnalyse.risque.id);
            }
            setAnalyse(savedAnalyse);
            setOpen(false);
        } catch (error) {
            console.error("Error saving Analyse de Risque:", error);
            alert("An error occurred while saving. Please try again.");
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
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {isEdit ? "Edit Analyse de Risque" : "Create New Analyse de Risque"}
                </Typography>
                <TextField
                    fullWidth
                    label="Deroulement Des Taches"
                    value={localAnalyse?.deroulementDesTaches || ""}
                    onChange={(e) => setLocalAnalyse((prev) => prev ? { ...prev, deroulementDesTaches: e.target.value } : prev)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Moyens Utilises"
                    value={localAnalyse?.moyensUtilises || ""}
                    onChange={(e) => setLocalAnalyse((prev) => prev ? { ...prev, moyensUtilises: e.target.value } : prev)}
                    sx={{ mb: 2 }}
                    multiline
                    rows={3}
                />
                <TextField
                    fullWidth
                    label="Mesures de Prevention"
                    value={localAnalyse?.mesuresDePrevention || ""}
                    onChange={(e) => setLocalAnalyse((prev) => prev ? { ...prev, mesuresDePrevention: e.target.value } : prev)}
                    sx={{ mb: 2 }}
                    multiline
                    rows={3}
                />
                <Button variant="outlined" fullWidth sx={{ mb: 2 }} onClick={() => setOpenRisqueSelector(true)}>
                    {localAnalyse?.risque ? `Selected Risque: ${localAnalyse?.risque?.title}` : "Select a Risque"}
                </Button>
                <Button variant="contained" color="primary" onClick={handleSave} fullWidth>
                    Save
                </Button>
                <SelectOrCreateRisque
                    open={openRisqueSelector}
                    setOpen={setOpenRisqueSelector}
                    currentPdp={currentPdp}
                    savePdp={savePdp}
                    setIsChanged={setIsChanged}
                    linkRisqueToAnalyse={linkRisqueToAnalyse}
                    analyseDeRisque={localAnalyse as AnalyseDeRisque}
                    setAnalyseDeRisque={setLocalAnalyse}
                />
            </Box>

        </Modal>
    );
};

export default EditAnalyseRisque;