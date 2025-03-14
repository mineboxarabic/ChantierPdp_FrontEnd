import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

const ConfirmDeleteDialog = ({ open, onClose, onConfirm, dialogTitle = "Confirm Deletion", dialogText = "Are you sure you want to delete this item? This action cannot be undone." }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>
                <DialogContentText>{dialogText}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={() => { onConfirm(); onClose(); }} color="error">Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDeleteDialog;
