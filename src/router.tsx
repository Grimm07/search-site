// src/router.tsx
import {
    createRootRoute,
    createRoute,
    createRouter,
} from '@tanstack/react-router';

import Root from './Root';
import HomePage from "@/pages/HomePage";
// import HomePage from './pages/HomePage';

// 1. Define root route with layout component
const rootRoute = createRootRoute({
    component: Root,
});

// 2. Define child routes with `getParentRoute`
const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomePage,
});

// 3. Add child routes to the root route
const routeTree = rootRoute.addChildren([indexRoute]);

// 4. Create and export the router instance
export const router = createRouter({ routeTree });

// 5. Register for TypeScript inference
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
