// src/auth/msalConfig.ts
import { PublicClientApplication } from '@azure/msal-browser';

export const msalInstance = new PublicClientApplication({
    auth: {
        clientId: '<your-client-id>',
        authority: 'https://login.microsoftonline.com/<tenant-id>',
        redirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: 'memoryStorage', // default: sessionStorage; override for SSR/SPA
        storeAuthStateInCookie: false,
    },
});
