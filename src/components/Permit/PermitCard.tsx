import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import Permit from "../../utils/permit/Permit.ts";
import defaultImage from "../../assets/default_entreprise_image.png";

interface PermitCardProps {
    permit: Permit;
    setPermit: (permit: Permit | null) => void;
    openModal?: (e: boolean) => void;
}

const PermitCard = ({ permit, setPermit, openModal }: PermitCardProps) => {
    return (
        <Card
            sx={{
                boxShadow: 3,
                borderRadius: 4,
                overflow: "hidden",
                transition: "transform 0.2s",
                "&:hover": {
                    transform: "scale(1.05)",
                },
            }}
        >
            <CardMedia
                component="img"
                height="160"
                image={permit?.logo?.mimeType ? `data:${permit?.logo?.mimeType};base64,${permit?.logo?.imageData}` : defaultImage}
                alt="Permit Image"
            />
            <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                    {permit.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                    Description: {permit.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Box sx={{ textAlign: "center", width: "100%" }}>
                    <Button
                        onClick={() => {
                            if (setPermit) setPermit(permit);
                            if (openModal) openModal(true);
                        }}
                        size="small"
                        variant="contained"
                        sx={{ borderRadius: 2 }}
                    >
                        Edit
                    </Button>
                </Box>
            </CardActions>
        </Card>
    );
};

export default PermitCard;
