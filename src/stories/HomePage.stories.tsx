// File: src/stories/HomePage.stories.tsx

import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider, CssBaseline, createTheme, Button, Box } from '@mui/material';
import { useInteractionStore } from '@/store/useInteractionStore';
import { RetrievedContent } from '@/types/search';
import HomePage from '@/pages/HomePage';

const mockResults: RetrievedContent[] = [
  {
    id: 'doc-001',
    docId: 'doc-001',
    contentType: 'image',
    data: 'https://via.placeholder.com/600x800?text=Fallback',
    fields: {},
    summary: {
      Status: 'Approved',
      Notes: 'Looks good to go!',
    },
    images: {
      primary: 'https://via.placeholder.com/150',
    },
  },
];

const StoreInitializer = ({ withResults = false }: { withResults?: boolean }) => {
  useInteractionStore.setState({
    results: withResults ? mockResults : [],
    isListLoading: false,
    currentDocument: null,
    error: null,
  });
  return null;
};

const meta: Meta = {
  title: 'Pages/HomePage',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

export const EmptyState: Story = {
  render: () => (
      <ThemeProvider theme={createTheme()}>
        <CssBaseline />
        <StoreInitializer withResults={false} />
        <HomePage />
      </ThemeProvider>
  ),
};

export const WithMockedSearchResults: Story = {
  render: () => {
    const [searched, setSearched] = useState(false);

    return (
        <ThemeProvider theme={createTheme()}>
          <CssBaseline />
          <StoreInitializer withResults={searched} />
          <Box display="flex" flexDirection="column" gap={2} p={2}>
            <Button
                variant="contained"
                onClick={() => setSearched(true)}
                sx={{ alignSelf: 'flex-start' }}
            >
              Simulate Search
            </Button>
            <HomePage />
          </Box>
        </ThemeProvider>
    );
  },
};
