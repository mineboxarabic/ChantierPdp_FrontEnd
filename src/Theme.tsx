import { createTheme } from "@mui/material";

const theme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
            },
        },
    },

    palette: {
        primary: {
            main: '#3B47A7', // Danone Blue
        },
        secondary: {
            main: '#11ACED', // Danone Light Blue
        },
        background: {
            default: '#FFFFFF', // White background
        },
    },
});


export default theme;