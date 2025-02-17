import {Box, Card, FormControlLabel, Select} from "@mui/material";
import Grid from "@mui/material/Grid2";
import worning from "../../assets/wornings/worning.webp"
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import {Checkbox} from "@mui/material";
import ObjectAnswered from "../../utils/pdp/ObjectAnswered.ts";


interface PapierDemanderProps {
    permit?: ObjectAnswered;
}

const PapierDemander = ({permit}:PapierDemanderProps) => {
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


                    <Typography fontWeight={'bold'} color={'purple'}>{permit?.permit?.title}</Typography>
                  <Checkbox
                        checked={permit?.answer || false}
                      color={'primary'}/>
                </CardContent>
            </Card>


        </Box>
    );
}

export default PapierDemander;