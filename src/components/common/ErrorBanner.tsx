// components/ErrorBanner.tsx
import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';

interface ErrorBannerProps {
    message?: string;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message }) => {
    return (
        <Box sx={{ mx: 'auto', mt: 2, maxWidth: '80%' }}>
            <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
                <AlertTitle>Something went wrong!</AlertTitle>
                {message || 'An unexpected error occurred. Please try again or refresh the page.'}
            </Alert>
        </Box>
    );
};

export default ErrorBanner;
