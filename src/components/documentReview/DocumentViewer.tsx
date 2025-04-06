// components/documentReview/DocumentViewer.tsx
import React, { useEffect, useRef } from 'react';
import OpenSeadragon from 'openseadragon';

// todo move props to document review
interface Props {
    src: string;
    type: 'image' | 'text' | 'form';
}

const DocumentViewer: React.FC<Props> = ({ src, type }) => {
    const viewerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (type === 'image' && viewerRef.current) {
            OpenSeadragon({
                element: viewerRef.current,
                tileSources: { type: 'image', url: src },
                showNavigator: true,
                prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/3.0.0/images/',
            });
        }
    }, [src, type]);

    if (type === 'text') {
        return <pre>{src}</pre>;
    }

    return <div ref={viewerRef} style={{ width: '100%', height: 400 }} />;
};

export default DocumentViewer;
