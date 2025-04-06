// src/store/slices/documentSlice.ts
import { StateCreator } from 'zustand';
import {
    RetrievedContent,
    FeedbackPayload,
} from '@/types/search';
import { detectSearchKeyFormat, SearchKeyFormat } from '@/utils/searchKeyFormat';
import { listDocuments, retrieveDocument, updateFeedback } from '@/lib/api';

export interface UserInteractionSlice {
    query: string;
    searchFormat: SearchKeyFormat;
    results: RetrievedContent[];
    controller: AbortController | null;
    currentDocument: RetrievedContent | null;
    isListLoading: boolean;
    isRetrieveLoading: boolean;
    error: string | null;

    setQuery: (query: string) => void;
    setController: (controller: AbortController | null) => void;

    list: (params: Record<string, any>) => Promise<void>;
    retrieve: (id: string) => Promise<void>;
    update: (payload: FeedbackPayload) => Promise<void>;
}

export const createUserInteractionSlice: StateCreator<
    UserInteractionSlice,
    [],
    [],
    UserInteractionSlice
> = (set) => ({
    query: '',
    searchFormat: 'unknown',
    results: [],
    currentDocument: null,
    controller: null,
    isListLoading: false,
    isRetrieveLoading: false,
    error: null,

    setQuery: (query) =>
        set(() => ({
            query,
            searchFormat: detectSearchKeyFormat(query),
        })),

    setController: (controller) => set({ controller }),

    list: async (params) => {
        const controller = new AbortController();
        set({ isListLoading: true, error: null, controller });

        try {
            const data = await listDocuments(params, controller);
            set({ results: data.results || [] });
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                set({ error: err.message ?? 'List failed' });
            }
        } finally {
            set({ isListLoading: false, controller: null });
        }
    },

    retrieve: async (id) => {
        set({ isRetrieveLoading: true, error: null });

        try {
            const doc = await retrieveDocument(id);
            set({ currentDocument: doc });
        } catch (err: any) {
            set({ error: err.message ?? 'Retrieve failed' });
        } finally {
            set({ isRetrieveLoading: false });
        }
    },

    update: async (payload) => {
        try {
            await updateFeedback(payload);
        } catch (err: any) {
            set({ error: err.message ?? 'Update failed' });
            console.error('Update failed:', err);
        }
    },
});
