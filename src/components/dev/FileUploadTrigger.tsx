import { useRef } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import { useInteractionStore } from '@/store/useInteractionStore';

const FileUploadTrigger = () => {
    // Reference to the file input
    const inputRef = useRef<HTMLInputElement>(null);

    // Access `query` and `viewSections` state from the store
    const { query, setQuery, setViewSections } = useInteractionStore();

    /**
     * Handles file upload and updates global store states.
     * @param file - The uploaded file to process.
     */
    const handleFile = async (file: File) => {
        try {
            // Read the file content using FileReader
            const fileContent = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = (event) => {
                    if (event.target?.result) {
                        resolve(event.target.result as string);
                    } else {
                        reject(new Error('File read failed.'));
                    }
                };

                reader.onerror = (error) => reject(error);
                reader.readAsText(file); // Read the file content
            });

            // Parse the file content as JSON
            const parsedData = JSON.parse(fileContent);

            // Update the search query if it exists
            if (parsedData?.title) {
                setQuery(parsedData.title);
            } else {
                console.warn("The uploaded JSON doesn't include a title field.");
                setQuery('');
            }

            // Update the view sections
            setViewSections(parsedData);
        } catch (error) {
            console.error('Error processing the uploaded file:', error);
        }
    };

    return (
        <Box>
            {/* Instruction */}
            <Typography variant="body2" mb={1}>
                Upload a file to populate the search query and view sections dynamically
            </Typography>

            {/* Search Bar */}
            <TextField
                label="Search"
                variant="outlined"
                value={query} // Controlled by `query` in global state
                onChange={(e) => setQuery(e.target.value)} // Allow user to override
                fullWidth
                sx={{ mb: 2 }}
            />

            {/* Hidden File Input */}
            <input
                ref={inputRef}
                type="file"
                hidden
                accept=".json"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file); // Process uploaded file
                }}
            />

            {/* File Upload Button */}
            <Button variant="outlined" onClick={() => inputRef.current?.click()}>
                Choose File
            </Button>
        </Box>
    );
};

export default FileUploadTrigger;