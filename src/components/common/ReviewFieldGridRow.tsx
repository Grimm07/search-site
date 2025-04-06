import React from 'react';
import {
    Grid,
    Typography,
    TextField,
    Box,
} from '@mui/material';
import DropdownControl from '@/components/common/DropdownControl';
import CheckboxControl from '@/components/common/CheckboxControl';

export interface ReviewFieldGridRowProps {
    field: string; // Field key like "InvoiceNumber"
    value: string; // Extracted system value
    correctedValue?: string | boolean; // Editable user value
    correctionInputType?: 'text' | 'textarea' | 'select' | 'checkbox';
    correctionOptions?: string[]; // For selects
    onCorrectionChange: (field: string, value: string | boolean) => void;
}

const ReviewFieldGridRow: React.FC<ReviewFieldGridRowProps> = ({
                                                                   field,
                                                                   value,
                                                                   correctedValue,
                                                                   correctionInputType = 'text',
                                                                   correctionOptions = [],
                                                                   onCorrectionChange,
                                                               }) => {
    const label = field; // Label should be passed pre-resolved, or derived cleanly

    const renderCorrectionInput = () => {
        switch (correctionInputType) {
            case 'select':
                return (
                    <DropdownControl
                        label={`Edit ${label}`}
                        value={correctedValue as string}
                        options={correctionOptions ?? []}
                        onChange={(v) => onCorrectionChange(field, v)}
                    />
                );

            case 'textarea':
                return (
                    <TextField
                        multiline
                        rows={3}
                        size="small"
                        label={`Edit ${label}`}
                        value={correctedValue}
                        onChange={(e) => onCorrectionChange(field, e.target.value)}
                        fullWidth
                    />
                );

            case 'checkbox':
                return (
                    <CheckboxControl
                        label={`Mark ${label}`}
                        checked={!!correctedValue}
                        onChange={(v) => onCorrectionChange(field, v)}
                    />
                );

            case 'text':
            default:
                return (
                    <TextField
                        size="small"
                        label={`Edit ${label}`}
                        value={correctedValue}
                        onChange={(e) => onCorrectionChange(field, e.target.value)}
                        fullWidth
                    />
                );
        }
    };

    return (
        <Grid container spacing={2} alignItems="center">
            {/* Field label */}
            <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                    {label}
                </Typography>
            </Grid>

            {/* System/extracted value */}
            <Grid item xs={4}>
                <Typography variant="body2">{value}</Typography>
            </Grid>

            {/* Editable user response */}
            <Grid item xs={4}>
                <Box display="flex" flexDirection="column" gap={1}>
                    {renderCorrectionInput()}
                </Box>
            </Grid>
        </Grid>
    );
};

export default ReviewFieldGridRow;
