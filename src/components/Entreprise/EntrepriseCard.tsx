import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import { Entreprise } from "../../utils/entities/Entreprise.ts";
import defaultImage from '../../assets/default_entreprise_image.png';
import Box from "@mui/material/Box";

interface EntrepriseCardProps {
    entreprise: Entreprise;
    setEntreprise: (entreprise: Entreprise | null) => void;
    openModal?: (e: boolean) => void;
    key?: number;
}

const EntrepriseCard = ({ entreprise, setEntreprise, openModal, key }: EntrepriseCardProps) => {
    return (
        <Card
            key={key}
            sx={{
                boxShadow: 3,
                borderRadius: 4,
                overflow: 'hidden',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'scale(1.05)',
                },
            }}
        >
            <CardMedia
                component="img"
                height="160"
                image={entreprise?.image ? `data:${entreprise.image.mimeType};base64,${entreprise.image.imageData}` : defaultImage}
                alt="Entreprise Image"
            />
            <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                    {entreprise.nom}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                    Fonction: {entreprise.fonction}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Raison Sociale: {entreprise.raisonSociale}
                </Typography>
            </CardContent>
            <CardActions>
                <Box sx={{ textAlign: 'center', width: '100%' }}>
                    <Button
                        onClick={() => {
                            if (setEntreprise) setEntreprise(entreprise);
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

export default EntrepriseCard;
