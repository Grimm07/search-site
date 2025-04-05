import { StateCreator } from 'zustand';
import {
    DocumentMeta,
    RetrievedContent,
    FeedbackPayload,
} from '@/types/search';
import { detectSearchKeyFormat, SearchKeyFormat } from '@/utils/searchKeyFormat';
import { listDocuments, retrieveDocument, updateFeedback } from '@/lib/api';

export interface UserInteractionSlice {
    query: string;
    searchFormat: SearchKeyFormat;
    results: DocumentMeta[];
    controller: AbortController | null;
    currentDocument: RetrievedContent | null;
    isLoading: boolean;
    error: string | null;

    // New state
    viewSections: Record<string, any> | null; // Parsed JSON or dynamic data

    setQuery: (query: string) => void;
    setController: (controller: AbortController | null) => void;

    // New method for setting view sections
    setViewSections: (sections: Record<string, any> | null) => void;

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
    isLoading: false,
    error: null,

    viewSections: null, // New state

    setQuery: (query) =>
        set(() => ({
            query,
            searchFormat: detectSearchKeyFormat(query),
        })),

    setController: (controller) => set({ controller }),

    // New action for updating viewSections
    setViewSections: (sections: Record<string, any> | null) => set({ viewSections: sections }),

    list: async (params) => {
        const controller = new AbortController();
        set({ isLoading: true, error: null, controller });

        try {
            const data = await listDocuments(params, controller);
            set({ results: data.results || [] });
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                set({ error: err.message ?? 'List failed' });
            }
        } finally {
            set({ isLoading: false, controller: null });
        }
    },

    retrieve: async (id) => {
        set({ isLoading: true, error: null });

        try {
            const doc = await retrieveDocument(id);
            set({ currentDocument: doc });
        } catch (err: any) {
            set({ error: err.message ?? 'Retrieve failed' });
        } finally {
            set({ isLoading: false });
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