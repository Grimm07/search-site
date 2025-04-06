// components/common/ToggleSwitch.tsx
import React from 'react';
import { Switch, FormControlLabel } from '@mui/material';

interface ToggleSwitchProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, checked, onChange }) => {
    return (
        <FormControlLabel
            control={<Switch checked={checked} onChange={(e) => onChange(e.target.checked)} />}
            label={label}
        />
    );
};

export default ToggleSwitch;
