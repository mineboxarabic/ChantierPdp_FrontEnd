import React, { useState, useEffect } from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    TextField,
    Checkbox,
    FormControlLabel, Paper,
} from "@mui/material";
import  Risque  from "../../utils/Risque/Risque";
import useRisque from "../../hooks/useRisque.ts";
import {useNotifications} from "@toolpad/core/useNotifications";
import {Image} from "@mui/icons-material";
import defaultImage from "../../assets/default_entreprise_image.png";
import Grid from "@mui/material/Grid2";
interface EditRisqueProps {
    risque: Risque | null;
    setRisque: (risque: Risque) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    isEdit: boolean;
}

const EditRisque = ({ risque, setRisque, open, setOpen, isEdit }: EditRisqueProps) => {
    const [localRisque, setLocalRisque] = useState<Risque | null>(null);

    const {createRisque, updateRisque, deleteRisque} = useRisque();

    const [openDelete, setOpenDelete] = useState(false);

    const notifications = useNotifications();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);


    useEffect(() => {
        if (isEdit && risque) {
            setLocalRisque({ ...risque });
        } else {
            setLocalRisque({
                id: 0,
                title: "",
                description: "",
                logo: { mimeType: "", imageData: "" },
                travailleDangereux: false,
                travaillePermit: false,
            });
        }
    }, [open, isEdit, risque]);

    const handleSave = () => {
        if (localRisque) {

            if(isEdit){
                updateRisque(localRisque, localRisque.id).then((response:Risque) => {
                    setRisque(response);
                    setOpen(false);
                    notifications.show("Risque updated successfully", {severity: "success", autoHideDuration: 2000});
                }
                );
            }else{
                createRisque(localRisque).then((response:Risque) => {
                    setRisque(response);
                    console.log("response",response);
                    notifications.show("Risque created successfully", {severity: "success", autoHideDuration: 2000});
                    setOpen(false);
                });
            }

            setOpen(false);

        }
    };

    const handleChange = (field: keyof Risque, value: any) => {
        if (localRisque) {
            setLocalRisque({ ...localRisque, [field]: value });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                notifications.show("File size exceeds 2MB", { severity: "error" });
                return;
            }
            if (!["image/png", "image/jpeg"].includes(file.type)) {
                notifications.show("Invalid file type", { severity: "error" });
                return;
            }

            // Create temporary preview URL
            const tempImageUrl = URL.createObjectURL(file);
            setPreviewUrl(tempImageUrl);

            // Convert the file to Base64 for backend storage
            const reader = new FileReader();
            reader.onload = () => {
                const imageDataString = reader.result?.toString().split(",")[1];
                if (imageDataString) {
                    setLocalRisque({
                        ...localRisque,
                        logo: {
                            mimeType: file.type,
                            imageData: imageDataString
                        }
                    } as Risque);
                }
            };
            reader.readAsDataURL(file);
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
                    width: 600,
                    bgcolor: "background.paper",
                    borderRadius: 4,
                    boxShadow: 24,
                    p: 4,
                    overflowY: "auto",

                }}
            >
                <Grid container spacing={2} sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",

                }}>
                <Grid size={{xs:12}}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {isEdit ? "Edit Risque" : "Create Risque"}
                    </Typography>
                </Grid>

                    <Grid size={{xs:12, md:6}}>
                        <Paper
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: 200,
                            width: 200,
                            marginBottom: 2,
                            borderRadius: 4,
                            'img': {
                                objectFit: "cover",
                                width: "100%",

                            }

                        }}
                        >
                            <img


                                src={previewUrl && localRisque?.logo?.imageData ? `data:${localRisque?.logo?.mimeType};base64,${localRisque?.logo?.imageData}` : defaultImage}
                                alt="Logo Preview" style={{width: "100%", marginBottom: 16}}/>


                        </Paper>


                        <Button
                            variant="contained"
                            component="label"
                            htmlFor="contained-button-file"
                            sx={{mb: 2}}
                        >
                            Upload Logo
                        </Button>

                        <input
                            accept="image/*"
                    id="contained-button-file"
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileChange}

                />
                </Grid>

                    <Grid size={{xs:12}}>
                <TextField
                    fullWidth
                    label="Title"
                    value={localRisque?.title || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    sx={{ mb: 2 }}
                />
                    </Grid>
                    <Grid size={{xs:12}}>

                    <TextField
                    fullWidth
                    label="Description"
                    value={localRisque?.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                    sx={{ mb: 2 }}
                />

                    </Grid>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={localRisque?.travailleDangereux || false}
                            onChange={(e) => handleChange("travailleDangereux", e.target.checked)}
                        />
                    }
                    label="Travaille Dangereux"
                    sx={{ mb: 2 }}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={localRisque?.travaillePermit || false}
                            onChange={(e) => handleChange("travaillePermit", e.target.checked)}
                        />
                    }
                    label="Travaille Permit"
                />
                </Grid>
                <Box sx={{ mt: 3, textAlign: "center" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        sx={{ mr: 2 }}
                    >
                        Save
                    </Button>

                    {
                        isEdit && (
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => setOpenDelete(true)}
                                sx={{ mr: 2 }}
                            >
                                Delete
                            </Button>
                        )
                    }
                    {

                        isEdit && (


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
                                    Are you sure you want to delete this Risque?
                                </Typography>
                                <Box sx={{ mt: 3, textAlign: "center" }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            if(localRisque){
                                                deleteRisque(localRisque.id).then(() => {
                                                    setOpenDelete(false);
                                                    notifications.show("Risque deleted successfully", {severity: "success", autoHideDuration: 2000});
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
                        )
                    }

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

export default EditRisque;
