// store/slices/devSlice.ts
import {StateCreator} from "zustand";

export type DevMode = 'live' | 'mock' | 'replay';

export interface DevSlice {
    devMode: DevMode;
    setDevMode: (mode: DevMode) => void;
    uploadedFile: File | null;
    setUploadedFile: (file: File) => void;
    clearUploadedFile: () => void;
    mockMode: boolean;
    toggleMockMode: () => void;
}

export const createDevSlice: StateCreator<DevSlice> = (set) => ({
    devMode: 'live',
    setDevMode: (mode) => set({ devMode: mode }),
    uploadedFile: null,
    setUploadedFile: (file) => set({ uploadedFile: file }),
    clearUploadedFile: () => set({ uploadedFile: null }),
    mockMode: import.meta.env.DEV, // enabled by default in dev
    toggleMockMode: () => set((state) => ({ mockMode: !state.mockMode })),
});