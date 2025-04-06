// theme/AppThemeProvider.tsx
import React, { useMemo } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useAppStore } from '@/store/useAppStore';
import { theme as createThemeFromMode } from './theme'; // renamed to avoid name clash

const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const mode = useAppStore((s) => s.mode) || 'light'; // fallback safety

    const muiTheme = useMemo(() => createThemeFromMode(mode), [mode]);

    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

export default AppThemeProvider;
