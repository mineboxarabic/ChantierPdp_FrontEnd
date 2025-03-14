import {
    Box,
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Select
} from "@mui/material";
import worning from "../../assets/wornings/worning.webp"
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import ObjectAnswered from "../../utils/pdp/ObjectAnswered.ts";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {useState} from "react";
import {Pdp} from "../../utils/pdp/Pdp.ts";
import usePdp from "../../hooks/usePdp.ts";
import ObjectAnsweredObjects from "../../utils/ObjectAnsweredObjects.ts";

interface RisqueProps {
   risque:ObjectAnswered

   currentPdp: Pdp;
    saveCurrentPdp: (pdp: Pdp) => void;
    setIsChanged: (isChanged: boolean) => void;
}

const RisqueComponent = ({risque,currentPdp, saveCurrentPdp, setIsChanged}:RisqueProps) => {

   const [openDialog, setOpenDialog] = useState(false);

   const {unlinkObjectFromPdp} = usePdp();

    const handleDeleteClick = () => {
         setOpenDialog(true);
    }
    const handleConfirmDelete = () => {
        unlinkObjectFromPdp(risque?.id,currentPdp?.id as number, ObjectAnsweredObjects.RISQUE).then(() => {

            saveCurrentPdp({
                ...currentPdp,
                risques: currentPdp["risques"]?.filter((p:ObjectAnswered) => p?.id !== risque?.id)
            });
            setIsChanged(true);
        })

        setOpenDialog(false);
    }

    return (
        <Box display={"flex"} alignItems={'center'}
            width={'100%'}
        >

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
                    backgroundColor: `${risque.risque?.travailleDangereux ? '#e9b9b9' : 'paper'}`,

                }}>
                    <img src={
                        risque.risque?.logo?.imageData ? `data:${risque.risque?.logo.mimeType};base64,${risque.risque?.logo.imageData}` :
                        worning
                    } width={10} alt="Risque" style={{
                        width: '5%',
                        objectPosition: 'center',
                    }}/>


                    <Typography>{
                        risque?.risque?.title
                    }</Typography>
                    <Select defaultValue={ risque.answer ? 1 : 0}
                    sx={{
                        backgroundColor: `${risque?.risque?.travailleDangereux ? '#b9b4ff' : 'paper'}`,
                    }}

                            onChange={e => {

                                //onSelectChange(e.target.value === 1);

                                currentPdp?.risques?.map((r: ObjectAnswered) => {
                                    if (r.id === risque.id) {
                                        r.answer = e.target.value === 1;
                                    }
                                });

                                saveCurrentPdp({
                                    ...currentPdp,
                                    risques: currentPdp.risques,
                                } as Pdp);
                                setIsChanged(true);

                            }}
                    >
                        <MenuItem value={0}>Non</MenuItem>
                        <MenuItem value={1}>Oui</MenuItem>
                    </Select>
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
}

export default RisqueComponent;