// src/auth/msalConfig.ts
import { Configuration } from '@azure/msal-browser';
import { useConfigStore } from '@/store/useConfigStore'; // or wherever your root store is

const tenantId = useConfigStore.getState().tenantId;
const clientId = useConfigStore.getState().clientId;

export const msalConfig: Configuration = {
    auth: {
        clientId,
        authority: `https://login.microsoftonline.com/${tenantId}`,
        redirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: true,
    },
};
