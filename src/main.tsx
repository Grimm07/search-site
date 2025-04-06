import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
// import {useInteractionStore} from "@/store/useInteractionStore";

// this loads the mock service worker in development mode also has a flag to enable mocking during runtime

// if (import.meta.env.DEV && useInteractionStore.getState().mockMode) {
//     const { worker } = await import('@/mocks/browser');
//     worker.start();
// }


// NOTE: VITE WILL REMOVE ALL DEAD CODE AT BUILD TIME SO THIS NEVER WILL SHOW UP IN A PRODUCTION ENVIRONMENT
// we use sessionStorage here to persist across browser reload and because zustand store has not been hydrated yet
if (import.meta.env.DEV && sessionStorage.getItem('mocksEnabled') === 'true') {
    const { worker } = await import('./mocks/browser');
    await worker.start();
}

createRoot(document.getElementById('root') as Element).render(<>
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
</>
);
