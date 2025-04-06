// config/dropdownOptions.ts
export interface DropdownConfig {
    id: string;
    label: string;
    options: string[];
    defaultValue?: string;
}

export const dropdownSettings: DropdownConfig[] = [
    {
        id: 'searchScope',
        label: 'Search Scope',
        options: ['All', 'Documents Only', 'Images Only'],
        defaultValue: 'All',
    },
    {
        id: 'language',
        label: 'Preferred Language',
        options: ['English', 'Spanish', 'French'],
        defaultValue: 'English',
    },
];
