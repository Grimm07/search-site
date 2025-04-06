import { describe, it, expect } from 'vitest';
import { listDocuments, retrieveDocument } from '@/lib/api';

interface SearchTestCase {
    key: string;
    expectFields?: string[];
}

const searchCases: SearchTestCase[] = [
    { key: 'abc-123', expectFields: ['Name', 'Email'] },
    { key: 'test@example.com' },
    { key: '2024-01-01', expectFields: ['Status'] },
];

describe('Search Integration Tests', () => {
    for (const test of searchCases) {
        it(`should successfully list and retrieve results for key: "${test.key}"`, async () => {
            const listRes = await listDocuments({ key: test.key });
            expect(listRes).toBeDefined();
            expect(listRes.results?.length).toBeGreaterThan(0);

            const firstDoc = listRes.results[0];
            const retrieved = await retrieveDocument(firstDoc.id);

            expect(retrieved).toBeDefined();

            if (test.expectFields) {
                for (const field of test.expectFields) {
                    expect(firstDoc.fields?.[field]).toBeDefined();
                }
            }
        });
    }
});
