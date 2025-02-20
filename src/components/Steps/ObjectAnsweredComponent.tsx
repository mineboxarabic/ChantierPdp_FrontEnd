import {Box, Card, Checkbox, Select} from "@mui/material";
import Grid from "@mui/material/Grid2";
import worning from "../../assets/wornings/worning.webp"
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import {ImageModel} from "../../utils/image/ImageModel.ts";
import Dispositif from "../../utils/dispositif/Dispositif.ts";
import ObjectAnswered from "../../utils/pdp/ObjectAnswered.ts";

interface ObjectAnsweredComponentProps {
    item:ObjectAnswered
    onChangeCheckBox: (value:boolean) => void;
    componentName: string;
}

const ObjectAnsweredComponent = ({item,onChangeCheckBox,componentName}:ObjectAnsweredComponentProps) => {
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
                        item[componentName]?.logo?.imageData ? `data:${item[componentName]?.logo.mimeType};base64,${item[componentName]?.logo.imageData}` :
                            worning
                    } width={10} alt="Dispositif" style={{

                        width: '5%',
                        objectPosition: 'center',
                    }}/>


                    <Typography>{
                        item[componentName]?.title
                    }</Typography>
                    <Checkbox checked={
                        item.answer ? true : false
                    } defaultValue={ item.answer ? 1 : 0} onChange={e => {

                        onChangeCheckBox(e.target.checked);

                    } }/>
                </CardContent>
            </Card>


        </Box>
    );
}

export default ObjectAnsweredComponent;