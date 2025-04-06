// strategies/TextFeedbackForm.tsx
import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { RetrievedContent } from '@/types/search';

interface Props {
    document: RetrievedContent;
}

const TextFeedbackForm: React.FC<Props> = ({ document }) => {
    return (
        <Box>
            <Typography variant="body1" gutterBottom>
                Please verify the text content below:
            </Typography>
            <TextField
                multiline
                fullWidth
                rows={10}
                defaultValue={document.data}
                variant="outlined"
            />
        </Box>
    );
};

export default TextFeedbackForm;
