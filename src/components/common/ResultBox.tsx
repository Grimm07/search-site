import React from 'react';
import { Button } from '@mui/material';

/**
 * Props for ResultBox
 */
export interface ResultBoxProps {
    imageUrl?: string;
    systemOutput: Record<string, string>;
    onFeedback?: (field: string, value: string, correct: boolean) => void;
}

/**
 * A box-like layout with:
 * - Left: Image
 * - Right: Two sub-columns
 *   1) System Output
 *   2) User Feedback
 */
const ResultBox: React.FC<ResultBoxProps> = ({
                                                 imageUrl,
                                                 systemOutput,
                                                 onFeedback,
                                             }) => {
    return (
        <div className="flex flex-row gap-4">
            {/* Left Column: Image */}
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-48 h-48 object-contain border rounded"
                />
            )}

            {/* Right Column: 2 sub-columns */}
            <div className="flex flex-row gap-8 flex-grow">
                {/* Sub-column 1: System Output */}
                <div className="flex flex-col gap-2 w-1/2 border-r pr-4">
                    <h3 className="font-bold mb-2">System Output</h3>
                    {Object.entries(systemOutput).map(([field, value]) => (
                        <div key={field} className="flex flex-col">
                            <span className="font-medium">{field}:</span>
                            <span>{value}</span>
                        </div>
                    ))}
                </div>

                {/* Sub-column 2: User Feedback */}
                <div className="flex flex-col gap-2 w-1/2">
                    <h3 className="font-bold mb-2">User Feedback</h3>
                    {Object.entries(systemOutput).map(([field, value]) => (
                        <div key={field} className="flex items-center gap-2">
                            <span>{field}</span>
                            {onFeedback && (
                                <>
                                    <Button
                                        size="small"
                                        color="success"
                                        variant="contained"
                                        onClick={() => onFeedback(field, value, true)}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        variant="contained"
                                        onClick={() => onFeedback(field, value, false)}
                                    >
                                        Reject
                                    </Button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResultBox;
