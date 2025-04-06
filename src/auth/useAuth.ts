// src/auth/useAuth.ts
import { useEffect, useState } from 'react';
import { PublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { msalConfig } from './msalConfig';

export const msalInstance = new PublicClientApplication(msalConfig);

export function useAuth() {
    const [account, setAccount] = useState<AccountInfo | null>(null);

    useEffect(() => {
        const init = async () => {
            const existing = msalInstance.getActiveAccount();
            if (existing) return setAccount(existing);

            const response = await msalInstance.handleRedirectPromise();
            if (response?.account) {
                msalInstance.setActiveAccount(response.account);
                setAccount(response.account);
            }
        };

        init();
    }, []);

    const login = async () => {
        try {
            const response = await msalInstance.loginPopup();
            if (response.account) {
                msalInstance.setActiveAccount(response.account);
                setAccount(response.account);
            }
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return { account, login };
}
