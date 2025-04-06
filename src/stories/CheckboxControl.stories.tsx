import { Meta, StoryFn } from '@storybook/react';
import CheckboxControl from '../components/common/CheckboxControl';

export default {
    title: 'Components/CheckboxControl',
    component: CheckboxControl,
    argTypes: {
        checked: { control: 'boolean' },
        label: { control: 'text' },
        onChange: { action: 'changed' },
    },
} as Meta<typeof CheckboxControl>;

const Template: StoryFn<typeof CheckboxControl> = (args: typeof CheckboxControl) => (
    <CheckboxControl {...args} />
);

export const Default = Template.bind({});
Default.args = {
    label: 'Default Checkbox',
    checked: false,
};
