import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

/* -------------------- helpers -------------------- */

const formatSimpleTime = (timeString, targetTimezone, timeFormat = "12h") => {
    if (!timeString) return "--:--";
    const [hours, minutes] = timeString.split(":").map(Number);
    if (timeFormat === "24h") {
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")}${period}`;
};

const getCountdown = (prayerTime, tz) => {
    if (!prayerTime || !tz) return "00:00:00";
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        day: "2-digit", month: "2-digit", year: "numeric",
        hour12: false,
    }).formatToParts(now).reduce((acc, p) => {
        acc[p.type] = p.value;
        return acc;
    }, {});

    const nowDate = new Date(
        Number(parts.year), Number(parts.month) - 1, Number(parts.day),
        Number(parts.hour), Number(parts.minute), Number(parts.second)
    );

    const [pH, pM] = prayerTime.split(":").map(Number);
    const target = new Date(Number(parts.year), Number(parts.month) - 1, Number(parts.day), pH, pM, 0);
    if (target <= nowDate) target.setDate(target.getDate() + 1);
    const diff = (target - nowDate) / 1000;
    const hh = String(Math.floor(diff / 3600)).padStart(2, "0");
    const mm = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
    const ss = String(Math.floor(diff % 60)).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
};

const PRAYER_EMOJI = {
    Fajr: "🌄",
    Sunrise: "🌅",
    Dhuhr: "☀️",
    Asr: "🌤️",
    Maghrib: "🌇",
    Isha: "🌙",
};

export default function PrayerTimes({ times, locationTimezone, timeFormat = "12h" }) {
    const [activePrayer, setActivePrayer] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const theme = useTheme();

    useEffect(() => {
        if (!times || !locationTimezone) return;
        const update = () => {
            const order = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
            let next = null;
            let closest = Infinity;
            for (let name of order) {
                const t = times[name];
                if (!t) continue;
                const cd = getCountdown(t, locationTimezone);
                const [h, m, s] = cd.split(":").map(Number);
                const sec = h * 3600 + m * 60 + s;
                if (sec > 0 && sec < closest) {
                    closest = sec;
                    next = name;
                }
            }
            setActivePrayer(next || "Fajr");
            setCountdown(getCountdown(times[next || "Fajr"], locationTimezone));
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, [times, locationTimezone]);

    if (!times) return null;

    const prayerOrder = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    const DESKTOP_BASE_HEIGHT = "140px";

    const activeBgColor = theme.palette.mode === 'dark'
        ? 'rgba(30, 30, 30, 0.4)'
        : 'rgba(255, 255, 255, 0.4)';

    return (
        <Container
            maxWidth={false} // Allow full width to make boxes wider
            sx={{
                width: "100%",
                pb: 2,
                px: { xs: 1, sm: 2, md: 4 }, // Increased horizontal padding slightly for wider screens
                display: 'flex',
                justifyContent: 'center'
            }}
        >
            <Grid
                container
                spacing={2}
                sx={{
                    justifyContent: "center",
                    alignItems: "stretch",
                    width: "100%",
                }}
            >
                {prayerOrder.map((name) => {
                    const time = times[name];
                    const isActive = activePrayer === name;
                    const showActive = isActive && name !== "Sunrise";

                    return (
                        <Grid
                            item
                            key={name}
                            xs={6}   // 2 per row on Mobile
                            sm={4}   // 3 per row on Tablet
                            md={2}   // 6 per row on Desktop
                        >
                            <Card
                                sx={{
                                    height: { xs: "100%", md: showActive ? "160px" : DESKTOP_BASE_HEIGHT },
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    transition: "transform 0.2s",
                                    transform: showActive ? "scale(1.02)" : "scale(1)",
                                    border: showActive ? `2px solid ${theme.palette.primary.main}` : "none",
                                    boxShadow: showActive ? 6 : 1,
                                    backgroundColor: showActive ? activeBgColor : "background.paper",
                                    backdropFilter: showActive ? "blur(10px)" : "none",
                                }}
                            >
                                <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: "bold",
                                            fontSize: { xs: "0.85rem", md: "1rem" },
                                            whiteSpace: "nowrap"
                                        }}
                                        color={showActive ? "primary" : "textSecondary"}
                                    >
                                        {name} {PRAYER_EMOJI[name]}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontWeight: "bold",
                                            fontSize: { xs: "1.1rem", md: "1.75rem" },
                                            my: 0.5
                                        }}
                                    >
                                        {time ? formatSimpleTime(time, locationTimezone, timeFormat) : "--:--"}
                                    </Typography>

                                    {showActive && countdown && (
                                        <Typography
                                            sx={{
                                                fontWeight: "bold",
                                                color: theme.palette.error.main,
                                                fontSize: { xs: "0.8rem", md: "1rem" },
                                            }}
                                        >
                                            -{countdown}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
    );
}