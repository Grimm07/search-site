// components/forms/CheckboxRenderer.tsx
import React from 'react';
import { Checkbox, FormControlLabel, Stack } from '@mui/material';
import { useAppStore } from '@/store/useAppStore';
import { checkboxFilters } from '@/config/checkboxOptions';

const CheckboxRenderer: React.FC = () => {
    const { checkboxes, setCheckbox } = useAppStore();

    return (
        <Stack spacing={1}>
            {checkboxFilters.map(({ id, label }) => (
                <FormControlLabel
                    key={id}
                    control={
                        <Checkbox
                            checked={checkboxes[id] ?? false}
                            onChange={(e) => setCheckbox(id, e.target.checked)}
                        />
                    }
                    label={label}
                />
            ))}
        </Stack>
    );
};

export default CheckboxRenderer;
