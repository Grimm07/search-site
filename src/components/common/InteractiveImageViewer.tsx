import React, { useEffect, useRef } from 'react';
import OpenSeadragon from 'openseadragon';
import { Box, CircularProgress, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useImageStore } from '@/store/useImageStore';

export interface InteractiveImageViewerProps {
    imageId: string;
}

const InteractiveImageViewer: React.FC<InteractiveImageViewerProps> = ({ imageId }) => {
    const viewerRef = useRef<HTMLDivElement>(null);
    const osdInstanceRef = useRef<OpenSeadragon.Viewer | null>(null);

    const {
        images,
        isLoading,
        error,
        startLoading,
        finishLoading,
        failLoading,
    } = useImageStore();

    const base64Url = images[imageId];

    useEffect(() => {
        if (!viewerRef.current || !base64Url) return;

        osdInstanceRef.current?.destroy();

        osdInstanceRef.current = OpenSeadragon({
            element: viewerRef.current,
            prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
            tileSources: {
                type: 'image',
                url: base64Url,
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
            osdInstanceRef.current = null;
        };
    }, [base64Url]);

    useEffect(() => {
        // Kick off image load if not already available
        if (!images[imageId] && !isLoading[imageId] && !error[imageId]) {
            startLoading(imageId);

            // Simulate fetch or retrieval
            fetch(`/api/images/${imageId}`) // or your actual loader
                .then(res => res.text()) // assume base64 string is returned
                .then((data) => {
                    const base64WithPrefix = `data:image/png;base64,${data}`;
                    finishLoading(imageId, base64WithPrefix);
                })
                .catch((err) => {
                    failLoading(imageId, err.message);
                });
        }
    }, [imageId]);

    if (error[imageId]) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" sx={{
                border: 1,
                borderColor: 'error.main',
                borderRadius: 2,
                p: 2,
                backgroundColor: 'rgba(255, 0, 0, 0.05)',
            }}>
                <ErrorOutlineIcon sx={{ color: 'error.main', fontSize: 40, mb: 1 }} />
                <Typography color="error" variant="body1">
                    Failed to load image: {error[imageId]}
                </Typography>
            </Box>
        );
    }

    return (
        <Box position="relative" width="100%" height="100%" borderRadius={2} overflow="hidden">
            {isLoading[imageId] && (
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    zIndex={10}
                    bgcolor="background.paper"
                >
                    <CircularProgress />
                </Box>
            )}
            <Box ref={viewerRef} sx={{ width: '100%', height: '100%' }} />
        </Box>
    );
};

export default InteractiveImageViewer;