// src/App.jsx
// Simplified top-level application. Uses the modularized hook + theme file.

import React, { useState, useEffect } from "react";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LocationOnIcon from '@mui/icons-material/LocationPin';

import LocationSearch from './components/LocationSearch.jsx';
import PrayerTimes from './components/PrayerTimes.jsx';
import MethodSelector from './components/MethodSelector.jsx';
import WeatherInfo from './components/WeatherInfo.jsx';
import Settings from './components/Settings.jsx';
import AppTitle from './components/AppTitle.jsx';
// Import the new component
import PrayerTimeTable from './components/PrayerTimeTable.jsx';

import usePrayerTimes from './hooks/usePrayerTimes';
import { lightTheme, darkTheme } from './theme';

// localStorage keys for UI preferences
const UI_STORAGE_KEYS = {
    DARK_MODE: 'waqt_tracker_darkMode',
    TEMP_UNIT: 'waqt_tracker_tempUnit',
    TIME_FORMAT: 'waqt_tracker_timeFormat',
};

// Load from localStorage with fallback
const loadFromStorage = (key, defaultValue) => {
    try {
        const item = localStorage.getItem(key);
        return item !== null ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error loading ${key} from localStorage:`, error);
        return defaultValue;
    }
};

// Save to localStorage
const saveToStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
    }
};

function App() {
    const {
        locationLabel,
        times,
        loading,
        error,
        locationTimezone,
        currentSettings,
        handleLocationSelected,
        setCurrentSettings,
        latitude,
        longitude,
        weather,
        aqi
    } = usePrayerTimes();


    // UI preferences (persisted)
    const [darkMode, setDarkMode] = useState(() => loadFromStorage(UI_STORAGE_KEYS.DARK_MODE, false));
    const [tempUnit, setTempUnit] = useState(() => loadFromStorage(UI_STORAGE_KEYS.TEMP_UNIT, 'C'));
    const [timeFormat, setTimeFormat] = useState(() => loadFromStorage(UI_STORAGE_KEYS.TIME_FORMAT, '12h'));

    // Persist preferences
    useEffect(() => {
        saveToStorage(UI_STORAGE_KEYS.DARK_MODE, darkMode);
    }, [darkMode]);

    useEffect(() => {
        saveToStorage(UI_STORAGE_KEYS.TEMP_UNIT, tempUnit);
    }, [tempUnit]);

    useEffect(() => {
        saveToStorage(UI_STORAGE_KEYS.TIME_FORMAT, timeFormat);
    }, [timeFormat]);

    const handleSettingsChange = (newSettings) => {
        setCurrentSettings(newSettings);
    };

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ minHeight: '100vh', py: 4, display: 'flex', flexDirection: 'column', gap: 3, position: 'relative' }}>

                {/* Top Section: AppTitle | Search (center on desktop) | Settings */}
                <Box sx={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2,
                    mb: 2
                }}>
                    <Box sx={{ flex: '0 0 auto' }}>
                        <AppTitle />
                    </Box>

                    <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                        <LocationSearch onLocationSelected={handleLocationSelected} />
                    </Box>

                    <Box sx={{ flex: '0 0 auto' }}>
                        <Settings
                            darkMode={darkMode}
                            onDarkModeChange={setDarkMode}
                            tempUnit={tempUnit}
                            onTempUnitChange={setTempUnit}
                            timeFormat={timeFormat}
                            onTimeFormatChange={setTimeFormat}
                        />
                    </Box>
                </Box>

                {/* Mobile: Search placed below title */}
                <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 2 }}>
                    <LocationSearch onLocationSelected={handleLocationSelected} />
                </Box>

                {/* Location label and weather */}
                <Box sx={{ textAlign: 'center', width: '100%' }}>
                    <Typography variant="h5" component="h2" sx={(theme) => ({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        fontWeight: 'bold',
                        color: theme.palette.text.primary
                    })}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : <><LocationOnIcon color="error" /> {locationLabel}</>}
                    </Typography>

                    <Box sx={(theme) => ({
                        width: '80px',
                        height: '1px',
                        backgroundColor: theme.palette.divider,
                        margin: '15px auto',
                        borderRadius: '2px'
                    })} />

                    <WeatherInfo
                        latitude={latitude}
                        longitude={longitude}
                        locationTimezone={locationTimezone}
                        tempUnit={tempUnit}
                    />

                </Box>

                {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
                {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}

                {!loading && !error && (
                    <>
                        <PrayerTimes times={times} locationTimezone={locationTimezone} timeFormat={timeFormat} />
                        <MethodSelector currentSettings={currentSettings} onSettingsChange={handleSettingsChange} />
                    </>
                )}

                {!error && (
                    <PrayerTimeTable
                        latitude={latitude}
                        longitude={longitude}
                        method={currentSettings.method}
                        school={currentSettings.school}
                        timeFormat={timeFormat}
                    />
                )}

            </Container>
        </ThemeProvider>
    );
}

export default App;
