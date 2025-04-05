import { useInteractionStore } from '@/store/useInteractionStore';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DocumentReview from '../documentReview/DocumentReview'; // assuming this shows currentDocument
import { useState } from 'react';

const SearchResultsAccordion = () => {
    const { results, viewSections, retrieve, currentDocument } = useInteractionStore();
    const [expanded, setExpanded] = useState<string | false>(false);

    // Handle accordion expand/collapse actions
    const handleChange = (id: string) => async (_event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? id : false);
        if (isExpanded) {
            await retrieve(id); // Fetch document when expanded
        }
    };

    // Decide which dataset to use: `viewSections` (e.g., file-based content) or `results` (API results)
    const documents = viewSections?.sections || results;

    return (
        <>
            {documents.map((doc: any) => (
                <Accordion
                    key={doc.id}
                    expanded={expanded === doc.id}
                    onChange={handleChange(doc.id)}
                >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{doc.title || `Document ${doc.id}`}</Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        {expanded === doc.id && currentDocument?.id === doc.id && (
                            <DocumentReview />
                        )}
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    );
};

export default SearchResultsAccordion;