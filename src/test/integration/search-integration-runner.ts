import { listDocuments, retrieveDocument } from '@/lib/api';
import fs from 'fs/promises';
import path from 'path';

interface SearchTestCase {
    key: string;
    expectFields?: string[];
}

interface TestResult {
    key: string;
    resultCount: number;
    retrieved: boolean;
    missingFields?: string[];
    success: boolean;
    error?: string;
}

const searchCases: SearchTestCase[] = [
    { key: 'abc-123', expectFields: ['Name', 'Email'] },
    { key: 'test@example.com' },
    { key: '2024-01-01', expectFields: ['Status'] },
];

async function runTests(): Promise<TestResult[]> {
    const results: TestResult[] = [];

    for (const test of searchCases) {
        try {
            const listRes = await listDocuments({ key: test.key });

            if (!listRes?.results?.length) {
                results.push({
                    key: test.key,
                    resultCount: 0,
                    retrieved: false,
                    success: false,
                });
                continue;
            }

            const doc = listRes.results[0];
            const retrieveRes = await retrieveDocument(doc.id);

            const missingFields = test.expectFields?.filter(
                (field) => !(doc.fields?.[field])
            ) ?? [];

            results.push({
                key: test.key,
                resultCount: listRes.results.length,
                retrieved: !!retrieveRes,
                missingFields: missingFields.length ? missingFields : undefined,
                success: !!retrieveRes && missingFields.length === 0,
            });
        } catch (err: any) {
            results.push({
                key: test.key,
                resultCount: 0,
                retrieved: false,
                success: false,
                error: err.message,
            });
        }
    }

    return results;
}

function toMarkdown(results: TestResult[]): string {
    let md = `# Integration Test Report\n\n`;
    md += `| Key | Found Results | Retrieved | Missing Fields | Status |\n`;
    md += `|-----|----------------|-----------|----------------|--------|\n`;

    for (const r of results) {
        const status = r.success ? '✅ Passed' : '❌ Failed';
        const missing = r.missingFields?.join(', ') ?? '-';
        md += `| \`${r.key}\` | ${r.resultCount} | ${r.retrieved ? 'Yes' : 'No'} | ${missing} | ${status} |\n`;
    }

    return md;
}

async function main() {
    const results = await runTests();
    const markdown = toMarkdown(results);

    const reportPath = path.resolve(__dirname, 'search-integration-report.md');
    await fs.writeFile(reportPath, markdown, 'utf-8');
    console.log(`✅ Markdown report saved: ${reportPath}`);
}

main();
