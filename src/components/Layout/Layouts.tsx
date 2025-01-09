import React from 'react';
import { Box, BoxProps } from '@mui/material';

// HorizontalBox with flexDirection: 'row'
export const HorizontalBox: React.FC<BoxProps> = (props) => {
    return <Box display="flex" flexDirection="row" {...props} />;
};

// VerticalBox with flexDirection: 'column'
export const VerticalBox: React.FC<BoxProps> = (props) => {
    return <Box display="flex" flexDirection="column" {...props} />;
};