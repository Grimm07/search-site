export interface FeedbackOption {
    id: string;
    label: string;
}

export interface FeedbackSchema {
    documentType: 'default' | 'invoice' | 'contract';
    fields: FeedbackOption[];
}

export const feedbackSchemas: FeedbackSchema[] = [
    {
        documentType: 'default',
        fields: [
            { id: 'name', label: 'Correct Name' },
            { id: 'date', label: 'Correct Date' },
            { id: 'status', label: 'Correct Status' },
            { id: 'address', label: 'Correct Address' },
            { id: 'notes', label: 'Correct Notes' },
            { id: 'type', label: 'Correct Type' },
        ],
    },
    {
        documentType: 'invoice',
        fields: [
            { id: 'amount', label: 'Correct Amount' },
            { id: 'dueDate', label: 'Correct Due Date' },
        ],
    },
];
