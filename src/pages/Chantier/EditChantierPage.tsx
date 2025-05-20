// Inside your EditChantierPage component (which would replace EditCreateChantier.tsx content)
import { useParams } from 'react-router-dom';
import ChantierFormWrapper from '../../components/ChantierForm/ChantierFormWrapper';
import { Container, Typography } from '@mui/material';
// ... other imports

const EditChantierPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get the id from the URL

    if (!id) {
        // Handle case where ID is missing, maybe redirect or show error
        return <Typography color="error">ID du chantier manquant!</Typography>;
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <ChantierFormWrapper key={id} /> {/* Pass the id as a prop. Add key={id} to ensure re-initialization if id changes */}
        </Container>
    );
};

export default EditChantierPage;