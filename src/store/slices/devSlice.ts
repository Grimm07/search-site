// store/slices/devSlice.ts
import {StateCreator} from "zustand";
import {DevSlice} from "@/types/slices"


export const createDevSlice: StateCreator<DevSlice> = (set) => ({
    devMode: 'live',
    setDevMode: (mode) => set({ devMode: mode }),
    uploadedFile: null,
    setUploadedFile: (file) => set({ uploadedFile: file }),
    clearUploadedFile: () => set({ uploadedFile: null }),
    mockMode: import.meta.env.DEV, // enabled by default in dev
    toggleMockMode: () => set((state) => ({ mockMode: !state.mockMode })),
});