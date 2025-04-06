// components/dev/MockToggle.tsx
import React from 'react';
import ToggleSwitch from '@/components/common/ToggleSwitch';
import { useAppStore } from '@/store/useAppStore';

const MockToggle: React.FC = () => {
    const { mockMode, toggleMockMode } = useAppStore();

    return (
        <ToggleSwitch
            label="Mock Mode"
            checked={mockMode}
            onChange={toggleMockMode}
        />
    );
};

export default MockToggle;
