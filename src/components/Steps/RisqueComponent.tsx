import {Box, Card, Select} from "@mui/material";
import Grid from "@mui/material/Grid2";
import worning from "../../assets/wornings/worning.webp"
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import {ImageModel} from "../../utils/image/ImageModel.ts";
import Risque from "../../utils/Risque/Risque.ts";
import ObjectAnswered from "../../utils/pdp/ObjectAnswered.ts";

interface RisqueProps {
   risque:ObjectAnswered
    onSelectChange: (value:boolean) => void;
}

const RisqueComponent = ({risque,onSelectChange}:RisqueProps) => {
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

                                onSelectChange(e.target.value === 1);

                            }}
                    >
                        <MenuItem value={0}>Non</MenuItem>
                        <MenuItem value={1}>Oui</MenuItem>
                    </Select>
                </CardContent>
            </Card>


        </Box>
    );
}

export default RisqueComponent;