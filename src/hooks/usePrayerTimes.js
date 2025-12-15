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

// localStorage keys
const STORAGE_KEYS = {
    LATITUDE: 'waqt_tracker_latitude',
    LONGITUDE: 'waqt_tracker_longitude',
    LOCATION_LABEL: 'waqt_tracker_locationLabel',
    LOCATION_TIMEZONE: 'waqt_tracker_locationTimezone',
    PRAYER_SETTINGS: 'waqt_tracker_prayerSettings',
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

export default function usePrayerTimes() {
    // Load initial values from localStorage or use defaults
    const [latitude, setLatitude] = useState(() => loadFromStorage(STORAGE_KEYS.LATITUDE, DEFAULT_LAT));
    const [longitude, setLongitude] = useState(() => loadFromStorage(STORAGE_KEYS.LONGITUDE, DEFAULT_LON));

    const [locationLabel, setLocationLabel] = useState(() =>
        loadFromStorage(STORAGE_KEYS.LOCATION_LABEL, `${DEFAULT_CITY}, ${DEFAULT_COUNTRY}`)
    );

    const [locationTimezone, setLocationTimezone] = useState(() =>
        loadFromStorage(STORAGE_KEYS.LOCATION_TIMEZONE, Intl.DateTimeFormat().resolvedOptions().timeZone)
    );

    const [times, setTimes] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load prayer settings from localStorage or use country-based default
    const savedSettings = loadFromStorage(STORAGE_KEYS.PRAYER_SETTINGS, null);
    const [currentSettings, setCurrentSettings] = useState(() =>
        savedSettings || getPrayerSettings(DEFAULT_COUNTRY)
    );

    // Persist to localStorage whenever these change
    useEffect(() => {
        saveToStorage(STORAGE_KEYS.LATITUDE, latitude);
    }, [latitude]);

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.LONGITUDE, longitude);
    }, [longitude]);

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.LOCATION_LABEL, locationLabel);
    }, [locationLabel]);

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.LOCATION_TIMEZONE, locationTimezone);
    }, [locationTimezone]);

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.PRAYER_SETTINGS, currentSettings);
    }, [currentSettings]);

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
