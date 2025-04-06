import { StateCreator } from 'zustand';

export interface ImageSlice {
    image: string | null;
    isLoading: boolean;
    error: string | null;
    query: string;
    setQuery: (query: string) => void;
    fetchImage: (url: string) => Promise<void>;
}

export const createImageSlice: StateCreator<ImageSlice, [], [], ImageSlice> = (set) => ({
    image: null,
    isLoading: false,
    error: null,
    query: '',
    setQuery: (query: string) => set({ query }),
    fetchImage: async (url: string) => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch image');
            const blob = await res.blob();
            const imageUrl = URL.createObjectURL(blob);
            set({ image: imageUrl, isLoading: false });
        } catch (e: any) {
            set({ error: e.message, isLoading: false });
        }
    },
});
