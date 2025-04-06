// src/store/slices/errorSlice.ts
export interface ErrorSlice {
    error: Error | null;
    setError: (error: Error) => void;
    clearError: () => void;
}

export const createErrorSlice = (
    set: (partial: Partial<ErrorSlice>, replace?: boolean) => void
): ErrorSlice => ({
    error: null,
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
});
