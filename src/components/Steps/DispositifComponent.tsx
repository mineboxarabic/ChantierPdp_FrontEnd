/*
import {Box, Card, Checkbox, Select} from "@mui/material";
import Grid from "@mui/material/Grid2";
import worning from "../../assets/wornings/worning.webp"
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import {ImageModel} from "../../utils/image/ImageModel.ts";
import Dispositif from "../../utils/dispositif/Dispositif.ts";
import ObjectAnswered from "../../utils/pdps/ObjectAnswered.ts";

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

export default DispositifComponent;*/

import ObjectAnsweredDTO from "../../utils/pdp/ObjectAnswered.ts";
import ObjectAnsweredComponent from "./ObjectAnsweredComponent.tsx";
import {Pdp} from "../../utils/entities/Pdp.ts";
import ObjectAnsweredObjects from "../../utils/ObjectAnsweredObjects.ts";
import { PdpDTO } from "../../utils/entitiesDTO/PdpDTO.ts";
import useDispositif from "../../hooks/useDispositif.ts";
import { useEffect, useState } from "react";
import DispositifDTO from "../../utils/entitiesDTO/DispositifDTO.ts";

interface PapierDemanderProps {
    dispositif: ObjectAnsweredDTO;
    currentPdp:PdpDTO;
    saveCurrentPdp: (pdp:PdpDTO) => void;
    setIsChanged: (value:boolean) => void;
}
const PapierDemander = ({dispositif,setIsChanged, currentPdp, saveCurrentPdp}:PapierDemanderProps) => {


    const dispositifHook = useDispositif();
    const [dispositifData, setDispositifData] = useState<DispositifDTO>();

    useEffect(() => {
        if (dispositif) {
            dispositifHook.getDispositif(dispositif.objectId as number).then((dispositif: DispositifDTO) => {
                setDispositifData(dispositif);
            });
        }
    }
    , [dispositif]);


    return (
        <ObjectAnsweredComponent object={dispositif} itemData={dispositifData} objectType={ObjectAnsweredObjects.DISPOSITIF} saveParent={saveCurrentPdp} parent={currentPdp} setIsChanged={setIsChanged} />
    )
}

export default PapierDemander;