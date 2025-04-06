// slices/createDocumentSlice.ts
import { StateCreator } from 'zustand';
import { DocumentSlice } from '@/types/slices';
import {listDocuments, retrieveDocument, updateFeedback} from '@/lib/api';
import {FeedbackPayload, RetrievedContent} from '@/types/search';

export const createDocumentSlice: StateCreator<
    DocumentSlice,
    [],
    [],
    DocumentSlice
> = (set, get) => {
    const fetchOptionalImagesIfNeeded = async (docId: string) => {
        const doc = get().results.find((r) => r.docId === docId);
        if (!doc) return;

        try {
            const moreImages: Partial<RetrievedContent['images']> = await fetchImageVariants(docId);
            set((state) => ({
                results: state.results.map((r) => {
                    if (r.docId !== docId) return r;

                    const mergedImages = {
                        ...r.images,
                        ...moreImages,
                    };

                    // Ensure required fields like `primary` are preserved
                    if (!mergedImages.primary && r.images?.primary) {
                        mergedImages.primary = r.images.primary;
                    }

                    return { ...r, images: mergedImages };
                }),
            }));
        } catch (e) {
            console.warn(`Optional image load failed for ${docId}`, e);
        }
    };

    return {
        results: [],
        currentDocument: null,
        docLoadState: {},
        isListLoading: false,
        isRetrieveLoading: false,
        controller: null,
        error: null,
        setError: (error: string | null) => set({error}),
        clearError: () => set({ error: null }),
        setResults: (results) => set({ results }),
        mocksEnabled: false,
        setMocksEnabled: (enabled: boolean) => set({ mocksEnabled: enabled }),

        setDocLoadState: (docId, state) =>
            set((s) => ({
                docLoadState: {
                    ...s.docLoadState,
                    [docId]: state,
                },
            })),

        setController: (controller) => set({ controller }),

        viewSections: null,

        setViewSections: (sections: Record<string, any> | null) => set({ viewSections: sections }),


        list: async (params) => {
            const controller = new AbortController();

            set({
                isListLoading: true,
                controller,
                results: [],
                docLoadState: {},
            });

            try {
                const data = await listDocuments(params, controller);
                const docs = data.results || [];

                set({ results: docs });

                await Promise.all(
                    docs.map(async (doc) => {
                        const { docId } = doc;
                        get().setDocLoadState(docId, 'loading');

                        try {
                            const fullDoc = await retrieveDocument(docId);
                            set((state) => ({
                                results: state.results.map((r) =>
                                    r.docId === docId ? { ...r, ...fullDoc } : r
                                ),
                            }));
                            get().setDocLoadState(docId, 'success');
                            fetchOptionalImagesIfNeeded(docId);
                        } catch (e) {
                            console.warn(`Failed to retrieve summary for ${docId}`, e);
                            get().setDocLoadState(docId, 'error');
                        }
                    })
                );
            } finally {
                set({ isListLoading: false, controller: null });
            }
        },

        retrieve: async (id) => {
            set({ isRetrieveLoading: true });

            try {
                const doc = await retrieveDocument(id);
                set({ currentDocument: doc });
            } finally {
                set({ isRetrieveLoading: false });
            }
        },
        update: async (payload: FeedbackPayload) => {
            try {
                await updateFeedback(payload);
            } catch (err: any) {
                set({ error: err.message ?? 'Update failed' });
                console.error('Update failed:', err);
            }
        },
    };
};

// Mocked variant image loader (to be replaced)
const fetchImageVariants = async (docId: string) => {
    await new Promise((r) => setTimeout(r, 300));
    return {
        secondary: `https://via.placeholder.com/150?text=Secondary+${docId}`,
        tertiary: `https://via.placeholder.com/150?text=Tertiary+${docId}`,
    };
};
