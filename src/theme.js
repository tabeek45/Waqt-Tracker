// src/theme.js
import { createTheme } from "@mui/material/styles";

const FONT_FAMILY = '"Rethink Sans", "RethinkSans", sans-serif';

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2A8C6A", light: "#5FB49A", dark: "#1E6C52" },
    secondary: { main: "#4C7FB1", light: "#78A2CC", dark: "#356286" },
    error: { main: "#B3586A" },
    warning: { main: "#C48A58" },
    info: { main: "#4B8AA6" },
    success: { main: "#3E9C78" },
    background: {
      default: "#DCEFE1",
      paper: "#F1FAF3",
    },
    text: {
      primary: "#0D1C16",
      secondary: "#3F564D",
      disabled: "#6A7B72",
    },
    divider: "#C6DFD0",
    action: {
      hover: "rgba(42, 140, 106, 0.12)",
      selected: "rgba(42, 140, 106, 0.18)",
      focus: "rgba(76, 127, 177, 0.22)",
    },
    custom: {
      surfaceAlt: "#E3F2E8",
      chip: "#D7ECE2",
      tableRowAlt: "rgba(42, 140, 106, 0.1)",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: FONT_FAMILY,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "linear-gradient(135deg, #BFE6D0 0%, #D4EEDC 45%, #EDF6EE 100%)",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          backgroundImage: "none",
          border: "none",
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#7CB2E2", light: "#9CC6EA", dark: "#5A95C7" },
    secondary: { main: "#4C8F86", light: "#6AA99E", dark: "#3A726B" },
    error: { main: "#C0707D" },
    warning: { main: "#C38B62" },
    info: { main: "#6BA5C0" },
    success: { main: "#58A88E" },
    background: {
      default: "#0A1424",
      paper: "#162739",
    },
    text: {
      primary: "#E7F1F7",
      secondary: "#9BB0C3",
      disabled: "#6E8498",
    },
    divider: "#2B3B4F",
    action: {
      hover: "rgba(124, 178, 226, 0.16)",
      selected: "rgba(124, 178, 226, 0.22)",
      focus: "rgba(76, 143, 134, 0.24)",
    },
    custom: {
      surfaceAlt: "#1D3045",
      chip: "#1E3346",
      tableRowAlt: "rgba(124, 178, 226, 0.12)",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: FONT_FAMILY,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "linear-gradient(135deg, #0A1426 0%, #12253D 45%, #103B36 100%)",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          color: "#E7F1F7",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          backgroundImage: "none",
          border: "none",
          backgroundColor: "#162739",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "none",
          border: "none",
        },
      },
    },
    // This handles the input fields without crashing
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(22, 39, 57, 0.75)",
        },
        notchedOutline: {
          borderWidth: "1px",
        },
      },
    },
  },
});
