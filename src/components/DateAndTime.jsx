// src/components/DateAndTime.jsx

import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Function to format time as HH:MM AM/PM using timezone
const formatTime = (date, timezone) => {
    return date.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

// Function to format date as DD-MMM-YYYY using timezone
const formatDate = (date, timezone) => {
    const options = {
        timeZone: timezone,
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    };

    // Use Intl.DateTimeFormat to reliably extract parts based on the timezone
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(date);

    const day = parts.find(p => p.type === 'day').value;
    const month = parts.find(p => p.type === 'month').value;
    const year = parts.find(p => p.type === 'year').value;

    return `${day}-${month}-${year}`;
};

export default function DateAndTime({ locationTimezone }) {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        // Interval updates the raw Date object every second
        const timerId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    // Use the prop, or fallback to the user's default system timezone if the prop is null/undefined
    const effectiveTimezone = locationTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

    const timeString = formatTime(currentDateTime, effectiveTimezone);
    const dateString = formatDate(currentDateTime, effectiveTimezone);

    return (
        <Paper
            elevation={3}
            sx={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                px: 3,
                py: 1,
                borderRadius: 4,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider'
            }}
        >
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
                {timeString}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 0.5 }}>
                {dateString}
            </Typography>
        </Paper>
    );
}