// components/dev/DevToolPanel.tsx
import React from 'react';
import { Paper, useTheme } from '@mui/material';

interface DevToolPanelProps {
    children: React.ReactNode;
    dense?: boolean;
    width?: number;
}

const DevToolPanel: React.FC<DevToolPanelProps> = ({ children, dense = true, width = 280 }) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={4}
            sx={{
                position: 'absolute',
                top: 60,
                right: 56,
                minWidth: width,
                maxWidth: 'calc(100vw - 64px)',
                p: dense ? 1.25 : 2,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                boxShadow: 4,
                zIndex: 1300,
                overflow: 'auto',
            }}
        >
            {children}
        </Paper>
    );
};

export default DevToolPanel;
