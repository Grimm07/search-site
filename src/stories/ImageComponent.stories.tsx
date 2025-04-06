import type { Meta, StoryObj } from '@storybook/react';
import ImageComponent from '../components/common/ImageComponent';

const meta: Meta<typeof ImageComponent> = {
  title: 'Components/ImageComponent',
  component: ImageComponent,
  tags: ['autodocs'], // Optional: helps with automatic docs generation
};

export default meta;

type Story = StoryObj<typeof ImageComponent>;

export const Default: Story = {
  args: {
    imageUrl: 'https://via.placeholder.com/150',
  },
};
