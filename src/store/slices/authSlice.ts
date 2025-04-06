
import { persist } from 'zustand/middleware';
import {PublicClientApplication} from "@azure/msal-browser";
import {msalConfig} from "@/auth/msalConfig"; // Adjust according to your MSAL setup

interface AuthSlice {
    account: any;
    initialized: boolean;
    persistedAt: number | null;
    login: () => Promise<void>;
    logout: () => void;
}
const EXPIRY_MS = 1000 * 60 * 60 * 4; // 4 hours
const msalInstance = new PublicClientApplication(msalConfig);

export const createAuthSlice = persist<AuthSlice>(
    (set, get) => {
        const now = Date.now();

        const state = get() || {}; // Default to an empty object if the state is undefined
        const persistedAt = state.persistedAt ?? null;
        const expired = persistedAt && now - persistedAt > EXPIRY_MS;

        if (expired) {
            console.info('[auth] Expired auth state — clearing');
            set({ account: null, initialized: true, persistedAt: null });
        } else if (!state.initialized) {
            set({ initialized: true });
        }

        return {
            account: state.account ?? null,
            initialized: state.initialized ?? false,
            persistedAt: state.persistedAt ?? null,
            login: async () => {
                try {
                    const res = await msalInstance.loginPopup();
                    if (res.account) {
                        msalInstance.setActiveAccount(res.account);
                        set({
                            account: res.account,
                            persistedAt: Date.now(),
                            initialized: true,
                        });
                    }
                } catch (err) {
                    console.error('Login failed:', err);
                }
            },
            logout: () => {
                msalInstance.logoutPopup();
                set({ account: null, persistedAt: null });
            },
        };
    },
    {
        name: 'auth-storage', // Persist to localStorage or sessionStorage
    }
);


export {}