// src/store/slices/userPreferencesSlice.ts
import { StateCreator } from 'zustand';
import { UserPreferences } from '@/types/userPreferences';

export interface UserPreferencesSlice {
    preferences: UserPreferences;
    setTheme: (theme: 'light' | 'dark') => void;
    setLanguage: (language: string) => void;
}

/**
 * This slice manages user preferences (e.g., theme, language).
 * You can persist these to localStorage or your backend as needed.
 */
export const createUserPreferencesSlice: StateCreator<
    UserPreferencesSlice,
    [],
    [],
    UserPreferencesSlice
> = (set) => ({
    preferences: {
        theme: 'light',
        language: 'en',
    },

    setTheme: (theme) =>
        set((state) => ({
            preferences: { ...state.preferences, theme },
        })),

    setLanguage: (language) =>
        set((state) => ({
            preferences: { ...state.preferences, language },
        })),
});
