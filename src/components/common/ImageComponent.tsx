import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import InteractiveImageViewer from "@/components/common/InteractiveImageViewer"; // ✅ new global store

interface ImageComponentProps {
    imageUrl: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ imageUrl }) => {
    const { image, isLoading, error, fetchImage, query, setQuery } = useStore((state) => ({
        image: state.currentDocument?.data, // Assuming image blob is stored as `currentDocument.data`
        isLoading: state.isLoading,
        error: state.error,
        fetchImage: state.retrieve,         // renamed from fetchImage → retrieve(id)
        query: state.query,
        setQuery: state.setQuery,
    }));

    const [localQuery, setLocalQuery] = useState(query);

    const handleSearch = () => {
        setQuery(localQuery);
        fetchImage(imageUrl); // still using prop as ID or URL
    };

    return (
        <div>
            <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search for an image"
            />
            <button onClick={handleSearch}>Search</button>

            {isLoading && <p>Loading image...</p>}
            {error && <p>Error: {error}</p>}
            {image && !isLoading && !error && (
                <InteractiveImageViewer imageUrl={typeof image === 'string' ? image : ''} />
            )}
        </div>
    );
};

export default ImageComponent;
