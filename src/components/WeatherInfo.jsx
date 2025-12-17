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

    const bgColor = theme.palette.mode === 'dark'
        ? 'rgba(30, 30, 30, 0.4)'
        : 'rgba(255, 255, 255, 0.4)';

    const [weather, setWeather] = useState(null);
    const [aqi, setAqi] = useState(null);
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [gmtOffset, setGmtOffset] = useState('');

    const BOX_HEIGHT = 70;

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


    useEffect(() => {
        if (!latitude || !longitude) return;

        let active = true;

        const fetchWeatherAndAQI = async () => {
            try {
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

                const aqiRes = await fetch(
                    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi`
                );
                const aqiData = await aqiRes.json();

                if (active && aqiData.current?.us_aqi !== undefined) {
                    setAqi(Math.round(aqiData.current.us_aqi));
                }
            } catch (err) {
                console.error('Weather/AQI fetch error:', err);
            }
        };

        fetchWeatherAndAQI();
        return () => { active = false; };
    }, [latitude, longitude]);


    const getWeatherInfo = (code) => {
        if (code === 0) return { icon: '☀️', label: 'Sunny' };
        if (code <= 3) return { icon: '⛅', label: 'Partly Cloudy' };
        if (code <= 48) return { icon: '🌫️', label: 'Foggy' };
        if (code <= 67) return { icon: '🌧️', label: 'Rainy' };
        if (code <= 77) return { icon: '🌨️', label: 'Snowy' };
        if (code <= 82) return { icon: '🌦️', label: 'Showers' };
        if (code <= 99) return { icon: '⛈️', label: 'Stormy' };
        return { icon: '🌤️', label: 'Clear' };
    };

    const getAQIInfo = (value) => {
        if (value <= 50) return { color: '#00e400', label: 'Good' };
        if (value <= 100) return { color: '#ffff00', label: 'Moderate' };
        if (value <= 150) return { color: '#ff7e00', label: 'Sensitive' };
        if (value <= 200) return { color: '#ff0000', label: 'Unhealthy' };
        if (value <= 300) return { color: '#8f3f97', label: 'Very Unhealthy' };
        return { color: '#7e0023', label: 'Hazardous' };
    };

    const weatherInfo = weather ? getWeatherInfo(weather.weatherCode) : null;
    const aqiInfo = aqi !== null ? getAQIInfo(aqi) : null;

    if (!latitude || !longitude) return null;

    return (
        <Box sx={{ width: '100%', pb: 2, px: 1 }}>
            <Grid
                container
                spacing={2}
                alignItems="flex-start"
                justifyContent="center"
                wrap="nowrap"
            >

                {/* Time Box */}
                <Grid item xs="auto">
                    <Box sx={{
                        p: 2,
                        borderRadius: 2,
                        border: `2px solid ${theme.palette.primary.main}`,
                        backdropFilter: 'blur(10px)',
                        backgroundColor: bgColor,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: BOX_HEIGHT,
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                            <Box sx={{ fontSize: { xs: '1rem', md: '1.25rem' }, fontWeight: 700 }}>{currentTime}</Box>
                            <Box sx={{ fontSize: { xs: '0.6rem', md: '0.7rem' }, color: 'text.secondary' }}>{gmtOffset}</Box>
                        </Box>
                        <Box sx={{ fontSize: { xs: '0.75rem', md: '0.85rem' } }}>{currentDate}</Box>
                    </Box>
                </Grid>

                {/* Weather Box */}
                {weatherInfo && (
                    <Grid item xs="auto">
                        <Box sx={{
                            p: 2,
                            borderRadius: 2,
                            border: `2px solid ${theme.palette.primary.main}`,
                            backdropFilter: 'blur(10px)',
                            backgroundColor: bgColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            height: BOX_HEIGHT,
                        }}>
                            <Box sx={{ fontSize: { xs: '1.5rem', md: '1.8rem' } }}>{weatherInfo.icon}</Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Box sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, fontWeight: 700 }}>
                                    {tempUnit === 'F'
                                        ? Math.round((weather.temperature * 9) / 5 + 32)
                                        : weather.temperature}
                                    °{tempUnit}
                                </Box>

                                <Box sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' }, color: 'text.secondary' }}>
                                    {weatherInfo.label}
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                )}

                {/* AQI Box */}
                {aqiInfo && (
                    <Grid item xs="auto">
                        <Box sx={{
                            p: 2,
                            borderRadius: 2,
                            backdropFilter: 'blur(10px)',
                            backgroundColor: bgColor,
                            border: `2px solid ${theme.palette.primary.main}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            height: BOX_HEIGHT,
                        }}>
                            <Box sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', md: '1rem' } }}>AQI:</Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Box sx={{
                                    px: 1.5,
                                    py: '2px',
                                    borderRadius: 20,
                                    fontWeight: 700,
                                    fontSize: { xs: '0.9rem', md: '1rem' },
                                    backgroundColor: aqiInfo.color,
                                    color: aqi > 100 ? '#fff' : '#000',
                                }}>
                                    {aqi}
                                </Box>

                                <Box sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' }, color: 'text.secondary' }}>
                                    {aqiInfo.label}
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}
