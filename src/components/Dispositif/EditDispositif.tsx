/*
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
import  Dispositif  from "../../utils/dispositif/Dispositif";
import useDispositif from "../../hooks/useDispositif.ts";
import {useNotifications} from "@toolpad/core/useNotifications";
import {Image} from "@mui/icons-material";
import defaultImage from "../../assets/default_entreprise_image.png";
import Grid from "@mui/material/Grid2";
interface EditDispositifProps {
    dispositif: Dispositif | null;
    setDispositif: (dispositif: Dispositif) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    isEdit: boolean;
}

const EditDispositif = ({ dispositif, setDispositif, open, setOpen, isEdit }: EditDispositifProps) => {
    const [localDispositif, setLocalDispositif] = useState<Dispositif | null>(null);

    const {createDispositif, updateDispositif, deleteDispositif} = useDispositif();

    const [openDelete, setOpenDelete] = useState(false);

    const notifications = useNotifications();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
console.log("dispositif",dispositif);
console.log("localDispositif",localDispositif);
    }, [dispositif]);

    useEffect(() => {
        if (isEdit && dispositif) {
            setLocalDispositif({ ...dispositif });
        } else {
            setLocalDispositif({
                id: 0,
                title: "",
                description: "",
                logo: { mimeType: "", imageData: "" },

            });
        }
    }, [open, isEdit, dispositif]);

    const handleSave = () => {
        if (localDispositif) {

            if(isEdit){
                updateDispositif(localDispositif, localDispositif.id).then((response:Dispositif) => {
                    setDispositif(response);
                    setOpen(false);
                    notifications.show("Dispositif updated successfully", {severity: "success", autoHideDuration: 2000});
                }
                );
            }else{
                createDispositif(localDispositif).then((response:Dispositif) => {
                    setDispositif(response);
                    console.log("response",response);
                    notifications.show("Dispositif created successfully", {severity: "success", autoHideDuration: 2000});
                    setOpen(false);
                });
            }

            setOpen(false);

        }
    };

    const handleChange = (field: keyof Dispositif, value: any) => {
        if (localDispositif) {
            setLocalDispositif({ ...localDispositif, [field]: value });
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
                    setLocalDispositif({
                        ...localDispositif,
                        logo: {
                            mimeType: file.type,
                            imageData: imageDataString
                        }
                    } as Dispositif);
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
                        {isEdit ? "Edit Dispositif" : "Create Dispositif"}
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


                                src={previewUrl && localDispositif?.logo?.imageData ? `data:${localDispositif?.logo?.mimeType};base64,${localDispositif?.logo?.imageData}` : defaultImage}
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
                            accept="image/!*"
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
                    value={localDispositif?.title || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    sx={{ mb: 2 }}
                />
                    </Grid>
                    <Grid size={{xs:12}}>

                    <TextField
                    fullWidth
                    label="Description"
                    value={localDispositif?.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                    sx={{ mb: 2 }}
                />

                    </Grid>


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
                                    Are you sure you want to delete this Dispositif?
                                </Typography>
                                <Box sx={{ mt: 3, textAlign: "center" }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            if(localDispositif){
                                                deleteDispositif(localDispositif.id).then(() => {
                                                    setOpenDelete(false);
                                                    notifications.show("Dispositif deleted successfully", {severity: "success", autoHideDuration: 2000});
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

export default EditDispositif;
*/
import React, { useState } from "react";
import EditItem, {FieldConfig} from "../EditItem.tsx";
import Dispositif from "../../utils/entities/Dispositif.ts";
import useDispositif from "../../hooks/useDispositif.ts";

interface DispositifEditorProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    isEdit: boolean;
    dispositif?: Dispositif | null;
    setDispositif: (dispositif: Dispositif) => void;
}

const DispositifEditor = ({
                              open,
                              setOpen,
                              isEdit,
                              dispositif,
                              setDispositif,
                          }: DispositifEditorProps) => {
    const { createDispositif, updateDispositif, deleteDispositif, getDispositif } = useDispositif();

    const [localDispositif, setLocalDispositif] = useState<Dispositif>(
         {
            title: "",
            description: "",
            logo: { mimeType: "", imageData: "" },
        }
    );

    const fieldsConfig:FieldConfig<any>[] = [
        {
            label: "Logo",
            type: "image",
            getter: () => localDispositif.logo,
            setter: (value: { mimeType: string; imageData: string }) =>
                setLocalDispositif((prev) => ({ ...prev, logo: value })),
        },
        {
            label: "Title",
            type: "text",
            getter: () => localDispositif.title,
            setter: (value: string) => setLocalDispositif((prev) => ({ ...prev, title: value })),
        },
        {
            label: "Description",
            type: "text",
            getter: () => localDispositif.description,
            setter: (value: string) => setLocalDispositif((prev) => ({ ...prev, description: value })),
        },

    ];


    const onSave = async() => {
        if (isEdit) {
            console.log("updating dispositif",localDispositif);
            updateDispositif(localDispositif, localDispositif?.id as number).then((response:Dispositif) => {
                setDispositif(response);
                setOpen(false);
            }
            );
        } else {
            console.log("creating dispositif",localDispositif);
            createDispositif(localDispositif).then((response:Dispositif) => {
                setDispositif(response);
                setOpen(false);
            });
        }
    }

    const onDelete = async () => {
        console.log("deleting dispositif",localDispositif);

        deleteDispositif(localDispositif?.id as number).then(() => {
            setOpen(false);
        });
    }

    return (
        <EditItem <Dispositif>
            open={open}
            setOpen={setOpen}
            isEdit={isEdit}
            title="Dispositif"
            fieldsConfig={fieldsConfig}
            initialItem={localDispositif}
            itemId={dispositif?.id}
            onSave={onSave}
            onDelete={onDelete}
        />
    );
};

export default DispositifEditor;
