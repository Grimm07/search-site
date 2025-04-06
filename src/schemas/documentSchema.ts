// schemas/documentSchema.ts

import { z } from 'zod';

/**
 * Describes the system's interpretation and the user's reviewable fields.
 * Not all fields will be present in every document.
 */
export const ReviewFieldSchema = z.object({
    fieldName: z.string(),              // e.g., "InvoiceNumber"
    systemValue: z.string().nullable(), // extracted value or null
    userResponse: z.string().nullable().optional(), // user's input (if provided)
});

/**
 * Represents the metadata and extracted summary fields for a document.
 */
export const DocumentSchema = z.object({
    id: z.string(),                   // unique ID for internal reference
    docId: z.string(),                // external ID (shown to user)
    contentType: z.enum(['image' , 'pdf' , 'text' , 'json' , 'unknown']),
    summary: z
        .record(z.string(), z.string().nullable())
        .optional(), // extracted key-value pairs (e.g., from OCR/NLP)
    metadata: z
        .record(z.string(), z.string().nullable())
        .optional(), // structured metadata (optional per doc)
    images: z
        .object({
            primary: z.string().url(), // base64 or remote
        })
        .optional(),
    fields: z.array(ReviewFieldSchema).optional(), // dynamically computed for layout
});

/**
 * A search response may return multiple documents.
 */
export const DocumentReviewSetSchema = z.array(DocumentSchema);

export type ReviewField = z.infer<typeof ReviewFieldSchema>;
export type DocumentReview = z.infer<typeof DocumentSchema>;
export type DocumentReviewSet = z.infer<typeof DocumentReviewSetSchema>;

/**
 * USAGE - doing things this way allows us to do the following:
 *
 * import { DocumentReviewSetSchema } from '@/schemas/documentSchema';
 *
 * const response = await fetch('/api/search');
 * const raw = await response.json();
 *
 * const parsed = DocumentReviewSetSchema.parse(raw);
 *
 * */