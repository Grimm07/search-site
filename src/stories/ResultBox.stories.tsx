import type { Meta, StoryObj } from '@storybook/react';
import ResultBox, { ResultBoxProps } from '../components/common/ResultBox';

const meta: Meta<ResultBoxProps> = {
    title: 'Components/ResultBox',
    component: ResultBox,
    argTypes: {
        onFeedback: { action: 'feedback' },
    },
};

export default meta;

type Story = StoryObj<ResultBoxProps>;

export const Default: Story = {
    args: {
        imageUrl: 'https://via.placeholder.com/150',
        systemOutput: {
            name: 'Sample Document',
            date: '2025-04-15',
            status: 'Approved',
        },
    },
};

export const WithoutImage: Story = {
    args: {
        systemOutput: {
            name: 'Document #2',
            content: 'Lorem ipsum dolor sit amet',
        },
    },
};
