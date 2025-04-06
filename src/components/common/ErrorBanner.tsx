import { Alert, AlertTitle, Box } from '@mui/material';

interface ErrorBannerProps {
    status: number;
    message: string;
    title?: string;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ status, message, title }) => {
    return (
        <Box sx={{ width: '100%', mt: 2 }}>
            <Alert severity="error" variant="outlined">
                <AlertTitle>{title || `Error ${status}`}</AlertTitle>
                {message}
            </Alert>
        </Box>
    );
};

export default ErrorBanner;
