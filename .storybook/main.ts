import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(ts|tsx|js|jsx)'],
    addons: ['@storybook/addon-essentials', 'storybook-dark-mode'],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    docs: { // this is showing strikethrough occassionally due to @storybook/react-vite exporting legacy StorybookConfig
        autodocs: true,
    },
    core: {
        builder: '@storybook/builder-vite', // 👈 The builder enabled here.
    }
};

export default config;
