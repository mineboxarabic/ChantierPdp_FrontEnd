import { Box, Card, Checkbox, Select, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl } from "@mui/material";
import Grid from "@mui/material/Grid2";
import worning from "../../assets/wornings/worning.webp";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import { ImageModel } from "../../utils/image/ImageModel.ts";
import { ObjectAnsweredDTO } from "../../utils/entitiesDTO/ObjectAnsweredDTO.ts";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import ObjectAnsweredObjects from "../../utils/ObjectAnsweredObjects.ts";
import usePdp from "../../hooks/usePdp.ts";
import { PdpDTO } from "../../utils/entitiesDTO/PdpDTO.ts";
import { ContentItem, ObjectAnsweredBasedComponentProps, ParentOfRelations } from "../Interfaces.ts";



const ObjectAnsweredComponent = <ITEM extends ContentItem, PARENT extends ParentOfRelations>({ 
    object: object,
     saveParent ,
     parent,
     setIsChanged,
     itemData,
     objectType: type,
     onDeleteRelationFromItem,
     onUpdateRelationFieldFromItem }: ObjectAnsweredBasedComponentProps<ITEM,PARENT>) => {
    
    
    
    const [openDialog, setOpenDialog] = useState(false);
    const {linkObjectToPdp, unlinkObjectFromPdp} = usePdp();

    const [checked, setChecked] = useState(object.answer ? true : false);
        
  



    const handleDeleteClick = () => {
        setOpenDialog(true);
    };

    const handleConfirmDelete = () => {
        setOpenDialog(false);
        // Use the prop function instead of the old onDelete
        if (onDeleteRelationFromItem) {
            onDeleteRelationFromItem();
        } else {
            // Fallback to old logic if prop not provided
            onDelete();
        }
    };
const onCheckChange = (value: boolean) => {
    setChecked(value); // update local state so Checkbox rerenders
    
    // Use the prop function if available, otherwise fallback to direct manipulation
    if (onUpdateRelationFieldFromItem) {
        onUpdateRelationFieldFromItem(object.id!, 'answer', value);
    } else {
        // Fallback to old logic for backward compatibility
        console.log("value", parent);
        const currentArrayofObjects = parent.relations as ObjectAnsweredDTO[];

        const newArrayofObjects = currentArrayofObjects?.map((p: ObjectAnsweredDTO) => {
            if (p.id === object.id) {
                return {
                    ...p,
                    answer: value,
                };
            }
            return p;
        });

        console.log("currentArrayofObjects", currentArrayofObjects);
        console.log("newArrayofObjects", newArrayofObjects);

        saveParent({
            ...parent,
            relations: newArrayofObjects,
        });

        setIsChanged(true);
    }
};

    const onDelete = () => {

        const currentArrayofObjects = parent?.relations as ObjectAnsweredDTO[];

        saveParent({
            ...parent,
            relations: currentArrayofObjects?.map((p:ObjectAnsweredDTO) => {
                if (p.id === object.id) {
                    return {
                        ...p,
                        answer: null,
                    };
                }
                return p;
            })
        });
        setIsChanged(true);
    }

    return (
        <Box display={"flex"} alignItems={'center'} width={'100%'} justifyContent={'space-between'}>
            <Card
                sx={{
                    width: '100%',
                }}
            >
                <CardContent sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '16px',
                }}>
                    <img src={
                        itemData?.logo?.imageData ? `data:${itemData?.logo.mimeType};base64,${itemData?.logo.imageData}` :
                            worning
                    } width={10} alt="Dispositif" style={{
                        width: '5%',
                        objectPosition: 'center',
                    }} />

                    <Typography>{itemData?.title}</Typography>


<Checkbox checked={checked} onChange={e => onCheckChange(e.target.checked)} />

                </CardContent>
            </Card>


            <Button
                color={"error"}
                onClick={() => handleDeleteClick()}
                startIcon={<RemoveCircleIcon/>}
                sx={{
                    height: '5rem',
                }}
            ></Button>



            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this item? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ObjectAnsweredComponent;
