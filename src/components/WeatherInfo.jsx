import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

export default function WeatherInfo({
    latitude,
    longitude,
    locationTimezone,
    tempUnit = 'C'
}) {
    const theme = useTheme();

    const [weather, setWeather] = useState(null);
    const [aqi, setAqi] = useState(null);
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [gmtOffset, setGmtOffset] = useState('');

    const BOX_HEIGHT = 70;

    /* -------------------------
       Time updater (location-based)
    -------------------------- */
    useEffect(() => {
        if (!locationTimezone) return;

        const updateTime = () => {
            const now = new Date();

            setCurrentTime(
                now.toLocaleTimeString('en-US', {
                    timeZone: locationTimezone,
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                })
            );

            setCurrentDate(
                now.toLocaleDateString('en-US', {
                    timeZone: locationTimezone,
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                })
            );

            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: locationTimezone,
                timeZoneName: 'short',
            });

            const parts = formatter.formatToParts(now);
            setGmtOffset(parts.find(p => p.type === 'timeZoneName')?.value || '');
        };

        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, [locationTimezone]);

    /* -------------------------
       Weather + AQI fetch
    -------------------------- */
    useEffect(() => {
        if (!latitude || !longitude) return;

        let active = true;

        const fetchWeatherAndAQI = async () => {
            try {
                // Weather
                const weatherRes = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
                );
                const weatherData = await weatherRes.json();

                if (active && weatherData.current) {
                    setWeather({
                        temperature: Math.round(weatherData.current.temperature_2m),
                        weatherCode: weatherData.current.weather_code,
                    });
                }

                // AQI
                const aqiRes = await fetch(
                    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi`
                );
                const aqiData = await aqiRes.json();

                if (active && aqiData.current?.us_aqi !== undefined) {
                    setAqi(Math.round(aqiData.current.us_aqi));
                }
            } catch (err) {
                console.error('Weather/AQI fetch error:', err);
                if (active) {
                    setWeather(null);
                    setAqi(null);
                }
            }
        };

        fetchWeatherAndAQI();
        return () => {
            active = false;
        };
    }, [latitude, longitude]);

    /* -------------------------
       Helpers
    -------------------------- */
    const getWeatherIcon = (code) => {
        if (code === 0) return '☀️';
        if (code <= 3) return '⛅';
        if (code <= 48) return '🌫️';
        if (code <= 67) return '🌧️';
        if (code <= 77) return '🌨️';
        if (code <= 82) return '🌦️';
        if (code <= 86) return '🌨️';
        if (code <= 99) return '⛈️';
        return '🌤️';
    };

    const getAQIInfo = (value) => {
        if (value <= 50) return { color: '#00e400', label: 'Good' };
        if (value <= 100) return { color: '#ffff00', label: 'Moderate' };
        if (value <= 150) return { color: '#ff7e00', label: 'Unhealthy for Sensitive' };
        if (value <= 200) return { color: '#ff0000', label: 'Unhealthy' };
        if (value <= 300) return { color: '#8f3f97', label: 'Very Unhealthy' };
        return { color: '#7e0023', label: 'Hazardous' };
    };

    const aqiInfo = aqi !== null ? getAQIInfo(aqi) : null;

    /* -------------------------
       Render
    -------------------------- */
    if (!latitude || !longitude) return null;

    return (
        <Box sx={{ width: '100%', pb: 2, px: 1 }}>
            <Grid
                container
                spacing={2}
                alignItems="flex-start"
                justifyContent="center"
            >
                {/* Time Box */}
                <Grid item xs={6} sm={4} md={4} lg="auto">
                    <Box sx={{
                        p: 2,
                        borderRadius: 2,
                        border: `2px solid ${theme.palette.primary.main}`,
                        backgroundColor: theme.palette.mode === 'dark'
                            ? 'rgba(0,0,0,0.4)'
                            : 'rgba(255,255,255,0.4)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: BOX_HEIGHT,
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                            <Box sx={{ fontSize: 20, fontWeight: 700 }}>{currentTime}</Box>
                            <Box sx={{ fontSize: 11, fontWeight: 500, color: theme.palette.text.secondary }}>
                                {gmtOffset}
                            </Box>
                        </Box>
                        <Box sx={{ fontSize: 13, fontWeight: 500 }}>
                            {currentDate}
                        </Box>
                    </Box>
                </Grid>

                {/* Weather Box */}
                {weather && (
                    <Grid item xs={6} sm={4} md={4} lg="auto">
                        <Box sx={{
                            p: 2,
                            borderRadius: 2,
                            border: `2px solid ${theme.palette.primary.main}`,
                            backgroundColor: theme.palette.mode === 'dark'
                                ? 'rgba(0,0,0,0.4)'
                                : 'rgba(255,255,255,0.4)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            height: BOX_HEIGHT,
                        }}>
                            <Box sx={{ fontSize: 28 }}>
                                {getWeatherIcon(weather.weatherCode)}
                            </Box>
                            <Box sx={{ fontSize: 18, fontWeight: 700 }}>
                                {tempUnit === 'F'
                                    ? Math.round((weather.temperature * 9) / 5 + 32)
                                    : weather.temperature}
                                °{tempUnit}
                            </Box>
                        </Box>
                    </Grid>
                )}

                {/* AQI Box */}
                {aqiInfo && (
                    <Grid item xs={12} sm={4} md={4} lg="auto">
                        <Box sx={{
                            p: 2,
                            borderRadius: 2,
                            border: `2px solid ${theme.palette.primary.main}`,
                            backgroundColor: theme.palette.mode === 'dark'
                                ? 'rgba(0,0,0,0.4)'
                                : 'rgba(255,255,255,0.4)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            height: BOX_HEIGHT,
                        }}>
                            <Box sx={{ fontWeight: 600, fontSize: 16 }}>AQI:</Box>
                            <Box sx={{
                                px: 2,
                                py: '3px',
                                borderRadius: 20,
                                fontWeight: 700,
                                fontSize: 16,
                                backgroundColor: aqiInfo.color,
                                color: aqi > 100 ? '#fff' : '#000',
                            }}>
                                {aqi}
                            </Box>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}
