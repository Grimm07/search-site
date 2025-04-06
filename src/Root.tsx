import { Outlet } from '@tanstack/react-router';

import { DevTools } from '@/DevTools';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { checkboxFilters, dropdownSettings } from '@/config/uiOptions';
import AppThemeProvider from '@/style/AppThemeProvider';


const Root = () => {
    const { initUIPreferences  } = useAppStore();

    useEffect(() => {
        initUIPreferences(checkboxFilters, dropdownSettings);
    }, []);

    return (
        <ErrorBoundary>
            <AppThemeProvider>
                {import.meta.env.DEV && localStorage.getItem('MOCK_MODE') === 'true' && <DevTools />}
                <Outlet />
            </AppThemeProvider>
        </ErrorBoundary>
    );
};

export default Root;
