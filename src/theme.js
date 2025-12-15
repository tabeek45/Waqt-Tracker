// src/theme.js
// Centralized theme definitions (light + dark). Import these into App.jsx

import { createTheme } from '@mui/material/styles';
import bgMobile from './assets/background-mobile-view.jpg';
import bgDesktop from './assets/background.jpg';

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#4CAF50' },
        background: { default: '#f0f0f0', paper: '#ffffff' },
        text: { primary: '#000000', secondary: '#555555' },
    },
    typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundImage: `url(${bgMobile})`,
                    backgroundColor: '#f0f0f0',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    minHeight: '100vh',
                    position: 'relative',
                    color: '#000000',
                    '&::before': {
                        content: '""',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255,255,255,0.08)', // subtle light overlay
                        zIndex: -1,
                    },
                    '@media (min-width: 768px)': { backgroundImage: `url(${bgDesktop})` },
                }
            }
        }
    }
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#00BFFF' },
        background: { default: '#0a0a0a', paper: '#121212' },
        text: { primary: '#ffffff', secondary: '#b0b0b0' },
    },
    typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundImage: `url(${bgMobile})`,
                    backgroundColor: '#0a0a0a',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    minHeight: '100vh',
                    position: 'relative',
                    color: '#ffffff',
                    '&::before': {
                        content: '""',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.7)', // dark overlay to match previous design
                        zIndex: -1,
                    },
                    '@media (min-width: 768px)': { backgroundImage: `url(${bgDesktop})` },
                }
            }
        }
    }
});
