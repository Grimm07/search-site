// File: components/common/SearchResultsAccordion.tsx

import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useInteractionStore } from '@/store/useInteractionStore';
import DocumentReviewLayout from '@/components/common/DocumentReviewLayout';

const SearchResultsAccordion: React.FC = () => {
    const { results, isListLoading } = useInteractionStore();

    if (isListLoading || results.length === 0) return null;

    return (
        <Accordion
            defaultExpanded
            disableGutters
            square={false}
            sx={{
                borderRadius: 4,
                boxShadow: 4,
                overflow: 'visible',
                backgroundColor: (theme) => theme.palette.background.paper,
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="results-content"
                id="results-header"
                sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                }}
            >
                <Typography variant="h6">Search Results ({results.length})</Typography>
            </AccordionSummary>

            <AccordionDetails
                sx={{
                    p: 3,
                    backgroundColor: (theme) => theme.palette.background.default,
                    borderBottomLeftRadius: 4,
                    borderBottomRightRadius: 4,
                }}
            >
                <Box display="flex" flexDirection="column" gap={4}>
                    {results.map((result) => (
                        <DocumentReviewLayout document={result} layoutFlags={{isInvoice: result.metadata?.docType === 'invoice'}} />
                    ))}
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default SearchResultsAccordion;