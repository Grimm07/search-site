import { DocumentSummary } from '@/types/search';
import { FieldConfig } from '@/schemas/reviewLayout';
import ReviewFieldGridRow from '@/components/common/ReviewFieldGridRow';

export interface ReviewFieldGridProps {
    summary?: DocumentSummary;
    metadata: Record<string, any>;
    fieldConfigMap: Record<string, FieldConfig>;
    onChange?: (field: string, value: string | boolean) => void;
    corrections?: Record<string, string | boolean>;
}

const ReviewFieldGrid: React.FC<ReviewFieldGridProps> = ({
                                                             metadata,
                                                             summary,
                                                             fieldConfigMap,
                                                             onChange,
                                                             corrections = {},
                                                         }) => {
    return (
        <>
            {Object.entries(fieldConfigMap).map(([field, config]) => {
                const systemValue = summary?.[field] ?? metadata?.[field] ?? '';

                return (
                    <ReviewFieldGridRow
                        key={field}
                        field={field}
                        value={String(systemValue ?? '')}
                        correctedValue={corrections[field]}
                        onCorrectionChange={(f, v) => onChange?.(f, v)}
                        correctionInputType={config.inputType}
                        correctionOptions={config.options}
                    />
                );
            })}
        </>
    );
};

export default ReviewFieldGrid;
