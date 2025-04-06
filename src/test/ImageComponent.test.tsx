import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ImageComponent from '@/components/common/ImageComponent';
import { useStore } from '@/store/useStore';

// ✅ Mock the Zustand store
vi.mock('@/store/useStore', () => {
    const mockState = {
        currentDocument: { data: 'https://fake-image-url.com/fake.png' },
        isLoading: false,
        error: null,
        retrieve: vi.fn(),
        query: '',
        setQuery: vi.fn(),
    };
    return {
        useGlobalStore: vi.fn((selector) => selector(mockState)),
    };
});

describe('ImageComponent', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders input and button', () => {
        render(<ImageComponent imageUrl="test-id" />);
        expect(screen.getByPlaceholderText(/search for an image/i)).toBeInTheDocument();
        expect(screen.getByText('Search')).toBeInTheDocument();
    });

    it('shows the image when loaded', () => {
        render(<ImageComponent imageUrl="test-id" />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'https://fake-image-url.com/fake.png');
    });

    it('calls retrieve and setQuery when Search button is clicked', () => {
        const mockRetrieve = vi.fn();
        const mockSetQuery = vi.fn();

        (useStore as any).mockImplementation((selector: any) =>
            selector({
                currentDocument: null,
                isLoading: false,
                error: null,
                retrieve: mockRetrieve,
                query: '',
                setQuery: mockSetQuery,
            })
        );

        render(<ImageComponent imageUrl="sample-image-id" />);
        fireEvent.change(screen.getByPlaceholderText(/search/i), {
            target: { value: 'new query' },
        });
        fireEvent.click(screen.getByText('Search'));

        expect(mockSetQuery).toHaveBeenCalledWith('new query');
        expect(mockRetrieve).toHaveBeenCalledWith('sample-image-id');
    });
});
