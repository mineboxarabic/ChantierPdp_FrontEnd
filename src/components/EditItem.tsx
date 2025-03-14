import React, { useState, useEffect } from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    Paper, Select, MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import defaultLogo from "../assets/wornings/worning.webp";
import {useNotifications} from "@toolpad/core/useNotifications";

export interface FieldConfig<T> {
    label: string;
    type: "text" | "checkbox" | "image" | "select" | "permi";
    getter: () => any;
    setter: (value: any) => void;
    options?: { value: any; label: string }[];
}

interface EditItemProps<T> {
    open: boolean;
    setOpen: (open: boolean) => void;
    isEdit: boolean;
    title: string;
    fieldsConfig: FieldConfig<T>[];
    itemId?: number;
    onSave: () => Promise<void>;
    onDelete: () => Promise<void>;
    initialItem: T;
}

const EditItem = <T, >({
                                                open,
                                                setOpen,
                                                isEdit,
                                                title,
                                                fieldsConfig,
                                                itemId,
                                                onSave,
                                                onDelete,
                                                initialItem
                                            }: EditItemProps<T>) => {
    const [localItem, setLocalItem] = useState<T | null>(null);
    const [openDelete, setOpenDelete] = useState(false);


    const notifications = useNotifications();

    useEffect(() => {
        if (open) {
          setLocalItem(initialItem);
        }
    }, [open, isEdit, itemId]);



    useEffect(() => {



    }, [localItem]);



    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: (value: { mimeType: string; imageData: string }) => void,
        labelOfImage: string
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert("File size exceeds 2MB");
            return;
        }

        if (!["image/png", "image/jpeg"].includes(file.type)) {
            alert("Invalid file type");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const imageDataString = reader.result?.toString().split(",")[1];
            if (imageDataString) {
                setter({
                    mimeType: file.type,
                    imageData: imageDataString,
                });


            }
        };
        reader.readAsDataURL(file);
    };
    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: (value:  string ) => void,
        labelOfFile:string
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 30 * 1024 * 1024) {
            alert("File size exceeds 30MB");
            return;
        }

        if(file.type !== "application/pdf"){
            alert("Invalid file type");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          if(reader.result){

              setter(reader.result.slice(28).toString());
          }

        };
        reader.readAsDataURL(file);
        //Open the pdf file
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
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {isEdit ? `Edit ${title}` : `Create ${title}`}
                </Typography>

                <Grid container spacing={2}>
                    {fieldsConfig.map((field, index) => (
                        <Grid item xs={12} key={index}>
                            {field.type === "text" && (
                                <TextField
                                    fullWidth
                                    label={field.label}
                                    value={field.getter() || ""}
                                    onChange={(e) => field.setter(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                            )}

                            {field.type === "checkbox" && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={field.getter()}
                                            onChange={(e) => field.setter(e.target.checked)}
                                        />
                                    }
                                    label={field.label}
                                    sx={{ mb: 2 }}
                                />
                            )}

                            {field.type === "image" && (
                                <>
                                    <Paper
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: 200,
                                            width: 200,
                                            marginBottom: 2,
                                            borderRadius: 4,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <img
                                            src={
                                                field.getter()?.imageData
                                                    ? `data:${field.getter()?.mimeType};base64,${field.getter()?.imageData}`
                                                    : defaultLogo
                                            }
                                            alt="Preview"
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    </Paper>

                                    <Button
                                        variant="contained"
                                        component="label"
                                        sx={{ mb: 2 }}
                                    >
                                        {field.getter()['imageData'] ? "Change Image" : "Upload Image"}
                                        <input
                                            accept="image/*"
                                            type="file"
                                            hidden
                                            onChange={(e) => handleImageChange(e, field.setter, field.label)}
                                        />
                                    </Button>
                                </>
                            )}

                            {
                                field.type === "permi" && (
                                    <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        sx={{ mb: 2 }}
                                    >

                                        {field.getter() ? "Change File" : "Upload File"}
                                        <input
                                            accept="application/pdf"
                                            type="file"
                                            hidden
                                            onChange={(e) => handleFileChange(e, field.setter, field.label)}
                                        />
                                    </Button>
                                        <Button variant="outlined" color="primary" onClick={()=>{

                                            //open the file in a new tab
                                            const newWindow:Window = window.open();
                                            newWindow?.document.write(`<embed width="100%" height="100%" src="data:application/pdf;base64,${field.getter()}" type="application/pdf" />`);
                                        }}>
                                            Open File
                                        </Button>
                                    </Box>

                                )
                            }



                            {
                                field.type === "select" && (
                                    <Select fullWidth
                                            value={field.getter() || ""}
                                            onChange={(e) => field.setter(e.target.value)}
                                            sx={{ mb: 2 }}
                                    >
                                        {field.options?.map((option, index) => (
                                            <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
                                        ))}
                                    </Select>
                                    )

                            }


                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ mt: 3, textAlign: "center" }}>
                    <Button variant="contained" color="primary" onClick={()=>{
                        onSave().then(()=>{
                            notifications.show("Saved successfully", {severity: "success", autoHideDuration: 2000});
                        }).catch(()=>{
                            notifications.show("Failed to save", {severity: "error", autoHideDuration: 2000});
                        })
                    }} sx={{ mr: 2 }}>
                        Save
                    </Button>

                    {isEdit && (
                        <>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => setOpenDelete(true)}
                                sx={{ mr: 2 }}
                            >
                                Delete
                            </Button>

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
                                        Are you sure you want to delete this {title}?
                                    </Typography>
                                    <Box sx={{ mt: 3, textAlign: "center" }}>
                                        <Button variant="contained" color="primary" onClick={()=>{
                                            onDelete().then(()=>{
                                                notifications.show("Deleted successfully", {severity: "success", autoHideDuration: 2000});
                                            } ).catch(()=>{
                                                notifications.show("Failed to delete", {severity: "error", autoHideDuration: 2000});
                                            })
                                        }} sx={{ mr: 2 }}>
                                            Yes
                                        </Button>
                                        <Button variant="outlined" color="secondary" onClick={() => setOpenDelete(false)}>
                                            No
                                        </Button>
                                    </Box>
                                </Box>
                            </Modal>
                        </>
                    )}

                    <Button variant="outlined" color="secondary" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditItem;
