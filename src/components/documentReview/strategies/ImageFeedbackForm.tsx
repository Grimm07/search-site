// strategies/ImageFeedbackForm.tsx
import React from 'react';
import { Grid, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { RetrievedContent } from '@/types/search';

interface Props {
    document: RetrievedContent;
}

const ImageFeedbackForm: React.FC<Props> = ({ document }) => {
    const labels = [
        'Correct Name',
        'Correct Date',
        'Correct Category',
        document.metadata?.customField || 'Correct Notes',
        'Correct Status',
    ];

    const left = labels.slice(0, 3);
    const right = labels.slice(3);

    return (
        <Grid container spacing={2}>
            {[left, right].map((group, index) => (
                <Grid item xs={6} key={index}>
                    <FormGroup>
                        {group.map((label) => (
                            <FormControlLabel key={label} control={<Checkbox />} label={label} />
                        ))}
                    </FormGroup>
                </Grid>
            ))}
        </Grid>
    );
};

export default ImageFeedbackForm;
