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
import ObjectAnsweredDTO from "../../utils/pdp/ObjectAnswered.ts";
import ObjectAnsweredEntreprises from "../../utils/pdp/ObjectAnsweredEntreprises.ts";
import {EntityRef} from "../../utils/EntityRef.ts";
import ObjectAnsweredObjects from "../../utils/ObjectAnsweredObjects.ts";
import { ParentOfRelations } from "../Interfaces.ts";


//An Item is an object that has an id and a title or the card that is displayed for each item in the select or create component
interface SelectOrCreateProps<ITEM extends {id?: number}, PARENT extends ParentOfRelations> {
    open: boolean;
    setOpen: (open: boolean) => void;


    parent: PARENT;
    saveParent: (parent: PARENT) => void;


    fetchItems: () => Promise<ITEM[]>; // Fetch function



    alreadySelected: (item: ITEM) => boolean; // Function to check if an item is selected
    objectType: ObjectAnsweredObjects;
    getItemId: (item: ITEM) => number; // Function to get the item ID
    getItemTitle: (item: ITEM) => string; // Function to get item title
    getItemDescription?: (item: ITEM) => string; // Optional function for description
    getItemImage?: (item: ITEM) => string | null; // Optional function for image
    
    createComponent: ReactNode; // Component for creation modal

    setIsChanged: (isChanged: boolean) => void;
    
    openCreate: boolean;
    setOpenCreate: (openCreate: boolean) => void;

    onValidate?: (item: ITEM) => void;

    addRelation?: (objectType: ObjectAnsweredObjects, selectedItem: ITEM) => void;
}

const SelectOrCreate = <ITEM extends {id?: number},PARENT extends  ParentOfRelations>({
                                                                             open,
                                                                             setOpen,
                                                                             parent,
                                                                             saveParent,
                                                                             fetchItems,
                                                                             alreadySelected,
                                                                             getItemId,
                                                                             getItemTitle,
                                                                             getItemDescription,
                                                                             getItemImage,
                                                                             createComponent,
                                                                             setIsChanged,
                                                                             openCreate,
                                                                             setOpenCreate,
                                                                             onValidate,
                                                                             objectType,
                                                                             addRelation
                                                                         }: SelectOrCreateProps<ITEM, PARENT>) => {
    const [items, setItems] = useState<ITEM[]>([]);
    const [selectedItem, setSelectedItem] = useState<ITEM | null>(null);

    useEffect(() => {
        fetchItems().then(setItems);
        console.log("items", items);
    }, [openCreate]);

    const handleSelectItem = (item: ITEM) => {
        if (!alreadySelected(item)) {
            setSelectedItem(selectedItem === item ? null : item);
        }
    };

    const handleValidate = () => {
        if (!selectedItem) return;


        // If custom validation is provided, use it and exit
        if (onValidate) {
            onValidate(selectedItem);
            setOpen(false);
            return;
        }


            const currentArray = Array.isArray(parent.relations)
                ? [...parent.relations as ObjectAnsweredDTO[]]
                : [];
            // Add the selected item directly 
            const updatedParent = {
                ...parent,
                relations: [...currentArray, {answer:false,objectId: getItemId(selectedItem), objectType: objectType} as ObjectAnsweredDTO]
            };
            if(addRelation){
                addRelation(objectType, selectedItem);
            }
            else{
            saveParent(updatedParent);
                
            }
            setIsChanged(true);

        setOpen(false);
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

                {  items && items.length ?
                    (
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
                    ): (
                        <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
                            No items available.
                        </Typography>
                    )}



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
                        onClick={handleValidate}
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