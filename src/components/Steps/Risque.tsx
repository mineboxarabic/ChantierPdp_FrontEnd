import {Box, Card, Select} from "@mui/material";
import Grid from "@mui/material/Grid2";
import worning from "../../assets/wornings/worning.webp"
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
const Risque = () => {
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


                    <Typography>Le poste de travail est-il exposé à un risque particulier ?</Typography>
                    <Select defaultValue={0}>
                        <MenuItem value={0}>Non</MenuItem>
                        <MenuItem value={1}>Oui</MenuItem>
                    </Select>
                </CardContent>
            </Card>


        </Box>
    );
}

export default Risque;