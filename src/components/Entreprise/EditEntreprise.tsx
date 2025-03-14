import React, { useEffect, useState } from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    Autocomplete,
    Dialog,
} from "@mui/material";
import { useNotifications } from "@toolpad/core/useNotifications";
import useEntreprise from "../../hooks/useEntreprise";
import useUser from "../../hooks/useUser";
import defaultImage from "../../assets/default_entreprise_image.png";
import { Entreprise } from "../../utils/entreprise/Entreprise.ts";
import EntrepriseMapper from "../../utils/entreprise/EntrepriseMapper.ts";
import User from "../../utils/user/User.ts";

import Grid from "@mui/material/Grid2";
interface EditEntrepriseProps {
    entreprise: Entreprise | null;
    setEntreprise: (entreprise: Entreprise) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    isEdit: boolean;
}

const EditEntreprise = ({
                            entreprise,
                            setEntreprise,
                            open,
                            setOpen,
                            isEdit,
                        }: EditEntrepriseProps) => {



    const [users, setUsers] = useState<User[]>([]);
    const { getUsers } = useUser();
    const { updateEntreprise, deleteEntreprise, createEntreprise } =
        useEntreprise();
    const notifications = useNotifications();
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);


    const handleClose = () => {
        setOpen(false);
        setOpenDeleteModal(false);
    };

    const handleSave = () => {
        if (!entreprise) {
            notifications.show("No entreprise to save", { severity: "error" });
            return;
        }

        if (isEdit) {
            updateEntreprise(entreprise, entreprise.id as number)
                .then(() => {
                        notifications.show("Entreprise updated successfully", {severity: "success", autoHideDuration: 2000});
                        handleClose();
                    })
                .catch(() =>
                    notifications.show("Error updating entreprise", { severity: "error" })
                );
        } else {
            createEntreprise(entreprise)
                .then(() => {

                    //Show notification for 2 secondss
                    notifications.show("Entreprise created successfully", { severity: "success", autoHideDuration: 2000})
                        handleClose(); // Close the modal after success
                    }
                )
                .catch(() =>
                    notifications.show("Error creating entreprise", { severity: "error", autoHideDuration: 2000 })
                );
        }
    };

    const handleDelete = () => {
        if (entreprise) {
            deleteEntreprise(entreprise.id as number)
                .then(() => {
                    notifications.show("Entreprise deleted successfully", {
                        severity: "success",
                    });
                    handleClose();
                })
                .catch(() =>
                    notifications.show("Error deleting entreprise", { severity: "error" })
                );
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
                    setEntreprise({
                        ...entreprise,
                        image: {
                            mimeType: file.type,
                            imageData: imageDataString
                        }
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        // Reset preview URL when entreprise changes or modal closes
        if (!open || !isEdit) {
            setPreviewUrl(null);
        }
    }, [open, isEdit]);

    useEffect(() => {
        if (!isEdit) {
            const newEntreprise = EntrepriseMapper.createEmptyEntreprise();
            setEntreprise(newEntreprise);
        } else if (!entreprise) {
            setEntreprise({}); // Ensure entreprise is not null
        }
    }, [open]);


    useEffect(() => {
        getUsers().then((response: User[]) => {
            setUsers(response);
        });
    }, []);
    useEffect(() => {
            console.log("entreprise?.image?.imageData", entreprise);
    }, [entreprise]);
    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "90%",
                    height: "90%",
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                    maxHeight: "80vh",
                    overflowY: "auto",
                }}
            >
                <Dialog
                    open={openDeleteModal}
                    onClose={() => setOpenDeleteModal(false)}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <Box sx={{ width: 400, bgcolor: "background.paper", boxShadow: 24, p: 4 }}>
                        <Typography variant="h5" component="div">
                            Are you sure you want to delete this entreprise?
                        </Typography>
                        <Button onClick={handleDelete}>Yes</Button>
                        <Button onClick={() => setOpenDeleteModal(false)}>No</Button>
                    </Box>
                </Dialog>

                <Button
                    sx={{ position: "absolute", top: 16, right: 16, color: "red" }}
                    onClick={handleClose}
                >
                    X
                </Button>

                <Typography variant="h5" component="div">
                    {isEdit ? "Edit Entreprise" : "Create Entreprise"}
                </Typography>

                <Grid container spacing={2}>
                    <Grid size={{xs: 12, md: 12}} sx={{textAlign: "center"}}>
                        <img
                            src={previewUrl || entreprise?.image?.imageData || defaultImage}
                            alt="Entreprise"
                            style={{
                                width: "300px",
                                height: "300px",
                                objectFit: "cover",
                                marginBottom: "20px",
                                borderRadius: "10px",
                            }}
                        />;

                        <input type="file" accept="image/*" onChange={handleFileChange}/>
                    </Grid>

                    <Grid size={{xs: 12, md: 6}}>
                        <TextField
                            fullWidth
                            label="Nom"
                            value={entreprise?.nom || ""}
                            onChange={(e) => setEntreprise({...entreprise, nom: e.target.value})}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Fonction"
                            value={entreprise?.fonction || ""}
                            onChange={(e) => setEntreprise({ ...entreprise, fonction: e.target.value })}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={entreprise?.isUtilisatrice || false}
                                    onChange={(e) =>
                                        setEntreprise({ ...entreprise, isUtilisatrice: e.target.checked })
                                    }
                                />
                            }
                            label="Is utilisatrice"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Numéro de téléphone"
                            value={entreprise?.numTel || ""}
                            onChange={(e) => setEntreprise({ ...entreprise, numTel: e.target.value })}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Autocomplete
                            fullWidth
                            options={users}
                            getOptionLabel={(option: User) => `${option.name} - ${option.id}`  || ""}
                            renderInput={(params) => <TextField {...params} label="Référent PDP" />}
                            value={
                                entreprise?.referentPdp
                                    ? users.find(user => user.id === entreprise.referentPdp?.id) || null
                                    : null
                            }
                            onChange={(e, value: User | null) =>
                                setEntreprise({
                                    ...entreprise,
                                    referentPdp: value || undefined
                                })
                            }
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Autocomplete
                            fullWidth
                            options={users}
                            getOptionLabel={(option: User) =>`${option.name} - ${option.id}` || ""}
                            renderInput={(params) => <TextField {...params} label="Responsable chantier" />}
                            value={
                                entreprise?.responsableChantier
                                    ? users.find(user => user.id === entreprise.responsableChantier?.id) || null
                                    : null
                            }
                            onChange={(e, value: User | null) =>
                                setEntreprise({
                                    ...entreprise,
                                    responsableChantier: value || undefined
                                })
                            }
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Raison sociale"
                            value={entreprise?.raisonSociale || ""}
                            onChange={(e) =>
                                setEntreprise({ ...entreprise, raisonSociale: e.target.value })
                            }
                        />
                    </Grid>
                </Grid>

                <Button onClick={handleSave}>Save</Button>
                <Button onClick={handleClose}>Close</Button>
                {isEdit && (
                    <Button sx={{ color: "red" }} onClick={() => setOpenDeleteModal(true)}>
                        Delete
                    </Button>
                )}
            </Box>
        </Modal>
    );
};

export default EditEntreprise;
