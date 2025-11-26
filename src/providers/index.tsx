'use client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useMemo, useState } from 'react';
import { darkTheme, lightTheme } from './theme';
import { queryClient } from '@/config/reactQueryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/context/AuthContext';
import { CustomThemeProvider } from '@/context/ThemeContext';

export default function AppProviders({
	children,
}: {
	children: React.ReactNode;
}) {
	const [darkMode] = useState(true);
	const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
			<ThemeProvider theme={theme}>
				<CustomThemeProvider>
					<CssBaseline />
					{children}
				</CustomThemeProvider>
			</ThemeProvider>
			<ReactQueryDevtools initialIsOpen={false} />
			</AuthProvider>
		</QueryClientProvider>
	);
}
