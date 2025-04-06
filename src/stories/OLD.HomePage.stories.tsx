// src/stories/HomePage.stories.tsx

import  { useEffect, useMemo } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { useInteractionStore } from '@/store/useInteractionStore';
import { RetrievedContent } from '@/types/search';
import HomePage from '@/pages/HomePage';
import Spinner from '@/components/common/Spinner'; // Hypothetical loading spinner component
import { useDarkMode } from 'storybook-dark-mode';

// Extended mock data for testing
const mockResults: RetrievedContent[] = [
    {
        docId: 'doc-001',
        contentType: 'image',
        summary: {
            Status: 'Approved',
            Notes: 'Looks good to go!',
            Title: 'Mock Result A',
        },
        images: {
            primary: 'https://via.placeholder.com/150',
        },
    },
    {
        docId: 'doc-002',
        contentType: 'image',
        summary: {
            Status: 'Pending',
            Notes: 'Needs review',
            Title: 'Mock Result B',
        },
        images: {
            primary: 'https://via.placeholder.com/150?text=Image+2',
        },
    },
    {
        docId: 'doc-003',
        contentType: 'text',
        summary: {
            Status: 'Archived',
            Notes: 'No further action.',
            Title: 'Mock Result C',
        },
        images: undefined,
    },
    {
        docId: 'doc-004',
        contentType: 'unknown',
        summary: undefined,
        images: undefined,
    },
];

// Store initializer to handle different app states
const StoreInitializer = ({
                              withResults = false,
                              withError = false,
                              errorMessage = 'Simulated error occurred.',
                              isLoading = false, // Add isLoading for control
                              mockMode = false,   // Mock mode control
                          }) => {
    useEffect(() => {
        if (withError) {
            useInteractionStore.setState({
                results: [],
                isListLoading: false,
                currentDocument: null,
                error: errorMessage,
                searchState: 'noResults',
            });
            return;
        }

        if (withResults) {
            useInteractionStore.setState({
                results: [],
                isListLoading: isLoading,
                currentDocument: null,
                error: null,
                searchState: 'searching',
            });

            const timer = setTimeout(() => {
                useInteractionStore.setState({
                    results: mockResults, // Always use mockResults in Storybook
                    isListLoading: false,
                    searchState: 'results',
                });
            }, 1000);

            return () => clearTimeout(timer);
        }


        // Default idle state
        useInteractionStore.setState({
            results: [],
            isListLoading: false,
            currentDocument: null,
            error: null,
            searchState: 'idle',
        });
    }, [withResults, withError, errorMessage, isLoading, mockMode]);

    return null;
};

// Meta configuration for Storybook
const meta = {
    title: 'Pages/HomePage',
    parameters: { layout: 'fullscreen' },
    tags: ['autodocs'],
    args: {
        withResults: false,
        withError: false,
        errorMessage: '',
        isLoading: false,
        mockMode: false, // Added mockMode toggle
    },
    argTypes: {
        withResults: {
            control: 'boolean',
            description: 'Simulate the presence of search results.',
        },
        withError: {
            control: 'boolean',
            description: 'Simulate an error state by showing error banner.',
        },
        errorMessage: {
            control: 'text',
            description: 'Custom error message for simulating diverse error scenarios.',
        },
        isLoading: {
            control: 'boolean',
            description: 'Simulate loading state for search results.',
        },
        mockMode: {
            control: 'boolean',
            description: 'Enable or disable mock API results.',
        },
    },
} satisfies Meta;

export default meta;

type Story = StoryObj<{
    withResults: boolean;
    withError: boolean;
    errorMessage: string;
    isLoading: boolean;
    mockMode: boolean;
    isDarkMode: boolean;
}>;

// Story implementation with controls
export const WithControls: Story = {
    args: {
        withResults: false,
        withError: false,
        errorMessage: '',
        isLoading: false, // Default loading state
        mockMode: false,   // Default mockMode state
        isDarkMode: false,
    },
    render: ({ withResults, withError, errorMessage, isLoading, mockMode }) => {
        const isDarkMode = useDarkMode();
        const theme = useMemo(
            () => createTheme({ palette: { mode: isDarkMode ? 'dark' : 'light' } }),
            [isDarkMode]
        );

        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <StoreInitializer
                    withResults={withResults}
                    withError={withError}
                    errorMessage={errorMessage}
                    isLoading={isLoading}
                    mockMode={mockMode} // Pass mockMode control
                />
                {isLoading ? (
                    <Spinner /> // Show spinner if loading
                ) : (
                    <HomePage />
                )}
            </ThemeProvider>
        );
    },
};

// Example snapshot story for testing visual states
export const LoadingState: Story = {
    args: {
        withResults: true,
        withError: false,
        errorMessage: '',
        isLoading: true, // Set loading state to true
        mockMode: true,   // Set mock mode to true
    },
    render: ({ withResults, isLoading, mockMode }) => {
        const isDarkMode = useDarkMode();
        const theme = useMemo(
            () => createTheme({ palette: { mode: isDarkMode ? 'dark' : 'light' } }),
            [isDarkMode]
        );

        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <StoreInitializer withResults={withResults} isLoading={isLoading} mockMode={mockMode} />
                <Spinner /> {/* Show spinner during loading */}
            </ThemeProvider>
        );
    },
};

export const ErrorState: Story = {
    args: {
        withResults: false,
        withError: true,
        errorMessage: 'Unable to load results. Please try again.',
        isDarkMode: true,
    },
    render: ({ withError, errorMessage, isDarkMode }) => {
        const theme = useMemo(
            () => createTheme({ palette: { mode: isDarkMode ? 'dark' : 'light' } }),
            [isDarkMode]
        );

        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <StoreInitializer withError={withError} errorMessage={errorMessage} />
                <HomePage />
            </ThemeProvider>
        );
    },
};

// import { within, userEvent, waitFor } from '@storybook/test';
// import {expect} from 'vitest'
// export const SimulatedSearch: Story = {
//   args: {
//     withResults: false, // Start in idle state
//     isLoading: false,
//     mockMode: true,
//     withError: false,
//     errorMessage: '',
//     isDarkMode: false,
//   },
//   render: ({ withResults, isLoading, mockMode, withError, errorMessage }) => {
//     const isDarkMode = useDarkMode();
//     const theme = useMemo(
//         () => createTheme({ palette: { mode: isDarkMode ? 'dark' : 'light' } }),
//         [isDarkMode]
//     );
//
//     return (
//         <ThemeProvider theme={theme}>
//           <CssBaseline />
//           <StoreInitializer
//               withResults={withResults}
//               withError={withError}
//               errorMessage={errorMessage}
//               isLoading={isLoading}
//               mockMode={mockMode}
//           />
//           <HomePage />
//         </ThemeProvider>
//     );
//   },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//
//     // Step 1: Find the input
//     const input = await canvas.findByRole('textbox', { name: /search/i });
//
//     // Step 2: Type a query and hit Enter
//     await userEvent.clear(input);
//     await userEvent.type(input, 'Mock Result A');
//     await userEvent.keyboard('{Enter}');
//
//     // Step 3: Simulate delayed result injection (as if API responded)
//     await new Promise((resolve) => {
//       setTimeout(() => {
//         useInteractionStore.setState({
//           results: mockResults,
//           isListLoading: false,
//           searchState: 'results',
//         });
//         resolve(true);
//       }, 1000);
//     });
//
//     // Step 4: Wait for result to appear in UI
//     await waitFor(() => {
//       expect(canvas.getByText('Mock Result A')).toBeInTheDocument();
//     });
//   },
// };