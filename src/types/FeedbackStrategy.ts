// types/FeedbackStrategy.ts
export interface FeedbackStrategyProps {
    documentId: string;
    metadata: Record<string, any>;
    onFeedback?: (payload: any) => void;
}
