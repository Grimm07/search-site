// src/store/useStore.ts
import { create } from 'zustand';
import {createDevSlice} from "@/store/slices/devSlice";
import {createSearchSlice} from "@/store/slices/searchSlice";
import {DocumentSlice, SearchSlice, DevSlice} from "@/types/slices";
import {createDocumentSlice} from "@/store/slices/documentSlice";


// note: you MUST update this type if you add a new slice
export type InteractionState = SearchSlice & DocumentSlice & DevSlice;


export const useInteractionStore = create<InteractionState>()((...a) => ({
    ...createSearchSlice(...a),
    ...createDevSlice(...a),
    ...createDocumentSlice(...a),
}));

