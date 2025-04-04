/*
import React, { useState, useEffect } from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    Dialog,
} from "@mui/material";
import { useNotifications } from "@toolpad/core/useNotifications";
import  User  from "../../utils/user/User.ts";
import useUser from "../../hooks/useUser";

interface EditUserProps {
    user: User | null;
    setUser: (user: User | null) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    isEdit: boolean;
}

const EditUser = ({ user, setUser, open, setOpen, isEdit }: EditUserProps) => {
    const { updateUser, createUser, deleteUser } = useUser();
    const notifications = useNotifications();

    const [localUser, setLocalUser] = useState<User | null>(user);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    useEffect(() => {
        setLocalUser(user);
    }, [user]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        if (!localUser) {
            notifications.show("Please fill in all fields.", { severity: "error" });
            return;
        }

        if (isEdit) {
            updateUser(localUser)
                .then((updatedUser: User) => {
                    setUser(updatedUser);
                    notifications.show("User updated successfully.", { severity: "success" });
                    handleClose();
                })
                .catch(() => {
                    notifications.show("Failed to update user.", { severity: "error" });
                });
        } else {
            createUser(localUser)
                .then((newUser: User) => {
                    setUser(newUser);
                    notifications.show("User created successfully.", { severity: "success" });
                    handleClose();
                })
                .catch(() => {
                    notifications.show("Failed to create user.", { severity: "error" });
                });
        }
    };

    const handleDelete = () => {
        if (!user?.id) return;

        deleteUser(user.id)
            .then(() => {

                setOpenDeleteDialog(false);
                notifications.show("User deleted successfully.", { severity: "success" });
                handleClose();
            })
            .catch(() => {
                notifications.show("Failed to delete user.", { severity: "error" });
            });
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "90%",
                    maxWidth: 500,
                    bgcolor: "background.paper",
                    borderRadius: 4,
                    boxShadow: 5,
                    p: 4,
                }}
            >
                <Typography variant="h5" component="div" sx={{ fontWeight: "bold", marginBottom: 3 }}>
                    {isEdit ? "Edit User" : "Create User"}
                </Typography>

                <TextField
                    fullWidth
                    label="Name"
                    value={localUser?.name || ""}
                    onChange={(e) => setLocalUser({ ...localUser, name: e.target.value })}
                    sx={{ marginBottom: 2 }}
                />

                <TextField
                    fullWidth
                    label="Email"
                    value={localUser?.email || ""}
                    onChange={(e) => setLocalUser({ ...localUser, email: e.target.value })}
                    sx={{ marginBottom: 2 }}
                />

                <Select
                    fullWidth
                    value={localUser?.role || ""}
                    onChange={(e) => setLocalUser({ ...localUser, role: e.target.value })}
                    displayEmpty
                    sx={{ marginBottom: 2 }}
                >
                    <MenuItem value="">
                        <em>Select Role</em>
                    </MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                </Select>

                <Box sx={{ textAlign: "center", marginTop: 3 }}>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="primary"
                        sx={{ borderRadius: 4, marginRight: 2 }}
                    >
                        Save
                    </Button>
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        color="secondary"
                        sx={{ borderRadius: 4, marginRight: 2 }}
                    >
                        Close
                    </Button>
                    {isEdit && (
                        <Button
                            onClick={() => setOpenDeleteDialog(true)}
                            variant="outlined"
                            color="error"
                            sx={{ borderRadius: 4 }}
                        >
                            Delete
                        </Button>
                    )}
                </Box>

                <Dialog
                    open={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                    aria-labelledby="delete-dialog-title"
                    aria-describedby="delete-dialog-description"
                >
                    <Box sx={{ p: 4 }}>
                        <Typography id="delete-dialog-title" variant="h6">
                            Are you sure you want to delete this user?
                        </Typography>
                        <Box sx={{ textAlign: "center", marginTop: 3 }}>
                            <Button
                                onClick={handleDelete}
                                variant="contained"
                                color="error"
                                sx={{ marginRight: 2 }}
                            >
                                Yes, Delete
                            </Button>
                            <Button
                                onClick={() => setOpenDeleteDialog(false)}
                                variant="outlined"
                                color="secondary"
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Dialog>
            </Box>
        </Modal>
    );
};

export default EditUser;
*/


import Dispositif from "../../utils/entities/Dispositif.ts";
import User from "../../utils/entities/User.ts";
import EditItem, {FieldConfig} from "../EditItem.tsx";
import {useEffect, useState} from "react";
import useUser from "../../hooks/useUser.ts";
import UserRoles from "../../utils/user/UserRoles.ts";

interface EditUserProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    isEdit: boolean;
    user?: User | null;
    setUser: (user: User) => void;
}

const EditUser = ({ open, setOpen, isEdit, user, setUser }: EditUserProps) => {

    const [localUser, setLocalUser] = useState<User | null>();


    useEffect(() => {
        if(user){
            console.log("user is present");
            setLocalUser(user);
        }else{
            setLocalUser({
                name: "",
                email: "",
                role: UserRoles.WORKER,
            });
        }
    }, [open]);

    const { updateUser, createUser, deleteUser } = useUser();

    const fieldsConfig:FieldConfig<any>[] = [
        {
            label: "Username",
            type: "text",
            getter: () => localUser?.username,
            setter: (value: string) => setLocalUser({...localUser, username: value}),
        },
        {
            label: "Email",
            type: "text",
            getter: () => localUser?.email || "",
            setter: (value: string) => setLocalUser({...localUser, email: value}),
        },
        {
            label: "Role",
            type: "select",
            options: [
                { value: "ADMIN", label: "ADMIN" },
                { value: "WORKER", label: "WORKER" },
                { value: "other", label: "Other" },
            ],
            getter: () => localUser?.role || "",
            setter: (value: string) => setLocalUser({...localUser, role: value}),
        }
    ]


    const onSave = async  () => {
        if(isEdit){
            if(localUser){
                updateUser(localUser)
                    .then((updatedUser: User) => {
                        setUser(updatedUser);
                        setOpen(false);
                    })
                    .catch(() => {
                    });
            }
        }else{
            if(localUser){
                createUser(localUser)
                    .then((newUser: User) => {
                        setUser(newUser);
                        setOpen(false);
                    })
                    .catch(() => {
                    });
            }
        }
    }


    const onDelete = async () => {
        if(user?.id){
            deleteUser(user.id)
                .then(() => {
                    setOpen(false);
                })
                .catch(() => {
                });
        }
    }


    return (
        <EditItem open={open} setOpen={setOpen} isEdit={isEdit} title={"User"} fieldsConfig={fieldsConfig} onSave={onSave} onDelete={onDelete} initialItem={localUser}/>
    )
}

export default EditUser;