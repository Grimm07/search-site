// src/store/useStore.ts
import { create } from 'zustand';
import { createAuthSlice, AuthSlice } from './slices/authSlice';

import {createThemeSlice, ThemeSlice} from "@/store/slices/themeSlice";
import {createDevSlice, DevSlice} from "@/store/slices/devSlice";
import { createUIPreferencesSlice, UIPreferencesSlice } from './slices/uiPreferencesSlice';
import {createUserInteractionSlice, UserInteractionSlice} from "@/store/slices/documentSlice";


export type AppState = AuthSlice & ThemeSlice & DevSlice & UIPreferencesSlice & UserInteractionSlice;

export const useAppStore = create<AppState>()((...a) => ({
    ...createAuthSlice(...a),
    ...createThemeSlice(...a),
    ...createDevSlice(...a),
    ...createUIPreferencesSlice(...a),
    ...createUserInteractionSlice(...a),
}));