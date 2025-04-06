// src/components/documentReview/feedbackStrategies.ts

import React from 'react';
import { RetrievedContent, DocumentType } from '@/types/search';

type FeedbackStrategyComponent = React.FC<{ document: RetrievedContent }>;
type StrategyResolver = () => Promise<{ default: FeedbackStrategyComponent }>;

// Fallback placeholder for unimplemented strategies
const PlaceholderForm: FeedbackStrategyComponent = () => (
    <p>Form-based feedback not implemented yet.</p>
);

// Lazy strategy imports
const loadImageFeedbackForm: StrategyResolver = () =>
    import('./ImageFeedbackForm') as Promise<{ default: FeedbackStrategyComponent }>;

const loadTextFeedbackForm: StrategyResolver = () =>
    import('./TextFeedbackForm') as Promise<{ default: FeedbackStrategyComponent }>;

// Explicit async fallback (to match signature)
const loadFormFallback: StrategyResolver = async () => ({ default: PlaceholderForm });

// Strict map of supported strategies
const strategyMap: Record<DocumentType, StrategyResolver> = {
    image: loadImageFeedbackForm,
    text: loadTextFeedbackForm,
    form: loadFormFallback,
};

/**
 * Loads the correct feedback form based on document type.
 * Returns a component that will be rendered with `document` as a prop.
 */
export const loadFeedbackComponent = async (
    doc: RetrievedContent
): Promise<React.FC> => {
    const resolver = strategyMap[doc.contentType];

    if (!resolver) {
        return () => <p>Unsupported document type: {doc.contentType}</p>;
    }

    try {
        const { default: Component } = await resolver();
        return (props) => <Component {...props} document={doc} />;
    } catch (err) {
        console.error(`Error loading feedback strategy for ${doc.contentType}:`, err);
        return () => <p>Failed to load feedback form.</p>;
    }
};
