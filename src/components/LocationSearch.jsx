import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

export default function LocationSearch({ onLocationSelected }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const theme = useTheme();

  // Debounce search
  useEffect(() => {
    let active = true;

    if (!inputValue) {
      setOptions([]);
      return undefined;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(inputValue)}&count=5&language=en`);
        const data = await res.json();
        if (active) setOptions(data.results || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [inputValue]);

  // Define transparent background for mode compliance
  const inputBgColor = theme.palette.mode === 'dark'
    ? 'rgba(30, 30, 30, 0.4)'
    : 'rgba(255, 255, 255, 0.4)';

  const inputHoverColor = theme.palette.mode === 'dark'
    ? 'rgba(40, 40, 40, 0.5)'
    : 'rgba(255, 255, 255, 0.5)';

  // Define the solid color for the floating label background
  const labelBgColor = theme.palette.mode === 'dark'
    ? theme.palette.grey[900] // Darker background for dark mode
    : theme.palette.background.paper; // Standard white/light background for light mode


  return (
    <Box sx={{ width: '100%', maxWidth: 400, zIndex: 1000 }}>
      <Autocomplete
        id="location-search"
        sx={{
          // Hide dropdown arrow
          '& .MuiAutocomplete-popupIndicator': { display: 'none' },
          '& .MuiAutocomplete-clearIndicator': { color: theme.palette.text.primary },

          // Input Root Styling (Background, Blur, Height)
          '& .MuiOutlinedInput-root': {
            backgroundColor: inputBgColor,
            backdropFilter: 'blur(10px)',
            // We remove the root border here and put it on the notchedOutline
            borderRadius: '8px',
            minHeight: '56px',
            '&:hover': { backgroundColor: inputHoverColor },
            '&.Mui-focused': { backgroundColor: inputHoverColor },
          },

          // Notched Outline Styling (The Border itself)
          '& .MuiOutlinedInput-notchedOutline': {
            // 🛑 FIX: Apply the custom border here, where MUI expects it
            borderColor: theme.palette.primary.main,
            borderWidth: '2px',
            // Ensure rounded corners match the root
            borderRadius: '8px',
            transition: 'border-color 0.3s ease, background-color 0.3s ease',
          },
          // Hover and Focused state borders
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.light,
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },


          // Floating Label Styling (The text "Search Location")
          '& .MuiInputLabel-root': {
            color: theme.palette.text.secondary,
            fontWeight: 500,
            zIndex: 1,
            // 🛑 FIX: Remove the manual background for the idle label.
            // We only apply it when it is shrunk.
            '@media (max-width:600px)': { color: theme.palette.mode === 'dark' ? '#fff' : '#555' },
            '&.Mui-focused': { color: theme.palette.primary.main },
          },

          // 🛑 FIX: Apply background color and padding ONLY when the label is floating/shrunk
          '& .MuiInputLabel-shrink': {
            backgroundColor: labelBgColor,
            padding: '0 4px', // Add padding to reveal the background
          },

          // Input Text Styling
          '& .MuiInputBase-input': { color: theme.palette.text.primary, fontWeight: 500 },

          // Optional: To hide the legend (the automatically generated notch background)
          // Since we are applying the background directly to the label text (.MuiInputLabel-shrink), 
          // we can hide the legend to remove any potential visual conflicts.
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline legend': {
            // This ensures the notch is calculated but invisible, preventing border gaps.
            width: '0.01px !important',
            maxWidth: '0.01px !important',
          },

        }}
        open={open && (options.length > 0 || loading)}
        onOpen={() => { if (inputValue.length > 0) setOpen(true); }}
        onClose={() => setOpen(false)}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => `${option.name}, ${option.country}`}
        options={options}
        loading={loading}
        noOptionsText={null}
        onInputChange={(event, newInputValue, reason) => {
          setInputValue(newInputValue);
          if (reason === 'input') setOpen(newInputValue.length > 0);
        }}
        onChange={(event, newValue) => {
          setOpen(false);
          if (newValue) onLocationSelected(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Location"
            variant="outlined"
            InputProps={{
              // Note: We intentionally removed startAdornment to avoid conflicts.
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={20} sx={{ ml: 1 }} />}
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