// slices/types.ts

import {FeedbackPayload, RetrievedContent, SearchRequestPayload} from "@/types/search";
import {SearchKeyFormat} from "@/utils/searchKeyFormat";


export type SearchState = 'idle' | 'searching' | 'noResults' | 'results' | 'error';
// 🔗 Unified slice
// export type UnifiedInteractionSlice = SearchSlice & DocumentSlice & UISlice;
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
export interface SearchSlice {
    query: string;
    searchFormat: SearchKeyFormat;
    searchState: SearchState;
    setQuery: (q: string) => void;
    setSearchState: (state: SearchState) => void;
}


export interface DocumentSlice {
    // List of document results from the search
    results: RetrievedContent[];
    viewSections: Record<string, any> | null;

    setViewSections: (v: Record<string, any> | null) => void;
    // The currently selected or focused document
    currentDocument: RetrievedContent | null;

    // Tracks per-document loading state (summary/images)
    docLoadState: Record<string, 'idle' | 'loading' | 'success' | 'error'>;

    // Global loading state for the list operation
    isListLoading: boolean;
    setMocksEnabled: (enabled: boolean) => void;
    setError: (error: string | null) => void;

    // Global loading state for a single document retrieval
    isRetrieveLoading: boolean;

    // Abort controller to cancel long-running requests
    controller: AbortController | null;

    // Sets the full list of results
    setResults: (results: RetrievedContent[]) => void;
    error: string | null;
    // Sets the loading state for a specific document
    setDocLoadState: (
        docId: string,
        state: 'idle' | 'loading' | 'success' | 'error'
    ) => void;

    // Sets the active abort controller
    setController: (controller: AbortController | null) => void;

    // Loads the document list and summaries
    list: (params: SearchRequestPayload) => Promise<void>;
    update: (params: FeedbackPayload) => Promise<void>;
    // Retrieves a single document (detail view)
    retrieve: (id: string) => Promise<void>;
    mocksEnabled: boolean;

}