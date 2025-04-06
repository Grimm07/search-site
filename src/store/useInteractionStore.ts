// src/store/useStore.ts
import { create } from 'zustand';
import {createDevSlice, DevSlice} from "@/store/slices/devSlice";
import {createUserInteractionSlice, UserInteractionSlice} from "@/store/slices/documentSlice";


// note: you MUST update this type if you add a new slice
export type InteractionState =  DevSlice & UserInteractionSlice;

export const useInteractionStore = create<InteractionState>()((...a) => ({
    ...createUserInteractionSlice(...a),
    ...createDevSlice(...a)
}));

