// src/store/slices/configSlice.ts
import { StateCreator } from 'zustand';

// export interface ConfigSlice {
//     apiUrl: string;
//     tenantId: string;
// }
export interface ConfigSlice {
    apiBaseUrl: string;
    getApiUrl: (endpoint: string, params?: Record<string, string>) => string;
    tenantId: string;
}

export const createConfigSlice: StateCreator<ConfigSlice> = () => ({
    apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',

    getApiUrl: (endpoint, params = {}) => {
        const url = new URL(endpoint, import.meta.env.VITE_API_URL);
        Object.entries(params).forEach(([key, value]) => {
            if (value) url.searchParams.append(key, value);
        });
        return url.toString();
    },
    tenantId: import.meta.env.VITE_TENANT_ID || '',
});

// export const createConfigSlice: StateCreator<ConfigSlice, [], [], ConfigSlice> = () => ({
//     apiUrl: import.meta.env.VITE_API_URL || '',
//
// });
