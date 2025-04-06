import { listDocuments, retrieveDocument } from '@/lib/api'; // Your real logic or mocked entrypoints
import fs from 'fs/promises';
import path from 'path';

interface SearchTestCase {
    key: string;
    expectFields?: string[];  // optional field names to validate
}

interface TestResult {
    key: string;
    success: boolean;
    resultCount: number;
    retrieved: boolean;
    missingFields?: string[];
    error?: string;
}

const searchCases: SearchTestCase[] = [
    { key: 'abc-123', expectFields: ['Name', 'Email'] },
    { key: 'user-456' },
    { key: 'uuid-789' },
];

async function runIntegrationTests() {
    const results: TestResult[] = [];

    for (const test of searchCases) {
        try {
            const listRes = await listDocuments({ key: test.key });

            if (!listRes?.results?.length) {
                results.push({ key: test.key, success: false, resultCount: 0, retrieved: false });
                continue;
            }

            const doc = listRes.results[0];
            const retrieveRes = await retrieveDocument(doc.id);

            const missingFields = test.expectFields?.filter((field) => !(doc.fields?.[field])) ?? [];
            const success = retrieveRes != null && missingFields.length === 0;

            results.push({
                key: test.key,
                success,
                resultCount: listRes.results.length,
                retrieved: !!retrieveRes,
                missingFields: missingFields.length > 0 ? missingFields : undefined,
            });
        } catch (err: any) {
            results.push({ key: test.key, success: false, error: err.message, resultCount: 0, retrieved: false });
        }
    }

    // Write report
    const outputPath = path.join(__dirname, 'search-integration-report.json');
    await fs.writeFile(outputPath, JSON.stringify(results, null, 2), 'utf-8');
    console.log(`✅ Integration test complete. Report saved to ${outputPath}`);
}

runIntegrationTests();
