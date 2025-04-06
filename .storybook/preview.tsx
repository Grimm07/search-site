import type { Preview } from '@storybook/react';
import {expect} from '@storybook/test'
import * as matchers from "@testing-library/jest-dom/matchers";

// extend storybooks 'expect' with jest-dom matchers
expect.extend(matchers);

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
};

export default preview;
