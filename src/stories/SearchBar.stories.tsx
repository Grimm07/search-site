import type { Meta, StoryObj } from '@storybook/react';
import SearchBar from '../components/common/SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Components/SearchBar',
  component: SearchBar,
  tags: ['autodocs'], // Optional: Enables automatic docs generation if configured
};

export default meta;

type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  args: {
    // Add default props here if needed
  },
};
