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
import Collapse from '@mui/material/Collapse';
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
                    border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? '#1A2940' : '#F3F6F8',
                    },
                    transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
            >
                <SettingsIcon />
            </IconButton>

            {/* Settings Menu */}
            <Collapse in={open} timeout={200}>
                <Box
                    ref={containerRef}
                    sx={{
                        position: 'absolute',
                        top: '60px',
                        right: 0,
                        minWidth: '280px',
                        backgroundColor: 'background.paper',
                        border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        padding: '20px',
                        boxShadow: 'none',
                        zIndex: 1100,
                    }}
                >
                    {/* Menu Content... (rest is unchanged) */}
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LightModeIcon sx={{ color: theme.palette.mode === 'dark' ? '#b0b0b0' : theme.palette.primary.main, fontSize: '1.2rem' }} />
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
            </Collapse>
        </Box>
    );
}