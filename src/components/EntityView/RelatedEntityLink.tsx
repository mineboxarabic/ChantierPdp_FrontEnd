// src/components/EntityView/RelatedEntityLink.tsx
import React, { FC, ReactNode } from 'react';
import { Typography, Link as MuiLink, Box, Skeleton } from '@mui/material';
import { Link as LinkIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DetailField from './DetailField'; // We'll use DetailField to display this

interface RelatedEntityLinkProps<T extends { id?: number; nom?: string; name?: string; username?: string }> {
    label: string;
    icon?: ReactNode;
    entityId?: number;
    entityData?: T; // Pre-fetched entity data
    getRoute: (id: number) => string; // Function to generate the link to view the entity
    emptyText?: string;
    fullWidth?: boolean;
}

const RelatedEntityLink = <T extends { id?: number; nom?: string; name?: string; username?: string }>({
    label,
    icon,
    entityId,
    entityData,
    getRoute,
    emptyText = 'Non spécifié',
    fullWidth = false,
}: RelatedEntityLinkProps<T>) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (entityData?.id) {
            navigate(getRoute(entityData.id));
        } else if (entityId) {
            // Fallback if only ID is provided, though entityData is preferred
            navigate(getRoute(entityId));
        }
    };

    const displayName = entityData?.nom || entityData?.name || entityData?.username || (entityId ? `ID: ${entityId}` : emptyText);
    const canNavigate = !!(entityData?.id || entityId);

    return (
        <DetailField
            label={label}
            icon={icon || <LinkIcon fontSize="small" />}
            fullWidth={fullWidth}
            value={displayName} // Pass display name as value
            renderValue={() => (
                canNavigate ? (
                    <MuiLink
                        component="button" // To make it behave like a button for navigation
                        variant="body2"
                        onClick={handleClick}
                        sx={{ textAlign: 'left', justifyContent: 'flex-start', textTransform: 'none', p:0 }}
                    >
                        {displayName}
                    </MuiLink>
                ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                        {displayName === `ID: ${entityId}` ? emptyText : displayName}
                    </Typography>
                )
            )}
            emptyText={emptyText} // DetailField handles its own empty text if value is truly empty
        />
    );
};

export default RelatedEntityLink;