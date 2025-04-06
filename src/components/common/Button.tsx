// components/common/ActionButton.tsx
import React from 'react';
import {Button, ButtonProps} from '@mui/material';

interface ActionButtonProps extends ButtonProps {
    label: string;
    guard?: boolean; // If provided, disables button when false
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, guard, disabled, ...props }) => {
    const isDisabled = guard === false || disabled === true;

    return (
        <Button
            variant="contained"
            disabled={isDisabled}
            {...props}
        >
            {label}
        </Button>
    );
};

export default ActionButton;
