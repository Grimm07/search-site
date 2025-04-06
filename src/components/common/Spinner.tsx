// components/Spinner.tsx

/**
 * Spinner.tsx
 * A modern, theme-aware loading spinner using MUI CircularProgress.
 */

import React from 'react';
import { CircularProgress, Box, useTheme } from '@mui/material';

interface SpinnerProps {
    size?: number;
    thickness?: number;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 48, thickness = 4 }) => {
    const theme = useTheme();

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minHeight="100px"
        >
            <CircularProgress
                size={size}
                thickness={thickness}
                sx={{
                    color: theme.palette.mode === 'dark'
                        ? theme.palette.primary.light
                        : theme.palette.primary.main,
                    animationDuration: '800ms',
                }}
            />
        </Box>
    );
};

export default Spinner;
