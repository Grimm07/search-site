// components/common/CheckboxControl.tsx
import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';

interface CheckboxControlProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const CheckboxControl: React.FC<CheckboxControlProps> = ({ label, checked, onChange }) => {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
            }
            label={label}
        />
    );
};

export default CheckboxControl;
