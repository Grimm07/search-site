// components/common/DropdownControl.tsx
import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface DropdownControlProps {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
}

const DropdownControl: React.FC<DropdownControlProps> = ({ label, value, options, onChange }) => {
    return (
        <FormControl fullWidth size="small">
            <InputLabel>{label}</InputLabel>
            <Select
                value={value}
                label={label}
                onChange={(e: SelectChangeEvent<string>) => onChange(e.target.value)}
            >
                {options.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                        {opt}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default DropdownControl;
