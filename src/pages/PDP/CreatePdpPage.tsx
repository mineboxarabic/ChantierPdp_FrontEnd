// src/pages/PDP/CreatePdpPage.tsx
import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Container, Typography, Alert, Box, Button } from '@mui/material';
import EditCreatePdp from './EditCreatePdp'; // Your main PDP form component
import { getRoute } from '../../Routes';     // For navigation
import { Assignment as PdpIcon } from '@mui/icons-material';

const CreatePdpPage: React.FC = () => {
    const { chantierId } = useParams<{ chantierId: string }>(); // From route like /pdp/create/:chantierId
 const navigate = useNavigate();
    if (!chantierId || isNaN(parseInt(chantierId))) {
        console.error("CreatePdpPage: Chantier ID is missing or invalid from URL params.");
        return (
            <Container sx={{ py: 3 }}>
                <Alert severity="error">
                    L'identifiant du chantier est manquant ou invalide pour créer un Plan de Prévention.
                    Veuillez retourner à la page du chantier et réessayer.
                    <Button onClick={() => navigate(getRoute('HOME'))} sx={{mt:1}}>Retour à l'accueil</Button>
                </Alert>
                {/* Or consider a <Navigate to={getRoute('CHOOSE_CHANTIER_FOR_PDP')} replace /> if such a page exists */}
            </Container>
        );
    }

    const numericChantierId = parseInt(chantierId, 10);

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PdpIcon color="primary" sx={{ fontSize: '2.5rem', mr: 1.5 }} />
                <Typography variant="h4" component="h1">
                    Créer un Nouveau Plan de Prévention (PDP)
                </Typography>
            </Box>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                Ce PDP sera associé au chantier ID: {numericChantierId}.
            </Typography>
            
            
            <EditCreatePdp chantierIdForCreation={numericChantierId} />
        </Container>
    );
};

export default CreatePdpPage;