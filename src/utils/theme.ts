// src/theme.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';

// Define custom theme options if you need to extend the default theme type
declare module '@mui/material/styles' {
    interface Palette {
        customColor?: {
            main: string;
            light: string;
            dark: string;
        };
    }

    interface PaletteOptions {
        customColor?: {
            main: string;
            light: string;
            dark: string;
        };
    }
}

const themeOptions: ThemeOptions = {
    palette: {
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
        },
        secondary: {
            main: '#9c27b0',
            light: '#ba68c8',
            dark: '#7b1fa2',
        },
        // Custom color
        customColor: {
            main: '#ff5722',
            light: '#ff8a65',
            dark: '#e64a19',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                },
            },
        },
    },
};

const theme = createTheme(themeOptions);

export default theme;