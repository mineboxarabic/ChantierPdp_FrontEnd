import {Box, Card, Checkbox, Select} from "@mui/material";
import Grid from "@mui/material/Grid2";
import worning from "../../assets/wornings/worning.webp"
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import {ImageModel} from "../../utils/image/ImageModel.ts";
import Dispositif from "../../utils/dispositif/Dispositif.ts";
import ObjectAnswered from "../../utils/pdp/ObjectAnswered.ts";

interface DispositifProps {
   dispositif:ObjectAnswered
    onSelectChange: (value:boolean) => void;
}

const DispositifComponent = ({dispositif,onSelectChange}:DispositifProps) => {
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
                }}>
                    <img src={
                        dispositif.dispositif?.logo?.imageData ? `data:${dispositif.dispositif?.logo.mimeType};base64,${dispositif.dispositif?.logo.imageData}` :
                        worning
                    } width={10} alt="Dispositif" style={{
                        width: '5%',
                        objectPosition: 'center',
                    }}/>


                    <Typography>{
                        dispositif?.dispositif?.title
                    }</Typography>
                   <Checkbox checked={
                        dispositif.answer ? true : false
                    } defaultValue={ dispositif.answer ? 1 : 0} onChange={e => { onSelectChange(e.target.checked); } }/>
                </CardContent>
            </Card>


        </Box>
    );
}

export default DispositifComponent;