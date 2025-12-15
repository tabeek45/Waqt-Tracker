// src/components/MethodSelector.jsx

import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Check from '@mui/icons-material/Check';

// --- Available Settings Options ---
const METHOD_OPTIONS = [
    { value: 1, label: "University of Islamic Sciences, Karachi" },
    { value: 2, label: "Islamic Society of North America (ISNA)" },
    { value: 3, label: "Muslim World League (MWL)" },
    { value: 4, label: "Umm al-Qura, Makkah" },
    { value: 5, label: "Egyptian General Authority of Survey" },
    { value: 8, label: "Gulf Regional Organization" },
    { value: 10, label: "Shia Ithna Ashari (Leva Research)" },
    { value: 11, label: "Institute of Geophysics, University of Tehran" },
];

const SCHOOL_OPTIONS = [
    { value: 0, label: "Shafi/Maliki/Hanbali" },
    { value: 1, label: "Hanafi Juristic" },
];

export default function MethodSelector({ currentSettings, onSettingsChange }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // --- Utility Functions ---
    const getCurrentMethodLabel = (methodValue) => {
        const option = METHOD_OPTIONS.find(opt => opt.value === methodValue);
        return option ? option.label.split(' (')[0].trim() : 'Custom Method';
    };

    const getCurrentSchoolLabel = (schoolValue) => {
        const option = SCHOOL_OPTIONS.find(opt => opt.value === schoolValue);
        return option ? option.label : 'Standard';
    };

    // --- Handlers ---
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMethodChange = (newMethod) => {
        const newSettings = { ...currentSettings, method: newMethod };

        // Update label logic
        const newMethodLabel = getCurrentMethodLabel(newMethod);
        const newSchoolLabel = getCurrentSchoolLabel(newSettings.school);
        newSettings.methodLabel = `${newMethodLabel} / ${newSchoolLabel}`;

        onSettingsChange(newSettings);
        // Do NOT close menu
    };

    const handleSchoolChange = (newSchool) => {
        const newSettings = { ...currentSettings, school: newSchool };

        // Update label logic
        const newMethodLabel = getCurrentMethodLabel(newSettings.method);
        const newSchoolLabel = getCurrentSchoolLabel(newSchool);
        newSettings.methodLabel = `${newMethodLabel} / ${newSchoolLabel}`;

        onSettingsChange(newSettings);
        // Do NOT close menu
    };

    // --- Render Logic ---
    const currentMethodLabel = getCurrentMethodLabel(currentSettings.method);
    const currentSchoolLabel = getCurrentSchoolLabel(currentSettings.school);
    const currentDisplayLabel = `${currentMethodLabel} · ${currentSchoolLabel}`;

    return (
        <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box
                sx={(theme) => ({
                    backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(30, 30, 30, 0.4)'
                        : 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(10px)',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: `2px solid ${theme.palette.primary.main}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    transition: 'all 0.3s ease',
                })}
            >
                <Typography
                    variant="body2"
                    sx={(theme) => ({
                        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                        fontWeight: 500,
                    })}
                >
                    Based on: <Box component="span" sx={(theme) => ({
                        fontWeight: 'bold',
                        color: theme.palette.mode === 'dark' ? '#fff' : '#000'
                    })}>{currentDisplayLabel}</Box>
                </Typography>

                <Typography
                    component="a"
                    onClick={handleClick}
                    aria-controls={open ? 'settings-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    sx={(theme) => ({
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        transition: 'color 0.2s ease',
                        '&:hover': {
                            opacity: 0.8,
                        },
                    })}
                >
                    Change
                </Typography>
            </Box>

            <Menu
                id="settings-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transitionDuration={100}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    sx: { maxHeight: 400 }
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <MenuItem disabled sx={{ opacity: '1 !important', fontWeight: 'bold', color: 'text.primary' }}>
                    Calculation Method
                </MenuItem>
                {METHOD_OPTIONS.map((option) => (
                    <MenuItem
                        key={option.value}
                        onClick={(event) => {
                            event.stopPropagation();
                            handleMethodChange(option.value);
                        }}
                        selected={currentSettings.method === option.value}
                    >
                        <ListItemIcon>
                            {currentSettings.method === option.value && <Check fontSize="small" />}
                        </ListItemIcon>
                        <ListItemText>{option.label}</ListItemText>
                    </MenuItem>
                ))}

                <Divider sx={{ my: 1 }} />

                <MenuItem disabled sx={{ opacity: '1 !important', fontWeight: 'bold', color: 'text.primary' }}>
                    Asr Method
                </MenuItem>
                {SCHOOL_OPTIONS.map((option) => (
                    <MenuItem
                        key={option.value}
                        onClick={(event) => {
                            event.stopPropagation();
                            handleSchoolChange(option.value);
                        }}
                        selected={currentSettings.school === option.value}
                    >
                        <ListItemIcon>
                            {currentSettings.school === option.value && <Check fontSize="small" />}
                        </ListItemIcon>
                        <ListItemText>{option.label}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}