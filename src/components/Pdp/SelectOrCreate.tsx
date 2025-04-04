import {
    Box,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography,
    Button,
    Modal,
    Divider,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useEffect, useState, ReactNode } from "react";
import {Pdp} from "../../utils/entities/Pdp.ts";
import ObjectAnswered from "../../utils/pdp/ObjectAnswered.ts";
import ObjectAnsweredEntreprises from "../../utils/pdp/ObjectAnsweredEntreprises.ts";

interface SelectOrCreateProps<T> {
    open: boolean;
    setOpen: (open: boolean) => void;
    currentPdp: Pdp;
    savePdp: (pdp: any) => void;
    where: keyof Pdp; // Define where the selected item should be stored
    fetchItems: () => Promise<T[]>; // Fetch function
    linkItem?: (itemId: number, pdpId: number) => Promise<ObjectAnswered | ObjectAnsweredEntreprises>; // Linking function
    alreadySelected: (item: T) => boolean; // Function to check if an item is selected
    getItemId: (item: T) => number; // Function to get the item ID
    getItemTitle: (item: T) => string; // Function to get item title
    getItemDescription?: (item: T) => string; // Optional function for description
    getItemImage?: (item: T) => string | null; // Optional function for image
    createComponent: ReactNode; // Component for creation modal
    setIsChanged: (isChanged: boolean) => void;
    openCreate: boolean;
    setOpenCreate: (openCreate: boolean) => void;

    onValidate?: (item: T) => void;

}

const SelectOrCreate = <T,>({
                                open,
                                setOpen,
                                currentPdp,
                                savePdp,
                                where,
                                fetchItems,
                                linkItem,
                                alreadySelected,
                                getItemId,
                                getItemTitle,
                                getItemDescription,
                                getItemImage,
                                createComponent,
                                setIsChanged,
                                openCreate,
                                setOpenCreate,
        onValidate
                            }: SelectOrCreateProps<T>) => {
    const [items, setItems] = useState<T[]>([]);
    const [selectedItem, setSelectedItem] = useState<T | null>(null);

    useEffect(() => {
        fetchItems().then(setItems);
    }, [openCreate]);

    const handleSelectItem = (item: T) => {
        if (!alreadySelected(item)) {
            setSelectedItem(selectedItem === item ? null : item);
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
                    width: "50%",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "80vh",
                    overflowY: "auto",
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>Select an Item</Typography>
                <List>
                    {items.map((item, index) => {
                        const isAlreadySelected = alreadySelected(item);
                        return (
                            <ListItem
                                key={index}
                                onClick={() => handleSelectItem(item)}
                                sx={{
                                    borderRadius: 2,
                                    border: "1px solid gray",
                                    mb: 1,
                                    cursor: isAlreadySelected ? "not-allowed" : "pointer",
                                    transition: "0.3s",
                                    backgroundColor: isAlreadySelected
                                        ? "lightgray"
                                        : selectedItem === item
                                            ? "lightblue"
                                            : "white",
                                    opacity: isAlreadySelected ? 0.6 : 1,
                                    "&:hover": {
                                        backgroundColor: isAlreadySelected ? "lightgray" : "lightgray",
                                    },
                                }}
                                component="button"
                                disabled={isAlreadySelected}
                            >
                                <ListItemAvatar>
                                    <Avatar src={getItemImage?.(item) || ""} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={getItemTitle(item)}
                                    secondary={getItemDescription?.(item)}
                                />
                            </ListItem>
                        );
                    })}
                </List>

                <Divider sx={{ my: 2 }} />

                <Button
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    onClick={() => setOpenCreate(true)}
                    sx={{ mb: 2 }}
                >
                    Create New Item
                </Button>

                <Box sx={{ position: "sticky", bottom: -20, bgcolor: "background.paper", p: 2, display: "flex", justifyContent: "space-between" }}>
                    <Button onClick={() => setOpen(false)} color={"error"}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {

                            if(onValidate) {
                                onValidate(selectedItem as T);
                                console.log('cureenntt',currentPdp)

                            }else{


                                if (currentPdp && currentPdp.id && selectedItem) {
                                    if(linkItem) {
                                        linkItem(getItemId(selectedItem), currentPdp?.id as number).then((reponse) => {
                                            if(currentPdp && currentPdp[where]){
                                                if(Array.isArray(currentPdp[where])) {
                                                    currentPdp[where].push(reponse);
                                                }
                                            }

                                            savePdp({ ...currentPdp });
                                            setIsChanged(true);
                                        });
                                    }else {
                                        if(currentPdp && currentPdp[where]){
                                            if(Array.isArray(currentPdp[where])) {
                                                currentPdp[where].push(selectedItem);
                                            }
                                        }
                                    }

                                }else {
                                    if(currentPdp && currentPdp[where]){
                                        if(Array.isArray(currentPdp[where])) {
                                            currentPdp[where].push(selectedItem);
                                        }
                                    }
                                }
                            }


                            setOpen(false);
                        }}
                        disabled={!selectedItem}
                    >
                        Validate
                    </Button>
                </Box>

                {createComponent}
            </Box>
        </Modal>
    );
};

export default SelectOrCreate;
