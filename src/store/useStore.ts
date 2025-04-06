// src/store/useStore.ts
import { create } from 'zustand';
import { createUserPreferencesSlice, UserPreferencesSlice } from './slices/userPreferencesSlice';
import { createImageSlice, ImageSlice } from './slices/imageSlice';
import { createFormSlice, FormSlice } from './slices/formSlice';
import {ConfigSlice, createConfigSlice} from "@/store/slices/configSlice";

export type GlobalState = UserPreferencesSlice &
    ImageSlice &
    FormSlice & ConfigSlice;

export const useStore = create<GlobalState>()((...a) => ({
    ...createConfigSlice(...a),
    ...createUserPreferencesSlice(...a),
    ...createImageSlice(...a),
    ...createFormSlice(...a)
}));

