import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';

// Helper to format time (HH:MM) to 12h/24h
const formatTime = (timeString, timeFormat = '12h') => {
    if (!timeString) return "--:--";
    // Remove seconds if present
    const cleanTime = timeString.split(" ")[0]; // Handle cases like "05:00 (BST)"
    const [hoursStr, minutesStr] = cleanTime.split(":");

    if (!hoursStr || !minutesStr) return timeString;

    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (timeFormat === '24h') {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')}${period}`;
};

export default function PrayerTimeTable({ latitude, longitude, method, school, timeFormat }) {
    const [expanded, setExpanded] = useState(false);
    const [weekData, setWeekData] = useState([]);
    const [loading, setLoading] = useState(false);
    const theme = useTheme();

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        if (!expanded || !latitude || !longitude) return;

        let active = true;

        const fetchWeekData = async () => {
            setLoading(true);
            try {
                const dates = [];
                const today = new Date();

                // Generate next 7 days
                for (let i = 0; i < 7; i++) {
                    const d = new Date(today);
                    d.setDate(today.getDate() + i);

                    const dd = String(d.getDate()).padStart(2, '0');
                    const mm = String(d.getMonth() + 1).padStart(2, '0');
                    const yyyy = d.getFullYear();

                    dates.push(`${dd}-${mm}-${yyyy}`);
                }

                const requests = dates.map(dateStr => {
                    const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${school}`;
                    return fetch(url).then(res => res.json());
                });

                const responses = await Promise.all(requests);

                const data = responses.map((res, index) => {
                    if (res.data && res.data.timings) {
                        return {
                            date: dates[index], // Use the request date string
                            readableDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + index).toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' }),
                            timings: res.data.timings
                        };
                    }
                    return null;
                }).filter(item => item !== null);

                if (active) {
                    setWeekData(data);
                }
            } catch (err) {
                console.error("Failed to fetch week data", err);
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchWeekData();

        return () => { active = false; };
    }, [expanded, latitude, longitude, method, school]);

    // Background color logic matching other components
    const tableBgColor = theme.palette.mode === 'dark'
        ? 'rgba(30, 30, 30, 0.4)'
        : 'rgba(255, 255, 255, 0.4)';

    return (
        <Box sx={{ width: '100%', mt: 4, mb: 4 }}>
            <Box
                onClick={toggleExpand}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                    mb: 1,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    width: 'fit-content',
                    mx: 'auto'
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Next 7 days prayer times
                </Typography>
                <IconButton
                    size="small"
                    sx={{
                        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s',
                        ml: 1
                    }}
                >
                    <KeyboardArrowDownIcon />
                </IconButton>
            </Box>

            <Collapse in={expanded}>
                {loading && weekData.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer
                        component={Paper}
                        sx={{
                            backgroundColor: tableBgColor,
                            backdropFilter: 'blur(10px)',
                            border: `2px solid ${theme.palette.primary.main}`,
                            borderRadius: 2,
                            boxShadow: 3,
                            overflowX: 'auto',
                            width: '100%',
                            maxWidth: '950px', // Fixed max width as requested
                            mx: 'auto' // Center the table container
                        }}
                    >
                        <Table
                            size="small"
                            aria-label="prayer times table"
                            sx={{
                                tableLayout: 'fixed', // Helps with consistent column sizing
                                width: '100%',
                                minWidth: { xs: '300px', sm: 'auto' } // Ensure it doesn't get too squashed on tiny screens
                            }}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{
                                        fontWeight: 'bold',
                                        fontSize: { xs: '10px', sm: '18px' },
                                        whiteSpace: 'normal',
                                        wordBreak: 'break-word',
                                        px: 1 // reduce padding to help with space
                                    }}>Date</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1 }}>Fajr</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1 }}>Sunrise</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1 }}>Dhuhr</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1 }}>Asr</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1 }}>Maghrib</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1 }}>Isha</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {weekData.map((row, index) => (
                                    <TableRow
                                        key={row.date}
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            backgroundColor: index % 2 === 0
                                                ? 'transparent'
                                                : (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')
                                        }}
                                    >
                                        <TableCell component="th" scope="row" sx={{
                                            whiteSpace: 'normal',
                                            wordBreak: 'break-word',
                                            fontSize: { xs: '10px', sm: '18px' },
                                            fontWeight: 'bold',
                                            px: 1
                                        }}>
                                            {row.readableDate}
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1 }}>{formatTime(row.timings.Fajr, timeFormat)}</TableCell>
                                        <TableCell align="center" sx={{ fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1 }}>{formatTime(row.timings.Sunrise, timeFormat)}</TableCell>
                                        <TableCell align="center" sx={{ fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1 }}>{formatTime(row.timings.Dhuhr, timeFormat)}</TableCell>
                                        <TableCell align="center" sx={{ fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1 }}>{formatTime(row.timings.Asr, timeFormat)}</TableCell>
                                        <TableCell align="center" sx={{ fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1 }}>{formatTime(row.timings.Maghrib, timeFormat)}</TableCell>
                                        <TableCell align="center" sx={{ fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1 }}>{formatTime(row.timings.Isha, timeFormat)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Collapse>
        </Box>
    );
}
