// store/slices/themeSlice.ts
import { StateCreator } from 'zustand';
import {theme} from "@/style/theme";

export type ThemeMode = 'light' | 'dark';

export interface ThemeSlice {
    mode: ThemeMode;
    toggleMode: () => void;
}

const getInitialMode = (): ThemeMode => {
    try {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('theme') as ThemeMode | null;
            if (stored === 'dark' || stored === 'light') return stored;

            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDark ? 'dark' : 'light';
        }
    } catch {
        // LocalStorage not available or browser error
    }

    return 'light';
};


export const createThemeSlice: StateCreator<ThemeSlice, [], [], ThemeSlice> = (set, get) => ({
    mode: ((localStorage.getItem('theme') as ThemeMode) || getInitialMode())  || theme('light'),
    toggleMode: () => {
        const next = get().mode === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', next);
        set({ mode: next ?? 'light' });
    },
});
