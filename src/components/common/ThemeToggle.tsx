// components/common/ThemeToggle.tsx
import React from 'react';
import ToggleSwitch from '@/components/common/ToggleSwitch';
import { useAppStore } from '@/store/useAppStore';

const ThemeToggle: React.FC = () => {
    const { mode, toggleMode } = useAppStore();
    return (
        <ToggleSwitch
            label="Dark Mode"
            checked={mode === 'dark'}
            onChange={() => toggleMode()}
        />
    );
};

export default ThemeToggle;
