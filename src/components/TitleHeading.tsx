import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";

interface TitleHeadingProps {
    title: string;
    subtitle?: string;
    width?: string;
    severity?: string;
}

const TitleHeading: React.FC<TitleHeadingProps> = ({
    title,
    subtitle,
    width = "100%",
    severity,

                                                   }) => {


    const getColor = ():string=>{
        switch (severity) {
            case "error": return "#D37070";
            case "warning": return "#ffc400";
            case "info": return "#00fff7";
            case "success": return "#22ff00";
            case "danger": return "#FF0000";
            case "indecation": return "#708FD3";
        }
        return "";
    }

    return(
        <Box sx={{
            backgroundColor: getColor(),
            borderRadius: 3,
            p:1,
            pl: 2

        }}>
            <Typography
                sx={{
                    color: "#ffffff"
                }}
                variant="h5"

                fontWeight={'bold'} component="div">{title}</Typography>
        </Box>
    )
}

export default TitleHeading;