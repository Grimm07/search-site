// src/store/useStore.ts
import { create } from 'zustand';
import { createAuthSlice, AuthSlice } from './slices/authSlice';

import {createThemeSlice, ThemeSlice} from "@/store/slices/themeSlice";
import {createDevSlice} from "@/store/slices/devSlice";
import {DevSlice, DocumentSlice} from "@/types/slices";
import {createDocumentSlice} from "@/store/slices/documentSlice";


export type AppState = AuthSlice & ThemeSlice & DevSlice & DocumentSlice;

export const useAppStore = create<AppState>()((...a) => ({
    ...createAuthSlice(...a),
    ...createThemeSlice(...a),
    ...createDevSlice(...a),
    ...createDocumentSlice(...a)
}));