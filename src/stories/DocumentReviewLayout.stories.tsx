import { Meta, StoryObj } from '@storybook/react';
import DocumentReviewLayout from '../components/common/DocumentReviewLayout';
import { RetrievedContent } from '@/types/search';

const mockDocument: RetrievedContent = {
    id: 'doc-001',
    docId: 'doc-001',
    contentType: 'image',
    data: 'https://via.placeholder.com/600x800?text=Fallback',
    summary: {
        Status: 'Approved',
        Confirmed: true,
        Notes: 'This invoice looks accurate, but please double check the discount field.',
        Vendor: 'ACME Corp',
    },
    images: {
        primary: 'https://via.placeholder.com/600x800?text=Document+Image',
    },
    metadata: {
        Status: 'Approved',
        Confirmed: true,
        Notes: 'This invoice looks accurate, but please double check the discount field.',
        Vendor: 'ACME Corp',
    },
};

const meta: Meta<typeof DocumentReviewLayout> = {
    title: 'Components/Review/DocumentReviewLayout',
    component: DocumentReviewLayout,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

type Story = StoryObj<typeof DocumentReviewLayout>;

export const Default: Story = {
    render: () => <DocumentReviewLayout document={mockDocument} />,
};