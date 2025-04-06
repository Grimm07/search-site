// components/forms/DropdownRenderer.tsx
import React from 'react';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
} from '@mui/material';
import { useAppStore } from '@/store/useAppStore';
import { dropdownSettings } from '@/config/dropdownOptions';

const DropdownRenderer: React.FC = () => {
    const { dropdowns, setDropdown } = useAppStore();

    return (
        <Stack spacing={2}>
            {dropdownSettings.map(({ id, label, options }) => (
                <FormControl fullWidth size="small" key={id}>
                    <InputLabel>{label}</InputLabel>
                    <Select
                        label={label}
                        value={dropdowns[id] ?? ''}
                        onChange={(e) => setDropdown(id, e.target.value)}
                    >
                        {options.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                                {opt}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ))}
        </Stack>
    );
};

export default DropdownRenderer;
