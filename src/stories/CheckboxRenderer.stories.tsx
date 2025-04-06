import { Meta, StoryObj } from '@storybook/react';
import CheckboxRenderer from '@/components/common/CheckboxRenderer';
import { useAppStore } from '@/store/useAppStore';

const meta: Meta<typeof CheckboxRenderer> = {
    title: 'Components/Forms/CheckboxRenderer',
    component: CheckboxRenderer,
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => {
            // Reset Zustand state before each story
            useAppStore.setState({
                checkboxes: {
                    company: true,
                    amount: false,
                    status: false,
                },
            });
            return <Story />;
        },
    ],
};

export default meta;

type Story = StoryObj<typeof CheckboxRenderer>;

export const Default: Story = {
    render: () => <CheckboxRenderer />,
};