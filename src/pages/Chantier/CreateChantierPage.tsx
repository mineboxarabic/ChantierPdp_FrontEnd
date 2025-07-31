// src/pages/Chantier/createChantier.tsx
import React from 'react';
import { Container } from '@mui/material';
import ChantierFormWrapper from '../../components/ChantierForm/ChantierFormWrapper'; // Adjust path if needed

const CreateChantierPage: React.FC = () => {
    return (
        <Container maxWidth="xl" sx={{ py: 3 }}> {/* Using xl for wider forms if desired */}
            {/* You can add a page-specific title here if you want, 
              but ChantierFormWrapper already has its own title ("Créer un nouveau chantier").
              Example:
              <Box sx={{ mb: 3 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Lancer un Nouveau Chantier
                </Typography>
                <Typography color="text.secondary">
                    Remplissez les informations ci-dessous pour enregistrer un nouveau chantier dans le système.
                </Typography>
              </Box>
            */}
            <ChantierFormWrapper />
        </Container>
    );
};

export default CreateChantierPage;