import { Meta, StoryObj } from '@storybook/react';
import SearchResultsAccordion from '@/components/common/SearchResultsAccordion';
import { useInteractionStore } from '@/store/useInteractionStore';
import { RetrievedContent } from '@/types/search';


const mockResults: RetrievedContent[] = [
    {
        docId: 'doc-001',
        docId: 'doc-001',
        contentType: 'image',
        summary: {
            Status: 'Approved',
            Notes: 'Reviewed and finalized',
        },
        images: {
            primary: 'https://via.placeholder.com/150',
        },
    },
    {
        docId: 'doc-002',
        docId: 'doc-002',
        contentType: 'image',
        summary: {
            Status: 'Pending',
            Vendor: 'ACME Corp',
        },
        images: {
            primary: 'https://via.placeholder.com/150',
        },
    },
    {
        docId: 'doc-003',
        docId: 'doc-003',
        contentType: 'image',
        summary: {
            Status: 'In Progress',
        },
        images: {
            primary: 'https://via.placeholder.com/150',
        },
    },
];

const StoreInitializer = () => {
    useInteractionStore.setState({
        results: mockResults,
        isListLoading: false,
    });
    return null;
};

const meta: Meta<typeof SearchResultsAccordion> = {
    title: 'Components/Common/SearchResultsAccordion',
    component: SearchResultsAccordion,
    parameters: {
        layout: 'centered',
    },
};

export default meta;

type Story = StoryObj<typeof SearchResultsAccordion>;

export const Default: Story = {
    render: () => (
        <>
            <StoreInitializer />
            <SearchResultsAccordion />
        </>
    ),
};
