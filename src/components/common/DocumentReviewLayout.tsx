import {
    Grid,
    Paper,
    Typography,
    Box,
} from '@mui/material';
import { useState } from 'react';
import { RetrievedContent } from '@/types/search';
import InteractiveImageViewer from '@/components/common/InteractiveImageViewer';
import ReviewFieldGrid from '@/components/common/ReviewFieldGrid';
import { layoutSchemaMap } from '@/schemas/reviewLayout';


interface DocumentLayoutFlags {
    hasSecondaryImage?: boolean;
    isContract?: boolean;
    isInvoice?: boolean;
    missingSignature?: boolean;
    // add more flags as needed
}

interface DocumentReviewLayoutProps {
    document: RetrievedContent;
    layoutFlags?: DocumentLayoutFlags;
}

const DocumentReviewLayout: React.FC<DocumentReviewLayoutProps> = ({ document }) => {

    const metadata = document.metadata ?? {};
    const summary = document.summary;
    const imageId = document.id;

    const fieldConfigMap = layoutSchemaMap[metadata?.docType?.toLowerCase()] ?? {};

    const [corrections, setCorrections] = useState<Record<string, string | boolean>>({});

    const handleCorrectionChange = (field: string, value: string | boolean) => {
        setCorrections((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Box p={3}>
            <Grid container spacing={4}>
                {/* Image Panel */}
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={4}
                        aria-label="Document image panel"
                        sx={{
                            p: 2,
                            borderRadius: 3,
                            height: '100%',
                            minHeight: 400,
                            maxHeight: 700,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Box pb={1} mb={2} borderBottom={1} borderColor="divider">
                            <Typography variant="h6">Document Image</Typography>
                        </Box>
                        <Box sx={{ flex: 1, overflow: 'hidden' }}>
                            <InteractiveImageViewer imageId={imageId} />
                        </Box>
                    </Paper>
                </Grid>

                {/* Review Panel */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={4} sx={{ p: 2, borderRadius: 3, height: '100%' }} aria-label="Document review panel">
                        <Box borderBottom={1} borderColor="divider" pb={1} mb={2}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={4}>
                                    <Typography variant="h6">Field</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="h6">System Value</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="h6">Your Response</Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        <ReviewFieldGrid
                            metadata={metadata}
                            summary={summary}
                            fieldConfigMap={fieldConfigMap}
                            corrections={corrections}
                            onChange={handleCorrectionChange}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DocumentReviewLayout;
