import * as React from "react"
import DANONE_LOGO_VERTICAL from "../assets/DANONE_LOGO_VERTICAL.png"
import DANONE_LOGO_VERTICAL_SIMPLE from "../assets/DANONE_LOGO_VERTICAL_SIMPLE.png"
import {Box, SxProps, Theme} from "@mui/material";
interface DanoneLogoProps {
    simple?: boolean
    sx: SxProps<Theme> | undefined
}
const DanoneLogo = ({simple,sx}:DanoneLogoProps) => {
    return (
        <Box sx={sx}>
        {simple ? <img src={DANONE_LOGO_VERTICAL_SIMPLE} alt="Danone Logo" width={40}/> : <img
        src={DANONE_LOGO_VERTICAL} alt="Danone Logo" width={40}/>}
    </Box>)
}
export default DanoneLogo
