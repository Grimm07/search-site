// authSlice.ts
import { persist } from 'zustand/middleware';
import { PublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { msalConfig } from '@/auth/msalConfig';

export interface AuthSlice {
    account: AccountInfo | null;
    initialized: boolean;
    persistedAt: number | null;
    login: () => Promise<void>;
    logout: () => void;
}

const EXPIRY_MS = 1000 * 60 * 60 * 4; // 4 hours
const msalInstance = new PublicClientApplication(msalConfig);

export const createAuthSlice = persist<AuthSlice>(
    (set, get) => {
        // Perform expiry check directly during slice creation
        const now = Date.now();
        const { persistedAt } = get();
        const expired = persistedAt && now - persistedAt > EXPIRY_MS;

        if (expired) {
            console.info('[auth] Expired auth state — clearing');
            set({ account: null, initialized: true, persistedAt: null });
        } else if (!get().initialized) {
            set({ initialized: true });
        }

        return {
            account: get().account ?? null,
            initialized: get().initialized ?? false,
            persistedAt: get().persistedAt ?? null,

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
        name: 'auth-storage',
    }
);

export { msalInstance };
