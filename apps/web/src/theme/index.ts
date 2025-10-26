import { createTheme, responsiveFontSizes, ThemeOptions } from "@mui/material/styles";

import { colors, radii, typography } from "./tokens";

const components: ThemeOptions["components"] = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: radii.sm,
        textTransform: "none",
        fontWeight: 600,
      },
      containedPrimary: {
        background: `linear-gradient(135deg, ${colors.oxossi[600]}, ${colors.oxossi[400]})`,
        color: "#fff",
        boxShadow: "0 10px 25px -12px rgba(31, 159, 95, 0.6)",
        ":hover": {
          background: `linear-gradient(135deg, ${colors.oxossi[700]}, ${colors.oxossi[500]})`,
          boxShadow: "0 20px 35px -20px rgba(15, 92, 54, 0.75)",
        },
      },
    },
  },
  MuiPaper: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: {
        borderRadius: radii.md,
        border: `1px solid rgba(15, 92, 54, 0.08)`
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: "rgba(8, 47, 35, 0.9)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundColor: "#0a3e25",
        color: "#f8fafc",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: radii.sm,
        marginInline: 8,
        ":hover": {
          backgroundColor: "rgba(203, 213, 245, 0.12)",
        },
        "&.Mui-selected": {
          background: "rgba(31, 159, 95, 0.18)",
          color: colors.oxossi[50],
          "&:hover": {
            background: "rgba(31, 159, 95, 0.3)",
          },
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: radii.md,
        border: "1px solid rgba(15, 92, 54, 0.1)",
        boxShadow: "0 20px 40px -24px rgba(8, 47, 35, 0.25)",
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      filled: {
        borderRadius: radii.xs,
        fontWeight: 600,
        background: colors.oxossi[100],
        color: colors.oxossi[700],
      },
    },
  },
};

const baseTheme: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: colors.oxossi[600],
      light: colors.oxossi[400],
      dark: colors.oxossi[800],
      contrastText: "#f8fafc",
    },
    secondary: {
      main: colors.rose[400],
      light: colors.rose[200],
      dark: colors.rose[600],
      contrastText: "#fff",
    },
    success: {
      main: colors.oxossi[500],
    },
    warning: {
      main: colors.highlight.amber,
    },
    background: {
      default: colors.neutral[50],
      paper: "#ffffff",
    },
    text: {
      primary: colors.neutral[800],
      secondary: "#4b5563",
    },
  },
  typography: {
    fontFamily: typography.fontFamily,
    h1: {
      fontSize: "3.75rem",
      fontWeight: 800,
      letterSpacing: "-0.03em",
    },
    h2: {
      fontSize: "3rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontSize: "2.25rem",
      fontWeight: 700,
    },
    h4: {
      fontSize: "1.875rem",
      fontWeight: 700,
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 700,
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 700,
    },
    subtitle1: {
      fontWeight: 600,
      letterSpacing: "0.01em",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      letterSpacing: "0.01em",
    },
    button: {
      fontWeight: 600,
      letterSpacing: "0.02em",
    },
  },
  shape: {
    borderRadius: radii.md,
  },
  components,
};

export const appTheme = responsiveFontSizes(createTheme(baseTheme));

export type AppTheme = typeof appTheme;
