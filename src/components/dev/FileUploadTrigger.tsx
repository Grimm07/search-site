import { useRef } from 'react';
import { listDocuments } from '@/lib/api';
import { Box, Button, Typography } from '@mui/material';

const FileUploadTrigger = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const abortRef = useRef<AbortController | null>(null); // ✅ Keep track of the controller

    const handleFile = async (file: File) => {
        const fileNameKey = file.name.replace(/\.[^/.]+$/, '');

        // Cancel previous request if any
        if (abortRef.current) {
            abortRef.current.abort();
        }

        const controller = new AbortController();
        abortRef.current = controller;

        try {
            await listDocuments({ key: fileNameKey }, controller);
        } catch (err: any) {
            if (err.name === 'AbortError') {
                console.log('Upload request aborted');
            } else {
                console.error('Error uploading file:', err);
            }
        }
    };

    return (
        <Box>
            <Typography variant="body2" mb={1}>
                Upload a file to simulate search input
            </Typography>

            <input
                ref={inputRef}
                type="file"
                hidden
                accept=".json"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                }}
            />

            <Button variant="outlined" onClick={() => inputRef.current?.click()}>
                Choose File
            </Button>
        </Box>
    );
};

export default FileUploadTrigger;
