import { useRef, useEffect } from 'react';
import { useInteractionStore } from '@/store/useInteractionStore';

// todo update this file to handle your type of data

const FileUploadTrigger = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { setQuery, setViewSections, setSearchState, list } = useInteractionStore();

    const handleFile = async (file: File) => {
        try {
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
                reader.readAsText(file);
            });

            const parsedData = JSON.parse(fileContent);

            if (parsedData?.title) {
                setQuery(parsedData.title);
            } else {
                console.warn("The uploaded JSON doesn't include a title field.");
                setQuery('');
            }

            setViewSections(parsedData);

            // Trigger the search
            setSearchState('searching');
            await list({ query: parsedData.title });
        } catch (error) {
            console.error('Error processing the uploaded file:', error);
            useInteractionStore.setState({
                error: 'Failed to process uploaded file.',
                searchState: 'error',
            });
        }
    };

    useEffect(() => {
        inputRef.current?.click();
    }, []);

    return (
        <input
            ref={inputRef}
            type="file"
            accept=".json"
            onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
            }}
            style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', border: 'none', padding: 0, margin: 0 }}
        />
    );
};

export default FileUploadTrigger;