// src/types/search.ts

export interface DocumentMeta {
    id: string;
    title: string;
    summary?: string;
    thumbnailUrl?: string;
    [key: string]: any;
}

export type DocumentType = 'image' | 'text'; // extend as needed

export interface RetrievedContent {
    id: string;
    docId: string;
    contentType: DocumentType; // used to determine viewer and feedback component
    data: string;              // either a blob URL (for images) or raw text
    metadata?: Record<string, any>; // optional contextual info (e.g. extracted fields, title, etc.)
}


export interface FeedbackPayload {
    documentId: string;
    field: string;
    value: string;
    correct: boolean;
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
