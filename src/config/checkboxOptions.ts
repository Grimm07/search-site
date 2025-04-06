// config/checkboxOptions.ts
export interface CheckboxOption {
    id: string;
    label: string;
    defaultChecked?: boolean;
}

export const checkboxFilters: CheckboxOption[] = [
    { id: 'includeImages', label: 'Include Images', defaultChecked: true },
    { id: 'includePDFs', label: 'Include PDFs' },
    { id: 'strictMode', label: 'Strict Key Matching' },
];