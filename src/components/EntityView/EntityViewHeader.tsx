// src/components/EntityView/EntityViewHeader.tsx
import React, { FC, ReactNode } from 'react';
import { Box, Typography, IconButton, Button, Stack, Divider } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { SectionTitle } from '../../pages/Home/styles'; // Assuming SectionTitle is now in home styles

interface EntityViewHeaderProps {
    title: string;
    entityTypeLabel: string; // e.g., "Chantier", "PDP"
    onEdit?: () => void;
    onDelete?: () => void;
    backRoute?: string; // Optional route to navigate back
    customActions?: ReactNode; // For any other specific buttons
    headerActions?: ReactNode; // Buttons to appear aligned with the title
}

const EntityViewHeader: FC<EntityViewHeaderProps> = ({
    title,
    entityTypeLabel,
    onEdit,
    onDelete,
    backRoute,
    customActions,
    headerActions,
}) => {
    const navigate = useNavigate();

    return (
        <Box sx={{ mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    {backRoute && (
                        <IconButton onClick={() => navigate(backRoute)} aria-label={`Retour à la liste des ${entityTypeLabel}s`}>
                            <ArrowBackIcon />
                        </IconButton>
                    )}
                     {/* Using SectionTitle or a similar styled Typography for the main title */}
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                        {title}
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                    {onEdit && (
                        <Button variant="contained" startIcon={<EditIcon />} onClick={onEdit}>
                            Modifier {entityTypeLabel}
                        </Button>
                    )}
                    {onDelete && (
                         <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={onDelete}>
                            Supprimer
                        </Button>
                    )}
                    {headerActions}
                </Stack>
            </Stack>
            {customActions && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1}}>
                    {customActions}
                </Box>
            )}
            <Divider sx={{ my: 2 }} />
        </Box>
    );
};

export default EntityViewHeader;