// src/types/search.ts


export interface DocumentListResponse {}
export interface DocumentSummary {
    [key: string]: string | number | boolean | undefined;
    Status?: string;
    Confirmed?: boolean;
    Notes?: string;
    Vendor?: string;
    // Add more fields as needed
}



export type DocumentType = 'image' | 'pdf' | 'text' | 'json' | 'unknown';

export interface RetrievedContent {
    id: string;
    docId: string;
    contentType: DocumentType;

    // Rich metadata including extracted fields, titles, etc.
    metadata?: Record<string, any>;

    // Optional: Structured fields to support richer views
    summary?: DocumentSummary;

    images?: {
        primary?: string;
        secondary?: string;
        tertiary?: string;
    };
}
export interface FieldCorrection {
    field: string;
    value: string;
    correct: boolean;
}

export interface FeedbackPayload {
    docId: string;
    corrections: FieldCorrection[];
}

export type SearchRequestPayload = {
    id?: string;
    query: string;
    key?: string;
    uuid?: string;
    email?: string;
    date?: string;
    numericId?: string;
};

