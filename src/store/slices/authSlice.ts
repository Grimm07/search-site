// src/store/slices/authSlice.ts
import { StateCreator } from 'zustand';
import { AuthResponse, AuthPayload } from '@/types/auth';
import {AppState} from "@/store/useAppStore";

export interface AuthSlice {
    isAuthenticated: boolean;
    token: string | null;
    expiresAt: number | null;

    login: (payload: AuthPayload) => Promise<void>;
    logout: () => void;
    restoreSession: () => void;
}

/**
 * This slice handles:
 * - Cookie-based auth token with 2-hour expiry
 * - Basic login/logout
 * - Session restoration (when user revisits the site)
 */
export const createAuthSlice: StateCreator<AppState, [], [], AuthSlice> =
    (set, get) => ({
        isAuthenticated: false,
        token: null,
        expiresAt: null,

        // 1. Login via Microsoft Entra ID flow or a custom backend
        login: async ({ username, password }) => {
            try {
                // Example: Make a POST request to your server or MS Entra ID flow
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                if (!res.ok) {
                    throw new Error('Login failed');
                }

                const data = (await res.json()) as AuthResponse;
                const token = data.token;

                // 2-hour expiry from now
                const TWO_HOURS = 2 * 60 * 60 * 1000;
                const expiresAt = Date.now() + TWO_HOURS;

                // Save token in a cookie
                const expirationDate = new Date(expiresAt);
                document.cookie = `authToken=${token}; expires=${expirationDate.toUTCString()}; path=/; secure; sameSite=strict`;

                // Update Zustand state
                set({
                    isAuthenticated: true,
                    token,
                    expiresAt,
                });
            } catch (error) {
                console.error('Login error:', error);
                set({
                    isAuthenticated: false,
                    token: null,
                    expiresAt: null,
                });
            }
        },

        // 2. Logout: clear token and cookie
        logout: () => {
            // Overwrite cookie with immediate expiration
            document.cookie = `authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure; sameSite=strict`;

            set({
                isAuthenticated: false,
                token: null,
                expiresAt: null,
            });
        },

        // 3. Restore session if user revisits and cookie still valid
        restoreSession: () => {
            // Grab the authToken cookie if it exists
            const match = document.cookie.match(/(^| )authToken=([^;]+)/);
            if (!match) {
                return;
            }
            const token = match[2];

            // Optionally, parse your cookie for expiry or store it separately
            // For this example, we'll assume we stored `expiresAt` somewhere or revalidate via an API

            const { expiresAt } = get();
            if (expiresAt && Date.now() < expiresAt) {
                set({
                    isAuthenticated: true,
                    token,
                });
            } else {
                // Token expired
                get().logout();
            }
        },
    });
