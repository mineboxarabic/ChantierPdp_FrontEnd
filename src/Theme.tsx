// src/theme.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';

// Define custom theme options if you need to extend the default theme type
declare module '@mui/material/styles' {
    interface Palette {
        customColor?: {
            main: string;
            light: string;
            dark: string;
            td: string;
            tp: string;
        };
    }

    interface PaletteOptions {
        customColor?: {
            main: string;
            light: string;
            dark: string;
            td: string;
            tp: string;
        };
    }
}

// Modern color palette with refined tones
const themeOptions: ThemeOptions = {
    palette: {
        primary: {
            main: '#2196f3', // Slightly brighter blue
            light: '#64b5f6',
            dark: '#1976d2',
        },
        secondary: {
            main: '#2196f3', // Slightly brighter blue
            light: '#64b5f6',
            dark: '#1976d2',
        },
        // Custom color
        customColor: {
            main: '#ff5722',
            light: '#ff8a65',
            dark: '#e64a19',
            td: '#E9B9B9',
            tp: '#B9B4FF',
        },
        background: {
            default: '#f8f9fa', // Lighter background for modern feel
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif', // Use Inter as primary font
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
            letterSpacing: '-0.025em',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
            letterSpacing: '-0.025em',
        },
        h3: {
            fontSize: '1.5rem',
            fontWeight: 600,
            letterSpacing: '-0.015em',
        },
        h4: {
            fontSize: '1.25rem',
            fontWeight: 500,
            letterSpacing: '-0.01em',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
        },
        button: {
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 10, // Rounded corners across components
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    padding: '8px 22px',
                    boxShadow: 'none',
                    fontWeight: 500,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(45deg, #2196f3 30%, #64b5f6 90%)',
                },
                containedSecondary: {
                    background: 'linear-gradient(45deg, #ff4081 30%, #ff80ab 90%)',
                },
                outlined: {
                    borderWidth: 2,
                    '&:hover': {
                        borderWidth: 2,
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    overflow: 'hidden',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
                elevation1: {
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
                },
                elevation2: {
                    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.07), 0 3px 6px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 10,
                        transition: 'box-shadow 0.2s ease-in-out',
                        '&:hover': {
                            boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.1)',
                        },
                        '&.Mui-focused': {
                            boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.2)',
                        },
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                    backgroundImage: 'none',
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                root: {
                    width: 42,
                    height: 26,
                    padding: 0,
                    '& .MuiSwitch-switchBase': {
                        padding: 2,
                        '&.Mui-checked': {
                            transform: 'translateX(16px)',
                            '& + .MuiSwitch-track': {
                                opacity: 1,
                            },
                        },
                    },
                    '& .MuiSwitch-thumb': {
                        width: 22,
                        height: 22,
                    },
                    '& .MuiSwitch-track': {
                        borderRadius: 13,
                        opacity: 1,
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 500,
                },
            },
        },
        MuiDialogContent: {
            styleOverrides: {
                root: {
                    padding: 24,
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    margin: '16px 0',
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    '&:hover': {
                        textDecoration: 'none',
                    },
                },
            },
        },
        MuiList: {
            styleOverrides: {
                root: {
                    paddingTop: 8,
                    paddingBottom: 8,
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    '&:hover': {
                        backgroundColor: 'rgba(33, 150, 243, 0.04)',
                    },
                },
            },
        },
    },
};

const theme = createTheme(themeOptions);

export default theme;