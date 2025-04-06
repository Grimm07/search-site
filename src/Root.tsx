import { Outlet } from '@tanstack/react-router';

import { DevTools } from '@/DevTools';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import AppThemeProvider from '@/style/AppThemeProvider';


const Root = () => {
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
