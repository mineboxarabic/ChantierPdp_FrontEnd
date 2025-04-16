import {
    Box,
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Select, useTheme
} from "@mui/material";
import worning from "../../assets/wornings/worning.webp"
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import ObjectAnswered from "../../utils/pdp/ObjectAnswered.ts";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {useEffect, useState} from "react";
import {Pdp} from "../../utils/entities/Pdp.ts";
import usePdp from "../../hooks/usePdp.ts";
import ObjectAnsweredObjects from "../../utils/ObjectAnsweredObjects.ts";
import useBdt from "../../hooks/useBdt.ts";
import useRisque from "../../hooks/useRisque.ts";
import RisqueDTO from "../../utils/entitiesDTO/RisqueDTO.ts";


//Types are bdt and pdp


interface RisqueProps {
    object:ObjectAnswered

   currentPdp: any;
    saveCurrentPdp: (pdp: any) => void;
    setIsChanged: (isChanged: boolean) => void;
    typeOfObject: "pdp" | "bdt";
}

const RisqueComponent = ({object,currentPdp, saveCurrentPdp, setIsChanged, typeOfObject}:RisqueProps) => {

   const [openDialog, setOpenDialog] = useState(false);

   const {unlinkObjectFromPdp} = usePdp();
   const {unlinkRisqueToBDT} = useBdt();
   const risqueHook = useRisque();

   const theme = useTheme();

   const [risque, setRisque] = useState<RisqueDTO>();


   useEffect(() => {


    console.log('Risque object:', object);

            // Fetch the risque data if it exists
            const fetchRiqsue = async () =>{
                if(object.risque_id){
                    const r = await risqueHook.getRisque(object.risque_id);
                    console.log('Risque fetched:', r);
                    setRisque(r); 
                }
            }

            fetchRiqsue();

   },[]);

    const handleDeleteClick = () => {
         setOpenDialog(true);
    }
    const handleConfirmDelete = () => {
       if(typeOfObject === "pdp"){
           unlinkObjectFromPdp(risque?.id as number,currentPdp?.id as number, ObjectAnsweredObjects.RISQUE).then(() => {

               saveCurrentPdp({
                   ...currentPdp,
                   risques: currentPdp["risques"]?.filter((p:ObjectAnswered) => p?.id !== object?.id)
               });
               setIsChanged(true);
           })
       }
        else{
           unlinkRisqueToBDT( currentPdp?.id as number, risque?.id as number).then(() => {
                   saveCurrentPdp({
                       ...currentPdp,
                       risques: currentPdp["risques"]?.filter((p:ObjectAnswered) => p?.id !== object?.id)
                   });
                   setIsChanged(true);
               }
           );
       }


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
                    backgroundColor: `${risque?.travailleDangereux ? theme.palette.customColor?.td : 'paper'}`,

                }}>
                    <img src={
                        risque?.logo?.imageData ? `data:${risque?.logo.mimeType};base64,${risque?.logo.imageData}` :
                        worning
                    } width={10} alt="Risque" style={{
                        width: '5%',
                        objectPosition: 'center',
                    }}/>


                    <Typography>{
                        risque?.title
                    }</Typography>
                    <Select defaultValue={ object.answer ? 1 : 0}
                    sx={{
                        backgroundColor: `${risque?.travaillePermit ? theme.palette.customColor?.tp : 'paper'}`,
                    }}

                            onChange={e => {

                                //onSelectChange(e.target.value === 1);

                                currentPdp?.risques?.map((r: ObjectAnswered) => {
                                    if (r.id === object.id) {
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