// components/documentReview/DocumentReviewLayout.tsx
import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import DocumentViewer from './DocumentViewer';

interface Props {
    title: string;
    viewerSrc: string;
    viewerType: 'image' | 'text' | 'form';
    feedbackComponent: React.ReactNode;
}

const DocumentReviewLayout: React.FC<Props> = ({ title, viewerSrc, viewerType, feedbackComponent }) => (
    <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
                <DocumentViewer src={viewerSrc} type={viewerType} />
            </Grid>
            <Grid item xs={12} md={6}>
                {feedbackComponent}
            </Grid>
        </Grid>
    </Paper>
);

export default DocumentReviewLayout;
