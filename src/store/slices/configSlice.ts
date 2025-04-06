// src/store/slices/configSlice.ts
import { StateCreator } from 'zustand';

export interface ConfigSlice {
    apiBaseUrl: string;
    getApiUrl: (endpoint: string, params?: Record<string, string>) => string;
    tenantId: string;
    clientId: string;
}

export const createConfigSlice: StateCreator<ConfigSlice> = () => {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const tenantId = import.meta.env.VITE_AZURE_TENANT_ID || '';
    const clientId = import.meta.env.VITE_AZURE_CLIENT_ID || '';

    return {
        apiBaseUrl,
        tenantId,
        clientId,
        getApiUrl: (endpoint, params = {}) => {
            const url = new URL(endpoint, apiBaseUrl);
            Object.entries(params).forEach(([key, value]) => {
                if (value) url.searchParams.append(key, value);
            });
            return url.toString();
        },
    };
};
