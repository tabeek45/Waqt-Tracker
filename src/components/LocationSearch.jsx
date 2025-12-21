import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

export default function LocationSearch({ onLocationSelected }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);
  const [resetKey, setResetKey] = useState(0); // Force reset component
  const theme = useTheme();

  const currentLocationOption = {
    id: 'current-location',
    name: 'Use your current location',
    country: '',
    isCurrentLocation: true
  };

  // Debounce search
  useEffect(() => {
    let active = true;

    // Always show "Use your current location" if input is focused/empty or has text
    const baseOptions = [currentLocationOption];

    if (!inputValue) {
      setOptions(baseOptions);
      return undefined;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(inputValue)}&count=5&language=en`);
        const data = await res.json();
        if (active) {
          setOptions([currentLocationOption, ...(data.results || [])]);
        }
      } catch (e) {
        console.error(e);
        if (active) setOptions(baseOptions);
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [inputValue]);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Use a more reliable/CORS-friendly reverse geocoding API
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await res.json();

          const locationData = {
            latitude,
            longitude,
            name: data.city || data.locality || 'Current Location',
            country: data.countryName || ''
          };
          onLocationSelected(locationData);
        } catch (error) {
          console.error("Reverse geocoding failed", error);
          onLocationSelected({ latitude, longitude, name: 'Current Location', country: '' });
        } finally {
          setGeoLoading(false);
          setInputValue('');
          setResetKey(prev => prev + 1); // Force clear
        }
      },
      (error) => {
        console.error("Geolocation error", error);
        setGeoLoading(false);
        alert(`Geolocation error: ${error.message}. Please ensure location permissions are enabled.`);
        setInputValue('');
        setResetKey(prev => prev + 1);
      },
      { timeout: 10000 }
    );
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 400, zIndex: 1000 }}>
      <Autocomplete
        key={resetKey}
        id="location-search"
        freeSolo={false}
        sx={{
          '& .MuiAutocomplete-popupIndicator': { display: 'none' },
          '& .MuiAutocomplete-clearIndicator': { color: theme.palette.text.secondary },

          '& .MuiOutlinedInput-root': {
            backgroundColor: theme.palette.background.paper,
            borderRadius: '8px',
            minHeight: '56px',
            paddingRight: '14px !important',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.light,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
            borderWidth: '1px',
            borderRadius: '8px',
            transition: 'border-color 0.2s',
          },
          '& .MuiInputLabel-root': {
            color: theme.palette.text.secondary,
            '&.Mui-focused': { color: theme.palette.primary.main }
          },
          '& .MuiInputBase-input': {
            color: theme.palette.text.primary,
            fontWeight: 500
          },
        }}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => {
          if (option.isCurrentLocation) return option.name;
          return `${option.name}, ${option.country}`;
        }}
        options={options}
        loading={loading}
        filterOptions={(x) => x}
        value={null}
        onInputChange={(event, newInputValue, reason) => {
          setInputValue(newInputValue);
          if (reason === 'input' || reason === 'reset') setOpen(true);
        }}
        onChange={(event, newValue) => {
          setOpen(false);
          setInputValue('');
          if (newValue) {
            if (newValue.isCurrentLocation) {
              handleCurrentLocation();
            } else {
              onLocationSelected(newValue);
              setResetKey(prev => prev + 1); // Reset input value for city selection too
            }
          }
        }}
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          return (
            <li key={key} {...otherProps}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                minHeight: '36px' // Ensures consistent row height even without subtext
              }}>
                {option.isCurrentLocation && (
                  <MyLocationIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: option.isCurrentLocation ? 700 : 400, lineHeight: 1.2 }}>
                    {option.name}
                  </Typography>
                  {option.country && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {option.country}
                    </Typography>
                  )}
                </Box>
              </Box>
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Location"
            variant="outlined"
            onClick={() => setOpen(true)}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {(loading || geoLoading) && <CircularProgress color="inherit" size={20} sx={{ ml: 1 }} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </Box>
  );
}

// updated