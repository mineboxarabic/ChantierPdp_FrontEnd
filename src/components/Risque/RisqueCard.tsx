import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import Risque from "../../utils/entities/Risque.ts";
import defaultImage from "../../assets/default_entreprise_image.png";

interface RisqueCardProps {
    risque: Risque;
    setRisque: (risque: Risque | null) => void;
    openModal?: (e: boolean) => void;
}

const RisqueCard = ({ risque, setRisque, openModal }: RisqueCardProps) => {
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
                image={risque?.logo?.mimeType ? `data:${risque?.logo?.mimeType};base64,${risque?.logo?.imageData}` : defaultImage}
                alt="Risque Image"
            />
            <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                    {risque.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                    Description: {risque.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Travaille Dangereux: {risque.travailleDangereux ? "Yes" : "No"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Travaille Permit: {risque.travaillePermit ? "Yes" : "No"}
                </Typography>
            </CardContent>
            <CardActions>
                <Box sx={{ textAlign: "center", width: "100%" }}>
                    <Button
                        onClick={() => {
                            if (setRisque) setRisque(risque);
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

export default RisqueCard;