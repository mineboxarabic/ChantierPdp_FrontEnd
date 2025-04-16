import { Box, Card, Checkbox, Select, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Grid from "@mui/material/Grid2";
import worning from "../../assets/wornings/worning.webp";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import { ImageModel } from "../../utils/image/ImageModel.ts";
import Dispositif from "../../utils/entities/Dispositif.ts";
import ObjectAnswered from "../../utils/pdp/ObjectAnswered.ts";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import ObjectAnsweredObjects from "../../utils/ObjectAnsweredObjects.ts";
import {Pdp} from "../../utils/entities/Pdp.ts";
import usePdp from "../../hooks/usePdp.ts";
import { PdpDTO } from "../../utils/entitiesDTO/PdpDTO.ts";

interface ObjectAnsweredComponentProps {
    item: ObjectAnswered;
    type: ObjectAnsweredObjects;
    saveCurrentPdp: (pdp: PdpDTO) => void;
    currentPdp: PdpDTO;
    setIsChanged: (value: boolean) => void;
    itemData?: any;
}

const ObjectAnsweredComponent = ({ item, saveCurrentPdp,currentPdp,setIsChanged,type,itemData }: ObjectAnsweredComponentProps) => {
    const [openDialog, setOpenDialog] = useState(false);
    const {linkObjectToPdp, unlinkObjectFromPdp} = usePdp();

    

  



    const handleDeleteClick = () => {
        setOpenDialog(true);
    };

    const handleConfirmDelete = () => {
        setOpenDialog(false);
        onDelete();
    };

    function pluralizeType(): string {
        return lowerCaseType() + "s";
    }

    function lowerCaseType(): string {
        return type.toLowerCase();
    }


    const onCheckChange = (value:boolean) => {
       console.log('value',currentPdp[lowerCaseType()], lowerCaseType());
        saveCurrentPdp({
            ...currentPdp,
            [pluralizeType()] : currentPdp[pluralizeType()]?.map((p:ObjectAnswered) => {
                if(p.id === item.id){
                    return {
                        ...p,
                        answer: value
                    }
                }
                return p;
            }
            )
        });
        setIsChanged(true);
    }

    const onDelete = () => {
       unlinkObjectFromPdp(item?.id as number,currentPdp?.id as number, type).then(() => {
            console.log('deleted', pluralizeType());
            saveCurrentPdp({
                ...currentPdp,
                [pluralizeType()]: currentPdp[pluralizeType()]?.filter((p:ObjectAnswered) => p?.id !== item?.id)
            });
            setIsChanged(true);
        })
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

                    <Checkbox checked={item.answer ? true : false} onChange={e => onCheckChange(e.target.checked)} />


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
