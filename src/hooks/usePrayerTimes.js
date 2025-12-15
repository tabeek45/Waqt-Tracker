// src/hooks/usePrayerTimes.js
import { useState, useEffect } from 'react';
import {
    getPrayerTimesByCoords,
    getPrayerSettings,
    normalizeCityName
} from '../api';

const DEFAULT_LAT = 23.8103;
const DEFAULT_LON = 90.4125;
const DEFAULT_CITY = 'Dhaka';
const DEFAULT_COUNTRY = 'Bangladesh';

export default function usePrayerTimes() {
    const [latitude, setLatitude] = useState(DEFAULT_LAT);
    const [longitude, setLongitude] = useState(DEFAULT_LON);

    const [locationLabel, setLocationLabel] = useState(
        `${DEFAULT_CITY}, ${DEFAULT_COUNTRY}`
    );

    const [locationTimezone, setLocationTimezone] = useState(
        Intl.DateTimeFormat().resolvedOptions().timeZone
    );

    const [times, setTimes] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [currentSettings, setCurrentSettings] = useState(
        getPrayerSettings(DEFAULT_COUNTRY)
    );

    // -------------------------------
    // Fetch prayer times when location or method changes
    // -------------------------------
    useEffect(() => {
        let active = true;

        const fetchPrayerTimes = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getPrayerTimesByCoords(
                    latitude,
                    longitude,
                    currentSettings.method,
                    currentSettings.school
                );

                if (!active) return;

                setTimes(data.timings);
                setLocationTimezone(data.meta.timezone);
            } catch (err) {
                if (active) {
                    setError('Failed to load prayer times');
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchPrayerTimes();

        return () => {
            active = false;
        };
    }, [latitude, longitude, currentSettings]);

    // -------------------------------
    // Location selected from search
    // -------------------------------
    const handleLocationSelected = (place) => {
        if (!place?.latitude || !place?.longitude) return;

        setLatitude(place.latitude);
        setLongitude(place.longitude);

        const label = place.name && place.country
            ? `${place.name}, ${place.country}`
            : normalizeCityName(place);

        setLocationLabel(label);

        if (place.country) {
            setCurrentSettings(getPrayerSettings(place.country));
        }
    };

    return {
        latitude,
        longitude,
        locationLabel,
        locationTimezone,
        times,
        loading,
        error,
        currentSettings,
        setCurrentSettings,
        handleLocationSelected,
    };
}
