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
                // 🛑 Attach buttonRef here
                ref={buttonRef}
                onClick={handleToggle}
                sx={{
                    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                    backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(10px)',
                    border: `2px solid ${theme.palette.primary.main}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.2)'
                            : 'rgba(255, 255, 255, 0.5)',
                    },
                    transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
            >
                <SettingsIcon />
            </IconButton>

            {/* Settings Menu */}
            <Collapse in={open} timeout={200}>
                <Box
                    // 🛑 Attach containerRef here, to the Box *inside* the Collapse
                    ref={containerRef}
                    sx={{
                        position: 'absolute',
                        top: '60px',
                        right: 0,
                        minWidth: '280px',
                        backgroundColor: theme.palette.mode === 'dark'
                            ? 'rgba(30, 30, 30, 0.4)'
                            : 'rgba(255, 255, 255, 0.4)',
                        backdropFilter: 'blur(10px)',
                        border: `2px solid ${theme.palette.primary.main}`,
                        borderRadius: '8px',
                        padding: '20px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                        zIndex: 1100,
                    }}
                >
                    {/* Menu Content... (rest is unchanged) */}
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LightModeIcon sx={{ color: theme.palette.mode === 'dark' ? '#b0b0b0' : theme.palette.primary.main, fontSize: '1.2rem' }} />
                                <Typography sx={{ fontWeight: 600, color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
                                    Theme
                                </Typography>
                                <DarkModeIcon sx={{ color: theme.palette.mode === 'dark' ? theme.palette.primary.main : '#b0b0b0', fontSize: '1.2rem' }} />
                            </Box>
                            <Switch
                                checked={darkMode}
                                onChange={(e) => onDarkModeChange(e.target.checked)}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: theme.palette.primary.main,
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: theme.palette.primary.main,
                                    },
                                    '& .MuiSwitch-track': {
                                        transition: 'background-color 0.3s ease',
                                    },
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Divider */}
                    <Box sx={{ height: '1px', backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)', mb: 2 }} />

                    {/* Temperature Unit Setting */}
                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontWeight: 600, mb: 1, color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
                            Temperature Unit
                        </Typography>
                        <RadioGroup row value={tempUnit} onChange={(e) => onTempUnitChange(e.target.value)} sx={{ justifyContent: 'space-around' }}>
                            <FormControlLabel
                                value="C"
                                control={
                                    <Radio sx={{
                                        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                                        '&.Mui-checked': { color: theme.palette.primary.main },
                                    }} />
                                }
                                label={<Typography sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>Celsius</Typography>}
                            />
                            <FormControlLabel
                                value="F"
                                control={
                                    <Radio sx={{
                                        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                                        '&.Mui-checked': { color: theme.palette.primary.main },
                                    }} />
                                }
                                label={<Typography sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>Fahrenheit</Typography>}
                            />
                        </RadioGroup>
                    </Box>

                    {/* Divider */}
                    <Box sx={{ height: '1px', backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)', mb: 2 }} />

                    {/* Time Format Setting */}
                    <Box>
                        <Typography sx={{ fontWeight: 600, mb: 1, color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>
                            Time Format
                        </Typography>
                        <RadioGroup row value={timeFormat} onChange={(e) => onTimeFormatChange(e.target.value)} sx={{ justifyContent: 'space-around' }}>
                            <FormControlLabel
                                value="12h"
                                control={
                                    <Radio sx={{
                                        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                                        '&.Mui-checked': { color: theme.palette.primary.main },
                                    }} />
                                }
                                label={<Typography sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>12 Hour</Typography>}
                            />
                            <FormControlLabel
                                value="24h"
                                control={
                                    <Radio sx={{
                                        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                                        '&.Mui-checked': { color: theme.palette.primary.main },
                                    }} />
                                }
                                label={<Typography sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}>24 Hour</Typography>}
                            />
                        </RadioGroup>
                    </Box>
                </Box>
            </Collapse>
        </Box>
    );
}