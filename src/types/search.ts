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
    fields: Record<string, string | number | boolean | undefined>;
    id: string;
    docId: string;
    contentType: DocumentType;

    // If multiple images, this is either the "primary" or the one displayed by default
    data: string;

    // Rich metadata including extracted fields, titles, etc.
    metadata?: Record<string, any>;

    // Optional: Structured fields to support richer views
    summary?: DocumentSummary;

    images?: {
        primary: string;
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

export interface DocumentMeta {
    id: string;
    title: string;
    thumbnailUrl?: string;
    fields: Record<string, string>;
    // other optional metadata if needed
}

export type SearchRequestPayload = {
    id?: string;
    key?: string;
    uuid?: string;
    email?: string;
    date?: string;
    numericId?: string;
};

