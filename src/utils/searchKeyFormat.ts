// utils/searchKeyFormat.ts

export type SearchKeyFormat = 'uuid' | 'date' | 'numericId' | 'email' | 'unknown';

export function detectSearchKeyFormat(input: string): SearchKeyFormat {
    const trimmed = input.trim();

    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed)) return 'uuid';
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return 'date';
    if (/^\d{6,20}$/.test(trimmed)) return 'numericId';
    if (/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(trimmed)) return 'email';

    return 'unknown';
}

export const SEARCH_KEY_HELP_TEXT =
    'Search key must be one of: UUID, date (YYYY-MM-DD), numeric ID, or email.';