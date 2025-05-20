// src/components/EntityView/RelatedEntitiesListDisplay.tsx
import React, { FC, ReactNode } from 'react';
import { Box, Typography, Chip, Stack, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DetailField from './DetailField'; // Using DetailField to wrap this list

interface RelatedEntitiesListDisplayProps<T extends { id?: number; nom?: string; name?: string; username?: string }> {
    label: string;
    icon?: ReactNode;
    entityIds?: number[];
    entitiesDataMap?: Map<number, T>; // Map of pre-fetched entity data
    getRoute: (id: number) => string;
    emptyText?: string;
    fullWidth?: boolean;
    chipVariant?: "filled" | "outlined";
}

const RelatedEntitiesListDisplay = <T extends { id?: number; nom?: string; name?: string; username?: string }>({
    label,
    icon,
    entityIds,
    entitiesDataMap,
    getRoute,
    emptyText = 'Aucun élément lié.',
    fullWidth = true,
    chipVariant = "outlined",
}: RelatedEntitiesListDisplayProps<T>) => {
    const navigate = useNavigate();

    if (!entityIds || entityIds.length === 0) {
        return (
            <DetailField
                label={label}
                icon={icon}
                value={null} // Triggers emptyText in DetailField
                emptyText={emptyText}
                fullWidth={fullWidth}
            />
        );
    }

    const renderContent = () => (
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {entityIds.map((id) => {
                const entity = entitiesDataMap?.get(id);
                const displayName = entity?.nom || entity?.name || entity?.username || `ID: ${id}`;
                const canNavigate = !!entity?.id;

                return (
                    <Chip
                        key={id}
                        label={displayName}
                        onClick={canNavigate ? () => navigate(getRoute(id)) : undefined}
                        clickable={canNavigate}
                        size="small"
                        variant={chipVariant}
                        color={canNavigate ? "primary" : "default"}
                        sx={!canNavigate ? { fontStyle: 'italic' } : {}}
                    />
                );
            })}
        </Stack>
    );

    return (
        <DetailField
            label={label}
            icon={icon}
            value={entityIds} // Pass a non-empty value so DetailField doesn't show its own emptyText
            renderValue={renderContent}
            fullWidth={fullWidth}
        />
    );
};

export default RelatedEntitiesListDisplay;