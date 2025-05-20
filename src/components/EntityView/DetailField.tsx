// src/components/EntityView/DetailField.tsx
import React, { FC, ReactNode } from 'react';
import { Box, Typography, Chip, Grid, Icon, Link as MuiLink } from '@mui/material';
import {
    CalendarToday as CalendarIcon,
    CheckCircleOutline as CheckIcon,
    HighlightOff as CrossIcon,
    Link as LinkIcon,
    EuroSymbol as EuroIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';

interface DetailFieldProps {
    label: string;
    value?: any;
    type?: 'string' | 'number' | 'date' | 'datetime' | 'boolean' | 'currency' | 'link' | 'list' | 'chip' | 'multiline';
    icon?: ReactNode;
    renderValue?: (value: any) => ReactNode; // For custom rendering
    linkTo?: string; // If type is 'link', this is the href
    fullWidth?: boolean; // If true, takes full width in a Grid, otherwise typically half.
    chipColor?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    emptyText?: string; // Text to display if value is null/undefined/empty
}

const DetailField: FC<DetailFieldProps> = ({
    label,
    value,
    type = 'string',
    icon,
    renderValue,
    linkTo,
    fullWidth = false,
    chipColor = 'default',
    emptyText = 'N/A',
}) => {
    const displayValue = (val: any) => {
        if (val === null || val === undefined || val === '') {
            return <Typography variant="body2" color="text.secondary" fontStyle="italic">{emptyText}</Typography>;
        }

        if (renderValue) {
            return renderValue(val);
        }

        switch (type) {
            case 'date':
                return <Typography variant="body2">{dayjs(val).isValid() ? dayjs(val).format('DD/MM/YYYY') : emptyText}</Typography>;
            case 'datetime':
                return <Typography variant="body2">{dayjs(val).isValid() ? dayjs(val).format('DD/MM/YYYY HH:mm') : emptyText}</Typography>;
            case 'boolean':
                return val ? <CheckIcon color="success" /> : <CrossIcon color="error" />;
            case 'currency':
                return <Typography variant="body2">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(val))}</Typography>;
            case 'link':
                return <MuiLink href={linkTo || val} target="_blank" rel="noopener noreferrer">{val}</MuiLink>;
            case 'list':
                if (Array.isArray(val)) {
                    return (
                        <Box>
                            {val.map((item, index) => (
                                <Chip label={String(item)} size="small" key={index} sx={{ mr: 0.5, mb: 0.5 }} />
                            ))}
                        </Box>
                    );
                }
                return <Typography variant="body2">{String(val)}</Typography>;
            case 'chip':
                 return <Chip label={String(val)} size="small" color={chipColor} variant="outlined"/>;
            case 'multiline':
                return <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{String(val)}</Typography>;
            default:
                return <Typography variant="body2" >{String(val)}</Typography>;
        }
    };

    return (
        <Grid item xs={12} sm={fullWidth ? 12 : 6} md={fullWidth ? 12 : 6} sx={{ display: 'flex', alignItems: 'flex-start', py: 1.5 }}>
            {icon && <Box sx={{ mr: 1.5, mt: '2px', color: 'text.secondary' }}>{icon}</Box>}
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                    {label}
                </Typography>
                {displayValue(value)}
            </Box>
        </Grid>
    );
};

export default DetailField;