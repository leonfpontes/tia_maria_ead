"use client";

import * as React from "react";
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material/styles";

const baseTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#166534",
      },
      secondary: {
        main: "#8b5e34",
      },
      background: {
        default: "#f8fafc",
      },
    },
    typography: {
      fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif",
    },
    shape: {
      borderRadius: 14,
    },
  })
);

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={baseTheme}>{children}</ThemeProvider>;
}
