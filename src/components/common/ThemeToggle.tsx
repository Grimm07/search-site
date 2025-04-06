// components/common/ThemeToggle.tsx
import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useAppStore } from '@/store/useAppStore';

const ThemeToggle: React.FC = () => {
    const { mode, toggleMode } = useAppStore();

    return (
        <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton color="inherit" onClick={toggleMode}>
                {mode === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
        </Tooltip>
    );
};

export default ThemeToggle;
