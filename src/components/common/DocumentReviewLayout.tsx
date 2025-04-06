import {
    Grid,
    Paper,
    Typography,
    Box,
} from '@mui/material';
import {RetrievedContent} from '@/types/search';
import InteractiveImageViewer from '@/components/common/InteractiveImageViewer';
import ReviewFieldGrid from "@/components/common/ReviewFieldGrid";

interface DocumentReviewLayoutProps {
    document: RetrievedContent;
}

const DocumentReviewLayout: React.FC<DocumentReviewLayoutProps> = ({ document }) => {
    const imageId = document.id;
    const metadata = document.metadata ?? {};
    const summary = document.summary;

    return (
        <Box p={3}>
            <Grid container spacing={4}>
                {/* Image Panel */}
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={4}
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
                    <Paper elevation={4} sx={{ p: 2, borderRadius: 3, height: '100%' }}>
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

                        <ReviewFieldGrid metadata={metadata} summary={summary} />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DocumentReviewLayout;
