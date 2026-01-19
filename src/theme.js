// src/theme.js
import { createTheme } from "@mui/material/styles";

const FONT_FAMILY = '"Rethink Sans", "RethinkSans", sans-serif';

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#00A360" }, // RESTORED YOUR GREEN
    background: {
      default: "#F1F5F9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0A1524",
      secondary: "#415063",
    },
    divider: "rgba(0,0,0,0.08)",
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
          background: "linear-gradient(135deg, #F8FAFC 0%, #94A3B8 100%)",
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
    primary: { main: "#82B1FF" }, // Softer desaturated blue
    background: {
      default: "#020617", // Deeper navy
      paper: "#1E293B", // Soft secondary slate
    },
    text: {
      primary: "#E3E9F0",
      secondary: "#94A3B8",
    },
    divider: "rgba(255,255,255,0.08)",
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
          background: "linear-gradient(135deg, #020617 0%, #201b5fff 100%)",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          color: "#E3E9F0",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          backgroundImage: "none",
          border: "none",
          backgroundColor: "#1E293B",
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
          backgroundColor: "rgba(200, 200, 200, 0.05)",
        },
        notchedOutline: {
          borderWidth: "1px",
        },
      },
    },
  },
});
