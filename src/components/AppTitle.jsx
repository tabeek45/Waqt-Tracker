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
                        fontSize: { xs: '2rem', sm: '2rem' },
                        lineHeight: 1.1,
                        fontWeight: 'bold',
                        textAlign: 'center',

                        color: theme.palette.primary.main,
                        // textShadow removed for flat design
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
