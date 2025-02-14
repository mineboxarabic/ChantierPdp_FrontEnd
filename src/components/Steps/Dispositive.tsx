import {Box, Card, FormControlLabel, Select} from "@mui/material";
import Grid from "@mui/material/Grid2";
import worning from "../../assets/wornings/worning.webp"
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import {Checkbox} from "@mui/material";
import Dispositif from "../../utils/dispositif/Dispositif.ts";
import ObjectAnswered from "../../utils/pdp/ObjectAnswered.ts";

interface DispositifProps {
    dispositifAnswered:ObjectAnswered
    onSelectChange: (value:boolean) => void;
}

const Dispositive = ({dispositifAnswered,onSelectChange}:DispositifProps) => {
    return (
        <Box display={"flex"} alignItems={'center'}>

            <Card>
                <CardContent sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '16px',
                }}>
                    <img src={worning} width={10} alt="Risque" style={{
                        width: '5%',
                        objectPosition: 'center',
                    }}/>


                    <Typography fontWeight={'bold'} color={'purple'}>{dispositifAnswered.dispositif?.title}</Typography>
                  <Checkbox
                        checked={dispositifAnswered.answer}
                      color={'primary'}/>
                </CardContent>
            </Card>


        </Box>
    );
}

export default Dispositive;