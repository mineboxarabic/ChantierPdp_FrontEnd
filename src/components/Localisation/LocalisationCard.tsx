import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Localisation from "../../utils/Localisation/Localisation.ts";

interface LocalisationCardProps {
    localisation: Localisation;
    openModal?: (e: boolean) => void;
}

const LocalisationCard = ({ localisation, openModal }: LocalisationCardProps) => {
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
            <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                    {localisation.nom}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                    Code: {localisation.code}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Description: {localisation.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Box sx={{ textAlign: "center", width: "100%" }}>
                    <Button
                        onClick={() => openModal && openModal(true)}
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

export default LocalisationCard;
