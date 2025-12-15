import React from 'react';
import { Box, Typography, useTheme, GlobalStyles } from '@mui/material';
import SyamsiahFont from '../assets/Syamsiah Arabic.ttf';

export default function AppTitle() {
    const theme = useTheme();

    return (
        <>
            {/* Local font injection */}
            <GlobalStyles
                styles={{
                    '@font-face': {
                        fontFamily: 'SyamsiahArabic',
                        src: `url(${SyamsiahFont}) format("truetype")`,
                        fontWeight: 'normal',
                        fontStyle: 'normal',
                        fontDisplay: 'swap',
                    },
                }}
            />

            <Box>
                <Typography
                    component="h1"
                    sx={{
                        fontFamily: 'SyamsiahArabic, serif',
                        fontSize: { xs: '1.6rem', sm: '2rem' },
                        lineHeight: 1.1,
                        fontWeight: 'bold',
                        textAlign: 'center',

                        color:
                            theme.palette.mode === 'light'
                                ? theme.palette.primary.main
                                : theme.palette.primary.main,

                        textShadow:
                            theme.palette.mode === 'light'
                                ? '0 0 14px rgba(0,0,0,0.55)'
                                : '0 0 16px rgba(255,255,255,0.65)',
                    }}
                >
                    Waqt
                    <br />
                    Tracker
                </Typography>
            </Box>
        </>
    );
}
