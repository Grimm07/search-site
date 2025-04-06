// Root.tsx
import { Outlet } from '@tanstack/react-router';
import { DevTools } from '@/DevTools';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import AppThemeProvider from '@/style/AppThemeProvider';
import { useAuth } from '@/auth/useAuth';
import { Button, Box, Typography } from '@mui/material';

const Root = () => {
    const { account, login } = useAuth();

    if (!account) {
        return (
            <AppThemeProvider>
                <Box height="100vh" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                    <Typography variant="h5" gutterBottom>
                        Please sign in to continue
                    </Typography>
                    <Button variant="contained" onClick={login}>
                        Sign in with SSO
                    </Button>
                </Box>
            </AppThemeProvider>
        );
    }

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
