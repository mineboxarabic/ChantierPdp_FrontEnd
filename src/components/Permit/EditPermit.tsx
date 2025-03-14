/*
import React, { useState, useEffect } from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    TextField,
    Paper,
} from "@mui/material";
import Permit from "../../utils/permit/Permit";
import usePermit from "../../hooks/usePermit.ts";
import { useNotifications } from "@toolpad/core/useNotifications";
import defaultImage from "../../assets/default_entreprise_image.png";
import Grid from "@mui/material/Grid2";

interface EditPermitProps {
    permit: Permit | null;
    setPermit: (permit: Permit) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    isEdit: boolean;
}

const EditPermit = ({ permit, setPermit, open, setOpen, isEdit }: EditPermitProps) => {
    const [localPermit, setLocalPermit] = useState<Permit | null>(null);

    const { createPermit, updatePermit, deletePermit } = usePermit();
    const [openDelete, setOpenDelete] = useState(false);
    const notifications = useNotifications();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (isEdit && permit) {
            setLocalPermit({ ...permit });
        } else {
            setLocalPermit({
                title: "",
                description: "",
                logo: { mimeType: "", imageData: "" },
            });
        }
    }, [open, isEdit, permit]);

    const handleSave = () => {
        if (localPermit) {
            if (isEdit) {
                updatePermit(localPermit, localPermit?.id as number).then((response: Permit) => {
                    setPermit(response);
                    setOpen(false);
                    notifications.show("Permit updated successfully", { severity: "success", autoHideDuration: 2000 });
                });
            } else {
                createPermit(localPermit).then((response: Permit) => {
                    setPermit(response);
                    notifications.show("Permit created successfully", { severity: "success", autoHideDuration: 2000 });
                    setOpen(false);
                });
            }
        }
    };

    const handleChange = (field: keyof Permit, value: any) => {
        if (localPermit) {
            setLocalPermit({ ...localPermit, [field]: value });
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
                    setLocalPermit({
                        ...localPermit,
                        logo: {
                            mimeType: file.type,
                            imageData: imageDataString
                        }
                    } as Permit);
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
                    <Grid size={{xs:12}} >
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {isEdit ? "Edit Permit" : "Create Permit"}
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
                                src={previewUrl && localPermit?.logo?.imageData ? `data:${localPermit?.logo?.mimeType};base64,${localPermit?.logo?.imageData}` : defaultImage}
                                alt="Logo Preview"
                                style={{ width: "100%", marginBottom: 16 }}
                            />
                        </Paper>

                        <Button
                            variant="contained"
                            component="label"
                            htmlFor="contained-button-file"
                            sx={{ mb: 2 }}
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

                    <Grid size={{xs:12, md:6}}>
                        <TextField
                            fullWidth
                            label="Title"
                            value={localPermit?.title || ""}
                            onChange={(e) => handleChange("title", e.target.value)}
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    <Grid size={{xs:12, md:6}}>
                        <TextField
                            fullWidth
                            label="Description"
                            value={localPermit?.description || ""}
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
                                    Are you sure you want to delete this Permit?
                                </Typography>
                                <Box sx={{ mt: 3, textAlign: "center" }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            if (localPermit) {
                                                deletePermit(localPermit.id as number).then(() => {
                                                    setOpenDelete(false);
                                                    notifications.show("Permit deleted successfully", { severity: "success", autoHideDuration: 2000 });
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

export default EditPermit;
*/

import React, {useEffect, useState} from "react";
import EditItem, {FieldConfig} from "../EditItem.tsx";
import Permit from "../../utils/permit/Permit.ts";
import usePermit from "../../hooks/usePermit.ts";
import PermiTypes from "../../utils/PermiTypes.ts";

interface PermiEditorProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    isEdit: boolean;
    permit?: Permit | null;
    setPermit: (permit: Permit) => void;
}

const EditPermit = ({
                              open,
                              setOpen,
                              isEdit,
                        permit,
                        setPermit,
                          }: PermiEditorProps) => {
    const { createPermit, updatePermit, deletePermit, getPermit } = usePermit();

    const [localPermi, setLocalPermi] = useState<Permit>(
        {
            title: "",
            description: "",
            logo: { mimeType: "", imageData: "" },
            pdfData: "",
            type: PermiTypes.NONE

        }
    );


    useEffect(() => {

        if (isEdit && permit) {
                setLocalPermi(permit);
                console.log(permit);
        } else {
            setLocalPermi({
                title: "",
                description: "",
                logo: { mimeType: "", imageData: "" },
                pdfData: "",
                type: PermiTypes.NONE
            });
        }


    }, [open]);


    const fieldsConfig:FieldConfig<any>[] = [
        {
            label: "Logo",
            type: "image",
            getter: () => localPermi.logo,
            setter: (value: { mimeType: string; imageData: string }) =>
                setLocalPermi((prev) => ({ ...prev, logo: value })),
        },
        {
            label: "Title",
            type: "text",
            getter: () => localPermi.title,
            setter: (value: string) => setLocalPermi((prev) => ({ ...prev, title: value })),
        },
        {
            label: "Description",
            type: "text",
            getter: () => localPermi.description,
            setter: (value: string) => setLocalPermi((prev) => ({ ...prev, description: value })),
        },
        {
            label: "Permi",
            type: "permi",
            getter: () => localPermi.pdfData,
            setter: (value: string) => setLocalPermi((prev) => ({ ...prev, pdfData: value })),
        }

    ];


    const onSave = async() => {
        if (isEdit) {
            console.log("updating permi",localPermi);
            updatePermit(localPermi, localPermi?.id as number).then((response:Permit) => {
                    setPermit(response);
                    setOpen(false);
                }
            );
        } else {
            console.log("creating permi",localPermi);
            createPermit(localPermi).then((response:Permit) => {
                setPermit(response);
                setOpen(false);
            });
        }
    }

    const onDelete = async () => {
        console.log("deleting dispositif",localPermi);

        deletePermit(localPermi?.id as number).then(() => {
            setOpen(false);
        });
    }

    return (
        <EditItem <Permit>
            open={open}
            setOpen={setOpen}
            isEdit={isEdit}
            title="Dispositif"
            fieldsConfig={fieldsConfig}
            initialItem={localPermi}
            itemId={permit?.id}
            onSave={onSave}
            onDelete={onDelete}
        />
    );
};

export default EditPermit;
