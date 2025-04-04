import React, { useState, useEffect } from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    TextField,
    Paper,
} from "@mui/material";
import Localisation from "../../utils/entities/Localisation.ts";
import useLocalisation from "../../hooks/useLocalisation";
import { useNotifications } from "@toolpad/core/useNotifications";
import Grid from "@mui/material/Grid2";

interface EditLocalisationProps {
    localisation: Localisation | null;
    setLocalisation: (localisation: Localisation) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    isEdit: boolean;
}

const EditLocalisation = ({ localisation, setLocalisation, open, setOpen, isEdit }: EditLocalisationProps) => {
    const [localLocalisation, setLocalLocalisation] = useState<Localisation | null>(null);
    const { createLocalisation, updateLocalisation, deleteLocalisation } = useLocalisation();
    const [openDelete, setOpenDelete] = useState(false);
    const notifications = useNotifications();

    useEffect(() => {
        if (isEdit && localisation) {
            setLocalLocalisation({ ...localisation });
        } else {
            setLocalLocalisation({
                id: 0,
                nom: "",
                code: "",
                description: "",
            });
        }
    }, [open, isEdit, localisation]);

    const handleSave = () => {
        if (localLocalisation) {
            if (isEdit) {
                updateLocalisation(localLocalisation, localLocalisation?.id as number).then((response: Localisation) => {
                    setLocalisation(response);
                    setOpen(false);
                    notifications.show("Localisation updated successfully", { severity: "success", autoHideDuration: 2000 });
                });
            } else {
                createLocalisation(localLocalisation).then((response: Localisation) => {
                    setLocalisation(response);
                    notifications.show("Localisation created successfully", { severity: "success", autoHideDuration: 2000 });
                    setOpen(false);
                });
            }
        }
    };

    const handleChange = (field: keyof Localisation, value: any) => {
        if (localLocalisation) {
            setLocalLocalisation({ ...localLocalisation, [field]: value });
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
                    width: 500,
                    bgcolor: "background.paper",
                    borderRadius: 4,
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {isEdit ? "Edit Localisation" : "Create Localisation"}
                </Typography>

                <TextField
                    fullWidth
                    label="Nom"
                    value={localLocalisation?.nom || ""}
                    onChange={(e) => handleChange("nom", e.target.value)}
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    label="Code"
                    value={localLocalisation?.code || ""}
                    onChange={(e) => handleChange("code", e.target.value)}
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    label="Description"
                    value={localLocalisation?.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                    sx={{ mb: 2 }}
                />

                <Box sx={{ mt: 3, textAlign: "center" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        sx={{ mr: 2 }}
                    >
                        Save
                    </Button>

                    {isEdit && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setOpenDelete(true)}
                            sx={{ mr: 2 }}
                        >
                            Delete
                        </Button>
                    )}

                    {isEdit && (
                        <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    width: 400,
                                    bgcolor: "background.paper",
                                    borderRadius: 4,
                                    boxShadow: 24,
                                    p: 4,
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Are you sure you want to delete this Localisation?
                                </Typography>
                                <Box sx={{ mt: 3, textAlign: "center" }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            if (localLocalisation) {
                                                deleteLocalisation(localLocalisation.id as number).then(() => {
                                                    setOpenDelete(false);
                                                    notifications.show("Localisation deleted successfully", { severity: "success", autoHideDuration: 2000 });
                                                    setOpen(false);
                                                });
                                            }
                                        }}
                                        sx={{ mr: 2 }}
                                    >
                                        Yes
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => setOpenDelete(false)}
                                    >
                                        No
                                    </Button>
                                </Box>
                            </Box>
                        </Modal>
                    )}

                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditLocalisation;
