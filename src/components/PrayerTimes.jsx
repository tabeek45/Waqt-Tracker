// src/components/PrayerTimes.jsx

import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

// Updated time formatter with timeFormat support
const formatSimpleTime = (timeString, targetTimezone, timeFormat = "12h") => {
    if (!timeString) return "--:--";

    const [hours, minutes] = timeString.split(":").map(Number);

    if (timeFormat === "24h") {
        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`;
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
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour12: false,
    })
        .formatToParts(now)
        .reduce((acc, p) => {
            acc[p.type] = p.value;
            return acc;
        }, {});

    const nowDate = new Date(
        Number(parts.year),
        Number(parts.month) - 1,
        Number(parts.day),
        Number(parts.hour),
        Number(parts.minute),
        Number(parts.second)
    );

    const [pH, pM] = prayerTime.split(":").map(Number);
    const target = new Date(
        Number(parts.year),
        Number(parts.month) - 1,
        Number(parts.day),
        pH,
        pM,
        0
    );

    if (target <= nowDate) target.setDate(target.getDate() + 1);

    const diff = (target - nowDate) / 1000;

    const hh = String(Math.floor(diff / 3600)).padStart(2, "0");
    const mm = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
    const ss = String(Math.floor(diff % 60)).padStart(2, "0");

    return `${hh}:${mm}:${ss}`;
};

export default function PrayerTimes({
    times,
    locationTimezone,
    timeFormat = "12h",
}) {
    const [activePrayer, setActivePrayer] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const theme = useTheme();

    useEffect(() => {
        setActivePrayer(null);
        setCountdown(null);
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

    const MOBILE_BASE_HEIGHT = "140px";
    const MOBILE_ACTIVE_HEIGHT = "170px";
    const DESKTOP_BASE_HEIGHT = "120px";

    return (
        <Box sx={{ width: "100%", pb: 2, px: 1 }}>
            <Grid
                container
                spacing={2}
                sx={{
                    flexWrap: { xs: "wrap", md: "nowrap" },
                    justifyContent: "center",
                    alignItems: "stretch",
                }}
            >
                {prayerOrder.map((name) => {
                    const time = times[name];
                    const isActive = activePrayer === name;
                    const showActive = isActive && name !== "Sunrise";

                    const cardHeightSx = {
                        xs: showActive ? MOBILE_ACTIVE_HEIGHT : "100%",
                        md: showActive ? MOBILE_ACTIVE_HEIGHT : DESKTOP_BASE_HEIGHT,
                    };

                    const timeFontSizeSx = {
                        xs: showActive ? "1.75rem" : "2.25rem",
                        md: "1.75rem",
                    };

                    return (
                        <Grid
                            item
                            xs={6}
                            md="auto"
                            key={name}
                            sx={{
                                flexGrow: { md: 1 },
                                flexBasis: { md: 0 },
                                aspectRatio: {
                                    xs: showActive ? "initial" : "1 / 1",
                                    md: "initial",
                                },
                            }}
                        >
                            <Card
                                sx={{
                                    height: cardHeightSx,
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    transition: "transform 0.2s, height 0.3s",
                                    transform: showActive ? "scale(1.05)" : "scale(1)",
                                    border: showActive
                                        ? `2px solid ${theme.palette.primary.main}`
                                        : "none",
                                    boxShadow: showActive ? 6 : 1,
                                    backgroundColor: showActive
                                        ? theme.palette.mode === "dark"
                                            ? "rgba(30, 30, 30, 0.4)"
                                            : "rgba(255, 255, 255, 0.4)"
                                        : "background.paper",
                                    backdropFilter: showActive ? "blur(10px)" : "none",
                                    py: 1.5,
                                }}
                            >
                                <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
                                    {showActive && (
                                        <Typography
                                            variant="subtitle2"
                                            color="primary"
                                            sx={{ fontWeight: "bold", mb: 0.5, fontSize: "0.75rem" }}
                                        >
                                            Upcoming Prayer
                                        </Typography>
                                    )}

                                    <Typography
                                        variant="h6"
                                        sx={{ fontSize: "1rem" }}
                                        color={showActive ? "primary" : "textSecondary"}
                                    >
                                        {name}
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: "bold",
                                            my: 0.5,
                                            fontSize: timeFontSizeSx,
                                        }}
                                    >
                                        {time
                                            ? formatSimpleTime(
                                                time,
                                                locationTimezone,
                                                timeFormat
                                            )
                                            : "--:--"}
                                    </Typography>

                                    {showActive && countdown && (
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: "bold",
                                                color: theme.palette.error.main,
                                                fontSize: "1rem",
                                            }}
                                        >
                                            - {countdown}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}
