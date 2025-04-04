import React from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';

// Custom styled components
const ErrorContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[3],
    backgroundColor: theme.palette.background.paper,
}));

const ErrorIcon = styled(ErrorOutlineIcon)(({ theme }) => ({
    fontSize: 120,
    color: theme.palette.error.main,
    marginBottom: theme.spacing(2),
}));

const ErrorCode = styled(Typography)(({ theme }) => ({
    color: theme.palette.error.main,
    fontWeight: 700,
    marginBottom: theme.spacing(1),
}));

interface NotFoundPageProps {
    message?: string;
    buttonText?: string;
    redirectPath?: string;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({
                                                       message = "The page you're looking for doesn't exist or has been moved.",
                                                       buttonText = "Back to Home",
                                                       redirectPath = "/",
                                                   }) => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(redirectPath);
    };

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <ErrorContainer>
                    <ErrorIcon />
                    <ErrorCode variant="h1">404</ErrorCode>
                    <Typography variant="h4" gutterBottom>
                        Page Not Found
                    </Typography>
                    <Typography variant="body1" color="textSecondary" paragraph>
                        {message}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleRedirect}
                        sx={{ mt: 3 }}
                    >
                        {buttonText}
                    </Button>
                </ErrorContainer>
            </Box>
        </Container>
    );
};

export default NotFoundPage;