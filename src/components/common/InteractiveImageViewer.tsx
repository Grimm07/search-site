import React, { useEffect, useRef } from 'react';
import OpenSeadragon from 'openseadragon';

export interface InteractiveImageViewerProps {
    imageUrl: string;
}

const InteractiveImageViewer: React.FC<InteractiveImageViewerProps> = ({ imageUrl }) => {
    const viewerRef = useRef<HTMLDivElement>(null);
    const osdInstanceRef = useRef<OpenSeadragon.Viewer | null>(null);


    useEffect(() => {
        if (!viewerRef.current) return;

        // Destroy previous instance if exists
        osdInstanceRef.current?.destroy();

        // Create new viewer
        osdInstanceRef.current = OpenSeadragon({
            element: viewerRef.current,
            prefixUrl: 'https://openseadragon.github.io/openseadragon/images/', // default controls
            tileSources: {
                type: 'image',
                url: imageUrl,
            },
            showNavigationControl: true,
            gestureSettingsMouse: {
                clickToZoom: true,
                scrollToZoom: true,
                dblClickToZoom: true,
                pinchToZoom: true,
            },
        });

        return () => {
            osdInstanceRef.current?.destroy();
        };
    }, [imageUrl]);

    return (
        <div
            ref={viewerRef}
            className="w-full h-[500px] border border-gray-300 rounded"
        />
    );
};

export default InteractiveImageViewer;
