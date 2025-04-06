
# Project Title

A modern, React-based application built with TypeScript, Vite, and TailwindCSS, designed for seamless development and scalable architecture. The project leverages popular libraries such as MUI, Zustand, and Framer Motion to deliver a highly interactive user experience.

## Features

- **React 19 & TypeScript 5.8**: Type-safe code with the latest React and TypeScript versions.
- **Vite**: Lightning-fast build system and development server.
- **TailwindCSS**: Utility-first CSS framework for rapid UI development.
- **MUI**: Material-UI components for a rich, consistent design system.
- **State Management**: Zustand for lightweight state management.
- **Testing**: Comprehensive testing with Vitest and Testing Library.
- **Storybook**: Component-driven development with Storybook.
- **Image Viewer**: Integrated OpenSeadragon for advanced image zooming and viewing.

## Prerequisites

Ensure you have the following tools installed:

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (comes with Node.js)

To verify the installations, you can run:

```bash
node -v
npm -v
```

Both should output the respective version numbers if installed correctly.

## Installation

1. Clone this repository:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The application will launch at `http://localhost:3000`.

## Scripts

Here are the commonly used npm scripts for this project:

- **`npm run dev`**: Starts the Vite development server.
- **`npm run build`**: Builds the production-ready app.
- **`npm run preview`**: Previews the production build.
- **`npm run test`**: Runs the test suite using Vitest.
- **`npm run lint`**: Lints the codebase with ESLint.
- **`npm run storybook`**: Starts the Storybook server.
- **`npm run build-storybook`**: Builds the Storybook for production.

## Libraries and Tools Used

- **React**: Core library for building the UI.
- **TypeScript**: Adds type safety to JavaScript.
- **Vite**: Development and build tool.
- **TailwindCSS**: CSS framework for styling.
- **MUI**: Pre-styled components based on Material Design.
- **Zustand**: Simplified state management.
- **Framer Motion**: Library for animations.
- **OpenSeadragon**: For interactive image zooming.
- **Vitest**: Unit testing platform.
- **Storybook**: Tool for developing and testing UI components.

## Folder Structure

The project is organized as follows:

```
/src
  /components      # Reusable React components
  /pages           # Page-level components
  /hooks           # Custom React hooks
  /store           # Zustand store for state management
  /styles          # Global and shared styles (includes TailwindCSS configurations)
  /assets          # Static assets like images, fonts, etc.
  /utils           # Utility functions and helpers
/public
  # Static files served directly, such as `index.html`.
/tests
  # Test files and testing-related utilities.
```

## Development Workflow

1. **Start Development**: Use `npm run dev` to start the local development server. A browser window will open at
   `http://localhost:3000`.
2. **Code Style**: Follow the defined code style conventions enforced by ESLint and Prettier. Use `npm run lint` to
   check for linting errors.
3. **Testing**: Write tests with Vitest. Use `npm run test` to run the tests.
4. **Storybook**: Test and develop components in isolation using Storybook with `npm run storybook`.


## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by the flexibility of modern web tooling and frameworks.
- Thanks to the creators and maintainers of the libraries and tools used in this project.
