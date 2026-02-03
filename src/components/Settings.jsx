// src/components/Settings.jsx
import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Switch from '@mui/material/Switch';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Grow from '@mui/material/Grow';
import { useTheme } from '@mui/material/styles';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Divider from '@mui/material/Divider';

export default function Settings({
    darkMode,
    onDarkModeChange,
    tempUnit,
    onTempUnitChange,
    timeFormat,
    onTimeFormatChange
}) {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const containerRef = useRef(null);
    // 🛑 New Ref for the button
    const buttonRef = useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    // Click outside detection
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check 1: If the ref exists AND the click is NOT inside the containerRef (the menu area)
            // Check 2: AND the click is NOT on the buttonRef (the settings cog)
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
            {/* Settings Cog Button */}
            <IconButton
                ref={buttonRef}
                onClick={handleToggle}
                sx={{
                    color: 'text.primary',
                    backgroundColor: 'background.paper',
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        backgroundColor: theme.palette.custom.surfaceAlt,
                    },
                    transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
            >
                <SettingsIcon />
            </IconButton>

            {/* Settings Menu */}
            <Grow 
                in={open} 
                style={{ transformOrigin: 'top right' }}
                {...(open ? { timeout: 300 } : {})}
            >
                <Box
                    ref={containerRef}
                    sx={{
                        position: 'absolute',
                        top: '55px',
                        right: 0,
                        minWidth: '280px',
                        backgroundColor: 'background.paper',
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '24px',
                        padding: '24px',
                        boxShadow: theme.palette.mode === 'dark'
                            ? '0 14px 28px -16px rgba(8, 15, 24, 0.7)'
                            : '0 12px 26px -12px rgba(13, 28, 22, 0.18)',
                        zIndex: 1100,
                    }}
                >
                    {/* Menu Content... (rest is unchanged) */}
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LightModeIcon sx={{ color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : theme.palette.primary.main, fontSize: '1.2rem' }} />
                                <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>
                                    Theme
                                </Typography>
                                <DarkModeIcon sx={{ color: theme.palette.mode === 'dark' ? theme.palette.primary.main : 'text.secondary', fontSize: '1.2rem' }} />
                            </Box>
                            <Switch
                                checked={darkMode}
                                onChange={(e) => onDarkModeChange(e.target.checked)}
                            />
                        </Box>
                    </Box>

                    {/* Divider */}
                    <Divider sx={{ mb: 2 }} />

                    {/* Temperature Unit Setting */}
                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                            Temperature Unit
                        </Typography>
                        <RadioGroup row value={tempUnit} onChange={(e) => onTempUnitChange(e.target.value)} sx={{ justifyContent: 'space-around' }}>
                            <FormControlLabel
                                value="C"
                                control={<Radio />}
                                label={<Typography sx={{ color: 'text.primary' }}>Celsius</Typography>}
                            />
                            <FormControlLabel
                                value="F"
                                control={<Radio />}
                                label={<Typography sx={{ color: 'text.primary' }}>Fahrenheit</Typography>}
                            />
                        </RadioGroup>
                    </Box>

                    {/* Divider */}
                    <Divider sx={{ mb: 2 }} />

                    {/* Time Format Setting */}
                    <Box>
                        <Typography sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                            Time Format
                        </Typography>
                        <RadioGroup row value={timeFormat} onChange={(e) => onTimeFormatChange(e.target.value)} sx={{ justifyContent: 'space-around' }}>
                            <FormControlLabel
                                value="12h"
                                control={<Radio />}
                                label={<Typography sx={{ color: 'text.primary' }}>12 Hour</Typography>}
                            />
                            <FormControlLabel
                                value="24h"
                                control={<Radio />}
                                label={<Typography sx={{ color: 'text.primary' }}>24 Hour</Typography>}
                            />
                        </RadioGroup>
                    </Box>
                </Box>
            </Grow>
        </Box>
    );
}
