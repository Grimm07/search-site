// import { useEffect, useMemo } from 'react';
// import { Meta, StoryObj } from '@storybook/react';
// import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
// import { useInteractionStore } from '@/store/useInteractionStore';
// import HomePage from '@/pages/HomePage';
// import { DocumentSchema } from '@/schemas/documentSchema';
// import { RetrievedContent } from '@/types/search'; // Assuming this is the correct path for the `RetrievedContent`
// import mockData from './mockResults.json'; // Assuming mockResults.json is here
//
// const meta = {
//   title: 'Pages/HomePage',
//   parameters: { layout: 'fullscreen' },
//   tags: ['autodocs'],
//   args: {
//     mockDocumentIndex: 0, // Start with the first document as default
//   },
//   argTypes: {
//     mockDocumentIndex: {
//       control: 'select',
//       description: 'Choose a mock document to display.',
//       options: Array.from({ length: mockData.length }, (_, i) => i), // Generate an array of indexes for each mock document
//     },
//   },
// } satisfies Meta;
//
// export default meta;
//
// type Story = StoryObj<{
//   mockDocumentIndex: number; // Control to select mock document index
//   isDarkMode: boolean;
// }>;
//
// // Store initializer to handle different app states and selected mock document
// const StoreInitializer = ({ mockDocumentIndex }: { mockDocumentIndex: number }) => {
//   useEffect(() => {
//     // const selectedDocument: RetrievedContent = mockData[mockDocumentIndex];
//
//     try {
//       // Validate and parse the selected mock data using Zod
//       const parsedResults = DocumentSchema.array().parse(mockData);  // Zod validation
//
//       // Set the selected document in the state
//       const firstDocument = parsedResults[mockDocumentIndex];
//
//       useInteractionStore.setState({
//         results: parsedResults, // Set all the results
//         currentDocument: firstDocument, // Set the current document based on the selection
//         isListLoading: false,
//         searchState: 'results',
//       });
//     } catch (error) {
//       console.error('Invalid mock data', error);
//       useInteractionStore.setState({
//         results: [],
//         isListLoading: false,
//         currentDocument: null,
//         searchState: 'noResults',
//         error: 'Failed to parse mock data.',
//       });
//     }
//   }, [mockDocumentIndex]);
//
//   return null;
// };
//
// // Story implementation with controls for different mock documents
// export const WithControls: Story = {
//   args: {
//     mockDocumentIndex: 0, // Default to the first document
//     isDarkMode: false,
//   },
//   render: ({ mockDocumentIndex, isDarkMode }) => {
//     const theme = useMemo(
//         () => createTheme({ palette: { mode: isDarkMode ? 'dark' : 'light' } }),
//         [isDarkMode]
//     );
//
//     return (
//         <ThemeProvider theme={theme}>
//           <CssBaseline />
//           <StoreInitializer mockDocumentIndex={mockDocumentIndex} />
//           <HomePage />
//         </ThemeProvider>
//     );
//   },
// };
