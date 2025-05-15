// src/theme.ts
'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';

// Shared typography and shapes
const baseThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: 'Montserrat, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    // button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // borderRadius: 24,
        },
      },
    },
  },
};

// Light Theme
export const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: '#b69e62', // Gold
    },
    secondary: {
      main: '#0c1c38', // Dark blue as accent
    },
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#0c1c38',
      secondary: '#b69e62',
    },
  },
});

// Dark Theme
export const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: '#b69e62',
    },
    secondary: {
      main: '#dcdcdc',
    },
    background: {
      default: '#0c1c38',
      paper: '#1a1a2e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b69e62',
    },
  },
});
