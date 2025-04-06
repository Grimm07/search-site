import { render, screen, fireEvent } from '@testing-library/react';
import ResultBox from '@/components/common/ResultBox';
import { describe, test, expect, vi } from 'vitest'; // if using Vitest

describe('ResultBox', () => {
    test('renders image if imageUrl is provided', () => {
        render(
            <ResultBox
                imageUrl="https://via.placeholder.com/150"
                systemOutput={{ key1: 'value1' }}
            />
        );
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'https://via.placeholder.com/150');
    });

    test('does not render image if imageUrl is not provided', () => {
        render(<ResultBox systemOutput={{ key1: 'value1' }} />);
        const img = screen.queryByRole('img');
        expect(img).not.toBeInTheDocument();
    });

    test('renders system output fields', () => {
        render(<ResultBox systemOutput={{ key1: 'value1', key2: 'value2' }} />);
        expect(screen.getByText('key1:')).toBeInTheDocument();
        expect(screen.getByText('value1')).toBeInTheDocument();
        expect(screen.getByText('key2:')).toBeInTheDocument();
        expect(screen.getByText('value2')).toBeInTheDocument();
    });

    test('calls onFeedback when Approve or Reject is clicked', () => {
        const mockFeedback = vi.fn();
        render(
            <ResultBox
                systemOutput={{ name: 'Document1' }}
                onFeedback={mockFeedback}
            />
        );

        const approveButton = screen.getByText('Approve');
        fireEvent.click(approveButton);
        expect(mockFeedback).toHaveBeenCalledWith('name', 'Document1', true);

        const rejectButton = screen.getByText('Reject');
        fireEvent.click(rejectButton);
        expect(mockFeedback).toHaveBeenCalledWith('name', 'Document1', false);
    });
});
