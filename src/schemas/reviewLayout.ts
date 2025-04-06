export type FieldInputType = 'text' | 'textarea' | 'select' | 'checkbox';

export interface FieldConfig {
    label: string;
    inputType: FieldInputType;
    options?: string[]; // only for select
    required?: boolean;
}

export const invoiceSchema: Record<string, FieldConfig> = {
    InvoiceNumber: { label: 'Invoice #', inputType: 'text', required: true },
    Status: { label: 'Status', inputType: 'select', options: ['Pending', 'Approved', 'Rejected'] },
    Reviewed: { label: 'Reviewed?', inputType: 'checkbox' },
};

export const contractSchema: Record<string, FieldConfig> = {
    ContractID: { label: 'Contract ID', inputType: 'text' },
    Signed: { label: 'Signed', inputType: 'checkbox' },
};

export const layoutSchemaMap: Record<string, Record<string, FieldConfig>> = {
    invoice: invoiceSchema,
    contract: contractSchema,
    // add more types here
};
