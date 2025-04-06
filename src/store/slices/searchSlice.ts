// slices/searchSlice.ts
import { StateCreator } from 'zustand';
import { SearchSlice, SearchState } from '@/types/slices';
import { detectSearchKeyFormat } from '@/utils/searchKeyFormat';

export const createSearchSlice: StateCreator<SearchSlice> = (set) => ({
    query: '', // ✅ make sure it's set
    searchFormat: 'unknown',
    searchState: 'idle',
    setQuery: (q) =>
        set({
            query: q,
            searchFormat: detectSearchKeyFormat(q),
        }),
    setSearchState: (state: SearchState) => set({ searchState: state }),
});
