// src/components/EntityView/DetailSection.tsx
import React, { FC, ReactNode } from 'react';
import { Box, Typography, Paper, Icon } from '@mui/material';
import { DashboardCard } from '../../pages/Home/styles'; // Using DashboardCard style
import { SectionTitle as HomeSectionTitle } from '../../pages/Home/styles'; // Assuming SectionTitle is in home styles


interface DetailSectionProps {
    title: string;
    icon?: ReactNode; // e.g., <InfoIcon />
    children: ReactNode;
    action?: ReactNode; // Optional action button/element for the section header
    elevation?: number;
}

const DetailSection: FC<DetailSectionProps> = ({ title, icon, children, action, elevation = 1 }) => {
    return (
        <DashboardCard sx={{ mb: 3, p: 2 }} elevation={elevation}> {/* Using DashboardCard directly */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px:1, borderBottom: theme => `1px solid ${theme.palette.divider}` , pb:1 }}>
                <HomeSectionTitle variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center', mb:0, pb:0, '&:after': { display: 'none'} }}>
                    {icon && <Box component="span" sx={{ mr: 1, display: 'flex', alignItems: 'center', color: 'primary.main' }}>{icon}</Box>}
                    {title}
                </HomeSectionTitle>
                {action}
            </Box>
            <Box sx={{px:1}}>
                {children}
            </Box>
        </DashboardCard>
    );
};

export default DetailSection;