
import React from 'react';
import ReviewFieldGridRow from './ReviewFieldGridRow';
import { DocumentSummary } from '@/types/search';

export interface ReviewFieldGridProps {
    metadata: Record<string, any>;
    summary?: DocumentSummary;
}

function inferFieldType(value: any): 'text' | 'textarea' | 'select' | 'checkbox' {
    if (typeof value === 'boolean') return 'checkbox';
    if (value === 'true' || value === 'false') return 'checkbox';
    if (typeof value === 'string' && value.length > 200) return 'textarea';
    return 'text';
}

const ReviewFieldGrid: React.FC<ReviewFieldGridProps> = ({ metadata, summary }) => {
    return (
        <>
            {Object.entries(metadata).map(([field, value]) => {
                const systemValue = summary?.[field] ?? value;
                const inferredType = inferFieldType(systemValue);

                return (
                    <ReviewFieldGridRow
                        key={field}
                        field={field}
                        value={value}
                        correctedValue={value}
                        onCorrectionChange={() => {}}
                        correctionInputType={inferredType}
                    />
                );
            })}
        </>
    );
};

export default ReviewFieldGrid;
