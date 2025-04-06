import React from 'react';
import {
    Grid,
    Typography,
    Checkbox,
    TextField,
    FormControlLabel,
    Box,
} from '@mui/material';

interface ReviewFieldGridRowProps {
    field: string;
    value: string;
    correctedValue?: string | boolean;
    onCorrectionChange: (value: string | boolean) => void;
    correctionInputType?: 'text' | 'textarea' | 'select' | 'checkbox';
    correctionOptions?: string[]; // required if type is 'select'
}

const ReviewFieldGridRow: React.FC<ReviewFieldGridRowProps> = ({
                                                                   field,
                                                                   value,
                                                                   correctedValue,
                                                                   onCorrectionChange,
                                                                   correctionInputType = 'text',
                                                                   correctionOptions = [],
                                                               }) => {
    const renderCorrectionInput = () => {
        switch (correctionInputType) {
            case 'select':
                return (
                    <TextField
                        select
                        label="Correction"
                        size="small"
                        fullWidth
                        value={correctedValue}
                        onChange={(e) => onCorrectionChange(e.target.value)}
                        SelectProps={{ native: true }}
                    >
                        {correctionOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </TextField>
                );

            case 'textarea':
                return (
                    <TextField
                        multiline
                        rows={3}
                        size="small"
                        placeholder="Enter correction"
                        value={correctedValue}
                        onChange={(e) => onCorrectionChange(e.target.value)}
                        fullWidth
                    />
                );

            case 'checkbox':
                return (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={!!correctedValue}
                                onChange={(e) => onCorrectionChange(e.target.checked)}
                            />
                        }
                        label="Correct?"
                    />
                );

            case 'text':
            default:
                return (
                    <TextField
                        size="small"
                        placeholder="Enter correction"
                        value={correctedValue}
                        onChange={(e) => onCorrectionChange(e.target.value)}
                        fullWidth
                    />
                );
        }
    };

    return (
        <Grid container spacing={2} alignItems="center">
            {/* Label */}
            <Grid item xs={4}>
                <Typography variant="body2" fontWeight="bold">
                    {field}
                </Typography>
            </Grid>

            {/* System value */}
            <Grid item xs={4}>
                <Typography variant="body2">{value}</Typography>
            </Grid>

            {/* User input */}
            <Grid item xs={4}>
                <Box display="flex" flexDirection="column" gap={1}>
                    {renderCorrectionInput()}
                </Box>
            </Grid>
        </Grid>
    );
};

export default ReviewFieldGridRow;