import React from "react";
import {Box, Typography} from "@mui/material";

interface SectionProps {
    title: string;
    children: React.ReactNode;
    backgroundColor?: string;
    padding?: string | number;
}

const Section: React.FC<SectionProps> = ({
                                             title = "",
                                             children,
                                             backgroundColor = "transparent",
                                             padding = "16px",
                                         }) => {
    return (
        <Box
            component="section"
            sx={{
                backgroundColor,
                padding,
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                width: "100%",
            }}
        >
            <Typography variant="h5" gutterBottom fontWeight="bold">
                {title}
            </Typography>
            <Box>{children}</Box>
        </Box>
    );
};

export default Section;