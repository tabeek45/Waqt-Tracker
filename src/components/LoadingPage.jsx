import React from 'react';
import { Box, Typography, useTheme, keyframes, GlobalStyles } from '@mui/material';
import SyamsiahFont from '../assets/Syamsiah Arabic.ttf';

// Define the breathing animation
const breathe = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

/**
 * LoadingPage component
 * A full-screen overlay with a breathing app title and a static "Please wait" message.
 * Adheres to flat design principles and uses dynamic theme values.
 * @param {Object} props
 * @param {string} [props.message="Please wait"] - The message to display below the title.
 */
const LoadingPage = ({ message = "Please wait" }) => {
    const theme = useTheme();

    return (
        <>
            {/* Ensure the custom font is available even if this is the only component mounted */}
            <GlobalStyles
                styles={{
                    '@font-face': {
                        fontFamily: 'SyamsiahArabic',
                        src: `url("${SyamsiahFont}") format("truetype")`,
                        fontWeight: 'normal',
                        fontStyle: 'normal',
                        fontDisplay: 'swap',
                    },
                }}
            />

            <Box
                id="loading-overlay"
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100vw',
                    height: '100vh',
                    minHeight: '100vh',
                    backgroundColor: theme.palette.background.default,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999, // High z-index to cover everything
                    pointerEvents: 'all', // Prevent interaction with background
                    animation: `${fadeIn} 0.3s ease-in-out forwards`,
                    margin: 0,
                    padding: 0,
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <Typography
                        variant="h1"
                        sx={{
                            fontFamily: 'SyamsiahArabic, "Rethink Sans", serif',
                            fontSize: { xs: '4rem', sm: '6rem', md: '7rem' },
                            fontWeight: 'bold',
                            color: theme.palette.primary.main,
                            lineHeight: 1.1,
                            animation: `${breathe} 3s ease-in-out infinite`,
                            mb: 3,
                            // Flat design: no shadows or gradients
                        }}
                    >
                        Waqt
                        <br />
                        Tracker
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            fontFamily: '"Rethink Sans", "RethinkSans", sans-serif',
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            color: theme.palette.text.secondary,
                            letterSpacing: '0.15rem',
                            textTransform: 'uppercase',
                            opacity: 0.7,
                            fontWeight: 500
                        }}
                    >
                        {message}
                    </Typography>
                </Box>
            </Box>
        </>
    );
};

export default LoadingPage;
