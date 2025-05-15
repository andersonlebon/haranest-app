"use client";
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useMemo, useState } from 'react';
import { darkTheme, lightTheme } from './theme';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);
  console.log("theme", setDarkMode);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
