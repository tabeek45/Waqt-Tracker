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

    // Background color logic - using flat paper colors
    const tableBgColor = theme.palette.background.paper;

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
                    backgroundColor: theme.palette.background.paper,
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                    width: 'fit-content',
                    mx: 'auto',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    Next 7 days prayer times
                </Typography>
                <IconButton
                    size="small"
                    sx={{
                        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s',
                        ml: 1,
                        color: theme.palette.text.primary
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
                            border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                            borderRadius: 2,
                            boxShadow: 'none',
                            overflowX: 'auto',
                            width: '100%',
                            maxWidth: '950px',
                            mx: 'auto'
                        }}
                    >
                        <Table
                            size="small"
                            aria-label="prayer times table"
                            sx={{
                                tableLayout: 'fixed',
                                width: '100%',
                                minWidth: { xs: '300px', sm: 'auto' }
                            }}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{
                                        fontWeight: 'bold',
                                        fontSize: { xs: '10px', sm: '18px' },
                                        whiteSpace: 'normal',
                                        wordBreak: 'break-word',
                                        px: 1,
                                        color: theme.palette.text.secondary
                                    }}>Date</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1, color: theme.palette.text.secondary }}>Fajr</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1, color: theme.palette.text.secondary }}>Sunrise</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1, color: theme.palette.text.secondary }}>Dhuhr</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1, color: theme.palette.text.secondary }}>Asr</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1, color: theme.palette.text.secondary }}>Maghrib</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1, color: theme.palette.text.secondary }}>Isha</TableCell>
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
                                                : (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)') // clearer alternating rows
                                        }}
                                    >
                                        <TableCell component="th" scope="row" sx={{
                                            whiteSpace: 'normal',
                                            wordBreak: 'break-word',
                                            fontSize: { xs: '10px', sm: '18px' },
                                            fontWeight: 'bold',
                                            px: 1,
                                            color: theme.palette.text.primary
                                        }}>
                                            {row.readableDate}
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1, color: theme.palette.text.primary }}>{formatTime(row.timings.Fajr, timeFormat)}</TableCell>
                                        <TableCell align="center" sx={{ fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1, color: theme.palette.text.primary }}>{formatTime(row.timings.Sunrise, timeFormat)}</TableCell>
                                        <TableCell align="center" sx={{ fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1, color: theme.palette.text.primary }}>{formatTime(row.timings.Dhuhr, timeFormat)}</TableCell>
                                        <TableCell align="center" sx={{ fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1, color: theme.palette.text.primary }}>{formatTime(row.timings.Asr, timeFormat)}</TableCell>
                                        <TableCell align="center" sx={{ fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1, color: theme.palette.text.primary }}>{formatTime(row.timings.Maghrib, timeFormat)}</TableCell>
                                        <TableCell align="center" sx={{ fontSize: { xs: '10px', sm: '18px' }, whiteSpace: 'normal', wordBreak: 'break-word', px: 1, color: theme.palette.text.primary }}>{formatTime(row.timings.Isha, timeFormat)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Collapse>
        </Box >
    );
}
