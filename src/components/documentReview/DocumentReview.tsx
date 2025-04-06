// components/documentReview/DocumentReview.tsx
import React, { useEffect, useState } from 'react';
import { useInteractionStore } from '@/store/useInteractionStore';
import { loadFeedbackComponent } from './strategies/feedbackStrategies';
import DocumentReviewLayout from './DocumentReviewLayout';

const DocumentReview: React.FC = () => {
    const { currentDocument } = useInteractionStore();
    const [FeedbackComponent, setFeedbackComponent] = useState<React.FC | null>(null);

    useEffect(() => {
        if (currentDocument) {
            loadFeedbackComponent(currentDocument).then(setFeedbackComponent);
        }
    }, [currentDocument]);

    if (!currentDocument || !FeedbackComponent) return null;

    return (
        <DocumentReviewLayout
            title="Document Feedback"
            viewerSrc={currentDocument.data}
            viewerType={currentDocument.contentType}
            feedbackComponent={<FeedbackComponent />}
        />
    );
};

export default DocumentReview;
