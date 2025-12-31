// src/theme.ts
'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';

// Shared typography and shapes
const baseThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: 'Titillium Web, sans-serif',
    h1: { fontWeight: 800 },
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
      main: '#b0ae41', // Gold
      light: '#c4c268',
      dark: '#8f8d35',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1f2845', // Dark blue as accent
      light: '#3d4a6b',
      dark: '#141a2f',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2845',
      secondary: '#6b7280',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    action: {
      hover: 'rgba(0, 0, 0, 0.04)',
      selected: 'rgba(0, 0, 0, 0.08)',
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
      light: '#c9b584',
      dark: '#9a8250',
      contrastText: '#000000',
    },
    secondary: {
      main: '#dcdcdc',
      light: '#e8e8e8',
      dark: '#b8b8b8',
      contrastText: '#000000',
    },
    background: {
      default: '#0c1c38',
      paper: '#1a1a2e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    action: {
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
    },
  },
});
