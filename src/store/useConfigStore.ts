// src/store/useStore.ts
import { create } from 'zustand';
import {ConfigSlice, createConfigSlice} from "@/store/slices/configSlice";


export type Config = ConfigSlice;

export const useConfigStore = create<Config>()((...a) => ({
    ...createConfigSlice(...a)
}));