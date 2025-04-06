// utils/auditUtils.ts
import lighthouse from 'lighthouse';
import { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

interface AuditThresholds {
    performance?: number;
    accessibility?: number;
    seo?: number;
    'best-practices'?: number;
}

const defaultThresholds: AuditThresholds = {
    performance: 0.85,
    accessibility: 0.9,
    seo: 0.9,
    'best-practices': 0.9,
};

export async function runAudit(
    page: Page,
    label = 'audit-report',
    thresholds: AuditThresholds = defaultThresholds
) {
    const reportDir = path.resolve('lighthouse-reports');
    const reportPath = path.join(reportDir, label);

    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }

    const result = await lighthouse(page, {
        thresholds,
        reports: {
            formats: ['html', 'json'],
            name: reportPath,
        },
    });

    console.log(`📊 Lighthouse report saved: ${label}.report.{html,json}`);
    console.log('🔍 Scores:', result.scores);
    return result;
}
