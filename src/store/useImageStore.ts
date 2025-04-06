import { create } from 'zustand';

interface ImageState {
    isLoading: Record<string, boolean>;
    images: Record<string, string>; // ID → blob URL or OSD URL
    error: Record<string, string | null>;

    startLoading: (id: string) => void;
    finishLoading: (id: string, url: string) => void;
    failLoading: (id: string, error: string) => void;
}

export const useImageStore = create<ImageState>((set) => ({
    isLoading: {},
    images: {},
    error: {},

    startLoading: (id) =>
        set((state) => ({
            isLoading: { ...state.isLoading, [id]: true },
            error: { ...state.error, [id]: null },
        })),

    finishLoading: (id, url) =>
        set((state) => ({
            isLoading: { ...state.isLoading, [id]: false },
            images: { ...state.images, [id]: url },
        })),

    failLoading: (id, error) =>
        set((state) => ({
            isLoading: { ...state.isLoading, [id]: false },
            error: { ...state.error, [id]: error },
        })),
}));